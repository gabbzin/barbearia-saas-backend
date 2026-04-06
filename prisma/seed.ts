import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";

type CreatedBarber = {
	barberId: string;
	tenantId: string;
	services: Array<{ id: string; priceInCents: number }>;
};

const AVATAR_IMAGES = [
	"https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=800&q=80",
	"https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=800&q=80",
];

const BARBERSHOPS = [
	{
		name: "Barbearia Navalha de Ouro",
		slug: "barbearia-navalha-de-ouro",
		address: "Rua Augusta, 1450 - Consolacao, Sao Paulo - SP",
	},
	{
		name: "Corte Fino Studio",
		slug: "corte-fino-studio",
		address: "Av. Rio Branco, 500 - Centro, Rio de Janeiro - RJ",
	},
	{
		name: "Dom Bigode Barber Club",
		slug: "dom-bigode-barber-club",
		address: "Rua da Bahia, 980 - Lourdes, Belo Horizonte - MG",
	},
];

const BARBER_NAMES = [
	"Rafael Lacerda",
	"Bruno Toledo",
	"Lucas Mendes",
	"Tiago Rocha",
	"Guilherme Prado",
	"Matheus Vieira",
	"Enzo Martins",
	"Caio Freitas",
	"Diego Arantes",
	"Vinicius Serra",
	"Felipe Nogueira",
	"Renan Duarte",
	"Igor Pacheco",
	"Leandro Salles",
	"Anderson Luz",
];

const CLIENTS = [
	{ name: "Marcos Vinicius", email: "marcos.vinicius@seed.dev" },
	{ name: "Paulo Henrique", email: "paulo.henrique@seed.dev" },
	{ name: "Andre Luiz", email: "andre.luiz@seed.dev" },
];

const SERVICE_TEMPLATES = [
	{
		name: "Corte Social",
		description: "Corte classico com acabamento na navalha.",
		priceInCents: 4500,
		durationInMinutes: 45,
		imageUrl:
			"https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Barba Completa",
		description: "Modelagem de barba com toalha quente e finalizacao.",
		priceInCents: 3500,
		durationInMinutes: 35,
		imageUrl:
			"https://images.unsplash.com/photo-1512690459411-b0fdc5d3b5b9?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Corte + Barba",
		description: "Pacote completo para renovar o visual.",
		priceInCents: 7500,
		durationInMinutes: 70,
		imageUrl:
			"https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Pigmentacao de Barba",
		description: "Uniformizacao e cobertura de falhas na barba.",
		priceInCents: 4000,
		durationInMinutes: 40,
		imageUrl:
			"https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
	},
	{
		name: "Tratamento Capilar",
		description: "Hidratacao e revitalizacao do couro cabeludo.",
		priceInCents: 5000,
		durationInMinutes: 50,
		imageUrl:
			"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
	},
];

const PLANS = [
	{
		name: "Plano gratis",
		description: "Plano de entrada para conhecer a plataforma.",
		priceInCents: 0,
		benefits: ["1 agendamento por mes", "Lembretes de horario"],
	},
	{
		name: "Plano Corte Ilimitado",
		description: "Cortes de cabelo ilimitados durante o periodo ativo.",
		priceInCents: 8900,
		benefits: ["Cortes ilimitados", "Prioridade no agendamento"],
		stripePriceId: "price_seed_corte_ilimitado",
	},
	{
		name: "Plano Barba Ilimitada",
		description: "Servicos de barba ilimitados durante o periodo ativo.",
		priceInCents: 6900,
		benefits: ["Barba ilimitada", "10% em servicos extras"],
		stripePriceId: "price_seed_barba_ilimitada",
	},
	{
		name: "Plano Corte e Barba Ilimitados",
		description: "Plano completo com corte e barba sem limites.",
		priceInCents: 12900,
		benefits: ["Corte ilimitado", "Barba ilimitada", "Atendimento prioritario"],
		stripePriceId: "price_seed_corte_barba_ilimitados",
	},
];

