const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');

    console.log('--- Testing with client_id/client_secret AND Authorization: Basic Og== ---');
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocument',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'client_id': docgenId,
                    'client_secret': docgenSecret,
                    'Authorization': 'Basic Og==',
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
