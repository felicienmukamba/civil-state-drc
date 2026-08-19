import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';

export const GET = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const logs = await db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return ApiResponse.success(logs);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
