import { divorceRepository } from '../repositories/divorce.repository';
import { marriageRepository } from '../repositories/marriage.repository';

export class DivorceService {
  async declareDivorce(
    mariage_id: number,
    officier_id: number,
    data: { numero_acte: string; date_enregistrement: Date; decision_justice_ref: string; motif: string }
  ) {
    if (!officier_id) {
      throw new Error('Officier ID is required');
    }

    const marriage = await marriageRepository.findById(mariage_id);
    if (!marriage) {
      throw new Error('Mariage introuvable');
    }

    if (marriage.divorce) {
      throw new Error('Ce mariage a déjà fait l\'objet d\'un divorce');
    }

    return divorceRepository.create({
      ...data,
      mariage_id,
      officier_id,
    });
  }

  async getAllDivorces() {
    return divorceRepository.findAll();
  }

  async validateDivorce(id: number, actorUsername: string) {
    const divorce = await divorceRepository.findById(id);
    if (!divorce) throw new Error("Divorce introuvable");
    
    await divorceRepository.updateStatus(id, "VALIDE");
    
    const { db } = await import('../db');
    await db.auditLog.create({
      data: {
        action: "VALIDATION",
        entity: "Divorce",
        summary: `Validation du divorce ${divorce.numero_acte}`,
        actor: actorUsername
      }
    });
    
    return { success: true };
  }
}

export const divorceService = new DivorceService();
