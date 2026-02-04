import { IsNumber, IsString } from "class-validator";

export class BarberServiceDto {
	@IsString()
	name: string;

	@IsString()
	description: string;

	@IsNumber()
	priceInCents: number;

	@IsString()
	imageUrl: string;
}
