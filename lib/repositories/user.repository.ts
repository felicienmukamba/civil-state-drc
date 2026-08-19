import { db } from '../db';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findById(id: number) {
    return db.user.findFirst({ where: { id, actif: true, deletedAt: null } });
  }

  async findByUsername(username: string) {
    return db.user.findFirst({ where: { username, actif: true, deletedAt: null } });
  }

  async findAll() {
    return db.user.findMany({
      where: { actif: true, deletedAt: null },
      select: {
        id: true,
        username: true,
        role: true,
        actif: true,
        createdAt: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return db.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return db.user.update({ where: { id }, data });
  }

  async softDelete(id: number) {
    return db.user.update({
      where: { id },
      data: { actif: false, deletedAt: new Date() },
    });
  }
}

export const userRepository = new UserRepository();
