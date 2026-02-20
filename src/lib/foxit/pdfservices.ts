import axios from 'axios';
import FormData from 'form-data';
import { getFoxitConfig } from './config';

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLS = 40; // max 2 minutes

/**
 * Create standard Foxit PDF Services headers.
 * Per official Foxit docs: only client_id and client_secret are needed.
 */
function getFoxitServiceHeaders(clientId: string, clientSecret: string) {
    return {
        'client_id': clientId,
        'client_secret': clientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

/**
 * Upload a PDF buffer to Foxit PDF Services and get a documentId.
 * Uses multipart/form-data as required by the upload endpoint.
 */
export async function uploadDocument(pdfBuffer: Buffer, filename = 'document.pdf'): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');

    if (!config.clientId || !config.clientSecret) {
        throw new Error(`[Foxit PDF Services] Missing credentials. Check Amplify Environment Variables.`);
    }

    const formData = new FormData();
    formData.append('file', pdfBuffer, {
        filename,
        contentType: 'application/pdf',
    });

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

    const documentId = response.data?.documentId || response.data?.id || response.data?.data?.documentId;
    if (!documentId) {
        throw new Error(`Upload failed: ${JSON.stringify(response.data)}`);
    }
    return documentId;
}

/**
 * Poll a task until COMPLETED, return resultDocumentId.
 */
export async function pollTaskUntilComplete(taskId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));

        const response = await axios.get(
            `${config.baseUrl}/api/tasks/${taskId}`,
            { headers }
        );

        const data = response.data;
        if (data?.status === 'COMPLETED') {
            const resultId = data?.resultDocumentId || data?.documentId;
            if (!resultId) throw new Error('Task completed but no resultDocumentId found');
            return resultId;
        }
        if (data?.status === 'FAILED' || data?.status === 'ERROR') {
            throw new Error(`Task failed: ${JSON.stringify(data)}`);
        }
    }
    throw new Error('Task polling timeout after 2 minutes');
}

/**
 * Download a document by ID and return as Buffer.
 */
export async function downloadDocument(documentId: string): Promise<Buffer> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.get(
        `${config.baseUrl}/api/documents/${documentId}/download`,
        { headers: { ...headers, 'Accept': 'application/octet-stream' }, responseType: 'arraybuffer' }
    );

    return Buffer.from(response.data);
}

/**
 * Merge multiple documents into one PDF.
 */
export async function mergePDFs(documentIds: string[]): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/merge`,
        { documentIds },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Merge failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Compress a PDF.
 */
export async function compressPDF(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/compress`,
        { documentId, compressionLevel: 'medium' },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Compress failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Password protect a PDF.
 */
export async function passwordProtectPDF(documentId: string, password: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/security`,
        { documentId, userPassword: password, ownerPassword: password },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Security failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add watermark to a PDF.
 */
export async function watermarkPDF(documentId: string, text: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/watermark`,
        { documentId, text, opacity: 0.3, position: 'center' },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Watermark failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add page numbers to a PDF.
 */
export async function addPageNumbers(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/pagenumber`,
        { documentId },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Page numbers failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Convert PDF to PDF/A format for archival.
 */
export async function convertToPDFA(documentId: string): Promise<string> {
    const config = getFoxitConfig('PDFSERVICES');
    const headers = getFoxitServiceHeaders(config.clientId, config.clientSecret);

    const response = await axios.post(
        `${config.baseUrl}/api/pdfa`,
        { documentId, conformance: 'pdfa-1b' },
        { headers }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`PDF/A conversion failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}
