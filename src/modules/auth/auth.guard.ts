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
import { PrismaService } from "../database/prisma.service";
import { verifySession } from "../user/utils/verifySession";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@Inject(AUTH) private auth,
		private prisma: PrismaService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const session = await verifySession(
			this.auth,
			this.prisma,
			request.headers
		);

		if (!session) {
			throw new UnauthorizedException();
		}

		request.user = session;

		console.log(request.user);

		return true;
	}
}
