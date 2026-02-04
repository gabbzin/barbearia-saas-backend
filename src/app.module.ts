import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { auth } from "./modules/auth/lib/auth";
import { UserModule } from "./modules/user/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		UserModule,
		AuthModule.forRoot({ auth }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
