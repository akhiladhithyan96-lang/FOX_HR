import axios from 'axios';

/**
 * Robust authentication configuration for Foxit Cloud APIs.
 * It tries multiple environment variable naming conventions to ensure compatibility.
 */
export function getFoxitConfig(service: 'DOCGEN' | 'PDFSERVICES') {
    const isDocGen = service === 'DOCGEN';

    // Potential Env Keys for Client ID
    const idKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_ID', 'FOXIT_DOC_GEN_CLIENT_ID', 'FOXIT_DOCGEN_ID', 'FOXIT_CLIENT_ID']
        : ['FOXIT_PDFSERVICES_CLIENT_ID', 'FOXIT_PDF_SERVICES_CLIENT_ID', 'FOXIT_PDFSERVICES_ID', 'FOXIT_CLIENT_ID'];

    // Potential Env Keys for Client Secret
    const secretKeys = isDocGen
        ? ['FOXIT_DOCGEN_CLIENT_SECRET', 'FOXIT_DOC_GEN_CLIENT_SECRET', 'FOXIT_DOCGEN_SECRET', 'FOXIT_CLIENT_SECRET']
        : ['FOXIT_PDFSERVICES_CLIENT_SECRET', 'FOXIT_PDF_SERVICES_CLIENT_SECRET', 'FOXIT_PDFSERVICES_SECRET', 'FOXIT_CLIENT_SECRET'];

    // Potential Env Keys for Application ID (UUID)
    const appIdKeys = isDocGen
        ? ['FOXIT_DOCGEN_APPLICATION_ID', 'FOXIT_DOCGEN_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID']
        : ['FOXIT_PDFSERVICES_APPLICATION_ID', 'FOXIT_PDFSERVICES_APP_ID', 'FOXIT_APPLICATION_ID', 'FOXIT_APP_ID'];

    // Find the first available key
    const clientId = idKeys.map(k => process.env[k]).find(v => !!v) || '';
    const clientSecret = secretKeys.map(k => process.env[k]).find(v => !!v) || '';
    const applicationId = appIdKeys.map(k => process.env[k]).find(v => !!v) || '';

    const baseUrl = isDocGen
        ? (process.env.FOXIT_DOCGEN_BASE_URL || process.env.FOXIT_BASE_URL || 'https://na1.fusion.foxit.com/document-generation')
        : (process.env.FOXIT_PDFSERVICES_BASE_URL || process.env.FOXIT_BASE_URL || 'https://na1.fusion.foxit.com/pdf-services');

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
