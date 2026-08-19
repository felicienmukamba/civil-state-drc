import { marriageRepository } from '../repositories/marriage.repository';
import { citizenRepository } from '../repositories/citizen.repository';
import { db } from '../db';

export class MarriageService {
  async declareMarriage(
    epoux_id: number,
    epouse_id: number,
    officier_id: number,
    data: { numero_acte: string; date_celebration: Date; lieu_celebration: string; regime_matrimonial: string }
  ) {
    if (!officier_id) {
      throw new Error('Officier ID is required');
    }

    const epoux = await citizenRepository.findById(epoux_id);
    const epouse = await citizenRepository.findById(epouse_id);

    if (!epoux || !epouse) {
      throw new Error('Les citoyens spécifiés sont introuvables');
    }

    if (epoux.sexe === epouse.sexe) {
      throw new Error('Le mariage doit être hétérosexuel selon le Code de la Famille de la RDC');
    }

    // Validate minimum age (18 years according to DRC Family Code)
    const MINIMUM_AGE = 18;
    const calculateAge = (birthDate: Date) => {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const epouxAge = calculateAge(epoux.date_naissance);
    const epouseAge = calculateAge(epouse.date_naissance);

    if (epouxAge < MINIMUM_AGE) {
      throw new Error(`L'époux doit avoir au moins ${MINIMUM_AGE} ans (âge actuel: ${epouxAge})`);
    }

    if (epouseAge < MINIMUM_AGE) {
      throw new Error(`L'épouse doit avoir au moins ${MINIMUM_AGE} ans (âge actuel: ${epouseAge})`);
    }

    // Use transaction to prevent race conditions in bigamy check
    return db.$transaction(async (tx) => {
      // Check for active marriages within transaction for atomicity
      const activeEpouxMarriage = await tx.marriage.findFirst({
        where: {
          OR: [
            { epoux_id: epoux_id },
            { epouse_id: epoux_id }
          ],
          divorce: {
            is: null
          },
          deletedAt: null
        }
      });

      if (activeEpouxMarriage) {
        throw new Error(`L'époux(se) (ID: ${epoux_id}) est déjà engagé(e) dans un mariage actif.`);
      }

      const activeEpouseMarriage = await tx.marriage.findFirst({
        where: {
          OR: [
            { epoux_id: epouse_id },
            { epouse_id: epouse_id }
          ],
          divorce: {
            is: null
          },
          deletedAt: null
        }
      });

      if (activeEpouseMarriage) {
        throw new Error(`L'époux(se) (ID: ${epouse_id}) est déjà engagé(e) dans un mariage actif.`);
      }

      // Create marriage within same transaction
      return tx.marriage.create({
        data: {
          ...data,
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
    });
  }

  async getAllMarriages() {
    return marriageRepository.findAll();
  }

  async validateMarriage(id: number, actorUsername: string) {
    const marriage = await marriageRepository.findById(id);
    if (!marriage) throw new Error("Mariage introuvable");
    
    // Use transaction to ensure both operations succeed or fail together
    await db.$transaction(async (tx) => {
      await tx.marriage.update({
        where: { id },
        data: { status: "VALIDE" }
      });
      
      await tx.auditLog.create({
        data: {
          action: "VALIDATION",
          entity: "Marriage",
          summary: `Validation du mariage ${marriage.numero_acte}`,
          actor: actorUsername
        }
      });
    });
    
    return { success: true };
  }
}

export const marriageService = new MarriageService();
