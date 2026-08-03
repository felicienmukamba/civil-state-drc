import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    const data = await req.json();
    
    if (data.date_celebration) {
      data.date_celebration = Validation.parseDate(data.date_celebration);
    }
    
    const updated = await db.marriage.update({
      where: { id },
      data: {
        numero_acte: data.numero_acte,
        date_celebration: data.date_celebration,
        lieu_celebration: data.lieu_celebration,
        regime_matrimonial: data.regime_matrimonial
      }
    });
    
    return ApiResponse.success(updated);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    
    await db.marriage.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Mariage',
        summary: `Suppression de l'acte de mariage ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
