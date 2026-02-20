const axios = require('axios');
const fs = require('fs');

async function main() {
    const env = fs.readFileSync('.env.local', 'utf8');
    const getEnv = (key) => env.split('\n').filter(l => l.includes('=')).find(l => l.startsWith(key))?.split('=')[1]?.trim();

    const docgenId = getEnv('FOXIT_DOCGEN_CLIENT_ID');
    const docgenSecret = getEnv('FOXIT_DOCGEN_CLIENT_SECRET');

    console.log('--- Testing OAuth Token flow ---');

    // Attempt 1: Fusion standard token endpoint
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/oauth/token',
            `grant_type=client_credentials&client_id=${docgenId}&client_secret=${docgenSecret}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        console.log('Fusion OAuth /oauth/token Success:', res.data);
    } catch (e) {
        console.log('Fusion OAuth /oauth/token Fail:', e.response?.status, JSON.stringify(e.response?.data));
    }

    // Attempt 2: API OAuth2 endpoint (from eSign docs but maybe shared)
    try {
        const res = await axios.post('https://na1.fusion.foxit.com/api/oauth2/access_token',
            `grant_type=client_credentials&client_id=${docgenId}&client_secret=${docgenSecret}&scope=read-write`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        console.log('Fusion OAuth /api/oauth2/access_token Success:', res.data);
    } catch (e) {
        console.log('Fusion OAuth /api/oauth2/access_token Fail:', e.response?.status, JSON.stringify(e.response?.data));
    }
}

main();
