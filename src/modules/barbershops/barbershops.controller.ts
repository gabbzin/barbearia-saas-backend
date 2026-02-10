import { Controller, Get } from "@nestjs/common";
import { TenantsService } from "./barbershops.service";

@Controller("tenants")
export class TenantsController {
	constructor(private readonly tenantsService: TenantsService) {}

	@Get()
	findAll() {
		return this.tenantsService.findAll();
	}
}
