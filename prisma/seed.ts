import { format } from "date-fns";
import { Barber, BarberService, PrismaClient } from "@prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Função auxiliar se vier apenas string "HH:mm"
function createDateFromTime(timeString: string) {
	const [hours, minutes] = timeString.split(":").map(Number);
	const date = new Date();
	date.setHours(hours, minutes, 0, 0);
	return date;
}

async function seedDatabase() {
	const startTime = createDateFromTime("09:00");
	const endTime = createDateFromTime("21:00");

	const connectionString = process.env.DATABASE_URL as string;

	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);

	const prisma = new PrismaClient({ adapter });

	try {
		const images = [
			"https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
			"https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
			"https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
			"https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
			"https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
			"https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
			"https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
			"https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
			"https://utfs.io/f/f64f1bd4-59ce-4ee3-972d-2399937eeafc-16x.png",
			"https://utfs.io/f/e995db6d-df96-4658-99f5-11132fd931e1-17j.png",
			"https://utfs.io/f/3bcf33fc-988a-462b-8b98-b811ee2bbd71-17k.png",
			"https://utfs.io/f/5788be0e-2307-4bb4-b603-d9dd237950a2-17l.png",
		];

		const services = [
			{
				name: "Corte de Cabelo",
				description: "Estilo personalizado com as últimas tendências.",
				price: 35,
				imageUrl:
					"https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
			},
			{
				name: "Barba",
				description: "Modelagem completa para destacar sua masculinidade.",
				price: 30,
				imageUrl:
					"https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
			},
			{
				name: "Pézinho",
				description: "Acabamento perfeito para um visual renovado.",
				price: 35,
				imageUrl:
					"https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
			},
			{
				name: "Sobrancelha",
				description: "Expressão acentuada com modelagem precisa.",
				price: 10,
				imageUrl:
					"https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
			},
			{
				name: "Massagem",
				description: "Relaxe com uma massagem revigorante.",
				price: 50,
				imageUrl:
					"https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
			},
			{
				name: "Hidratação",
				description: "Hidratação profunda para cabelo e barba.",
				price: 25,
				imageUrl:
					"https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
			},
			{
				name: "Platinado + Corte",
				description: "Hidratação profunda para cabelo e barba.",
				price: 120,
				imageUrl:
					"https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
			},
			{
				name: "Luzes + Corte",
				description: "Hidratação profunda para cabelo e barba.",
				price: 100,
				imageUrl:
					"https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
			},
		];

		const plans = {
			hair: {
				name: "Hair",
				description: "Cortes de cabelo ilimitados por mês",
				priceInCents: 8000,
				stripePriceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ",
			},
			beard: {
				name: "Beard",
				description: "Serviços de barba ilimitados por mês",
				priceInCents: 7000,
				stripePriceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8",
			},
			hairAndBeard: {
				name: "Hair and Beard",
				description: "Cortes e barba ilimitados por mês",
				priceInCents: 15000,
				stripePriceId: "price_1SfJCmLZmTtv3cllXAzpWq1a",
			},
		};

		const barbershopConfigs = [
			{
				name: "BarberShop 2w",
				slug: "barbershop-2w",
				address: "Av. Paulista, 1000, São Paulo - SP",
				logo: "https://3tlh7aktl6.ufs.sh/f/tcFRjMXVSkQ0Asb1IxZDwZ30bIph8P2qjXfOcVJmTvFtnMxi",
				planKeys: ["hair", "hairAndBeard"],
				barberNames: ["Ceara do Corte", "Davi Barber", "Rafael Cuts"],
				clientUser: {
					idPrefix: "client-2w",
					name: "João Silva",
					email: "joao.silva@barbershop-2w.com",
				},
			},
			{
				name: "Barbearia do Zé",
				slug: "barbearia-do-ze",
				address: "Rua das Flores, 200, Rio de Janeiro - RJ",
				logo: "https://utfs.io/f/0522fdaf-0357-4213-8f52-1d83c3dcb6cd-18e.png",
				planKeys: ["beard"],
				barberNames: ["Tuco do Corte", "Lucas Barbeiro", "Pedro Style"],
				clientUser: {
					idPrefix: "client-ze",
					name: "Carlos Souza",
					email: "carlos.souza@barbearia-do-ze.com",
				},
			},
		];

		await prisma.plan.upsert({
			where: { id: "global-free" },
			update: {},
			create: {
				id: "global-free",
				name: "FREE",
				description: "Plano gratuito padrão",
				priceInCents: 0,
				tenantId: null,
			},
		});

		let imageIndex = 0;
		let totalBarbershops = 0;
		let totalBarbers = 0;
		let totalBookings = 0;
		let totalPlans = 1;

		for (const barbershop of barbershopConfigs) {
			const tenant = await prisma.barbershop.create({
				data: {
					name: barbershop.name,
					slug: barbershop.slug,
					address: barbershop.address,
					logo: barbershop.logo,
				},
			});

			totalBarbershops += 1;

			for (const planKey of barbershop.planKeys) {
				const plan = plans[planKey as keyof typeof plans];
				await prisma.plan.create({
					data: {
						...plan,
						tenantId: tenant.id,
					},
				});

				totalPlans += 1;
			}

			const tenantBarbers: { barber: Barber; services: BarberService[] }[] = [];

			for (const name of barbershop.barberNames) {
				const imageUrl = images[imageIndex % images.length];
				const emailSlug = name.toLowerCase().replace(/ /g, ".");
				const email = `${emailSlug}.${imageIndex}@${barbershop.slug}.com`;

				const user = await prisma.user.create({
					data: {
						name,
						email,
						emailVerified: true,
						image: imageUrl,
					},
				});

				await prisma.userTenant.create({
					data: {
						userId: user.id,
						tenantId: tenant.id,
						role: "BARBER",
					},
				});

				const barber = await prisma.barber.create({
					data: {
						userId: user.id,
						tenantId: tenant.id,
						phone: "(11) 99999-9999",
					},
				});

				const createdServices: BarberService[] = [];

				for (const service of services) {
					const createdService = await prisma.barberService.create({
						data: {
							name: service.name,
							description: service.description,
							priceInCents: service.price * 100,
							barber: {
								connect: {
									id: barber.id,
								},
							},
							imageUrl: service.imageUrl,
							tenant: {
								connect: {
									id: tenant.id,
								},
							},
						},
					});

					createdServices.push(createdService);
				}

				tenantBarbers.push({ barber, services: createdServices });
				totalBarbers += 1;
				imageIndex += 1;
			}

			const clientUser = await prisma.user.create({
				data: {
					id: `${barbershop.clientUser.idPrefix}-${tenant.id}`,
					name: barbershop.clientUser.name,
					email: barbershop.clientUser.email,
					emailVerified: true,
				},
			});

			await prisma.userTenant.upsert({
				where: {
					userId_tenantId: { userId: clientUser.id, tenantId: tenant.id },
				},
				update: {},
				create: { userId: clientUser.id, tenantId: tenant.id, role: "CLIENT" },
			});

			const bookingServices = tenantBarbers[0].services.slice(0, 4);
			const pastDates = [
				new Date("2024-12-01T10:00:00Z"),
				new Date("2024-12-05T14:00:00Z"),
				new Date("2024-12-12T16:00:00Z"),
				new Date("2024-12-18T11:00:00Z"),
				new Date("2024-12-22T15:00:00Z"),
				new Date("2024-12-28T09:00:00Z"),
			];

			for (let i = 0; i < pastDates.length; i++) {
				const service = bookingServices[i % bookingServices.length];

				await prisma.booking.create({
					data: {
						date: pastDates[i],
						status: "COMPLETED",
						paidWithSubscription: false,
						priceInCents: service.priceInCents,
						userId: clientUser.id,
						barberId: tenantBarbers[0].barber.id,
						serviceId: service.id,
						tenantId: tenant.id,
					},
				});

				totalBookings += 1;
			}

			for (const entry of tenantBarbers) {
				for (let day = 1; day <= 5; day++) {
					await prisma.barberDisponibility.create({
						data: {
							barberId: entry.barber.id,
							tenantId: tenant.id,
							dayOfWeek: day,
							startTime: new Date(startTime),
							endTime: new Date(endTime),
						},
					});
				}
			}
		}

		console.log("✅ Seed concluído com sucesso!");
		console.log(`- ${totalBarbershops} barbearias criadas`);
		console.log(`- ${totalBarbers} barbeiros criados`);
		console.log(`- ${totalBookings} agendamentos passados criados`);
		console.log(`- ${totalPlans} planos criados`);
		console.log(
			`- Configurações de disponibilidade criadas para cada barbeiro iniciando as ${format(startTime, "HH:mm")} até ${format(endTime, "HH:mm")} de segunda a sexta.`
		);

		await prisma.$disconnect();
	} catch (error) {
		console.error("Erro ao criar as barbearias:", error);
	}
}

seedDatabase();
