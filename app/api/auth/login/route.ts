import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username et password requis' }, { status: 400 });
    }

    const data = await authService.login(username, password);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
