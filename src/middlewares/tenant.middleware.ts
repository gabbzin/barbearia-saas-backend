import { Injectable, NestMiddleware } from "@nestjs/common";
import { tenantStorage } from "src/storages/tenant-context.storage";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
	use(req: any, res: any, next: (error?: any) => void) {
		const tenantId = req.headers["x-tenant-id"];

		if (!tenantId) {
			return next();
		}

		tenantStorage.run({ tenantId }, () => next());
	}
}
