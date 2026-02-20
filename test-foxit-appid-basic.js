const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const secret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const appId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    console.log('--- Testing basic auth with APP ID ---');
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(appId + ':' + secret).toString('base64'),
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
