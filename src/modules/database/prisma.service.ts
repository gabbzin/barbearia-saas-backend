import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { prisma } from "prisma";
import { tenantStorage } from "src/storages/tenant-context.storage";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	// public client = prisma;
	async onModuleInit() {
		await this.client.$connect();
	}

	get client() {
		const store = tenantStorage.getStore();
		const tenantId = store?.tenantId;

		if (tenantId) {
			return this.getTenantClient(tenantId);
		}

		return this;
	}

	private getTenantClient(tenantId: string) {
		return this.$extends({
			query: {
				$allModels: {
					async $allOperations({ model, operation, args, query }) {
						const tenantModels = [
							"Barber",
							"BarberService",
							"Booking",
							"Subscription",
							"Plan",
							"UserTenant",
						];

						if (tenantModels.includes(model)) {
							const anyArgs = args as any;

							// Filtros de Leitura
							if (
								[
									"findFirst",
									"findMany",
									"findUnique",
									"count",
									"aggregate",
								].includes(operation)
							) {
								anyArgs.where = { ...anyArgs.where, tenantId };
							}

							// Criação
							if (operation === "create" || operation === "createMany") {
								if (Array.isArray(anyArgs.data)) {
									anyArgs.data = anyArgs.data.map((item: any) => ({
										...item,
										tenantId,
									}));
								} else {
									anyArgs.data = { ...anyArgs.data, tenantId };
								}
							}

							// Atualização e Deleção
							if (
								[
									"update",
									"updateMany",
									"upsert",
									"delete",
									"deleteMany",
								].includes(operation)
							) {
								anyArgs.where = { ...anyArgs.where, tenantId };
							}
						}

						return query(args);
					},
				},
			},
		});
	}
}
