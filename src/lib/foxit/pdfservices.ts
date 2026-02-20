import axios from 'axios';
import FormData from 'form-data';
import { getFoxitConfig } from './config';

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLS = 60; // max 3 minutes

/**
 * Create standard Foxit PDF Services headers.
 */
function getHeaders(clientId: string, clientSecret: string) {
    return {
        'client_id': clientId,
        'client_secret': clientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

/**
 * Poll a task until COMPLETED, return resultDocumentId.
 */
export async function pollTaskUntilComplete(taskId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = { 'client_id': config.clientId, 'client_secret': config.clientSecret };

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));

        const response = await axios.get(
            `${config.baseUrl}/api/tasks/${taskId}`,
            { headers }
        );

        const data = response.data;
        if (data?.status === 'COMPLETED') {
            const resultId = data?.resultDocumentId || data?.documentId || data?.id;
            if (!resultId) throw new Error('Task completed but no resultDocumentId found');
            return resultId;
        }
        if (data?.status === 'FAILED' || data?.status === 'ERROR') {
            throw new Error(`Task failed: ${JSON.stringify(data)}`);
        }
    }
    throw new Error('Task polling timeout');
}

/**
 * Upload a bundle/file to Foxit PDF Services.
 */
export async function uploadDocument(pdfBuffer: Buffer, filename = 'document.pdf', contentType = 'application/pdf'): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const formData = new FormData();
    formData.append('file', pdfBuffer, { filename, contentType });

    const response = await axios.post(
        `${config.baseUrl}/api/documents/upload`,
        formData,
        {
            headers: {
                'client_id': config.clientId,
                'client_secret': config.clientSecret,
                ...formData.getHeaders(),
            },
        }
    );

    const documentId = response.data?.documentId || response.data?.id;
    if (!documentId) throw new Error(`Upload failed: ${JSON.stringify(response.data)}`);
    return documentId;
}

/**
 * Download a document by ID.
 */
export async function downloadDocument(documentId: string): Promise<Buffer> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.get(
        `${config.baseUrl}/api/documents/${documentId}/download`,
        {
            headers: {
                'client_id': config.clientId,
                'client_secret': config.clientSecret,
                'Accept': 'application/octet-stream'
            },
            responseType: 'arraybuffer'
        }
    );
    return Buffer.from(response.data);
}

// ── PDF Operations ───────────────────────────────────────────────────

export async function mergePDFs(documentIds: string[]): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/merge`, { documentIds }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function compressPDF(documentId: string, level: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/compress`, { documentId, compressionLevel: level }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function passwordProtectPDF(documentId: string, password: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/security`, { documentId, userPassword: password, ownerPassword: password }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function watermarkPDF(documentId: string, text: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/watermark`, { documentId, text, opacity: 0.3, position: 'center' }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function addPageNumbers(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pagenumber`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function splitPDF(documentId: string, splitAt: number): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/split`, { documentId, splitAt }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function convertToPDFA(documentId: string, conformance = 'pdfa-1b'): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdfa`, { documentId, conformance }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function flattenPDF(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/flatten`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function linearizePDF(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/linearize`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function comparePDFs(docId1: string, docId2: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/compare`, { documentId1: docId1, documentId2: docId2 }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

// ── Conversions ──────────────────────────────────────────────────────

export async function pdfToWord(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdf-to-word`, { documentId, outputFormat: 'docx' }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function pdfToExcel(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdf-to-excel`, { documentId, outputFormat: 'xlsx' }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function pdfToPPT(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdf-to-ppt`, { documentId, outputFormat: 'pptx' }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function pdfToImage(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdf-to-image`, { documentId, outputFormat: 'png' }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function pdfToHtml(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/pdf-to-html`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function wordToPDF(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/word-to-pdf`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}

export async function excelToPDF(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const response = await axios.post(`${config.baseUrl}/api/excel-to-pdf`, { documentId }, { headers: getHeaders(config.clientId, config.clientSecret) });
    return pollTaskUntilComplete(response.data?.taskId || response.data?.id);
}
