import { NextRequest, NextResponse } from 'next/server';
import { divorceService } from '@/lib/services/divorce.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest) => {
  const divorces = await divorceService.getAllDivorces();
  return NextResponse.json(divorces);
});

export const POST = authGuard(['OFFICIER'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const data = await req.json();
    
    if (data.date_enregistrement) {
      data.date_enregistrement = new Date(data.date_enregistrement);
    }

    const { mariage_id, ...divorceData } = data;

    const divorce = await divorceService.declareDivorce(
      mariage_id,
      session.userId,
      divorceData
    );
    
    return NextResponse.json(divorce, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
