import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
