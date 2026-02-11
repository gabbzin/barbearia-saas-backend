import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BarbershopsService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		try {
			const result = await this.prisma.barbershop.findMany();

			return result;
		} catch (error) {
			throw error;
		}
	}
}
