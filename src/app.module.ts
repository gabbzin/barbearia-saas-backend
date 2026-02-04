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

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,

		AuthModule.forRoot({ auth }),
		BarberModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
