import axios from 'axios';
import FormData from 'form-data';
import { getFoxitConfig, getFoxitHeaders } from './config';

const {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    applicationId: APPLICATION_ID,
    baseUrl: PDFSERVICES_BASE_URL
} = getFoxitConfig('PDFSERVICES');

const pdfServiceHeaders = getFoxitHeaders(CLIENT_ID, CLIENT_SECRET, APPLICATION_ID);

// Remove Content-Type from global headers for FormData compatibility
const globalPdfHeaders = { ...pdfServiceHeaders };
delete globalPdfHeaders['Content-Type'];

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLS = 60; // max 2 minutes

/**
 * Upload a PDF buffer to Foxit PDF Services and get a documentId
 */
export async function uploadDocument(pdfBuffer: Buffer, filename = 'document.pdf'): Promise<string> {
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
                ...globalPdfHeaders,
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
 * Poll a task until COMPLETED, return resultDocumentId
 */
export async function pollTaskUntilComplete(taskId: string): Promise<string> {
    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));

        const response = await axios.get(
            `${PDFSERVICES_BASE_URL}/api/tasks/${taskId}`,
            { headers: pdfServiceHeaders }
        );

        const data = response.data;
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
    const response = await axios.get(
        `${PDFSERVICES_BASE_URL}/api/documents/${documentId}/download`,
        {
            headers: pdfServiceHeaders,
            responseType: 'arraybuffer',
        }
    );

    return Buffer.from(response.data);
}

/**
 * Merge multiple documents into one PDF
 */
export async function mergePDFs(documentIds: string[]): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/merge`,
        { documentIds },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Merge failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Compress a PDF
 */
export async function compressPDF(documentId: string): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/compress`,
        { documentId, compressionLevel: 'medium' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Compress failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Password protect a PDF
 */
export async function passwordProtectPDF(documentId: string, password: string): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/security`,
        {
            documentId,
            userPassword: password,
            ownerPassword: password,
        },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Security failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add watermark to a PDF
 */
export async function watermarkPDF(documentId: string, text: string): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/watermark`,
        { documentId, text, opacity: 0.3, position: 'center' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Watermark failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Add page numbers to a PDF
 */
export async function addPageNumbers(documentId: string): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/pagenumber`,
        { documentId },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`Page numbers failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}

/**
 * Convert PDF to PDF/A format for archival
 */
export async function convertToPDFA(documentId: string): Promise<string> {
    const response = await axios.post(
        `${PDFSERVICES_BASE_URL}/api/pdfa`,
        { documentId, conformance: 'pdfa-1b' },
        { headers: { ...pdfServiceHeaders, 'Content-Type': 'application/json' } }
    );

    const taskId = response.data?.taskId || response.data?.id;
    if (!taskId) throw new Error(`PDF/A conversion failed: ${JSON.stringify(response.data)}`);
    return pollTaskUntilComplete(taskId);
}
