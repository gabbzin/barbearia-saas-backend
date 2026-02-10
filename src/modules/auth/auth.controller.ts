import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import { AUTH } from "./auth.provider";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(
		@Inject(AUTH) private readonly auth,
		private readonly authService: AuthService
	) {}

	@All("*")
	async handleAuth(@Req() req: Request, @Res() res: Response) {
		return toNodeHandler(this.auth)(req, res);
	}

	async registerClientInTenant(@Req() req: Request, @Res() res: Response) {
		return this.authService.registerClientInTenant(req.body);
	}
}
