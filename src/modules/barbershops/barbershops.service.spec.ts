import { Test, TestingModule } from "@nestjs/testing";
import { BarbershopsService } from "./barbershops.service";
import { PrismaService } from "../database/prisma.service";

describe("BarbershopsService", () => {
	let service: BarbershopsService;

	const prismaMock = {
		barbershop: {
			findMany: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BarbershopsService,
				{
					provide: PrismaService,
					useValue: prismaMock,
				},
			],
		}).compile();

		service = module.get<BarbershopsService>(BarbershopsService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
