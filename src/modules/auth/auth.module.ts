import { Global, Module } from "@nestjs/common";
import { AUTH, AuthProvider } from "./auth.provider";
import { PrismaModule } from "../database/prisma.module";
import { AuthGuard } from "./auth.guard";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";

@Global()
@Module({
	imports: [PrismaModule, ConfigModule],
	controllers: [AuthController],
	exports: [AUTH, AuthGuard],
	providers: [AuthProvider, AuthGuard],
})
export class AuthModule {}
