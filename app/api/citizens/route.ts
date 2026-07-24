import { NextRequest, NextResponse } from 'next/server';
import { citizenService } from '@/lib/services/citizen.service';
import { authGuard } from '@/lib/middleware/auth.guard';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest) => {
  const citizens = await citizenService.getAllCitizens();
  return NextResponse.json(citizens);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const data = await req.json();
    if (data.date_naissance) {
      data.date_naissance = new Date(data.date_naissance);
    }
    const citizen = await citizenService.registerCitizen(data);
    return NextResponse.json(citizen, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
