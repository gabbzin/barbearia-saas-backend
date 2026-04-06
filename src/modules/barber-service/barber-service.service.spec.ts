import { REQUEST } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../database/prisma.service";
import { BarberServiceService } from "./barber-service.service";

describe("BarberServiceService", () => {
	let service: BarberServiceService;

	const prismaMock = {
		tenant: {
			barberService: {
				findMany: jest.fn(),
				findUnique: jest.fn(),
				update: jest.fn(),
				delete: jest.fn(),
			},
		},
		barberService: {
			create: jest.fn(),
		},
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BarberServiceService,
				{
					provide: PrismaService,
					useValue: prismaMock,
				},
				{
					provide: REQUEST,
					useValue: { headers: { "x-tenant-id": "tenant-test-id" } },
				},
			],
		}).compile();

		service = await module.resolve<BarberServiceService>(BarberServiceService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
