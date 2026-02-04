import { Controller, Get, Param } from "@nestjs/common";
import { BarberService } from "./barber.service";

@Controller("barber")
export class BarberController {
	constructor(private readonly barberService: BarberService) {}

	@Get()
	async getBarbers() {
		return this.barberService.findAll();
	}

	@Get(":id")
	async getBarber(@Param("id") id: string) {
		return this.barberService.findUnique(id);
	}
} 
