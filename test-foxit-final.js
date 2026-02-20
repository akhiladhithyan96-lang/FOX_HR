const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const docgenAppId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    const pdfId = getEnv('FOXIT_PDFSERVICES_CLIENT_ID');
    const pdfSecret = getEnv('FOXIT_PDFSERVICES_CLIENT_SECRET');
    const pdfAppId = getEnv('FOXIT_PDFSERVICES_APPLICATION_ID');

    console.log('--- Testing Final Implementation Headers ---');

    console.log(`DocGen ID: ${docgenId.substring(0, 8)}..., AppID: ${docgenAppId}`);
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'client_id': docgenId,
                    'client_secret': docgenSecret,
                    'application-id': docgenAppId,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('DocGen Success!', res.status);
    } catch (e) {
        console.log(`DocGen Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
    }

    console.log(`\nPDF Services ID: ${pdfId.substring(0, 8)}..., AppID: ${pdfAppId}`);
    try {
        // Just a GET to check auth
        const res = await axios.get('https://na1.fusion.foxit.com/pdf-services/api/tasks/123456',
            {
                headers: {
                    'client_id': pdfId,
                    'client_secret': pdfSecret,
                    'application-id': pdfAppId
                }
            }
        );
        console.log('PDF Services Success!', res.status);
    } catch (e) {
        if (e.response?.status === 404) {
            console.log('PDF Services Auth PASSED (Task not found)');
        } else {
            console.log(`PDF Services Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        }
    }
}

main();
