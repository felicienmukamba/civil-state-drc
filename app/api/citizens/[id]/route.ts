import { NextRequest } from 'next/server';
import { citizenRepository } from '@/lib/repositories/citizen.repository';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const PUT = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    const data = await req.json();
    
    if (data.date_naissance) {
      data.date_naissance = Validation.parseDate(data.date_naissance);
    }
    
    const updated = await citizenRepository.update(validatedId, data);
    return ApiResponse.success(updated);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    
    await citizenRepository.softDelete(validatedId);
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Citoyen',
        summary: `Suppression du citoyen ID: ${validatedId}`,
        actor: `User ${session.userId}`
      }
    });

    return ApiResponse.success({ success: true });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
