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
}

export const divorceService = new DivorceService();
