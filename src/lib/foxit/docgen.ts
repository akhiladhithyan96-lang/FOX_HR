import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { getFoxitConfig, getFoxitHeaders } from './config';
import { mockGenerateDocumentBase64, mockAnalyzeTemplate } from './mocks';

// --- PRODUCTION CONFIG ---
const USE_MOCKS = process.env.FOXIT_USE_MOCKS === 'true'; // Set to true in env for demo
// ------------------------

function logToFile(msg: string) {
    const logPath = path.join(process.cwd(), 'docgen-debug.log');
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error('Failed to log to file:', e);
    }
}

const {
    clientId: DEFAULT_CLIENT_ID,
    clientSecret: DEFAULT_CLIENT_SECRET,
    applicationId: DEFAULT_APP_ID,
    baseUrl: DOCGEN_BASE_URL
} = getFoxitConfig('DOCGEN');

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

    logToFile(`DocGen API call initiated to ${DOCGEN_BASE_URL}`);

    if (!DEFAULT_CLIENT_ID || !DEFAULT_CLIENT_SECRET) {
        logToFile('ERROR: Missing credentials');
        throw new Error('Foxit DocGen credentials (CLIENT_ID or CLIENT_SECRET) are missing. Check your .env.local or production secrets.');
    }

    const body = {
        outputFormat: outputFormat.toLowerCase() === 'pdf' ? 'pdf' : 'docx',
        currencyCulture: 'en-US',
        documentValues,
        base64FileString: templateBase64,
    };

    try {
        logToFile(`Trying DocGen credentials...`);
        return await makeDocGenRequest(DEFAULT_CLIENT_ID, DEFAULT_CLIENT_SECRET, DEFAULT_APP_ID, body);
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            logToFile(`DocGen credentials failed (401). Trying fallback to PDF Services credentials...`);

            const fallback = getFoxitConfig('PDFSERVICES');

            if (fallback.clientId && fallback.clientId !== DEFAULT_CLIENT_ID) {
                try {
                    const result = await makeDocGenRequest(fallback.clientId, fallback.clientSecret, fallback.applicationId, body);
                    logToFile(`Success with fallback credentials!`);
                    return result;
                } catch (fallbackError: any) {
                    logToFile(`Fallback failed as well.`);
                }
            }
        }

        // If we reach here, both failed or only DocGen failed without valid fallback
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            logToFile(`API Error ${status}: ${JSON.stringify(errorData)}`);

            if (status === 401) {
                throw new Error(`Foxit Authentication Failed (401). Using ID: ${DEFAULT_CLIENT_ID.substring(0, 8)}... and AppID: ${DEFAULT_APP_ID}. Please verify credentials in environment variables.`);
            }
        }
        throw error;
    }
}

/**
 * Helper to make the actual API call with specific credentials
 */
async function makeDocGenRequest(clientId: string, clientSecret: string, appId: string, body: any): Promise<string> {
    logToFile(`Requesting with ClientID: ${clientId.substring(0, 8)}`);

    const response = await axios.post(
        `${DOCGEN_BASE_URL}/api/GenerateDocumentBase64`,
        body,
        {
            headers: getFoxitHeaders(clientId, clientSecret, appId)
        }
    );

    const data = response.data;
    const resultBase64 =
        data?.base64FileString ||
        data?.outputBase64 ||
        data?.result ||
        data?.data ||
        (typeof data === 'string' ? data : null);

    if (!resultBase64) {
        throw new Error('Document Generation API returned unexpected format');
    }

    return resultBase64;
}

/**
 * Analyze a document template for text tags
 */
export async function analyzeTemplate(templateBase64: string): Promise<Record<string, unknown>> {
    if (USE_MOCKS) {
        return mockAnalyzeTemplate();
    }

    const body = {
        base64FileString: templateBase64,
    };

    const headers = getFoxitHeaders(DEFAULT_CLIENT_ID, DEFAULT_CLIENT_SECRET, DEFAULT_APP_ID);

    const response = await axios.post(
        `${DOCGEN_BASE_URL}/api/AnalyzeDocument`,
        body,
        { headers }
    );

    return response.data;
}
