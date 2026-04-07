import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import { AUTH } from "./auth.provider";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";

/**
 * Exclusivo para lidar com as rotas de autenticação usando o BetterAuth, sem incluir a rota de registro de usuários, que agora é tratada em um controlador separado (AuthController). Isso permite uma melhor organização do código e separação de responsabilidades, mantendo as funcionalidades de autenticação e registro de usuários distintas.
 */

@Controller("api/auth")
export class BetterAuthController {
	constructor(@Inject(AUTH) private readonly auth) {}

	@All("*")
	async handleAuth(@Req() req: Request, @Res() res: Response) {
		return toNodeHandler(this.auth)(req, res);
	}
}
