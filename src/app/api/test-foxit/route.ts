import { NextResponse } from 'next/server';
import axios from 'axios';

// This route makes a REAL test call to Foxit to diagnose the 401.
// Visit /api/test-foxit to run it.
export async function GET() {
    const clientId = process.env.FOXIT_DOCGEN_CLIENT_ID || '';
    const clientSecret = process.env.FOXIT_DOCGEN_CLIENT_SECRET || '';
    const BASE_URL = 'https://na1.fusion.foxit.com';

    const envInfo = {
        clientId_present: !!clientId,
        clientId_length: clientId.length,
        clientId_prefix: clientId.substring(0, 12),
        clientSecret_present: !!clientSecret,
        clientSecret_length: clientSecret.length,
        clientSecret_prefix: clientSecret.substring(0, 6),
        node_env: process.env.NODE_ENV,
        aws_branch: process.env.AWS_BRANCH || 'NOT_SET',
    };

    // Minimal valid DOCX base64 (a real minimal .docx file)
    // This is the smallest possible valid DOCX that Foxit can parse
    const minimalDocxBase64 = 'UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtVLLTsMwELwj8Q+R71XiDgghJulBgCMqKB/g2NvGqu1Y3kDp37NOCoiHVCGkXuL17uzMrjfZ/qfWiQcrqTKSMshJ3EVbKHkQ78VHumS7LQFsHOiCUuY9VXhrFfBbq4+dNAAnJQ5LHgJLUBZ1ePc8OjqKGnWEWzVxUAg6L5OkK/mFRJFqULniQm3AAQDQ3i4U+6JKkK6sW5lLK4OMDvkCNEgkqrQW4e8DPy2mGXN3Y3j5lZ3xKRr8eCWJM33n/Z3O1Ys7UNzELasRAFifKtKKsMASXgHFPCM9UmRJV3HlL7o0m7UzUUsPFrQTJABFNPRkuIjV5xNQkf69WgPd5Rqr5+q5VBzPxiCkAAAA';

    let foxitTestResult: Record<string, unknown> = {};

    try {
        const response = await axios.post(
            `${BASE_URL}/document-generation/api/GenerateDocumentBase64`,
            {
                outputFormat: 'pdf',
                documentValues: { name: 'Test' },
                base64FileString: minimalDocxBase64,
            },
            {
                headers: {
                    'client_id': clientId,
                    'client_secret': clientSecret,
                    'Content-Type': 'application/json',
                },
                timeout: 20000,
            }
        );
        foxitTestResult = {
            status: response.status,
            success: true,
            responseKeys: Object.keys(response.data || {}),
            hasBase64: !!response.data?.base64FileString,
        };
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            foxitTestResult = {
                success: false,
                httpStatus: err.response?.status,
                httpStatusText: err.response?.statusText,
                foxitError: err.response?.data,
                requestHeaders: err.config?.headers ?
                    Object.keys(err.config.headers).join(', ') : 'unknown',
                requestUrl: err.config?.url,
            };
        } else {
            foxitTestResult = { success: false, error: String(err) };
        }
    }

    return NextResponse.json({
        envInfo,
        foxitTestResult,
        timestamp: new Date().toISOString(),
    });
}
