import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/repositories/user.repository';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import bcrypt from 'bcryptjs';

export const PUT = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return ApiResponse.error('Mot de passe actuel et nouveau mot de passe requis');
    }

    if (newPassword.length < 6) {
      return ApiResponse.error('Le mot de passe doit contenir au moins 6 caractères');
    }

    const user = await userRepository.findById(session.userId);
    if (!user) {
      return ApiResponse.notFound('Utilisateur non trouvé');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return ApiResponse.error('Mot de passe actuel incorrect', 401);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await userRepository.update(session.userId, { password_hash });

    return ApiResponse.success({ message: 'Mot de passe changé avec succès' });
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
