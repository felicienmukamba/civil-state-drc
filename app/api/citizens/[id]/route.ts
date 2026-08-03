import { NextRequest } from 'next/server';
import { citizenRepository } from '@/lib/repositories/citizen.repository';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    const data = await req.json();
    
    if (data.date_naissance) {
      data.date_naissance = Validation.parseDate(data.date_naissance);
    }
    
    const updated = await citizenRepository.update(id, data);
    return ApiResponse.success(updated);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    
    await db.citizen.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Citoyen',
        summary: `Suppression du citoyen ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
