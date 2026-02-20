import axios from 'axios';
import { getFoxitConfig, getFoxitHeaders } from './config';

export interface DocGenResult {
    outputBase64: string;
    outputFormat: string;
}

/**
 * Generate a document with heavy-duty error recovery and multi-strategy auth.
 */
export async function generateDocumentBase64(
    templateBase64: string,
    documentValues: Record<string, string | number>,
    outputFormat: 'pdf' | 'docx' = 'pdf'
): Promise<string> {
    const config = getFoxitConfig('DOCGEN');

    if (!config.clientId || !config.clientSecret) {
        throw new Error(`[Foxit DocGen] Missing credentials. Please check Amplify env variables.`);
    }

    const body = {
        outputFormat: outputFormat.toLowerCase() === 'pdf' ? 'pdf' : 'docx',
        currencyCulture: 'en-US',
        documentValues,
        base64FileString: templateBase64,
    };

    // Strategy 1: Standard Headers (The most common Fusion API method)
    try {
        console.log('[DocGen] Attempting Strategy 1: Standard Headers (No AppID)');
        return await makeRequest(config.baseUrl, getFoxitHeaders(config.clientId, config.clientSecret, ''), body);
    } catch (error: any) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
        console.warn('[DocGen] Strategy 1 failed (401). Trying Strategy 2...');
    }

    // Strategy 2: Standard Headers WITH Application ID
    if (config.applicationId) {
        try {
            console.log('[DocGen] Attempting Strategy 2: Standard Headers + AppID');
            return await makeRequest(config.baseUrl, getFoxitHeaders(config.clientId, config.clientSecret, config.applicationId), body);
        } catch (error: any) {
            if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
            console.warn('[DocGen] Strategy 2 failed (401). Trying Strategy 3...');
        }
    }

    // Strategy 3: Basic Authentication
    try {
        console.log('[DocGen] Attempting Strategy 3: Basic Auth');
        return await makeRequest(config.baseUrl, getFoxitHeaders(config.clientId, config.clientSecret, '', 'BASIC'), body);
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error('[DocGen] All authentication strategies failed (401).');
            throw new Error(`Foxit Authentication Failed (401). Please verify your Client ID (${config.clientId.substring(0, 8)}...) and Secret in the Foxit Cloud Portal. Also ensure the Document Generation service is ENABLED for your account.`);
        }
        throw error;
    }
}

async function makeRequest(baseUrl: string, headers: any, body: any): Promise<string> {
    const response = await axios.post(
        `${baseUrl}/api/GenerateDocumentBase64`,
        body,
        { headers, timeout: 30000 }
    );

    const data = response.data;
    const resultBase64 = data?.base64FileString || data?.outputBase64 || data?.result || data?.data;

    if (!resultBase64 && typeof data === 'string' && data.length > 100) return data;
    if (!resultBase64) throw new Error('API returned successfully but no document data was found in the response.');

    return resultBase64;
}

export async function analyzeTemplate(templateBase64: string): Promise<Record<string, unknown>> {
    const config = getFoxitConfig('DOCGEN');
    const headers = getFoxitHeaders(config.clientId, config.clientSecret, config.applicationId);
    const response = await axios.post(`${config.baseUrl}/api/AnalyzeDocument`, { base64FileString: templateBase64 }, { headers });
    return response.data;
}
