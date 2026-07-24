import { userRepository } from '../repositories/user.repository';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async createUser(data: { username: string, password_raw: string, role?: 'ADMIN' | 'OFFICIER' }) {
    const existing = await userRepository.findByUsername(data.username);
    if (existing) {
      throw new Error("L'utilisateur existe déjà");
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password_raw, salt);

    return userRepository.create({
      username: data.username,
      password_hash,
      role: data.role || 'OFFICIER',
    });
  }

  async deleteUser(id: number) {
    return userRepository.softDelete(id);
  }
}

export const userService = new UserService();
