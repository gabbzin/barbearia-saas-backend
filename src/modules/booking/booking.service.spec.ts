import { REQUEST } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { I18nService } from "nestjs-i18n";
import { PrismaService } from "../database/prisma.service";
import { BookingService } from "./booking.service";

describe("BookingService", () => {
	let service: BookingService;

	const prismaMock = {
		tenant: {
			booking: {
				findMany: jest.fn(),
				findFirst: jest.fn(),
				update: jest.fn(),
			},
			barberService: {
				findUnique: jest.fn(),
			},
			barberDisponibility: {
				findFirst: jest.fn(),
			},
		},
		booking: {
			create: jest.fn(),
		},
		barber: {
			findFirst: jest.fn(),
		},
	};

	const i18nMock = {
		t: jest.fn((key: string) => key),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookingService,
				{
					provide: PrismaService,
					useValue: prismaMock,
				},
				{
					provide: I18nService,
					useValue: i18nMock,
				},
				{
					provide: REQUEST,
					useValue: { headers: { "x-tenant-id": "tenant-test-id" } },
				},
			],
		}).compile();

		service = await module.resolve<BookingService>(BookingService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
