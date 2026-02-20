const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const id = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const secret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const appId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    console.log('--- Testing x-application-id variation ---');
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'client_id': id,
                    'client_secret': secret,
                    'x-application-id': appId, // Testing x- prefix
                    'Content-Type': 'application/json'
                }, timeout: 5000
            }
        );
        console.log('SUCCESS!', res.status);
    } catch (e) {
        console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data || {})}`);
    }
}

main();
