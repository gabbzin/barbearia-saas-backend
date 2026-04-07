import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BarberRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return await this.prisma.tenant.barber.findMany({
			include: {
				user: {
					omit: {
						passwordHash: true,
						stripeCustomerId: true,
						id: true,
					},
				},
			},
		});
	}

	async findUnique(id: string) {
		await this.prisma.tenant.barber.findUnique({
			where: { id },
			include: {
				user: {
					omit: {
						passwordHash: true,
						stripeCustomerId: true,
						id: true,
					},
				},
			},
		});
	}
}
