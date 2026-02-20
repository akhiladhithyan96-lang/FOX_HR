const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');

    const noPrefixId = docgenId.includes('_') ? docgenId.split('_')[1] : docgenId;

    console.log(`--- Testing with noPrefixId: ${noPrefixId} ---`);
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocument',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'client_id': noPrefixId,
                    'client_secret': docgenSecret,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('SUCCESS!', res.status);
    } catch (e) {
        console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
    }

    console.log(`\n--- Testing with Application ID instead of Client ID ---`);
    const docgenAppId = 'd7af9e65-3731-46aa-b946-d7d5035e0b54';
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocument',
            { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
            {
                headers: {
                    'client_id': docgenAppId,
                    'client_secret': docgenSecret,
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
