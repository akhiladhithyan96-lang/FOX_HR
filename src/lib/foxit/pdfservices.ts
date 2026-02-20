import axios from 'axios';
import FormData from 'form-data';

const PDFSERVICES_BASE_URL = process.env.FOXIT_PDFSERVICES_BASE_URL || 'https://na1.fusion.foxit.com/pdf-services';
const CLIENT_ID = process.env.FOXIT_PDFSERVICES_CLIENT_ID || '';
const CLIENT_SECRET = process.env.FOXIT_PDFSERVICES_CLIENT_SECRET || '';

const pdfServiceHeaders = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
};

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLS = 60; // max 2 minutes

/**
 * Upload a PDF buffer to Foxit PDF Services and get a documentId
 */
export async function uploadDocument(pdfBuffer: Buffer, filename = 'document.pdf'): Promise<string> {
    console.log('[PDFServices] Uploading document:', filename, 'size:', pdfBuffer.length);

    const formData = new FormData();
    formData.append('file', pdfBuffer, {
        filename,
        contentType: 'application/pdf',
    });

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/documents/upload`,
        formData,
        {
            headers: {
                ...pdfServiceHeaders,
                ...formData.getHeaders(),
            },
        }
    );

    console.log('[PDFServices] Upload response:', JSON.stringify(response.data));
    const documentId = response.data?.documentId || response.data?.id || response.data?.data?.documentId;
    if (!documentId) {
        throw new Error(`Upload failed: ${JSON.stringify(response.data)}`);
    }
    return documentId;
}

/**
 * Poll a task until COMPLETED, return resultDocumentId
 */
export async function pollTaskUntilComplete(taskId: string): Promise<string> {
    console.log('[PDFServices] Polling task:', taskId);

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));

        const response = await axios.get(
            `${PDFSERVICES_BASE_URL}/api/tasks/${taskId}`,
            { headers: pdfServiceHeaders }
        );

        const data = response.data;
        console.log(`[PDFServices] Poll ${i + 1}: status=${data?.status}, progress=${data?.progress}`);

        if (data?.status === 'COMPLETED') {
            const resultId = data?.resultDocumentId || data?.documentId;
            if (!resultId) {
                throw new Error('Task completed but no resultDocumentId');
            }
            return resultId;
        }

        if (data?.status === 'FAILED' || data?.status === 'ERROR') {
            throw new Error(`Task failed: ${JSON.stringify(data)}`);
        }
    }
    throw new Error('Task polling timeout after 2 minutes');
}

/**
 * Download a document by ID and return as Buffer
 */
export async function downloadDocument(documentId: string): Promise<Buffer> {
    console.log('[PDFServices] Downloading document:', documentId);

    const response = await axios.get(
        `${PDFSERVICES_BASE_URL}/api/documents/${documentId}/download`,
        {
            headers: pdfServiceHeaders,
            responseType: 'arraybuffer',
        }
    );

    console.log('[PDFServices] Downloaded bytes:', response.data.byteLength);
    return Buffer.from(response.data);
}

/**
 * Merge multiple documents into one PDF
 */
export async function mergePDFs(documentIds: string[]): Promise<string> {
    console.log('[PDFServices] Merging documents:', documentIds);

    // PDF Services merge: POST /api/merge or /api/combine
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/merge`,
        { documentIds },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] Merge response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Merge failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Compress a PDF
 */
export async function compressPDF(documentId: string): Promise<string> {
    console.log('[PDFServices] Compressing document:', documentId);

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/compress`,
        { documentId, compressionLevel: 'medium' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] Compress response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Compress failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Password protect a PDF
 */
export async function passwordProtectPDF(documentId: string, password: string): Promise<string> {
    console.log('[PDFServices] Password protecting document:', documentId);

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/security`,
        {
            documentId,
            userPassword: password,
            ownerPassword: password,
        },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] Security response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Security failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Convert PDF to PDF/A format for archival
 */
export async function convertToPDFA(documentId: string): Promise<string> {
    console.log('[PDFServices] Converting to PDF/A:', documentId);

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/pdfa`,
        { documentId, conformance: 'pdfa-1b' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] PDF/A response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`PDF/A conversion failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add watermark to a PDF
 */
export async function watermarkPDF(documentId: string, text: string): Promise<string> {
    console.log('[PDFServices] Adding watermark to:', documentId);

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/watermark`,
        { documentId, text, opacity: 0.3, position: 'center' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] Watermark response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Watermark failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add page numbers to a PDF
 */
export async function addPageNumbers(documentId: string): Promise<string> {
    console.log('[PDFServices] Adding page numbers to:', documentId);

    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/pagenumber`,
        { documentId },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    console.log('[PDFServices] Page numbers response:', JSON.stringify(response.data));
    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Page numbers failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}
