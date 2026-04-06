import {
	Injectable,
	NestMiddleware,
	UnauthorizedException,
} from "@nestjs/common";
import { tenantStorage } from "src/storages/tenant-context.storage";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
	use(req: any, res: any, next: (error?: any) => void) {
		const tenantId = req.headers["x-tenant-id"];

		if (!tenantId) {
			throw new UnauthorizedException(
				"Tenant ID is missing in the request headers"
			);
		}

		tenantStorage.run({ tenantId }, () => next());
	}
}
