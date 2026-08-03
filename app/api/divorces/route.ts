import { NextRequest } from 'next/server';
import { divorceService } from '@/lib/services/divorce.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const divorces = await divorceService.getAllDivorces();
  return ApiResponse.success(divorces);
});

export const POST = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const data = await req.json();
    
    Validation.validateRequiredFields(data, ['mariage_id', 'numero_acte', 'date_enregistrement', 'decision_justice_ref', 'motif']);
    
    if (data.date_enregistrement) {
      data.date_enregistrement = Validation.parseDate(data.date_enregistrement);
    }

    const { mariage_id, ...divorceData } = data;

    const divorce = await divorceService.declareDivorce(
      Validation.validateId(mariage_id),
      session.userId,
      divorceData
    );
    
    return ApiResponse.created(divorce);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
