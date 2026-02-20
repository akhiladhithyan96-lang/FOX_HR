import axios from 'axios';
import { getFoxitConfig } from './config';

export interface DocGenResult {
    outputBase64: string;
    outputFormat: string;
}

/**
 * Generate a document using Foxit Document Generation API.
 * The API is synchronous: send template + data → get PDF back immediately.
 * 
 * Official API: POST /document-generation/api/GenerateDocumentBase64
 * Headers: client_id, client_secret
 * Body: { outputFormat, documentValues, base64FileString }
 * Response: { message, fileExtension, base64FileString }
 */
export async function generateDocumentBase64(
    templateBase64: string,
    documentValues: Record<string, string | number>,
    outputFormat: 'pdf' | 'docx' = 'pdf'
): Promise<string> {
    const config = getFoxitConfig('DOCGEN');

    if (!config.clientId || !config.clientSecret) {
        throw new Error(`[Foxit DocGen] Missing credentials. Check Amplify Environment Variables.`);
    }

    // The exact body structure required by Foxit DocGen API
    const body = {
        outputFormat: 'pdf',
        documentValues,
        base64FileString: templateBase64,
    };

    // The exact headers required by Foxit DocGen API (no application-id needed)
    const headers = {
        'client_id': config.clientId,
        'client_secret': config.clientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const url = `${config.baseUrl}/api/GenerateDocumentBase64`;

    console.log(`[DocGen] Calling ${url} with client_id: ${config.clientId.substring(0, 8)}...`);

    try {
        const response = await axios.post(url, body, { headers, timeout: 60000 });
        const data = response.data;

        console.log('[DocGen] Response keys:', Object.keys(data || {}));

        // Foxit API returns: { message: "success", fileExtension: "pdf", base64FileString: "..." }
        const resultBase64 =
            data?.base64FileString ||
            data?.outputBase64 ||
            data?.result ||
            data?.data ||
            data?.fileContent ||
            data?.content;

        if (!resultBase64) {
            console.error('[DocGen] Unexpected response structure:', JSON.stringify(data).substring(0, 500));
            throw new Error(`DocGen API succeeded but returned no document data. Response: ${JSON.stringify(data).substring(0, 200)}`);
        }

        console.log(`[DocGen] Success! Document size: ${resultBase64.length} base64 chars`);
        return resultBase64;

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            console.error(`[DocGen] HTTP ${status} Error:`, JSON.stringify(errorData));

            if (status === 400) {
                // Log the full error to understand what's wrong with the request
                const errMsg = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
                throw new Error(`DocGen API rejected the request (400). Details: ${errMsg}`);
            }
            if (status === 401) {
                throw new Error(`Foxit Authentication Failed (401). Client ID: ${config.clientId.substring(0, 8)}... - Please verify credentials in Foxit Cloud Portal.`);
            }
            if (status === 403) {
                throw new Error(`Foxit Permission Denied (403). Ensure Document Generation is enabled for Application ID: ${config.applicationId}`);
            }
            throw new Error(`DocGen API Error ${status}: ${JSON.stringify(errorData)}`);
        }
        throw error;
    }
}

export async function analyzeTemplate(templateBase64: string): Promise<Record<string, unknown>> {
    const config = getFoxitConfig('DOCGEN');
    const headers = {
        'client_id': config.clientId,
        'client_secret': config.clientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = await axios.post(
        `${config.baseUrl}/api/AnalyzeDocument`,
        { base64FileString: templateBase64 },
        { headers }
    );
    return response.data;
}
