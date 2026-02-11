import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { BarberModule } from "./modules/barber/barber.module";
import { PrismaModule } from "./modules/database/prisma.module";
import { BookingModule } from "./modules/booking/booking.module";
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from "nestjs-i18n";
import { BarberServiceModule } from "./modules/barber-service/barber-service.module";
import path from "path";
import { json } from "express";
import { BarbershopsModule } from "./modules/barbershops/barbershops.module";
import { TenantMiddleware } from "./middlewares/tenant.middleware";

@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: "pt-br",
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
		ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
		PrismaModule,

		AuthModule,
		BarberModule,
		UserModule,
		BookingModule,
		BarberServiceModule,
		BarbershopsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(json())
			.exclude(
				{ path: "auth", method: RequestMethod.ALL },
				{ path: "auth/*path", method: RequestMethod.ALL }
			)
			.forRoutes("*");

		consumer
			.apply(TenantMiddleware)
			.exclude({ path: "barbershops", method: RequestMethod.GET })
			.forRoutes("*");
	}
}
