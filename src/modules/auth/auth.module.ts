import { Module } from "@nestjs/common";
import { AuthProvider } from "./auth.provider";
import { PrismaModule } from "../database/prisma.module";
import { AuthGuard } from "./auth.guard";

@Module({
	imports: [PrismaModule],
	exports: [AuthProvider, AuthGuard],
	providers: [AuthProvider, AuthGuard],
})
export class AuthModule {}
