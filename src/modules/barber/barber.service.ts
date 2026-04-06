import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BarberService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			const result = await this.prisma.tenant.barber.findMany({
				include: {
					user: {
						omit: {
							password: true,
							stripeCustomerId: true,
							id: true,
						},
					},
				},
			});

			return result;
		} catch (error) {
			throw error;
		}
	}

	async findUnique(id: string) {
		try {
			const result = await this.prisma.tenant.barber.findUnique({
				where: { id },
				include: {
					user: {
						omit: {
							password: true,
							stripeCustomerId: true,
							id: true,
						},
					},
				},
			});

			return result;
		} catch (error) {
			throw error;
		}
	}
}
