import axios from 'axios';
import { getFoxitConfig, getFoxitHeaders } from './config';

export interface DocGenResult {
    outputBase64: string;
    outputFormat: string;
}

/**
 * Generate a document by sending a base64-encoded DOCX template + JSON data.
 * Returns base64-encoded PDF string (standard for Foxit DocGen Responses).
 */
export async function generateDocumentBase64(
    templateBase64: string,
    documentValues: Record<string, string | number>,
    outputFormat: 'pdf' | 'docx' = 'pdf'
): Promise<string> {
    const config = getFoxitConfig('DOCGEN');

    if (!config.clientId || !config.clientSecret) {
        console.error('[DocGen] Missing credentials:', { hasId: !!config.clientId, hasSecret: !!config.clientSecret });
        throw new Error('Foxit DocGen credentials (CLIENT_ID or CLIENT_SECRET) are missing. Check your environment variables.');
    }

    const body = {
        outputFormat: outputFormat.toLowerCase() === 'pdf' ? 'pdf' : 'docx',
        currencyCulture: 'en-US',
        documentValues,
        base64FileString: templateBase64,
    };

    try {
        return await makeDocGenRequest(config.clientId, config.clientSecret, config.applicationId, config.baseUrl, body);
    } catch (error: any) {
        // Fallback mechanism: If DocGen credentials fail, try PDF Services credentials (if they differ)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            const fallback = getFoxitConfig('PDFSERVICES');
            if (fallback.clientId && fallback.clientId !== config.clientId) {
                try {
                    return await makeDocGenRequest(fallback.clientId, fallback.clientSecret, fallback.applicationId, config.baseUrl, body);
                } catch (fallbackError: any) {
                    console.error('[DocGen] Fallback credentials failed as well.');
                }
            }
        }

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            console.error(`[DocGen] API Error ${status}:`, JSON.stringify(errorData));
            if (status === 401) {
                throw new Error('Foxit Authentication Failed. Please verify credentials in environment variables.');
            }
        }
        throw error;
    }
}

/**
 * Helper to make the actual API call with specific credentials
 */
async function makeDocGenRequest(clientId: string, clientSecret: string, appId: string, baseUrl: string, body: any): Promise<string> {
    const response = await axios.post(
        `${baseUrl}/api/GenerateDocumentBase64`,
        body,
        {
            headers: getFoxitHeaders(clientId, clientSecret, appId)
        }
    );

    const data = response.data;
    // Map various potential result keys from Foxit API
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
    const config = getFoxitConfig('DOCGEN');

    const body = {
        base64FileString: templateBase64,
    };

    const headers = getFoxitHeaders(config.clientId, config.clientSecret, config.applicationId);

    const response = await axios.post(
        `${config.baseUrl}/api/AnalyzeDocument`,
        body,
        { headers }
    );

    return response.data;
}
