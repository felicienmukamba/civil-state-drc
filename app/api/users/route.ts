import { NextRequest } from 'next/server';
import { userService } from '@/lib/services/user.service';
import { authGuard } from '@/lib/middleware/auth.guard';
import { ApiResponse } from '@/lib/utils/api-response';
import { Validation } from '@/lib/utils/validation';
import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(40),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OFFICIER']).optional()
});

export const GET = authGuard(['ADMIN'])(async () => {
  const users = await userService.getAllUsers();
  return ApiResponse.success(users);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const rawData = await req.json();
    const parsed = userSchema.safeParse(rawData);

    if (!parsed.success) {
      return ApiResponse.error('Données utilisateur invalides : ' + JSON.stringify(parsed.error.flatten().fieldErrors));
    }

    const data = parsed.data;
    
    const newUser = await userService.createUser({ 
      username: data.username, 
      password_raw: data.password, 
      role: data.role 
    });
    
    const { password_hash, ...userWithoutPassword } = newUser;
    
    return ApiResponse.created(userWithoutPassword);
  } catch (error: unknown) {
    return ApiResponse.error((error instanceof Error ? error.message : String(error)));
  }
});
