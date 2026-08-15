import { NextRequest } from 'next/server';
import { divorceService } from '@/lib/services/divorce.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';

export const POST = authGuard(['ADMIN', 'OFFICIER_SUPERIEUR'])(async (
  req: NextRequest, 
  session: AuthSession, 
  context?: { params: { id: string } }
) => {
  try {
    const id = parseInt(context?.params?.id || '');
    if (isNaN(id)) {
      return ApiResponse.error("ID invalide", 400);
    }
    
    await divorceService.validateDivorce(id, session.username);
    
    return ApiResponse.success({ message: "Divorce validé avec succès" });
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
