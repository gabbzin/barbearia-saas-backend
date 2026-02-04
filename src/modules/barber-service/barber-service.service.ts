import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { BarberServiceDto } from "./dto/barber-service.dto";

@Injectable()
export class BarberServiceService {
	constructor(private readonly prisma: PrismaService) {}

	async getServicesByBarberId(barberId: string) {
		return this.prisma.client.barberService.findMany({
			where: { barberId },
		});
	}

	async create(data: BarberServiceDto, barberId: string) {
		return this.prisma.client.barberService.create({
			data: {
				...data,
				barberId,
			},
		});
	}
	async update(id: string, data: Partial<BarberServiceDto>) {
		return this.prisma.client.barberService.update({
			where: { id },
			data,
		});
	}

  async delete(id: string) {
    return this.prisma.client.barberService.delete({
      where: { id },
    });
  }
}
