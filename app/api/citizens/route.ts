import { NextRequest } from 'next/server';
import { citizenService } from '@/lib/services/citizen.service';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';
import { z } from 'zod';

const citizenSchema = z.object({
  numero_national: z.string().min(5).max(40),
  nom: z.string().min(2).max(80),
  postnom: z.string().min(2).max(80),
  prenom: z.string().min(2).max(80),
  date_naissance: z.string().or(z.date()),
  lieu_naissance: z.string().min(2),
  sexe: z.enum(['F', 'M']),
  profession: z.string().min(2),
  adresse_actuelle: z.string().min(2)
});

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async () => {
  const citizens = await citizenService.getAllCitizens();
  return ApiResponse.success(citizens);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const rawData = await req.json();
    const parsed = citizenSchema.safeParse(rawData);
    
    if (!parsed.success) {
      return ApiResponse.error('Données citoyen invalides : ' + JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const data = parsed.data;
    if (data.date_naissance && typeof data.date_naissance === 'string') {
      data.date_naissance = Validation.parseDate(data.date_naissance);
    }
    
    const citizen = await citizenService.registerCitizen(data as any);
    return ApiResponse.created(citizen);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
