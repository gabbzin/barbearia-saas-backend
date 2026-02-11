import { Module } from "@nestjs/common";
import { BarbershopsService } from "./barbershops.service";
import { BarbershopsController } from "./barbershops.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [AuthModule],
	controllers: [BarbershopsController],
	providers: [BarbershopsService],
})
export class BarbershopsModule {}
