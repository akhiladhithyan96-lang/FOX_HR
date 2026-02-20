const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const id = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const secret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const appId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    const headerSets = [
        { 'client_id': id, 'client_secret': secret, 'application-id': appId },
        { 'Client_Id': id, 'Client_Secret': secret, 'Application-Id': appId },
        { 'CLIENT_ID': id, 'CLIENT_SECRET': secret, 'APPLICATION-ID': appId },
        { 'client-id': id, 'client-secret': secret, 'application-id': appId },
        { 'x-client-id': id, 'x-client-secret': secret, 'x-application-id': appId }
    ];

    console.log('--- Testing Header Case Sensitivity ---');
    for (const headers of headerSets) {
        console.log(`Testing: ${Object.keys(headers).join(', ')} (Case variant)`);
        try {
            const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
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
