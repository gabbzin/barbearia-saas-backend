import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { I18nService } from "nestjs-i18n";
import { endOfDay, format, startOfDay } from "date-fns";
import { TenantBase } from "src/packages/tenantBase";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class BookingService extends TenantBase {
	constructor(
		protected readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		@Inject(REQUEST) private readonly request: Request
	) {
		super(prisma);
	}

	private intervalBetweenBookingsInMinutes = 30;

	// ================= Private Methods =================

	// Função para converter "HH:mm" em minutos (ex: "14:30" => 870)
	private timeToMinutes = (time: Date) => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		return hours * 60 + minutes;
	};

	// Função para converter minutos de volta para "HH:mm"
	private minutesToTime = (minutes: number) => {
		const h = Math.floor(minutes / 60)
			.toString()
			.padStart(2, "0");
		const m = (minutes % 60).toString().padStart(2, "0");
		return `${h}:${m}`;
	};

	// ================== Public Methods ==================

	async findAllByUserId(userId: string) {
		try {
			const result = await this.prisma.tenant.booking.findMany({
				where: {
					userId,
				},
				include: {
					barber: {
						include: {
							user: {
								select: {
									name: true,
								},
							},
						},
					},
					service: true,
				},
			});

			return result;
		} catch (error) {
			throw error;
		}
	}

	async create(userId: string, { serviceId, date }: CreateBookingDto) {
		// Data inválida (data passada é menor que a data atual) [Segurança]
		if (new Date(date) < new Date()) {
			throw new BadRequestException(
				this.i18n.t("booking.errors.BOOKING_PAST_DATE")
			);
		}

		const service = await this.prisma.tenant.barberService.findUnique({
			where: { id: serviceId },
		});

		if (!service) {
			throw new BadRequestException(
				this.i18n.t("service.errors.SERVICE_NOT_FOUND")
			);
		}

		const existingBooking = await this.prisma.tenant.booking.findFirst({
			where: {
				date,
				status: "SCHEDULED",
				barberId: service.barberId,
			},
		});

		if (existingBooking) {
			throw new BadRequestException(
				this.i18n.t("booking.errors.EXISTING_BOOKING_AT_DATE")
			);
		}

		// Buscando o tenantId do contexto usando o método da classe abstrata base
		const tenantId = this.getTenantId(this.request.headers);

		// Usando o modelo livre do Prisma para enviar o tenantId sem problemas
		const booking = await this.prisma.booking.create({
			data: {
				barberId: service.barberId,
				serviceId,
				userId,
				tenantId,
				date,
				priceInCents: service.priceInCents,
			},
		});

		return booking;
	}

	async cancel(userId: string, id: string) {
		const booking = await this.prisma.tenant.booking.findFirst({
			where: { id, userId },
		});

		if (!booking) {
			throw new BadRequestException(
				this.i18n.t("booking.errors.BOOKING_NOT_FOUND")
			);
		}

		await this.prisma.tenant.booking.update({
			where: { id },
			data: { status: "CANCELLED" },
		});

		return { message: this.i18n.t("booking.SUCCESS_BOOKING_CANCELLED") };
	}

	// Rota exclusiva para o barbeiro
	async confirm(bookingId: string, userId: string) {
		// Buscando o tenantId do contexto usando o método da classe abstrata base
		const tenantId = this.getTenantId(this.request.headers);

		// Usando o modelo livre do Prisma para enviar o tenantId sem problemas
		const barberId = await this.prisma.barber.findUnique({
			where: { userId_tenantId: { userId, tenantId } },
			select: { id: true },
		});

		if (!barberId) {
			throw new BadRequestException(
				this.i18n.t("barber.errors.BARBER_NOT_FOUND")
			);
		}

		return await this.prisma.tenant.booking.update({
			where: {
				id: bookingId,
				barberId: barberId?.id,
			},
			data: {
				status: "COMPLETED",
			},
		});
	}

	// ===== Métodos adicionais podem ser adicionados aqui =====
	async getDateAvailableTimeSlots(barberId: string, date: Date) {
		// Lógica para obter os horários disponíveis para agendamento
		const bookings = await this.prisma.tenant.booking.findMany({
			where: {
				barberId,
				date: {
					gte: startOfDay(date),
					lte: endOfDay(date),
				},
				status: {
					not: "CANCELLED",
				},
			},
			select: {
				date: true,
			},
		});

		// Dia 0 (Domingo) a 6 (Sábado)
		const day = date.getDay();

		const availability = await this.prisma.tenant.barberDisponibility.findFirst(
			{
				where: {
					barberId,
					dayOfWeek: day,
				},
				select: {
					dayOfWeek: true,
					startTime: true,
					endTime: true,
				},
			}
		);

		if (!availability) {
			return []; // Sem disponibilidade para este dia
			// Ou retornar uma mensagem apropriada
		}

		if (availability.dayOfWeek !== day) {
			return []; // Sem disponibilidade para este dia
		}

		const occupiedSlots = bookings.map((b) => format(b.date, "HH:mm"));

		const start = this.timeToMinutes(availability.startTime);
		const end = this.timeToMinutes(availability.endTime);

		const dynamicSlots: string[] = [];

		for (
			let time = start;
			time <= end;
			time += this.intervalBetweenBookingsInMinutes
		) {
			const timeStr = this.minutesToTime(time);
			if (!occupiedSlots.includes(timeStr)) {
				dynamicSlots.push(timeStr);
			}
		}

		return dynamicSlots;
	}
}
