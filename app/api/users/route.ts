import { NextRequest } from 'next/server';
import { userService } from '@/lib/services/user.service';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';

export const GET = authGuard(['ADMIN'])(async () => {
  const users = await userService.getAllUsers();
  return ApiResponse.success(users);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const data = await req.json();
    Validation.validateRequiredFields(data, ['username', 'password']);
    
    const newUser = await userService.createUser({ 
      username: data.username, 
      password_raw: data.password, 
      role: data.role 
    });
    
    const { password_hash, ...userWithoutPassword } = newUser;
    
    return ApiResponse.created(userWithoutPassword);
  } catch (error: any) {
    return ApiResponse.error(error.message);
  }
});
