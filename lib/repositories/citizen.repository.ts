import { db } from '../db';
import { Prisma } from '@prisma/client';

export class CitizenRepository {
  async findById(id: number) {
    return db.citizen.findUnique({ where: { id, deletedAt: null } as any }); // using 'as any' temporarily until prisma generate
  }

  async findByNationalId(numero_national: string) {
    return db.citizen.findUnique({ where: { numero_national, deletedAt: null } as any });
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

  async softDelete(id: number) {
    return db.citizen.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }
}

export const citizenRepository = new CitizenRepository();
