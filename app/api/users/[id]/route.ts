import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/lib/repositories/user.repository';
import { authGuard } from '@/lib/middleware/auth.guard';

// DELETE /api/users/[id]
export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    // We do soft delete as per repository
    await userRepository.softDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});

// PUT /api/users/[id]
export const PUT = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    const data = await req.json();
    const updated = await userRepository.update(id, {
      username: data.username,
      role: data.role,
      actif: data.actif
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
