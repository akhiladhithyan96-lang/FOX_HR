import { NextRequest, NextResponse } from 'next/server';
import { Employee, DocumentType } from '../../../types';
import { generateSingleDocument } from '../../../lib/foxit/pipeline';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { employees } = body as { employees: Employee[] };

        if (!employees?.length) {
            return NextResponse.json({ error: 'No employees provided' }, { status: 400 });
        }

        console.log(`[API] Bulk generating for ${employees.length} employees`);
        const results = [];

        for (const employee of employees) {
            const docResults = [];
            for (const docType of employee.documentsToGenerate) {
                try {
                    const base64Data = await generateSingleDocument(employee, docType as DocumentType);
                    docResults.push({ documentType: docType, status: 'ready', base64Data });
                } catch (err) {
                    docResults.push({ documentType: docType, status: 'error', error: err instanceof Error ? err.message : 'Failed' });
                }
            }
            results.push({ employeeId: employee.id, employeeName: employee.fullName, documents: docResults });
        }

        return NextResponse.json({ success: true, results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bulk generation failed';
        console.error('[API] Bulk generate error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
