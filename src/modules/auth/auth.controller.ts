import { All, Body, Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { AUTH } from "./auth.provider";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { TenantId } from "./decorators/tenant-id.decorator";

@Controller("auth")
export class AuthController {
	constructor(
		@Inject(AUTH) private readonly auth,
		private readonly authService: AuthService
	) {}

	@Post("register-client")
	async registerClientInTenant(
		@Body() body: RegisterUserDto,
		@TenantId() tenantId: string
	) {
		return this.authService.registerClientInTenant(body, tenantId);
	}

	@All("*")
	async handleAuth(@Req() req: Request, @Res() res: Response) {
		return toNodeHandler(this.auth)(req, res);
	}
}
