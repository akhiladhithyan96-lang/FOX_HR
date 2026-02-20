const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenAppId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    console.log('--- Testing ONLY application-id header ---');
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'application-id': docgenAppId,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('SUCCESS!', res.status);
    } catch (e) {
        console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
    }
}

main();
