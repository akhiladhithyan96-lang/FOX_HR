const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const values = {
        id: getEnv('FOXIT_DOCGEN_CLIENT_ID'),
        secret: getEnv('FOXIT_DOCGEN_CLIENT_SECRET'),
        appId: getEnv('FOXIT_DOCGEN_APPLICATION_ID')
    };

    console.log('--- Permutation Testing of Auth Values ---');

    const headersToTest = [
        { client_id: values.id, client_secret: values.secret, 'application-id': values.appId },
        { client_id: values.appId, client_secret: values.secret, 'application-id': values.id },
        { client_id: values.id, client_secret: values.secret },
        { client_id: values.appId, client_secret: values.secret },
        { client_id: values.id, client_secret: values.appId },
        { client_id: values.appId, client_secret: values.id },
        { client_id: values.id, client_secret: values.secret, 'app-id': values.appId },
        { x_api_key: values.id, x_api_secret: values.secret }
    ];

    for (const h of headersToTest) {
        console.log(`Testing headers: ${Object.keys(h).join(', ')}`);
        try {
            const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
                { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
                { headers: { ...h, 'Content-Type': 'application/json' }, timeout: 5000 }
            );
            console.log('SUCCESS!', res.status, res.data);
            process.exit(0);
        } catch (e) {
            console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data || {})}`);
        }
    }
}

main();
