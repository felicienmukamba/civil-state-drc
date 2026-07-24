import { db } from '../db';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findById(id: number) {
    return db.user.findUnique({ where: { id, actif: true } });
  }

  async findByUsername(username: string) {
    return db.user.findUnique({ where: { username, actif: true } });
  }

  async findAll() {
    return db.user.findMany({
      where: { actif: true },
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
      data: { actif: false },
    });
  }
}

export const userRepository = new UserRepository();
