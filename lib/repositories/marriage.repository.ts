import { db } from '../db';
import { Prisma } from '@prisma/client';

export class MarriageRepository {
  async findById(id: number) {
    return db.marriage.findUnique({ 
      where: { id },
      include: { epoux: true, epouse: true, divorce: true }
    });
  }

  async findAll() {
    return db.marriage.findMany({
      include: { epoux: true, epouse: true, divorce: true }
    });
  }

  async findActiveMarriageByCitizenId(citizenId: number) {
    // An active marriage is one where the citizen is either epoux or epouse,
    // and there is NO associated divorce.
    return db.marriage.findFirst({
      where: {
        OR: [
          { epoux_id: citizenId },
          { epouse_id: citizenId }
        ],
        divorce: {
          is: null
        }
      },
      include: { divorce: true }
    });
  }

  async create(data: Prisma.MarriageUncheckedCreateInput) {
    const { epoux_id, epouse_id, officier_id, id, ...rest } = data;
    return db.marriage.create({
      data: {
        ...rest,
        epoux: {
          connect: { id: epoux_id }
        },
        epouse: {
          connect: { id: epouse_id }
        },
        officier: {
          connect: { id: officier_id }
        }
      }
    });
  }
  async updateStatus(id: number, status: string) {
    return db.marriage.update({
      where: { id },
      data: { status }
    });
  }
}

export const marriageRepository = new MarriageRepository();
