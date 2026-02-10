import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/database/prisma.service";

@Injectable()
/* Base class for tenant-related operations */
export abstract class TenantBase {
	constructor(protected prisma: PrismaService) {}

	protected getTenantId(headers: Record<string, any>): string {
		const tenantId = headers["x-tenant-id"];

		if (!tenantId) {
			throw new BadRequestException(
				"Tenant ID is required in the 'x-tenant-id' header."
			);
		}

		return tenantId;
	}
}
