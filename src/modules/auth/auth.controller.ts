import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import { AUTH } from "./auth.provider";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";

@Controller("auth")
export class AuthController {
	constructor(@Inject(AUTH) private readonly auth) {}

	@All("*")
	async handleAuth(@Req() req: Request, @Res() res: Response) {
    console.log('🔍 Rota chamada:', req.method, req.originalUrl);
    console.log(res)
		return toNodeHandler(this.auth)(req, res);
	}
}
