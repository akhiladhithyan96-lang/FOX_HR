# 🦊 Fox HR — Smart HR Document Automation

**Fox HR** is a high-performance HR Document Automation platform built for the **Foxit Document Automation Hackathon 2026**. It transforms raw employee data into polished, secure, and compliant document packages in seconds, eliminating manual paperwork bottlenecks.

---

## 🚀 Pitch
"Stop wasting hours manually editing HR templates. Fox HR automates the generation, merging, and cryptographic protection of entire onboarding packs, allowing HR teams to focus on people, not paperwork."

## ✨ Key Features
*   **Instant Generation:** High-fidelity document creation via **Foxit Document Generation API**.
*   **Automated Onboarding Packs:** Intelligent orchestration of **Foxit PDF Services** to merge, compress, and watermark document bundles.
*   **Smart Security:** Automatic PDF password protection using employee metadata (e.g., Date of Birth) via the **PDF Services API**.
*   **Bulk Processing:** CSV-driven automation for mass-onboarding events.
*   **Local-First Privacy:** All sensitive employee data resides in the browser's `localStorage` — no external database required.

## 🛠️ Technical Architecture
The application follows a clean **Generate → Process → Deliver** pipeline powered by Foxit Cloud APIs:

```text
[ Data Source ] → [ DocGen API ] → [ PDF Services API ] → [ Integrated Pack ]
      |               |                    |                    |
  Form Input/    Injects data into    Merges, Compresses,      Final Secure
  CSV Upload     DOCX Templates       & Protects PDFs          Onboarding PDF
```

### 🛰️ API Orchestration
1.  **Foxit Document Generation API**: Dynamically generates Offer Letters, NDAs, and Appointment Letters by injecting JSON data into `.docx` templates.
2.  **Foxit PDF Services API**: Handles post-processing including:
    *   **Merge**: Consolidating individual PDFs into a single Onboarding Pack.
    *   **Compress**: Optimizing file size for email delivery.
    *   **Security**: Applying user-level password protection.
    *   **Watermark**: Adding "Confidential" branding to restricted documents.
    *   **Page Numbering**: Ensuring professional pagination across merged bundles.

## ⚙️ Setup Instructions

### 1. Prerequisites
*   Node.js 18.x or 20.x+
*   Foxit Developer Account ([Sign up here](https://developer-api.foxit.com))

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# Foxit Document Generation API (Fusion)
FOXIT_DOCGEN_CLIENT_ID=your_client_id
FOXIT_DOCGEN_CLIENT_SECRET=your_client_secret
FOXIT_DOCGEN_BASE_URL=https://na1.fusion.foxit.com/document-generation

# Foxit PDF Services API (Fusion)
FOXIT_PDFSERVICES_CLIENT_ID=your_client_id
FOXIT_PDFSERVICES_CLIENT_SECRET=your_client_secret
FOXIT_PDFSERVICES_BASE_URL=https://na1.fusion.foxit.com/pdf-services

# Branding
NEXT_PUBLIC_COMPANY_NAME=FoxHR
```

### 3. Installation
```bash
npm install
npm run dev
```

## 🔒 Security & Compliance
Fox HR is built with a privacy-first mindset. Employee data travels through secure, encrypted API tunnels and is processed transiently by Foxit's high-performance servers. No PII (Personally Identifiable Information) is persisted on the backend beyond the processing session.

---
*Built with ❤️ for the Foxit Document Automation Hackathon 2026.*
