import { NextRequest, NextResponse } from 'next/server';
import * as pdfSvc from '../../../lib/foxit/pdfservices';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
        }

        const formData = await req.formData();
        const operation = formData.get('operation') as string;
        const file = formData.get('file') as File | null;
        const file2 = formData.get('file2') as File | null;

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const buf1 = Buffer.from(await file.arrayBuffer());

        // Handle specialized upload content types if needed
        let upContentType = 'application/pdf';
        if (operation === 'word-to-pdf') upContentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (operation === 'excel-to-pdf') upContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const docId1 = await pdfSvc.uploadDocument(buf1, file.name || 'input.pdf', upContentType);

        let resultDocId: string;

        switch (operation) {
            case 'compress':
                resultDocId = await pdfSvc.compressPDF(docId1);
                break;
            case 'merge':
                if (!file2) throw new Error('Second file required');
                const docId2 = await pdfSvc.uploadDocument(Buffer.from(await file2.arrayBuffer()), file2.name || 'input2.pdf');
                resultDocId = await pdfSvc.mergePDFs([docId1, docId2]);
                break;
            case 'split':
                resultDocId = await pdfSvc.splitPDF(docId1, parseInt(formData.get('splitAt') as string) || 1);
                break;
            case 'protect':
                resultDocId = await pdfSvc.passwordProtectPDF(docId1, formData.get('password') as string || 'password123');
                break;
            case 'watermark':
                resultDocId = await pdfSvc.watermarkPDF(docId1, formData.get('text') as string || 'CONFIDENTIAL');
                break;
            case 'pagenumber':
                resultDocId = await pdfSvc.addPageNumbers(docId1);
                break;
            case 'flatten':
                resultDocId = await pdfSvc.flattenPDF(docId1);
                break;
            case 'linearize':
                resultDocId = await pdfSvc.linearizePDF(docId1);
                break;
            case 'pdfa':
                resultDocId = await pdfSvc.convertToPDFA(docId1);
                break;
            case 'compare':
                if (!file2) throw new Error('Second file required');
                const docId2c = await pdfSvc.uploadDocument(Buffer.from(await file2.arrayBuffer()), file2.name || 'input2.pdf');
                resultDocId = await pdfSvc.comparePDFs(docId1, docId2c);
                break;

            // Conversions
            case 'pdf-to-word': resultDocId = await pdfSvc.pdfToWord(docId1); break;
            case 'pdf-to-excel': resultDocId = await pdfSvc.pdfToExcel(docId1); break;
            case 'pdf-to-ppt': resultDocId = await pdfSvc.pdfToPPT(docId1); break;
            case 'pdf-to-image': resultDocId = await pdfSvc.pdfToImage(docId1); break;
            case 'pdf-to-html': resultDocId = await pdfSvc.pdfToHtml(docId1); break;
            case 'word-to-pdf': resultDocId = await pdfSvc.wordToPDF(docId1); break;
            case 'excel-to-pdf': resultDocId = await pdfSvc.excelToPDF(docId1); break;

            default:
                return NextResponse.json({ error: `Unknown operation: ${operation}` }, { status: 400 });
        }

        const resultBuf = await pdfSvc.downloadDocument(resultDocId);
        return NextResponse.json({
            success: true,
            base64: resultBuf.toString('base64'),
            size: resultBuf.length,
            operation
        });

    } catch (error: any) {
        let msg = error instanceof Error ? error.message : 'PDF Services operation failed';

        if (axios.isAxiosError(error)) {
            console.error('[PDF Services API] Axios Error:', error.response?.status, error.response?.data);
            if (error.response?.data) {
                msg = `Foxit Error: ${JSON.stringify(error.response.data)}`;
            }
        }

        console.error('[PDF Services API] Full Error:', error);
        return NextResponse.json({
            error: msg,
            details: axios.isAxiosError(error) ? error.response?.data : undefined
        }, { status: 500 });
    }
}