function timeToDate(time: string): Date {
	const [hours, minutes] = time.split(":").map(Number);
	return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

function pickRandom<T>(values: T[]): T {
	return values[Math.floor(Math.random() * values.length)];
}

async function createBetterAuthAccount(
	prisma: PrismaClient,
	userId: string,
	email: string
) {
	await prisma.account.create({
		data: {
			id: crypto.randomUUID(),
			accountId: email,
			providerId: "credential",
			userId,
			password: "seed_password_hash",
		},
	});
}

async function resetDatabase(prisma: PrismaClient) {
	await prisma.rating.deleteMany();
	await prisma.booking.deleteMany();
	await prisma.subscription.deleteMany();
	await prisma.socialMedia.deleteMany();
	await prisma.exceptionDate.deleteMany();
	await prisma.barberDisponibility.deleteMany();
	await prisma.barberBreak.deleteMany();
	await prisma.barberService.deleteMany();
	await prisma.barber.deleteMany();
	await prisma.userTenant.deleteMany();
	await prisma.plan.deleteMany();
	await prisma.session.deleteMany();
	await prisma.account.deleteMany();
	await prisma.verification.deleteMany();
	await prisma.barbershop.deleteMany();
	await prisma.user.deleteMany();
}

async function seedDatabase() {
	const connectionString = process.env.DATABASE_URL as string;
	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);
	const prisma = new PrismaClient({ adapter });

	const availabilityStart = timeToDate("08:00");
	const availabilityEnd = timeToDate("18:00");
	const referenceDate = new Date("2026-04-06T15:40:00-03:00");
	const now = new Date();
	const futureBase = now > referenceDate ? now : referenceDate;

	try {
		await resetDatabase(prisma);

		const createdPlans = [] as Array<{ id: string; name: string }>;
		for (const plan of PLANS) {
			const createdPlan = await prisma.plan.create({
				data: {
					name: plan.name,
					description: plan.description,
					priceInCents: plan.priceInCents,
					benefits: plan.benefits,
					stripePriceId: plan.stripePriceId,
					tenantId: null,
				},
			});
			createdPlans.push({ id: createdPlan.id, name: createdPlan.name });
		}

		const createdTenants = [] as Array<{ id: string; slug: string }>;
		for (const shop of BARBERSHOPS) {
			const tenant = await prisma.barbershop.create({
				data: {
					name: shop.name,
					slug: shop.slug,
					address: shop.address,
					imageUrl:
						AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)],
				},
			});
			createdTenants.push({ id: tenant.id, slug: tenant.slug });
		}

		const clients = [] as Array<{ id: string; name: string; email: string }>;
		for (const [index, client] of CLIENTS.entries()) {
			const createdUser = await prisma.user.create({
				data: {
					name: client.name,
					email: client.email,
					emailVerified: true,
					role: "CLIENT",
					passwordHash: "seed_password_hash",
					image: AVATAR_IMAGES[index % AVATAR_IMAGES.length],
				},
			});

			await createBetterAuthAccount(prisma, createdUser.id, createdUser.email);
			clients.push({
				id: createdUser.id,
				name: createdUser.name,
				email: createdUser.email,
			});
		}

		await prisma.userTenant.create({
			data: {
				userId: clients[0].id,
				tenantId: createdTenants[0].id,
				role: "CLIENT",
			},
		});

		await prisma.userTenant.create({
			data: {
				userId: clients[1].id,
				tenantId: createdTenants[1].id,
				role: "CLIENT",
			},
		});

		await prisma.userTenant.create({
			data: {
				userId: clients[2].id,
				tenantId: createdTenants[2].id,
				role: "CLIENT",
			},
		});

		await prisma.userTenant.create({
			data: {
				userId: clients[0].id,
				tenantId: createdTenants[1].id,
				role: "CLIENT",
			},
		});

		const tenantClients = new Map<string, string[]>();
		tenantClients.set(createdTenants[0].id, [clients[0].id]);
		tenantClients.set(createdTenants[1].id, [clients[1].id, clients[0].id]);
		tenantClients.set(createdTenants[2].id, [clients[2].id]);

		const createdBarbers: CreatedBarber[] = [];
		let barberNameIndex = 0;

		for (const tenant of createdTenants) {
			for (let barberIndex = 0; barberIndex < 5; barberIndex++) {
				const barberName = BARBER_NAMES[barberNameIndex];
				const emailLocal = barberName
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^a-z0-9]+/g, ".")
					.replace(/^\.|\.$/g, "");
				const barberEmail = `${emailLocal}.${tenant.slug}@seed.dev`;

				const barberUser = await prisma.user.create({
					data: {
						name: barberName,
						email: barberEmail,
						emailVerified: true,
						role: "BARBER",
						passwordHash: "seed_password_hash",
						image:
							AVATAR_IMAGES[
								(barberNameIndex + barberIndex) % AVATAR_IMAGES.length
							],
					},
				});

				await createBetterAuthAccount(prisma, barberUser.id, barberUser.email);

				await prisma.userTenant.create({
					data: {
						userId: barberUser.id,
						tenantId: tenant.id,
						role: "BARBER",
					},
				});

				const barber = await prisma.barber.create({
					data: {
						phone: `+55 11 90000-${String(barberNameIndex + 1000).slice(-4)}`,
						userId: barberUser.id,
						tenantId: tenant.id,
					},
				});

				for (let day = 1; day <= 6; day++) {
					await prisma.barberDisponibility.create({
						data: {
							barberId: barber.id,
							tenantId: tenant.id,
							dayOfWeek: day,
							startTime: availabilityStart,
							endTime: availabilityEnd,
						},
					});

					await prisma.barberBreak.create({
						data: {
							barberId: barber.id,
							tenantId: tenant.id,
							dayOfWeek: day,
							startTime: "12:00",
							endTime: "14:00",
						},
					});
				}

				const services = [] as Array<{ id: string; priceInCents: number }>;
				for (const service of SERVICE_TEMPLATES) {
					const createdService = await prisma.barberService.create({
						data: {
							name: service.name,
							description: service.description,
							imageUrl: service.imageUrl,
							priceInCents: service.priceInCents,
							durationInMinutes: service.durationInMinutes,
							barberId: barber.id,
							tenantId: tenant.id,
						},
					});
					services.push({
						id: createdService.id,
						priceInCents: createdService.priceInCents,
					});
				}

				createdBarbers.push({
					barberId: barber.id,
					tenantId: tenant.id,
					services,
				});

				barberNameIndex += 1;
			}
		}

		const pastBookings = [] as Array<{
			id: string;
			barberId: string;
			userId: string;
			tenantId: string;
		}>;

		for (const barber of createdBarbers) {
			const possibleClientIds = tenantClients.get(barber.tenantId) ?? [];
			for (const [serviceIndex, service] of barber.services.entries()) {
				const date = new Date(futureBase);
				date.setDate(
					date.getDate() -
						(serviceIndex + 1) * 3 -
						Math.floor(Math.random() * 2)
				);
				const allowedHours = [8, 9, 10, 11, 14, 15, 16, 17];
				date.setHours(
					allowedHours[serviceIndex % allowedHours.length],
					0,
					0,
					0
				);

				const createdBooking = await prisma.booking.create({
					data: {
						date,
						serviceId: service.id,
						userId: pickRandom(possibleClientIds),
						tenantId: barber.tenantId,
						barberId: barber.barberId,
						status: "COMPLETED",
						priceInCents: service.priceInCents,
						paidWithSubscription: false,
						paymentMethod: "pix",
					},
				});

				pastBookings.push({
					id: createdBooking.id,
					barberId: barber.barberId,
					userId: createdBooking.userId,
					tenantId: barber.tenantId,
				});
			}
		}

		for (const [index, booking] of pastBookings.entries()) {
			if (index % 2 === 0 || index % 5 === 0) {
				await prisma.rating.create({
					data: {
						bookingId: booking.id,
						barberId: booking.barberId,
						userId: booking.userId,
						tenantId: booking.tenantId,
						ratingValue: 4 + (index % 2),
						comment:
							index % 3 === 0
								? "Atendimento excelente e muito pontual."
								: "Otimo servico, volto novamente.",
						asked: true,
					},
				});
			}
		}

		for (let i = 0; i < 10; i++) {
			const barber = pickRandom(createdBarbers);
			const service = pickRandom(barber.services);
			const possibleClientIds = tenantClients.get(barber.tenantId) ?? [];

			const date = new Date(futureBase);
			date.setDate(date.getDate() + 1 + Math.floor(Math.random() * 7));
			const allowedHours = [8, 9, 10, 11, 14, 15, 16, 17];
			date.setHours(
				pickRandom(allowedHours),
				Math.random() > 0.5 ? 0 : 30,
				0,
				0
			);

			await prisma.booking.create({
				data: {
					date,
					serviceId: service.id,
					userId: pickRandom(possibleClientIds),
					tenantId: barber.tenantId,
					barberId: barber.barberId,
					status: "SCHEDULED",
					priceInCents: service.priceInCents,
					paidWithSubscription: false,
					paymentMethod: "pix",
				},
			});
		}

		const subscriptionPlan = createdPlans.find((plan) =>
			plan.name.includes("Corte Ilimitado")
		);

		await prisma.subscription.create({
			data: {
				planId: subscriptionPlan?.id,
				stripeCustomerId: "cus_seed_cliente_001",
				stripeSubscriptionId: "sub_seed_cliente_001",
				status: "ACTIVE",
				periodStart: new Date(futureBase),
				periodEnd: new Date(futureBase.getTime() + 1000 * 60 * 60 * 24 * 30),
				trialStart: null,
				trialEnd: null,
				cancelAtPeriodEnd: false,
				seats: 1,
				userId: clients[0].id,
				tenantId: createdTenants[0].id,
			},
		});

		console.log("Seed concluido com sucesso.");
		console.log(`Barbearias: ${createdTenants.length}`);
		console.log(`Barbeiros: ${createdBarbers.length}`);
		console.log("Servicos por barbeiro: 5");
		console.log(`Agendamentos passados: ${pastBookings.length}`);
		console.log("Agendamentos futuros: 10");
		console.log(`Planos: ${createdPlans.length}`);
		console.log("Assinaturas: 1");
	} catch (error) {
		console.error("Erro ao executar seed:", error);
		process.exitCode = 1;
	} finally {
		await prisma.$disconnect();
		await pool.end();
	}
}

void seedDatabase();
