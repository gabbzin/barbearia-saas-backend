import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterUserDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(8, { message: "A senha deve conter pelo menos 8 caracteres" })
	@Matches(/[A-Z]/, {
		message: "A senha deve conter pelo menos uma letra maiúscula",
	})
	@Matches(/[a-z]/, {
		message: "A senha deve conter pelo menos uma letra minúscula",
	})
	@Matches(/[0-9]/, { message: "A senha deve conter pelo menos um número" })
	@Matches(/[@$!%*?&]/, {
		message: "A senha deve conter pelo menos um caractere especial (@$!%*?&)",
	})
	password: string;
}
