// --- DEMO MODE TOGGLE ---
const USE_MOCKS = true;
// ------------------------

import {
    mockUploadDocument,
    mockPollTaskUntilComplete,
    mockDownloadDocument,
    mockMergePDFs,
    mockCompressPDF,
    mockPasswordProtectPDF,
    mockWatermarkPDF,
    mockAddPageNumbers
} from './mocks';

/**
 * Upload a PDF buffer to Foxit PDF Services and get a documentId
 */
export async function uploadDocument(pdfBuffer: Buffer, filename = 'document.pdf'): Promise<string> {
    if (USE_MOCKS) return mockUploadDocument();
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Poll a task until COMPLETED, return resultDocumentId
 */
export async function pollTaskUntilComplete(taskId: string): Promise<string> {
    if (USE_MOCKS) return mockPollTaskUntilComplete(taskId);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Download a document by ID and return as Buffer
 */
export async function downloadDocument(documentId: string): Promise<Buffer> {
    if (USE_MOCKS) return mockDownloadDocument();
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Merge multiple documents into one PDF
 */
export async function mergePDFs(documentIds: string[]): Promise<string> {
    if (USE_MOCKS) return mockMergePDFs(documentIds);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Compress a PDF
 */
export async function compressPDF(documentId: string): Promise<string> {
    if (USE_MOCKS) return mockCompressPDF(documentId);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Password protect a PDF
 */
export async function passwordProtectPDF(documentId: string, password: string): Promise<string> {
    if (USE_MOCKS) return mockPasswordProtectPDF(documentId);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Add watermark to a PDF
 */
export async function watermarkPDF(documentId: string, text: string): Promise<string> {
    if (USE_MOCKS) return mockWatermarkPDF(documentId);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Add page numbers to a PDF
 */
export async function addPageNumbers(documentId: string): Promise<string> {
    if (USE_MOCKS) return mockAddPageNumbers(documentId);
    throw new Error('Real PDF Services disabled in DEMO mode');
}

/**
 * Convert PDF to PDF/A format for archival
 */
export async function convertToPDFA(documentId: string): Promise<string> {
    if (USE_MOCKS) return documentId; // Just return same ID for mock
    throw new Error('Real PDF Services disabled in DEMO mode');
}
