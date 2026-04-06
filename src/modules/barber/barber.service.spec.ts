import { Test, TestingModule } from "@nestjs/testing";
import { BarberService } from "./barber.service";
import { PrismaService } from "../database/prisma.service";

describe("BarberService", () => {
	let service: BarberService;

	const prismaMock = {
		tenant: {
			barber: {
				findMany: jest.fn(),
				findUnique: jest.fn(),
			},
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BarberService,
				{
					provide: PrismaService,
					useValue: prismaMock,
				},
			],
		}).compile();

		service = module.get<BarberService>(BarberService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
