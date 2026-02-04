import { Test, TestingModule } from '@nestjs/testing';
import { BarberServiceService } from './barber-service.service';

describe('BarberServiceService', () => {
  let service: BarberServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarberServiceService],
    }).compile();

    service = module.get<BarberServiceService>(BarberServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
