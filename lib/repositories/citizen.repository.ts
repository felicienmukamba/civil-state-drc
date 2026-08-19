import { db } from '../db';
import { Prisma } from '@prisma/client';

export class CitizenRepository {
  async findById(id: number) {
    return db.citizen.findFirst({ where: { id, deletedAt: null } });
  }

  async findByNationalId(numero_national: string) {
    return db.citizen.findFirst({ where: { numero_national, deletedAt: null } });
  }

  async findAll() {
    return db.citizen.findMany({ where: { deletedAt: null } });
  }

  async create(data: Prisma.CitizenCreateInput) {
    return db.citizen.create({ data });
  }

  async update(id: number, data: Prisma.CitizenUpdateInput) {
    return db.citizen.update({ where: { id }, data });
  }

  async updateStatus(id: number, status: string) {
    return db.citizen.update({
      where: { id },
      data: { status }
    });
  }

  async softDelete(id: number) {
    return db.citizen.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const citizenRepository = new CitizenRepository();
