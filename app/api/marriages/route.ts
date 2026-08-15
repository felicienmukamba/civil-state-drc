import { NextRequest } from 'next/server';
import { marriageService } from '@/lib/services/marriage.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';
import { z } from 'zod';

const marriageSchema = z.object({
  epoux_id: z.coerce.number().int().positive(),
  epouse_id: z.coerce.number().int().positive(),
  numero_acte: z.string().min(3),
  date_celebration: z.string().or(z.date()),
  lieu_celebration: z.string().min(2),
  regime_matrimonial: z.string().min(2)
});

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const marriages = await marriageService.getAllMarriages();
  return ApiResponse.success(marriages);
});

export const POST = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const rawData = await req.json();
    const parsed = marriageSchema.safeParse(rawData);
    
    if (!parsed.success) {
      return ApiResponse.error('Données mariage invalides : ' + JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const data = parsed.data;
    
    if (data.date_celebration && typeof data.date_celebration === 'string') {
      data.date_celebration = Validation.parseDate(data.date_celebration);
    }

    const { epoux_id, epouse_id, ...marriageData } = data;

    const marriage = await marriageService.declareMarriage(
      epoux_id,
      epouse_id,
      session.userId,
      marriageData as any
    );
    
    return ApiResponse.created(marriage);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
