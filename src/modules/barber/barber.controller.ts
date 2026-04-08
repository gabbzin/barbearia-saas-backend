import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
		return this.barberService.findBarberById(id);
	}

	@Post()
	async createBarber(@Body() body: any) {
		return this.barberService.createBarber(body);
	}
}
