import { createHash } from 'crypto';

/**
 * Generates an MD5 signature for Foxit API requests if required by the endpoint.
 * Pattern: md5(sorted_querystring + '&sk=' + client_secret)
 */
export function generateSignature(params: Record<string, string>, secretId: string): string {
    // 1. Sort keys alphabetically
    const sortedKeys = Object.keys(params).sort();

    // 2. Build query string
    const queryStr = sortedKeys
        .map((key) => `${key}=${params[key]}`)
        .join('&');

    // 3. Append secret key and generate MD5 hash
    return createHash('md5')
        .update(queryStr + '&sk=' + secretId)
        .digest('hex');
}
