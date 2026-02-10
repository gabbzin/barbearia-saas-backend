import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { tenantStorage } from "src/storages/tenant-context.storage";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		const pool = new Pool({
			connectionString: process.env.DATABASE_URL as string,
		});

		const adapter = new PrismaPg(pool);

		super({ adapter });
	}

	// public client = prisma;
	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
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
