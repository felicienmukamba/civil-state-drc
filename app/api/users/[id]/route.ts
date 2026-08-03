import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/repositories/user.repository';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    await userRepository.softDelete(id);
    return ApiResponse.success({ success: true });
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});

export const PUT = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = Validation.validateId(params?.params?.id || '');
    const data = await req.json();
    
    const updated = await userRepository.update(id, {
      username: data.username,
      role: data.role,
      actif: data.actif
    });
    
    return ApiResponse.success(updated);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
