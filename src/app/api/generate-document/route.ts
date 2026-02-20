import { NextRequest, NextResponse } from 'next/server';
import { generateSingleDocument } from '../../../lib/foxit/pipeline';
import { Employee, DocumentType } from '../../../types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { employeeData, documentType } = body as {
            employeeData: Employee;
            documentType: DocumentType;
        };

        if (!employeeData || !documentType) {
            return NextResponse.json({ error: 'Missing employeeData or documentType' }, { status: 400 });
        }

        console.log(`[API] Generating document: ${documentType} for ${employeeData.fullName}`);

        const base64Data = await generateSingleDocument(employeeData, documentType);
        const fileSize = Buffer.from(base64Data, 'base64').length;

        console.log(`[API] Generated ${documentType}: ${fileSize} bytes`);

        return NextResponse.json({
            success: true,
            docId: `doc_${Date.now()}`,
            base64Data,
            fileSize,
            documentType,
            employeeName: employeeData.fullName,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Document generation failed';
        console.error('[API] Generate document error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
