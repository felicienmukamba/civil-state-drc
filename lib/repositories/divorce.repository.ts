import { db } from '../db';
import { Prisma } from '@prisma/client';

export class DivorceRepository {
  async findById(id: number) {
    return db.divorce.findFirst({ 
      where: { id, deletedAt: null },
      include: { mariage: true }
    });
  }

  async findAll() {
    return db.divorce.findMany({
      where: { deletedAt: null },
      include: { mariage: true }
    });
  }

  async create(data: Prisma.DivorceUncheckedCreateInput) {
    const { mariage_id, officier_id, id, ...rest } = data;
    return db.divorce.create({
      data: {
        ...rest,
        mariage: {
          connect: { id: mariage_id }
        },
        officier: {
          connect: { id: officier_id }
        }
      }
    });
  }
  async updateStatus(id: number, status: string) {
    return db.divorce.update({
      where: { id },
      data: { status }
    });
  }

  async softDelete(id: number) {
    return db.divorce.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const divorceRepository = new DivorceRepository();
