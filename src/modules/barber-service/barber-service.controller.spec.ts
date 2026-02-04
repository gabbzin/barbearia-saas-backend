import { Test, TestingModule } from '@nestjs/testing';
import { BarberServiceController } from './barber-service.controller';
import { BarberServiceService } from './barber-service.service';

describe('BarberServiceController', () => {
  let controller: BarberServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarberServiceController],
      providers: [BarberServiceService],
    }).compile();

    controller = module.get<BarberServiceController>(BarberServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
