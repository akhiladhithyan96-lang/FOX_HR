/**
 * Robust authentication configuration for Foxit Cloud APIs.
 */
export function getFoxitConfig(service: 'DOCGEN' | 'PDFSERVICES') {
    const isDocGen = service === 'DOCGEN';

    // List of keys to check (supporting multiple naming conventions)
    const idKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_ID', 'FOXIT_DOC_GEN_CLIENT_ID', 'FOXIT_DOCGEN_ID', 'FOXIT_CLIENT_ID']
        : ['FOXIT_PDFSERVICES_CLIENT_ID', 'FOXIT_PDF_SERVICES_CLIENT_ID', 'FOXIT_PDFSERVICES_ID', 'FOXIT_CLIENT_ID'];

    const secretKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_SECRET', 'FOXIT_DOC_GEN_CLIENT_SECRET', 'FOXIT_DOCGEN_SECRET', 'FOXIT_CLIENT_SECRET']
        : ['FOXIT_PDFSERVICES_CLIENT_SECRET', 'FOXIT_PDF_SERVICES_CLIENT_SECRET', 'FOXIT_PDFSERVICES_SECRET', 'FOXIT_CLIENT_SECRET'];

    const appIdKeys = isDocGen
        ? ['FOXIT_DOCGEN_APPLICATION_ID', 'FOXIT_DOCGEN_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID']
        : ['FOXIT_PDFSERVICES_APPLICATION_ID', 'FOXIT_PDFSERVICES_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID'];

    const getEnv = (key: string): string => {
        return process.env[key] || '';
    };

    const clientId = idKeys.map(getEnv).find(v => v.length > 0) || '';
    const clientSecret = secretKeys.map(getEnv).find(v => v.length > 0) || '';
    const applicationId = appIdKeys.map(getEnv).find(v => v.length > 0) || '';

    // Default base URLs - allowing for environment overrides
    const baseUrl = isDocGen
        ? (getEnv('FOXIT_DOCGEN_BASE_URL') || getEnv('FOXIT_BASE_URL') || 'https://na1.fusion.foxit.com/document-generation')
        : (getEnv('FOXIT_PDFSERVICES_BASE_URL') || getEnv('FOXIT_BASE_URL') || 'https://na1.fusion.foxit.com/pdf-services');

    return { clientId, clientSecret, applicationId, baseUrl };
}

/**
 * Returns the standardized headers for Foxit Fusion API calls.
 * Implements multiple auth strategies.
 */
export function getFoxitHeaders(clientId: string, clientSecret: string, applicationId: string, strategy: 'STANDALONE' | 'BASIC' = 'STANDALONE') {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (strategy === 'BASIC') {
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
    } else {
        headers['client_id'] = clientId;
        headers['client_secret'] = clientSecret;
    }

    // Many Foxit implementations do NOT want application-id for Fusion APIs
    // We only add it if specifically provided and we're not using Basic auth
    if (applicationId && strategy === 'STANDALONE') {
        headers['application-id'] = applicationId;
    }

    return headers;
}
