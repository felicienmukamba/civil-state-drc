import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authGuard } from '@/lib/middleware/auth.guard';

export const PUT = authGuard(['OFFICIER', 'ADMIN'])(async (req: NextRequest, session, params?: { params: { id: string } }) => {
  try {
    const id = parseInt(params?.params?.id || '');
    if (isNaN(id)) throw new Error('ID invalide');
    
    const data = await req.json();
    if (data.date_enregistrement) {
      data.date_enregistrement = new Date(data.date_enregistrement);
    }
    
    const updated = await db.divorce.update({
      where: { id },
      data: {
        numero_acte: data.numero_acte,
        date_enregistrement: data.date_enregistrement,
        decision_justice_ref: data.decision_justice_ref,
        motif: data.motif
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
    
    await db.divorce.delete({ where: { id } });
    
    await db.auditLog.create({
      data: {
        action: 'DELETE',
        entity: 'Divorce',
        summary: `Suppression de l'acte de divorce ID: ${id}`,
        actor: `User ${session.userId}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
});
