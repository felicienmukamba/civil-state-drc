import { NextRequest } from 'next/server';
import { divorceService } from '@/lib/services/divorce.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';
import { z } from 'zod';

const divorceSchema = z.object({
  mariage_id: z.coerce.number().int().positive(),
  numero_acte: z.string().min(3),
  date_enregistrement: z.string().or(z.date()),
  decision_justice_ref: z.string().min(2),
  motif: z.string().min(2)
});

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const divorces = await divorceService.getAllDivorces();
  return ApiResponse.success(divorces);
});

export const POST = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const rawData = await req.json();
    const parsed = divorceSchema.safeParse(rawData);

    if (!parsed.success) {
      return ApiResponse.error('Données divorce invalides : ' + JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const data = parsed.data;
    
    if (data.date_enregistrement && typeof data.date_enregistrement === 'string') {
      data.date_enregistrement = Validation.parseDate(data.date_enregistrement);
    }

    const { mariage_id, ...divorceData } = data;

    const divorce = await divorceService.declareDivorce(
      mariage_id,
      session.userId,
      divorceData as any
    );
    
    return ApiResponse.created(divorce);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
