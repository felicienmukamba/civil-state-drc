import { NextRequest, NextResponse } from 'next/server';
import { marriageService } from '@/lib/services/marriage.service';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest) => {
  const marriages = await marriageService.getAllMarriages();
  return NextResponse.json(marriages);
});

export const POST = authGuard(['OFFICIER'])(async (req: NextRequest, session: AuthSession) => {
  try {
    const data = await req.json();
    
    if (data.date_celebration) {
      data.date_celebration = new Date(data.date_celebration);
    }

    const { epoux_id, epouse_id, ...marriageData } = data;

    const marriage = await marriageService.declareMarriage(
      epoux_id,
      epouse_id,
      session.userId,
      marriageData
    );
    
    return NextResponse.json(marriage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
