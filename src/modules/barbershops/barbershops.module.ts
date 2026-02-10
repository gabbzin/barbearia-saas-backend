import { Module } from "@nestjs/common";
import { TenantsService } from "./barbershops.service";
import { TenantsController } from "./barbershops.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [AuthModule],
	controllers: [TenantsController],
	providers: [TenantsService],
})
export class TenantsModule {}
