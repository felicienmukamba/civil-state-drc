import { marriageRepository } from '../repositories/marriage.repository';
import { citizenRepository } from '../repositories/citizen.repository';

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

    const activeEpouxMarriage = await marriageRepository.findActiveMarriageByCitizenId(epoux_id);
    if (activeEpouxMarriage) {
      throw new Error(`L'époux(se) (ID: ${epouse_id}) est déjà engagé(e) dans un mariage actif.`);
    }

    const activeEpouseMarriage = await marriageRepository.findActiveMarriageByCitizenId(epouse_id);
    if (activeEpouseMarriage) {
      throw new Error(`L'époux(se) (ID: ${epouse_id}) est déjà engagé(e) dans un mariage actif.`);
    }

    return marriageRepository.create({
      ...data,
      epoux_id,
      epouse_id,
      officier_id,
    });
  }

  async getAllMarriages() {
    return marriageRepository.findAll();
  }

  async validateMarriage(id: number, actorUsername: string) {
    const marriage = await marriageRepository.findById(id);
    if (!marriage) throw new Error("Mariage introuvable");
    
    await marriageRepository.updateStatus(id, "VALIDE");
    
    // Import dynamique ou utiliser un service pour AuditLog
    const { db } = await import('../db');
    await db.auditLog.create({
      data: {
        action: "VALIDATION",
        entity: "Marriage",
        summary: `Validation du mariage ${marriage.numero_acte}`,
        actor: actorUsername
      }
    });
    
    return { success: true };
  }
}

export const marriageService = new MarriageService();
