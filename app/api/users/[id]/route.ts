import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/repositories/user.repository';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    await userRepository.softDelete(validatedId);
    return ApiResponse.success({ success: true });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});

export const PUT = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = Validation.validateId(id);
    const data = await req.json();
    
    const updated = await userRepository.update(validatedId, {
      username: data.username,
      role: data.role,
      actif: data.actif
    });
    
    return ApiResponse.success(updated);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
