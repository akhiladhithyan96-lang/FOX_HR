import { NextRequest, NextResponse } from 'next/server';
import { downloadDocument } from '../../../../lib/foxit/pdfservices';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ docId: string }> }
) {
    try {
        const { docId } = await params;

        if (!docId) {
            return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
        }

        console.log(`[API] Proxying download for Foxit doc: ${docId}`);

        // In a real production app, you might want to check the cached local storage
        // But here we fetch fresh from Foxit if it exists
        const pdfBuffer = await downloadDocument(docId);

        return new Response(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="hrflow-document-${docId}.pdf"`,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Download failed';
        console.error('[API] Download error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
