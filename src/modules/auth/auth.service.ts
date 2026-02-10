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

	async registerClientInTenant(data: {
		name: string;
		email: string;
		password: string;
		tenantId: string;
	}) {
		const { name, email, password, tenantId } = data;

		if (!tenantId) {
			throw new BadRequestException(
				this.i18n.t("tenant.errors.TENANT_ID_REQUIRED")
			);
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

		const existingLink = await this.prisma.userTenant.findUnique({
			where: {
				userId_tenantId: {
					userId: newUser ? newUser.id : user!.id,
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
				userId: newUser ? newUser.id : user!.id,
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
