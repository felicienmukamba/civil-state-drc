import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { marriageRepository } from '@/lib/repositories/marriage.repository';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    const data = await req.json();
    
    // Check if marriage exists and is not already validated
    const existingMarriage = await db.marriage.findUnique({ where: { id: validatedId } });
    if (!existingMarriage) {
      return ApiResponse.notFound('Mariage introuvable');
    }
    
    if (existingMarriage.status === 'VALIDE') {
      return ApiResponse.error('Impossible de modifier un mariage déjà validé', 403);
    }
    
    if (data.date_celebration) {
      data.date_celebration = Validation.parseDate(data.date_celebration);
    }
    
    const updated = await db.marriage.update({
      where: { id: validatedId },
      data: {
        numero_acte: data.numero_acte,
        date_celebration: data.date_celebration,
        lieu_celebration: data.lieu_celebration,
        regime_matrimonial: data.regime_matrimonial
      }
    });
    
    return ApiResponse.success(updated);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    
    await marriageRepository.softDelete(validatedId);
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Mariage',
        summary: `Suppression de l'acte de mariage ID: ${validatedId}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
