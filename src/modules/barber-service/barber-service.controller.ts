import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { BarberServiceService } from "./barber-service.service";
import { AuthGuard } from "../auth/auth.guard";
import { BarberServiceDto } from "./dto/barber-service.dto";

@Controller("barber-service")
export class BarberServiceController {
	constructor(private readonly barberServiceService: BarberServiceService) {}

	@Get()
	@UseGuards(AuthGuard)
	getServices(
		@Query("barberId") barberId: string,
		@Query("serviceId") serviceId: string
	) {
		if (serviceId) {
			return this.barberServiceService.getServiceById(serviceId);
		}

		if (barberId) {
			return this.barberServiceService.getServicesByBarberId(barberId);
		}

		throw new BadRequestException(
			"É necessário fornecer barberId ou serviceId como query parameter"
		);
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
