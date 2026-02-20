/**
 * Robust authentication configuration for Foxit Cloud APIs.
 * This version uses dynamic lookup to avoid Next.js static replacement issues.
 */
export function getFoxitConfig(service: 'DOCGEN' | 'PDFSERVICES') {
    const isDocGen = service === 'DOCGEN';

    // List of keys to check
    const idKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_ID', 'FOXIT_DOC_GEN_CLIENT_ID', 'FOXIT_DOCGEN_ID', 'FOXIT_CLIENT_ID']
        : ['FOXIT_PDFSERVICES_CLIENT_ID', 'FOXIT_PDF_SERVICES_CLIENT_ID', 'FOXIT_PDFSERVICES_ID', 'FOXIT_CLIENT_ID'];

    const secretKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_SECRET', 'FOXIT_DOC_GEN_CLIENT_SECRET', 'FOXIT_DOCGEN_SECRET', 'FOXIT_CLIENT_SECRET']
        : ['FOXIT_PDFSERVICES_CLIENT_SECRET', 'FOXIT_PDF_SERVICES_CLIENT_SECRET', 'FOXIT_PDFSERVICES_SECRET', 'FOXIT_CLIENT_SECRET'];

    const appIdKeys = isDocGen
        ? ['FOXIT_DOCGEN_APPLICATION_ID', 'FOXIT_DOCGEN_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID']
        : ['FOXIT_PDFSERVICES_APPLICATION_ID', 'FOXIT_PDFSERVICES_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID'];

    // Helper to get env value dynamically (avoids some build-time inlining issues)
    const getEnv = (key: string): string => {
        const val = process.env[key];
        return val || '';
    };

    const clientId = idKeys.map(getEnv).find(v => v.length > 0) || '';
    const clientSecret = secretKeys.map(getEnv).find(v => v.length > 0) || '';
    const applicationId = appIdKeys.map(getEnv).find(v => v.length > 0) || '';

    // Diagnostic log (server-side only)
    if (!clientId || !clientSecret) {
        console.warn(`[FoxitConfig] Missing credentials for ${service}. Tried keys:`,
            isDocGen ? 'FOXIT_DOCGEN_...' : 'FOXIT_PDFSERVICES_...');
    }

    const baseUrl = isDocGen
        ? (getEnv('FOXIT_DOCGEN_BASE_URL') || getEnv('FOXIT_BASE_URL') || 'https://na1.fusion.foxit.com/document-generation')
        : (getEnv('FOXIT_PDFSERVICES_BASE_URL') || getEnv('FOXIT_BASE_URL') || 'https://na1.fusion.foxit.com/pdf-services');

    return { clientId, clientSecret, applicationId, baseUrl };
}

/**
 * Returns the standardized headers for Foxit Fusion API calls.
 */
export function getFoxitHeaders(clientId: string, clientSecret: string, applicationId: string) {
    const headers: Record<string, string> = {
        'client_id': clientId,
        'client_secret': clientSecret,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (applicationId) {
        headers['application-id'] = applicationId;
    }

    return headers;
}
