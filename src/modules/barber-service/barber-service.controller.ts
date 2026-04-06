import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { BarberServiceService } from "./barber-service.service";
import { AuthGuard } from "../auth/auth.guard";
import { BarberServiceDto } from "./dto/barber-service.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "@thallesp/nestjs-better-auth";

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
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(["BARBER"])
	createService(@Req() request, @Body() data: BarberServiceDto) {
		const barberId = request.user.barberId;

		const payload = {
			...data,
			priceInCents: data.priceInCents * 100, // Convertendo para centavos
		};

		return this.barberServiceService.create(payload, barberId);
	}

	@Patch(":id")
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(["BARBER"])
	updateService(id: string, @Body() data: Partial<BarberServiceDto>) {
		return this.barberServiceService.update(id, {
			...data,
			priceInCents: data.priceInCents ? data.priceInCents * 100 : undefined,
		});
	}

	@Delete(":id")
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(["BARBER"])
	deleteService(id: string) {
		return this.barberServiceService.delete(id);
	}
}
