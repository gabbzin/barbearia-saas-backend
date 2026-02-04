import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class BookingService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService
	) {}

	async findAllByUserId(userId: string) {
		try {
			const result = await this.prisma.client.booking.findMany({
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

		const service = await this.prisma.client.barberService.findUnique({
			where: { id: serviceId },
		});

		if (!service) {
			throw new BadRequestException(
				this.i18n.t("booking.errors.SERVICE_NOT_FOUND")
			);
		}

		const existingBooking = await this.prisma.client.booking.findFirst({
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

		const booking = await this.prisma.client.booking.create({
			data: {
				barberId: service.barberId,
				serviceId,
				userId,
				date,
				priceInCents: service.priceInCents,
			},
		});

		return booking;
	}
}
