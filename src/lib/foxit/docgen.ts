// --- DEMO MODE TOGGLE ---
const USE_MOCKS = true;
// ------------------------

import { mockGenerateDocumentBase64, mockAnalyzeTemplate } from './mocks';

export interface DocGenResult {
    outputBase64: string;
    outputFormat: string;
}

/**
 * Generate a document by sending a base64-encoded DOCX template + JSON data.
 * Returns base64-encoded PDF string.
 */
export async function generateDocumentBase64(
    templateBase64: string,
    documentValues: Record<string, string | number>,
    outputFormat: 'pdf' | 'docx' = 'pdf'
): Promise<string> {
    if (USE_MOCKS) {
        return mockGenerateDocumentBase64();
    }

    // Simplified real logic placeholder for build stability
    throw new Error('Real Foxit API is disabled in DEMO mode. Set USE_MOCKS=false to enable.');
}

/**
 * Analyze a document template for text tags
 */
export async function analyzeTemplate(templateBase64: string): Promise<Record<string, unknown>> {
    if (USE_MOCKS) {
        return mockAnalyzeTemplate();
    }
    throw new Error('Real Foxit API is disabled in DEMO mode.');
}
