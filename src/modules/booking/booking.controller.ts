import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { AuthGuard, Session, UserSession } from "@thallesp/nestjs-better-auth";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("booking")
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get()
	@UseGuards(AuthGuard)
	async getBookings(@Session() session: UserSession) {
		return this.bookingService.findAllByUserId(session.user.id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthGuard)
	async createBooking(
		@Session() session: UserSession,
		@Body() body: CreateBookingDto
	) {
		return this.bookingService.create(session.user.id, body);
	}
}
