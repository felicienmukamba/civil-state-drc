import { NextRequest } from 'next/server';
import { divorceService } from '@/lib/services/divorce.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';

export const POST = authGuard(['ADMIN', 'OFFICIER'])(async (
  req: NextRequest, 
  session: AuthSession, 
  params?: Promise<{ id: string }>
) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const validatedId = parseInt(id, 10);
    if (isNaN(validatedId)) {
      return ApiResponse.error("ID invalide", 400);
    }
    
    await divorceService.validateDivorce(validatedId, session.username);
    
    return ApiResponse.success({ message: "Divorce validé avec succès" });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
