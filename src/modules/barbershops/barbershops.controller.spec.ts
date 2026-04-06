import { Test, TestingModule } from "@nestjs/testing";
import { BarbershopsController } from "./barbershops.controller";
import { BarbershopsService } from "./barbershops.service";

describe("BarbershopsController", () => {
	let controller: BarbershopsController;

	const barbershopsServiceMock = {
		findAll: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BarbershopsController],
			providers: [
				{
					provide: BarbershopsService,
					useValue: barbershopsServiceMock,
				},
			],
		}).compile();

		controller = module.get<BarbershopsController>(BarbershopsController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
