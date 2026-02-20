const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const pdfServicesId = getEnv('FOXIT_PDFSERVICES_CLIENT_ID');
    const pdfServicesSecret = getEnv('FOXIT_PDFSERVICES_CLIENT_SECRET');

    // Application IDs provided by user
    const docgenAppId = 'd7af9e65-3731-46aa-b946-d7d5035e0b54';
    const pdfAppId = 'abed8b3d-463d-494e-9f42-eee1e878eb13';

    console.log('--- Testing with application-id header ---');

    console.log('Testing DocGen...');
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocument',
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
        console.log('DocGen Success:', res.status);
    } catch (e) {
        console.log('DocGen Fail:', e.response?.status, JSON.stringify(e.response?.data));
    }

    console.log('\nTesting PDF Services...');
    try {
        const res = await axios.get('https://na1.fusion.foxit.com/pdf-services/api/tasks/123',
            {
                headers: {
                    'client_id': pdfServicesId,
                    'client_secret': pdfServicesSecret,
                    'application-id': pdfAppId
                }
            }
        );
        console.log('PDF Services Success (likely 404):', res.status);
    } catch (e) {
        if (e.response?.status === 404) {
            console.log('PDF Services Auth passed (Task not found)');
        } else {
            console.log('PDF Services Fail:', e.response?.status, JSON.stringify(e.response?.data));
        }
    }
}

main();
