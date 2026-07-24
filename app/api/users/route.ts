import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/user.service';
import { authGuard } from '@/lib/middleware/auth.guard';

export const GET = authGuard(['ADMIN'])(async (req: NextRequest) => {
  const users = await userService.getAllUsers();
  return NextResponse.json(users);
});

export const POST = authGuard(['ADMIN'])(async (req: NextRequest) => {
  try {
    const { username, password, role } = await req.json();
    const newUser = await userService.createUser({ username, password_raw: password, role });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
