import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    const data = await req.json();
    
    if (data.date_enregistrement) {
      data.date_enregistrement = Validation.parseDate(data.date_enregistrement);
    }
    
    const updated = await db.divorce.update({
      where: { id },
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

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    
    await db.divorce.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Divorce',
        summary: `Suppression de l'acte de divorce ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
