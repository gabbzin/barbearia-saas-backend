import { Module } from "@nestjs/common";
import { BarberServiceService } from "./barber-service.service";
import { BarberServiceController } from "./barber-service.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [AuthModule],
	controllers: [BarberServiceController],
	providers: [BarberServiceService],
})
export class BarberServiceModule {}
