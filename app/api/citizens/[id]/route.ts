import { NextRequest, NextResponse } from 'next/server';
import { citizenRepository } from '@/lib/repositories/citizen.repository';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';

export const PUT = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    const data = await req.json();
    if (data.date_naissance) {
      data.date_naissance = new Date(data.date_naissance);
    }
    
    const updated = await citizenRepository.update(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    await db.citizen.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Citoyen',
        summary: `Suppression du citoyen ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
