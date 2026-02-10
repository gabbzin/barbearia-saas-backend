// auth.guard.ts
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Inject,
	UnauthorizedException,
} from "@nestjs/common";
import { AUTH } from "./auth.provider";
import { fromNodeHeaders } from "better-auth/node";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@Inject(AUTH) private auth) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const session = await this.auth.api.getSession({
			headers: fromNodeHeaders(request.headers),
		});

		if (!session) {
			throw new UnauthorizedException();
		}

		request["user"] = session.user;
		request["session"] = session.session;

		return true;
	}
}
