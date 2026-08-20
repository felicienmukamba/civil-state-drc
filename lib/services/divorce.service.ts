import { divorceRepository } from '../repositories/divorce.repository';
import { marriageRepository } from '../repositories/marriage.repository';
import { db } from '../db';

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
    
    // Use transaction to ensure both operations succeed or fail together
    await db.$transaction(async (tx) => {
      // Update divorce status
      await tx.divorce.update({
        where: { id },
        data: { status: "VALIDE" }
      });
      
      // Update marriage status to reflect divorce
      await tx.marriage.update({
        where: { id: divorce.mariage_id },
        data: { status: "DIVORCE" }
      });
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "VALIDATION",
          entity: "Divorce",
          summary: `Validation du divorce ${divorce.numero_acte} - Mariage ${divorce.mariage?.numero_acte || divorce.mariage_id}`,
          actor: actorUsername
        }
      });
    });
    
    return { success: true };
  }
}

export const divorceService = new DivorceService();
