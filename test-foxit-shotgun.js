const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const docgenAppId = 'd7af9e65-3731-46aa-b946-d7d5035e0b54';

    const testHeaders = [
        { 'client_id': docgenId, 'client_secret': docgenSecret },
        { 'client-id': docgenId, 'client-secret': docgenSecret },
        { 'clientId': docgenId, 'clientSecret': docgenSecret },
        { 'x-client-id': docgenId, 'x-client-secret': docgenSecret },
        { 'x-api-key': docgenId, 'x-api-secret': docgenSecret },
        { 'client_id': docgenId, 'client_secret': docgenSecret, 'application-id': docgenAppId },
        { 'client_id': docgenId, 'client_secret': docgenSecret, 'application_id': docgenAppId },
        { 'app-id': docgenAppId, 'client-id': docgenId, 'client-secret': docgenSecret }
    ];

    console.log('--- Shotgun Testing Headers ---');

    for (const headers of testHeaders) {
        console.log(`Testing with headers: ${Object.keys(headers).join(', ')}`);
        try {
            const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocument',
                { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
                { headers: { ...headers, 'Content-Type': 'application/json' } }
            );
            console.log('SUCCESS!', res.status);
            process.exit(0);
        } catch (e) {
            console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        }
    }
}

main();
