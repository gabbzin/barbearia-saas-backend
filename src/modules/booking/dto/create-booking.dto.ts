import { IsDate, IsString } from "class-validator";

export class CreateBookingDto {
	@IsString()
	serviceId: string;

	@IsDate()
	date: Date;
}
