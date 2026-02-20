const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const id = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const secret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const appId = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    const hosts = [
        'https://na1.fusion.foxit.com',
        'https://fusion.foxit.com',
        'https://na1.foxit.com',
        'https://developer-api.foxit.com'
    ];

    console.log('--- Testing Host Variations ---');
    for (const host of hosts) {
        const url = `${host}/document-generation/api/AnalyzeDocumentBase64`;
        console.log(`Testing: ${url}`);
        try {
            const res = await axios.post(url,
                { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
                {
                    headers: {
                        'client_id': id,
                        'client_secret': secret,
                        'application-id': appId,
                        'Content-Type': 'application/json'
                    }, timeout: 5000
                }
            );
            console.log('SUCCESS!', res.status);
            process.exit(0);
        } catch (e) {
            console.log(`Fail: ${e.response?.status || e.code} ${JSON.stringify(e.response?.data || {})}`);
        }
    }
}

main();
