import { BadRequestException, Inject } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AUTH, AuthType } from "./auth.provider";
import { I18nService } from "nestjs-i18n";

export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly i18n: I18nService,
		@Inject(AUTH) private readonly auth: AuthType
	) {}

	async registerClientInTenant(
		data: {
			name: string;
			email: string;
			password: string;
		},
		tenantId: string
	) {
		const { name, email, password } = data;

		if (!tenantId) {
			throw new BadRequestException(
				"Tenant ID é obrigatório no header 'x-tenant-id'"
			);
		}

		// Verificar se o tenant existe
		const tenant = await this.prisma.barbershop.findUnique({
			where: { id: tenantId },
		});

		if (!tenant) {
			throw new BadRequestException(`Barbearia não encontrada`);
		}

		let user = await this.prisma.user.findUnique({ where: { email } });

		let newUser;

		if (!user) {
			const response = await this.auth.api.signUpEmail({
				body: {
					email,
					name,
					password,
				},
				asResponse: false,
			});

			newUser = response.user;
		}

		const userId: string = newUser ? newUser.id : user!.id;

		const existingLink = await this.prisma.userTenant.findUnique({
			where: {
				userId_tenantId: {
					userId,
					tenantId,
				},
			},
		});

		if (existingLink) {
			throw new BadRequestException(
				this.i18n.t("user.errors.USER_ALREADY_EXISTS")
			);
		}

		await this.prisma.userTenant.create({
			data: {
				userId,
				tenantId,
				role: "CLIENT",
			},
		});

		return {
			message: this.i18n.t("user.success.USER_CREATED"),
			user: newUser || user,
		};
	}
}
