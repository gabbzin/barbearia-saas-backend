import { Controller, Get } from "@nestjs/common";
import { BarbershopsService } from "./barbershops.service";

@Controller("barbershops")
export class BarbershopsController {
	constructor(private readonly barbershopsService: BarbershopsService) {}

	@Get()
	findAll() {
		return this.barbershopsService.findAll();
	}
}
