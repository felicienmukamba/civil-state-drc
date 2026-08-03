import { db } from '../db';
import { Prisma } from '@prisma/client';

export class DivorceRepository {
  async findById(id: number) {
    return db.divorce.findUnique({ 
      where: { id },
      include: { mariage: true }
    });
  }

  async findAll() {
    return db.divorce.findMany({
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
}

export const divorceRepository = new DivorceRepository();
