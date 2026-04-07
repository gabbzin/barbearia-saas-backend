import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { userRole } from "@prisma/client";

@Injectable()
export class AuthRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findUniqueByTenantId(tenantId: string) {
		return await this.prisma.barbershop.findUnique({
			where: { id: tenantId },
		});
	}

	async findUniqueByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: { email },
			omit: {
				passwordHash: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	async findUniqueUserTenant(userId: string, tenantId: string) {
		return await this.prisma.userTenant.findUnique({
			where: {
				userId_tenantId: {
					userId,
					tenantId,
				},
			},
		});
	}

	async upsertUserTenantLink(
		userId: string,
		tenantId: string,
		requestedRole?: userRole
	) {
		const existingLink = await this.findUniqueUserTenant(userId, tenantId);

		let finalRole = requestedRole;

		// Se for admin, permanece
		// Se for barbeiro e o pedido for cliente, permanece
		// Se for cliente e o pedido for barbeiro, sobe para barbeiro
		if (existingLink) {
			if (existingLink.role === "ADMIN") finalRole = "ADMIN";
			if (existingLink.role === "BARBER" && requestedRole === "CLIENT")
				finalRole = "BARBER";
		}

		return await this.prisma.userTenant.upsert({
			where: {
				userId_tenantId: {
					userId,
					tenantId,
				},
			},
			update: {
				role: finalRole,
			},
			create: {
				userId,
				tenantId,
				role: finalRole,
			},
		});
	}
}
