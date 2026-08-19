import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';
import { rateLimit, getRateLimitHeaders } from '@/lib/middleware/rate-limit';

// Rate limit: 5 attempts per 15 minutes per IP
const loginRateLimit = rateLimit(5, 15 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!loginRateLimit(ip)) {
      const headers = getRateLimitHeaders(ip, 5, 15 * 60 * 1000);
      return NextResponse.json(
        { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
        { 
          status: 429,
          headers: {
            ...headers,
            'Retry-After': '900'
          }
        }
      );
    }

    const data = await req.json();
    Validation.validateRequiredFields(data, ['username', 'password']);

    const result = await authService.login(data.username, data.password);
    
    const headers = getRateLimitHeaders(ip, 5, 15 * 60 * 1000);
    return NextResponse.json(result, { 
      status: 200,
      headers
    });
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)), 401);
  }
}
