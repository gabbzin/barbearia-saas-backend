import { Controller, Get, Param, Post } from "@nestjs/common";
import { BarberService } from "./barber.service";

@Controller("barber")
export class BarberController {
	constructor(private readonly barberService: BarberService) {}

	@Get()
	async getBarbers() {
		return this.barberService.findAllBarbers();
	}

	@Get(":id")
	async getBarber(@Param("id") id: string) {
		return this.barberService.findBarberForId(id);
	}

	@Post()
	async createBarber() {}
}
