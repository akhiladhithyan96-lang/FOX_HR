const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const v1 = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const v2 = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');
    const v3 = getEnv('FOXIT_DOCGEN_APPLICATION_ID');

    const combinations = [
        { cid: v1, sec: v3 },
        { cid: v3, sec: v1 },
        { cid: v2, sec: v1 },
        { cid: v1, sec: v2, aid: v3 } // Re-testing this just in case
    ];

    console.log('--- Testing Value Combinations ---');

    for (const c of combinations) {
        console.log(`Testing cid=${c.cid.substring(0, 8)}..., sec=${c.sec.substring(0, 8)}..., aid=${c.aid ? c.aid.substring(0, 8) : 'none'}`);
        try {
            const headers = {
                'client_id': c.cid,
                'client_secret': c.sec,
                'Content-Type': 'application/json'
            };
            if (c.aid) headers['application-id'] = c.aid;

            const res = await axios.post('https://na1.fusion.foxit.com/document-generation/api/AnalyzeDocumentBase64',
                { base64FileString: 'UEsDBBQAAAAIAAAAIQD...' },
                { headers }
            );
            console.log('SUCCESS!', res.status);
            process.exit(0);
        } catch (e) {
            console.log(`Fail: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        }
    }
}

main();
