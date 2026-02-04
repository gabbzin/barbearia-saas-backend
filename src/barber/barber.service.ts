import { Injectable } from "@nestjs/common";
import { prisma } from "prisma";

@Injectable()
export class BarberService {
  findAll() {
    return prisma.barber.findMany({
      include: {
        user: {
          omit: {
            passwordHash: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return prisma.barber.findUnique({
      where: { id },
      include: {
        user: {
          omit: {
            passwordHash: true,
          },
        },
      },
    });
  }

  // create(createBarberDto: CreateBarberDto) {
  //   return 'This action adds a new barber';
  // }

  // update(id: string, updateBarberDto: UpdateBarberDto) {
  //   return `This action updates a #${id} barber`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} barber`;
  // }
}
