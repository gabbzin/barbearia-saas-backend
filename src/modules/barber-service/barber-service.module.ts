import { Module } from '@nestjs/common';
import { BarberServiceService } from './barber-service.service';
import { BarberServiceController } from './barber-service.controller';

@Module({
  controllers: [BarberServiceController],
  providers: [BarberServiceService],
})
export class BarberServiceModule {}
