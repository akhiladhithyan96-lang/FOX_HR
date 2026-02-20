/**
 * Foxit API Configuration
 * 
 * Retrieves Foxit API credentials from environment variables.
 * Variables are explicitly re-exported in next.config.ts to ensure
 * they are available in Lambda runtime on AWS Amplify.
 */
export function getFoxitConfig(service: 'DOCGEN' | 'PDFSERVICES') {
    const isDocGen = service === 'DOCGEN';

    const clientId = isDocGen
        ? process.env.FOXIT_DOCGEN_CLIENT_ID
        : process.env.FOXIT_PDFSERVICES_CLIENT_ID;

    const clientSecret = isDocGen
        ? process.env.FOXIT_DOCGEN_CLIENT_SECRET
        : process.env.FOXIT_PDFSERVICES_CLIENT_SECRET;

    const applicationId = isDocGen
        ? process.env.FOXIT_DOCGEN_APPLICATION_ID
        : process.env.FOXIT_PDFSERVICES_APPLICATION_ID;

    // Base URL: the HOST variable (no trailing path)
    // DocGen appends: /document-generation/api/...
    // PDF Services appends: /pdf-services/api/...
    const HOST = 'https://na1.fusion.foxit.com';

    const baseUrl = isDocGen
        ? `${HOST}/document-generation`
        : `${HOST}/pdf-services`;

    return {
        clientId: clientId || '',
        clientSecret: clientSecret || '',
        applicationId: applicationId || '',
        baseUrl,
    };
}
