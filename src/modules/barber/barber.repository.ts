import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BarberRepository {
	constructor(private readonly prisma: PrismaService) {}

	private infosOmit = {
		passwordHash: true,
		stripeCustomerId: true,
		id: true,
	};

	async findAll() {
		return await this.prisma.tenant.barber.findMany({
			include: {
				user: {
					omit: this.infosOmit,
				},
			},
		});
	}

	async findUniqueById(id: string) {
		return await this.prisma.tenant.barber.findUnique({
			where: { id },
			include: {
				user: {
					omit: this.infosOmit,
				},
			},
		});
	}

	async create(data: any) {
		return await this.prisma.tenant.barber.create({
			data: data,
		});
	}
}
