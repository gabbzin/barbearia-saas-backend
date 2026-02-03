import type { Barber } from "./generated";
import { prisma } from "./prisma";

async function seedDatabase() {
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
      "https://utfs.io/f/6b0888f8-b69f-4be7-a13b-52d1c0c9cab2-17m.png",
      "https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
      "https://utfs.io/f/ef45effa-415e-416d-8c4a-3221923cd10f-17n.png",
      "https://utfs.io/f/a55f0f39-31a0-4819-8796-538d68cc2a0f-17o.png",
      "https://utfs.io/f/5c89f046-80cd-4443-89df-211de62b7c2a-17p.png",
      "https://utfs.io/f/23d9c4f7-8bdb-40e1-99a5-f42271b7404a-17q.png",
      "https://utfs.io/f/9f0847c2-d0b8-4738-a673-34ac2b9506ec-17r.png",
      "https://utfs.io/f/07842cfb-7b30-4fdc-accc-719618dfa1f2-17s.png",
      "https://utfs.io/f/0522fdaf-0357-4213-8f52-1d83c3dcb6cd-18e.png",
    ];

    const barberNames = ["Ceara do Corte", "Tuco do Corte", "Davi Barber"];

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 30.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 10.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Platinado + Corte",
        description: "Hidratação profunda para cabelo e barba.",
        price: 120.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Luzes + Corte",
        description: "Hidratação profunda para cabelo e barba.",
        price: 100.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ];

    // Criar planos de assinatura
    const Plans = [
      {
        id: "plano-1",
        name: "Hair",
        description: "Cortes de cabelo ilimitados por mês",
        priceInCents: 8000,
        stripePriceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ", // R$ 80
      },
      {
        id: "plano-2",
        name: "Beard",
        description: "Serviços de barba ilimitados por mês",
        priceInCents: 7000,
        stripePriceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8", // R$ 70
      },
      {
        id: "plano-3",
        name: "Hair and Beard",
        description: "Cortes e barba ilimitados por mês",
        priceInCents: 15000,
        stripePriceId: "price_1SfJCmLZmTtv3cllXAzpWq1a", // R$ 150
      },
      {
        id: "plano-4",
        name: "FREE",
        description: "Plano gratuito com serviços limitados",
        priceInCents: 0,
        stripePriceId: null, // Plano gratuito sem cobrança
      },
    ];

    for (const plan of Plans) {
      await prisma.plan.create({
        data: plan,
      });
    }

    const barbers: Barber[] = [];
    for (let i = 0; i < barberNames.length; i++) {
      const name = barberNames[i];
      const imageUrl = images[i];
      const email = `${name.toLowerCase().replace(/ /g, ".")}@barber.com`;

      const user = await prisma.user.create({
        data: {
          id: `barber-${i + 1}`,
          name,
          email,
          emailVerified: true,
          role: "BARBER",
          image: imageUrl,
        },
      });

      const barber = await prisma.barber.create({
        data: {
          imageUrl,
          phone: ["(11) 99999-9999"],
          userId: user.id,
        },
      });

      for (const service of services) {
        await prisma.barberService.create({
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
          },
        });
      }

      barbers.push(barber);
    }

    // Criar usuário cliente para os agendamentos
    const clientUser = await prisma.user.create({
      data: {
        id: "client-user-1",
        name: "João Silva",
        email: "joao.silva@example.com",
        emailVerified: true,
        role: "USER",
      },
    });

    // Criar agendamentos passados para o primeiro barbeiro
    const firstBarber = barbers[0];
    const barberServices = await prisma.barberService.findMany({
      where: { barberId: firstBarber.id },
      take: 4,
    });

    // Datas passadas (últimos 30 dias)
    const pastDates = [
      new Date("2024-11-01T10:00:00Z"),
      new Date("2024-11-05T14:00:00Z"),
      new Date("2024-11-12T16:00:00Z"),
      new Date("2024-11-18T11:00:00Z"),
      new Date("2024-11-22T15:00:00Z"),
      new Date("2024-11-28T09:00:00Z"),
    ];

    for (let i = 0; i < pastDates.length; i++) {
      const service = barberServices[i % barberServices.length];

      await prisma.booking.create({
        data: {
          date: pastDates[i],
          status: "COMPLETED",
          userId: clientUser.id,
          barberId: firstBarber.id,
          serviceId: service.id,
          paidWithSubscription: false,
          priceInCents: service.priceInCents,
        },
      });
    }

    const startTime = "09:00";
    const endTime = "21:00";

    // Criar disponibilidade para os barbeiros
    for (const barber of barbers) {
      for (let day = 1; day <= 5; day++) {
        await prisma.disponibility.create({
          data: {
            barberId: barber.id,
            dayOfWeek: day, // Segunda-feira a sexta-feira
            startTime: startTime,
            endTime: endTime,
          },
        });
      }
    }

    console.log("✅ Seed concluído com sucesso!");
    console.log(`- ${barbers.length} barbeiros criados`);
    console.log(`- ${pastDates.length} agendamentos passados criados`);
    console.log(`- ${Plans.length} planos criados`);
    console.log(
      `- Configurações de disponibilidade criadas para cada barbeiro iniciando as ${startTime} até ${endTime} de segunda a sexta.`,
    );

    // Fechar a conexão com o banco de dados
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error);
  }
}

seedDatabase();
