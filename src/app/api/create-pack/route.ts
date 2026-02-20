import { NextRequest, NextResponse } from 'next/server';
import { generateOnboardingPack } from '../../../lib/foxit/pipeline';
import { Employee, DocumentType, PackOptions } from '../../../types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { employee, documentTypes, options } = body as {
            employee: Employee;
            documentTypes: DocumentType[];
            options: PackOptions;
        };

        if (!employee || !documentTypes?.length) {
            return NextResponse.json({ error: 'Missing employee or documentTypes' }, { status: 400 });
        }

        console.log(`[API] Creating onboarding pack for ${employee.fullName}`);
        console.log(`[API] Documents: ${documentTypes.join(', ')}`);
        console.log(`[API] Options:`, JSON.stringify(options));

        const pdfBuffer = await generateOnboardingPack(employee, documentTypes, options);
        const base64Data = pdfBuffer.toString('base64');
        const fileSize = pdfBuffer.length;

        console.log(`[API] Pack created: ${fileSize} bytes`);

        return NextResponse.json({
            success: true,
            base64Data,
            fileSize,
            employeeName: employee.fullName,
            documentCount: documentTypes.length,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Pack creation failed';
        console.error('[API] Create pack error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
