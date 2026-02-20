import axios from 'axios';

const DOCGEN_BASE_URL = process.env.FOXIT_DOCGEN_BASE_URL || 'https://na1.fusion.foxit.com/document-generation';
const CLIENT_ID = process.env.FOXIT_DOCGEN_CLIENT_ID || '';
const CLIENT_SECRET = process.env.FOXIT_DOCGEN_CLIENT_SECRET || '';

const docgenHeaders = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    'Content-Type': 'application/json',
};

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
    console.log('[DocGen] Calling GenerateDocumentBase64 API...');
    console.log('[DocGen] Endpoint:', `${DOCGEN_BASE_URL}/api/GenerateDocumentBase64`);
    console.log('[DocGen] DocumentValues:', JSON.stringify(documentValues, null, 2));

    const body = {
        outputFormat: outputFormat.toLowerCase() === 'pdf' ? 'pdf' : 'docx',
        currencyCulture: 'en-US',
        documentValues,
        base64FileString: templateBase64,
    };

    const response = await axios.post(
        `${DOCGEN_BASE_URL}/api/GenerateDocumentBase64`,
        body,
        { headers: docgenHeaders }
    );

    console.log('[DocGen] Response status:', response.status);
    console.log('[DocGen] Response data keys:', Object.keys(response.data || {}));

    // The API returns base64 encoded document
    const data = response.data;
    // Different possible response formats from Foxit DocGen
    const resultBase64 =
        data?.base64FileString ||
        data?.outputBase64 ||
        data?.result ||
        data?.data ||
        (typeof data === 'string' ? data : null);

    if (!resultBase64) {
        console.error('[DocGen] Unexpected response format:', JSON.stringify(data));
        throw new Error('Document Generation API returned unexpected format');
    }

    return resultBase64;
}

/**
 * Analyze a document template for text tags
 */
export async function analyzeTemplate(templateBase64: string): Promise<Record<string, unknown>> {
    console.log('[DocGen] Analyzing template for text tags...');

    const body = {
        base64FileString: templateBase64,
    };

    const response = await axios.post(
        `${DOCGEN_BASE_URL}/api/AnalyzeDocument`,
        body,
        { headers: docgenHeaders }
    );

    console.log('[DocGen] Analyze response:', response.data);
    return response.data;
}
