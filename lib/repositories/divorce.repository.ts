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
    return db.divorce.create({ data });
  }
}

export const divorceRepository = new DivorceRepository();
