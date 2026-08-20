import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { divorceRepository } from '@/lib/repositories/divorce.repository';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    const data = await req.json();
    
    // Check if divorce exists and is not already validated
    const existingDivorce = await db.divorce.findUnique({ where: { id: validatedId } });
    if (!existingDivorce) {
      return ApiResponse.notFound('Divorce introuvable');
    }
    
    if (existingDivorce.status === 'VALIDE') {
      return ApiResponse.error('Impossible de modifier un divorce déjà validé', 403);
    }
    
    if (data.date_enregistrement) {
      data.date_enregistrement = Validation.parseDate(data.date_enregistrement);
    }
    
    const updated = await db.divorce.update({
      where: { id: validatedId },
      data: {
        numero_acte: data.numero_acte,
        date_enregistrement: data.date_enregistrement,
        decision_justice_ref: data.decision_justice_ref,
        motif: data.motif
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
    
    await divorceRepository.softDelete(validatedId);
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Divorce',
        summary: `Suppression de l'acte de divorce ID: ${validatedId}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
