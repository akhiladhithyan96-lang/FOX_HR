import { NextResponse } from 'next/server';

export async function GET() {
    const keysToCheck = [
        'FOXIT_DOCGEN_CLIENT_ID',
        'FOXIT_DOCGEN_CLIENT_SECRET',
        'FOXIT_DOCGEN_APPLICATION_ID',
        'FOXIT_PDFSERVICES_CLIENT_ID',
        'FOXIT_PDFSERVICES_CLIENT_SECRET',
        'FOXIT_PDFSERVICES_APPLICATION_ID',
        'NEXT_PUBLIC_COMPANY_NAME'
    ];

    const results: Record<string, string> = {};

    keysToCheck.forEach(key => {
        const val = process.env[key];
        if (!val) {
            results[key] = 'MISSING';
        } else {
            results[key] = `PRESENT (Length: ${val.length})`;
        }
    });

    return NextResponse.json({
        runtime: 'Node.js',
        env: results,
        timestamp: new Date().toISOString()
    });
}
