import {
	Injectable,
	CanActivate,
	Inject,
	ExecutionContext,
} from "@nestjs/common";
import { AUTH } from "./auth.provider";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@Inject(AUTH) private auth: any) {}

	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();

		const session = await this.auth.api.getSession({
			headers: req.headers,
		});

		if (!session) return false;

		req.user = session.user;
		return true;
	}
}
