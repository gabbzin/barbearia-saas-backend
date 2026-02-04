import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/database/prisma.service";

@Injectable()
export class BarberService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			const result = await this.prisma.client.barber.findMany({
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

			return result;
		} catch (error) {
			throw error;
		}
	}

	async findUnique(id: string) {
		try {
			const result = await this.prisma.client.barber.findUnique({
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

			return result;
		} catch (error) {
			throw error;
		}
	}
}
