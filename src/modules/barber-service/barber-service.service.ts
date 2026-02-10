import { Inject, Injectable, Scope } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { BarberServiceDto } from "./dto/barber-service.dto";
import { TenantBase } from "src/packages/tenantBase";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class BarberServiceService extends TenantBase {
	constructor(
		protected readonly prisma: PrismaService,
		@Inject(REQUEST) private readonly request: Request
	) {
		super(prisma);
	}
	async getServicesByBarberId(barberId: string) {
		return this.prisma.tenant.barberService.findMany({
			where: { barberId },
		});
	}

	async create(data: BarberServiceDto, barberId: string) {
		// Buscando o tenantId do contexto usando o método da classe abstrata base
		const tenantId = this.getTenantId(this.request.headers);

		// Usando o modelo livre do Prisma para enviar o tenantId sem problemas
		return this.prisma.barberService.create({
			data: {
				...data,
				barberId,
				tenantId,
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
