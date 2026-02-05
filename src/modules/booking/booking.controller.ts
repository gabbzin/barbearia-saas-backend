import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import {
	AuthGuard,
	Roles,
	Session,
	UserSession,
} from "@thallesp/nestjs-better-auth";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get()
	@UseGuards(AuthGuard)
	async getBookings(@Session() session: UserSession) {
		return this.bookingService.findAllByUserId(session.user.id);
	}

	// ===== Usuários =====
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthGuard)
	async createBooking(
		@Session() session: UserSession,
		@Body() body: CreateBookingDto
	) {
		return this.bookingService.create(session.user.id, body);
	}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(AuthGuard)
	async cancelBooking(
		@Session() session: UserSession,
		@Body("bookingId") bookingId: string
	) {
		return this.bookingService.cancel(session.user.id, bookingId);
	}

	// ===== Barbeiros =====

	@Post()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Roles(["BARBER"])
	async confirmBooking(
		@Session() session: UserSession,
		@Body("bookingId") bookingId: string
	) {
		return this.bookingService.confirm(session.user.id, bookingId);
	}

	// (Opcional) Endpoint para editar o horário da reserva com até 2 horas de antecedência
}
