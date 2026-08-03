import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    Validation.validateRequiredFields(data, ['username', 'password']);

    const result = await authService.login(data.username, data.password);
    return ApiResponse.success(result);
  } catch (error: any) {
    return ApiResponse.error(error.message, 401);
  }
}
