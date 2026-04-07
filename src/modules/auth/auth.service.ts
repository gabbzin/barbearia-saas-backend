import { BadRequestException, Inject } from "@nestjs/common";
import { AUTH, AuthType } from "./auth.provider";
import { I18nService } from "nestjs-i18n";
import { AuthRepository } from "./auth.repository";

export class AuthService {
	constructor(
		private readonly repository: AuthRepository,
		private readonly i18n: I18nService,
		@Inject(AUTH) private readonly auth: AuthType
	) {}

	private tenantIdError = "Tenant ID é obrigatório no header 'x-tenant-id'";
	private registerUser = async ({ email, name, password }) => {
		return await this.auth.api.signUpEmail({
			body: {
				email,
				name,
				password,
			},
			asResponse: false,
		});
	};

	async registerUserInTenant(
		data: {
			name: string;
			email: string;
			password: string;
		},
		tenantId: string,
		role?: "BARBER" | "CLIENT"
	) {
		if (!tenantId) {
			throw new BadRequestException(this.tenantIdError);
		}

		// Verificar se o tenant existe
		const tenant = await this.repository.findUniqueByTenantId(tenantId);

		if (!tenant) {
			throw new BadRequestException(`Barbearia não encontrada`);
		}

		let user = await this.repository.findUniqueByEmail(data.email);
		let userId = user?.id;
		let newUser;

		if (!user) {
			const response = await this.registerUser(data);
			userId = response.user.id;
			newUser = response.user;
		}

		await this.repository.upsertUserTenantLink(userId!, tenantId, role);

		return {
			message: this.i18n.t("user.success.USER_CREATED"),
			user: newUser || user,
		};
	}
}
