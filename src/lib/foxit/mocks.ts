/**
 * Mock implementation for Foxit APIs to ensure the demo works seamlessly
 * even if the actual API credentials have issues.
 */

const MOCK_DELAY = 1500;

// Minimal valid PDF base64
const MOCK_PDF_BASE64 = 'JVBERi0xLjcKWrX9v84KMSAwIG9iaiA8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmogMiAwIG9iaiA8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmogMyAwIG9iaiA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4lZW5kb2JqIDQgMCBvYmogPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4lZW5kb2JqIDUgMCBvYmogPDwvTGVuZ3RoIDY4Pj5zdHJlYW0KQlQKIC9GMSAyNCBUZgogNzAgNzIwIFRkCiAoRm94IEhSIC0gRG9jdW1lbnQgR2VuZXJhdGVkIFN1Y2Nlc3NmdWxseSkgVGoKRVQKZW5kc3RyZWFtDWVuZG9iawp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMzEgMDAwMDAgbiAKMDAwMDAwMDI4NCAwMDAwMCBuIAp0cmFpbGVyIDw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQwMwolJUVPRg==';

export async function mockGenerateDocumentBase64(): Promise<string> {
    console.log('[MOCK] Generating document...');
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return MOCK_PDF_BASE64;
}

export async function mockUploadDocument(): Promise<string> {
    const mockId = `mock_doc_${Math.random().toString(36).substring(7)}`;
    console.log('[MOCK] Uploading document:', mockId);
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockId;
}

export async function mockPollTaskUntilComplete(taskId: string): Promise<string> {
    console.log('[MOCK] Polling task:', taskId);
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return `mock_result_${taskId}`;
}

export async function mockDownloadDocument(): Promise<Buffer> {
    console.log('[MOCK] Downloading document...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Buffer.from(MOCK_PDF_BASE64, 'base64');
}

export async function mockMergePDFs(documentIds: string[]): Promise<string> {
    console.log('[MOCK] Merging documents:', documentIds);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'mock_merged_id';
}

export async function mockCompressPDF(documentId: string): Promise<string> {
    console.log('[MOCK] Compressing document:', documentId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `mock_compressed_${documentId}`;
}

export async function mockPasswordProtectPDF(documentId: string): Promise<string> {
    console.log('[MOCK] Protecting document:', documentId);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return `mock_protected_${documentId}`;
}

export async function mockWatermarkPDF(documentId: string): Promise<string> {
    console.log('[MOCK] Watermarking document:', documentId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `mock_watermarked_${documentId}`;
}

export async function mockAddPageNumbers(documentId: string): Promise<string> {
    console.log('[MOCK] Adding page numbers:', documentId);
    await new Promise(resolve => setTimeout(resolve, 800));
    return `mock_paginated_${documentId}`;
}

export async function mockAnalyzeTemplate(): Promise<Record<string, unknown>> {
    console.log('[MOCK] Analyzing template...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        tags: ['fullName', 'jobTitle', 'salary', 'startDate'],
        status: 'success'
    };
}
