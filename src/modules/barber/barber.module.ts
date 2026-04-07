import { Module } from "@nestjs/common";
import { BarberService } from "./barber.service";
import { BarberController } from "./barber.controller";
import { BarberRepository } from "./barber.repository";

@Module({
	controllers: [BarberController],
	providers: [BarberService, BarberRepository],
})
export class BarberModule {}
