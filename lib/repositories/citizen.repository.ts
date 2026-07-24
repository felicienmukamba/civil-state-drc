import { db } from '../db';
import { Prisma } from '@prisma/client';

export class CitizenRepository {
  async findById(id: number) {
    return db.citizen.findUnique({ where: { id } });
  }

  async findByNationalId(numero_national: string) {
    return db.citizen.findUnique({ where: { numero_national } });
  }

  async findAll() {
    return db.citizen.findMany();
  }

  async create(data: Prisma.CitizenCreateInput) {
    return db.citizen.create({ data });
  }

  async update(id: number, data: Prisma.CitizenUpdateInput) {
    return db.citizen.update({ where: { id }, data });
  }
}

export const citizenRepository = new CitizenRepository();
