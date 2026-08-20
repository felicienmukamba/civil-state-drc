import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { renderToBuffer } from '@react-pdf/renderer';
import DivorceCertificate from '@/components/pdf/DivorceCertificate';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session: AuthSession, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const divorceId = parseInt(id, 10);
    
    if (isNaN(divorceId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Fetch divorce with all related data
    const divorce = await db.divorce.findUnique({
      where: { id: divorceId },
      include: {
        mariage: {
          include: {
            epoux: true,
            epouse: true,
          }
        },
        officier: true,
      }
    });

    if (!divorce) {
      return NextResponse.json({ error: "Divorce introuvable" }, { status: 404 });
    }

    // Only allow certificate generation for validated divorces
    if (divorce.status !== 'VALIDE') {
      return NextResponse.json({ 
        error: "Seuls les divorces validés peuvent générer un certificat" 
      }, { status: 403 });
    }

    // Generate PDF - convert Date objects to strings for PDF component
    const divorceForPdf = {
      ...divorce,
      date_enregistrement: divorce.date_enregistrement.toISOString(),
      createdAt: divorce.createdAt.toISOString(),
      mariage: {
        ...divorce.mariage,
        date_celebration: divorce.mariage.date_celebration.toISOString(),
        epoux: {
          ...divorce.mariage.epoux,
          date_naissance: divorce.mariage.epoux.date_naissance.toISOString(),
        },
        epouse: {
          ...divorce.mariage.epouse,
          date_naissance: divorce.mariage.epouse.date_naissance.toISOString(),
        },
      },
    };
    const pdfBuffer = await renderToBuffer(DivorceCertificate({ divorce: divorceForPdf }));

    // Return PDF with appropriate headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificat-divorce-${divorce.numero_acte}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error: unknown) {
    console.error('Error generating divorce certificate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
});
