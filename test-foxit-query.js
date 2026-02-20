const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const id = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const secret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');

    console.log('--- Testing Credentials in Query String ---');
    const url = `https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64?client_id=${id}&client_secret=${secret}`;
    console.log(`Testing: ${url}`);
    try {
        const res = await axios.post(url,
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('SUCCESS!', res.status);
    } catch (e) {
        console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
    }
}

main();
