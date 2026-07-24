import { citizenRepository } from '../repositories/citizen.repository';
import { Prisma } from '@prisma/client';

export class CitizenService {
  async registerCitizen(data: Omit<Prisma.CitizenCreateInput, 'createdAt' | 'updatedAt'>) {
    const existing = await citizenRepository.findByNationalId(data.numero_national);
    if (existing) {
      throw new Error('Un citoyen avec ce numéro national existe déjà');
    }
    return citizenRepository.create(data as Prisma.CitizenCreateInput);
  }

  async getAllCitizens() {
    return citizenRepository.findAll();
  }
}

export const citizenService = new CitizenService();
