import { NextRequest } from 'next/server';
import { marriageService } from '@/lib/services/marriage.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const marriages = await marriageService.getAllMarriages();
  return ApiResponse.success(marriages);
});

export const POST = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const data = await req.json();
    
    Validation.validateRequiredFields(data, ['epoux_id', 'epouse_id', 'numero_acte', 'date_celebration', 'lieu_celebration', 'regime_matrimonial']);
    
    if (data.date_celebration) {
      data.date_celebration = Validation.parseDate(data.date_celebration);
    }

    const { epoux_id, epouse_id, ...marriageData } = data;

    const marriage = await marriageService.declareMarriage(
      Validation.validateId(epoux_id),
      Validation.validateId(epouse_id),
      session.userId,
      marriageData
    );
    
    return ApiResponse.created(marriage);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
