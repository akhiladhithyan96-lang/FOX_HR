/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {},
  // Explicitly expose server-side environment variables to Next.js runtime.
  // This is REQUIRED for AWS Amplify Hosting (SSR Lambda mode) to make these
  // available via process.env in API routes and server components.
  env: {
    FOXIT_DOCGEN_CLIENT_ID: process.env.FOXIT_DOCGEN_CLIENT_ID,
    FOXIT_DOCGEN_CLIENT_SECRET: process.env.FOXIT_DOCGEN_CLIENT_SECRET,
    FOXIT_DOCGEN_APPLICATION_ID: process.env.FOXIT_DOCGEN_APPLICATION_ID,
    FOXIT_PDFSERVICES_CLIENT_ID: process.env.FOXIT_PDFSERVICES_CLIENT_ID,
    FOXIT_PDFSERVICES_CLIENT_SECRET: process.env.FOXIT_PDFSERVICES_CLIENT_SECRET,
    FOXIT_PDFSERVICES_APPLICATION_ID: process.env.FOXIT_PDFSERVICES_APPLICATION_ID,
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
  },
};

export default nextConfig;
