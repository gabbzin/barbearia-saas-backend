import {
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { BarberServiceService } from "./barber-service.service";
import { AuthGuard } from "@thallesp/nestjs-better-auth";
import { BarberServiceDto } from "./dto/barber-service.dto";

@Controller("barber-service")
export class BarberServiceController {
	constructor(private readonly barberServiceService: BarberServiceService) {}

	@Get()
	@UseGuards(AuthGuard)
	getServicesByBarberId(barberId: string) {
		return this.barberServiceService.getServicesByBarberId(barberId);
	}

	@Post()
	@UseGuards(AuthGuard)
	createService(barberId: string, data: BarberServiceDto) {
		return this.barberServiceService.create(
			{ ...data, priceInCents: data.priceInCents * 100 },
			barberId
		);
	}

	@Patch(":id")
	@UseGuards(AuthGuard)
	updateService(id: string, data: Partial<BarberServiceDto>) {
		return this.barberServiceService.update(id, {
			...data,
			priceInCents: data.priceInCents ? data.priceInCents * 100 : undefined,
		});
	}

	@Delete(":id")
	@UseGuards(AuthGuard)
	deleteService(id: string) {
		return this.barberServiceService.delete(id);
	}
}
