import { NextRequest } from 'next/server';
import { citizenService } from '@/lib/services/citizen.service';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const citizens = await citizenService.getAllCitizens();
  return ApiResponse.success(citizens);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const data = await req.json();
    
    if (data.date_naissance) {
      data.date_naissance = Validation.parseDate(data.date_naissance);
    }
    
    const citizen = await citizenService.registerCitizen(data);
    return ApiResponse.created(citizen);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
