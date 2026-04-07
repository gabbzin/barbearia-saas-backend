import { Global, Module } from "@nestjs/common";
import { AUTH, AuthProvider } from "./auth.provider";
import { PrismaModule } from "../database/prisma.module";
import { AuthGuard } from "./auth.guard";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";

@Global()
@Module({
	imports: [PrismaModule, ConfigModule],
	controllers: [AuthController],
	exports: [AUTH, AuthGuard, AuthService],
	providers: [AuthProvider, AuthGuard, AuthService, AuthRepository],
})
export class AuthModule {}
