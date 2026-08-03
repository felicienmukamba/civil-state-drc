import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/repositories/user.repository';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import bcrypt from 'bcryptjs';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const user = await userRepository.findById(session.userId);
    if (!user) {
      return ApiResponse.notFound('Utilisateur non trouvé');
    }
    
    const { password_hash, ...userWithoutPassword } = user;
    return ApiResponse.success(userWithoutPassword);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});

export const PUT = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const data = await req.json();
    
    const updated = await userRepository.update(session.userId, {
      username: data.username,
    });
    
    const { password_hash, ...userWithoutPassword } = updated;
    return ApiResponse.success(userWithoutPassword);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
