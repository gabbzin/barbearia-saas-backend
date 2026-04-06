import { Test, TestingModule } from "@nestjs/testing";
import { BarberServiceController } from "./barber-service.controller";
import { BarberServiceService } from "./barber-service.service";

describe("BarberServiceController", () => {
	let controller: BarberServiceController;

	const barberServiceServiceMock = {
		getServiceById: jest.fn(),
		getServicesByBarberId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BarberServiceController],
			providers: [
				{
					provide: BarberServiceService,
					useValue: barberServiceServiceMock,
				},
			],
		}).compile();

		controller = module.get<BarberServiceController>(BarberServiceController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
