import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    const data = await req.json();
    if (data.date_celebration) {
      data.date_celebration = new Date(data.date_celebration);
    }
    
    // We only allow updating basic info, not changing the spouses to maintain integrity
    const updated = await db.marriage.update({
      where: { id },
      data: {
        numero_acte: data.numero_acte,
        date_celebration: data.date_celebration,
        lieu_celebration: data.lieu_celebration,
        regime_matrimonial: data.regime_matrimonial
      }
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});

export const DELETE = authGuard(['ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    await db.marriage.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Mariage',
        summary: `Suppression de l'acte de mariage ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
