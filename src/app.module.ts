import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { auth } from "./modules/auth/lib/auth";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { BarberModule } from "./modules/barber/barber.module";
import { PrismaService } from "./modules/database/prisma.service";
import { PrismaModule } from "./modules/database/prisma.module";
import { BookingModule } from "./modules/booking/booking.module";
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from "nestjs-i18n";
import path from "path";

@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: "pt-BR",
			loaderOptions: {
				path: path.join(process.cwd(), "src/i18n/"),
				watch: true,
			},
			resolvers: [
				new QueryResolver(["lang", "locale", "l"]),
				new HeaderResolver([
					"x-lang",
					"x-locale",
					"x-language",
					"x-custom-lang",
				]),
				AcceptLanguageResolver,
			],
			typesOutputPath: path.join(
				process.cwd(),
				"src/generated/i18n.generated.ts"
			),
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,

		AuthModule.forRoot({ auth }),
		BarberModule,
		UserModule,
		BookingModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
