import { db } from '../db';
import { Prisma } from '@prisma/client';

export class MarriageRepository {
  async findById(id: number) {
    // using findFirst because findUnique might not allow querying non-unique fields easily without composite index if deletedAt is added, but it's fine for now if we use findFirst
    return db.marriage.findFirst({ 
      where: { id, deletedAt: null } as any,
      include: { epoux: true, epouse: true, divorce: true }
    });
  }

  async findAll() {
    return db.marriage.findMany({
      where: { deletedAt: null } as any,
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
        },
        deletedAt: null
      } as any,
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

  async softDelete(id: number) {
    return db.marriage.update({
      where: { id },
      data: { deletedAt: new Date() } as any,
    });
  }
}

export const marriageRepository = new MarriageRepository();
