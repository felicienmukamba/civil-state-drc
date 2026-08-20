import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authGuard, AuthSession } from '@/lib/middleware/auth.guard';
import { renderToBuffer } from '@react-pdf/renderer';
import MarriageCertificate from '@/components/pdf/MarriageCertificate';

export const GET = authGuard(['ADMIN', 'OFFICIER'])(async (req: NextRequest, session: AuthSession, params?: Promise<{ id: string }>) => {
  try {
    const { id } = await (params || Promise.resolve({ id: '' }));
    const marriageId = parseInt(id, 10);
    
    if (isNaN(marriageId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Fetch marriage with all related data
    const marriage = await db.marriage.findUnique({
      where: { id: marriageId },
      include: {
        epoux: true,
        epouse: true,
        officier: true,
      }
    });

    if (!marriage) {
      return NextResponse.json({ error: "Mariage introuvable" }, { status: 404 });
    }

    // Only allow certificate generation for validated marriages
    if (marriage.status !== 'VALIDE') {
      return NextResponse.json({ 
        error: "Seuls les mariages validés peuvent générer un certificat" 
      }, { status: 403 });
    }

    // Generate PDF - convert Date objects to strings for PDF component
    const marriageForPdf = {
      ...marriage,
      date_celebration: marriage.date_celebration.toISOString(),
      createdAt: marriage.createdAt.toISOString(),
      epoux: {
        ...marriage.epoux,
        date_naissance: marriage.epoux.date_naissance.toISOString(),
      },
      epouse: {
        ...marriage.epouse,
        date_naissance: marriage.epouse.date_naissance.toISOString(),
      },
    };
    const pdfBuffer = await renderToBuffer(MarriageCertificate(marriageForPdf));

    // Return PDF with appropriate headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificat-mariage-${marriage.numero_acte}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error: unknown) {
    console.error('Error generating marriage certificate:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
});
