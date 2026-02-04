import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BarberModule } from "./barber/barber.module";
import { auth } from "./lib/auth";
import { UserModule } from "./user/user.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BarberModule, UserModule, AuthModule.forRoot({ auth }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
