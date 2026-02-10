import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { BarberServiceDto } from "./dto/barber-service.dto";

@Injectable()
export class BarberServiceService {
	constructor(private readonly prisma: PrismaService) {}

	async getServicesByBarberId(barberId: string) {
		return this.prisma.tenant.barberService.findMany({
			where: { barberId },
		});
	}

	async create(data: BarberServiceDto, barberId: string) {
		return this.prisma.tenant.barberService.create({
			data: {
				...data,
				barberId,
			},
		});
	}
	async update(id: string, data: Partial<BarberServiceDto>) {
		return this.prisma.tenant.barberService.update({
			where: { id },
			data,
		});
	}

	async delete(id: string) {
		return this.prisma.tenant.barberService.delete({
			where: { id },
		});
	}
}
