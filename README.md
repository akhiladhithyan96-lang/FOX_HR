# 🦊 HRFlow — Smart HR Documents, Delivered Instantly

**HRFlow** is a powerful HR Document Automation platform built for the Foxit Document Automation Hackathon. It streamlines the entire employee onboarding workflow by transforming raw data into polished, professional, and secure document packages in seconds.

## 🚀 Pitch
"Stop wasting hours manually editing HR templates. HRFlow automates the generation, merging, and delivery of entire onboarding packs, allowing HR teams to focus on people, not paperwork."

## 🛠️ Architecture Overview
The application follows a clean "Generate → Process → Deliver" flow powered exclusively by Foxit Cloud APIs:

```text
[ Input ] → [ Document Generation ] → [ PDF Processing ] → [ Integrated Pack ]
   |                |                     |                    |
Form Data/    Foxit DocGen API      Foxit PDF Services      Final Result
CSV Upload    Injects JSON into     Merges, Compresses,     Delivery-ready
              DOCX Templates        & Protects PDFs         Onboarding PDF
```

### 🛰️ API Usage Callouts
- **Document Generation API**: Used to dynamically generate Offer Letters, NDAs, Policy Handbooks, Tax Declarations, and Appointment Letters. It maps employee JSON data (names, roles, salaries) into professional .docx templates and converts them to high-quality PDFs.
- **PDF Services API**: Orchestrates the multi-step post-processing pipeline. It merges individual documents into a single consolidated pack, compresses the final file for email delivery, adds "Confidential" watermarks, and applies password protection using the employee's date of birth.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js 18.x or 20.x
- Foxit Developer Account (Client ID and Secret)

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# Foxit Document Generation API
FOXIT_DOCGEN_CLIENT_ID=your_client_id
FOXIT_DOCGEN_CLIENT_SECRET=your_client_secret
FOXIT_DOCGEN_BASE_URL=https://na1.fusion.foxit.com/document-generation

# Foxit PDF Services API
FOXIT_PDFSERVICES_CLIENT_ID=your_client_id
FOXIT_PDFSERVICES_CLIENT_SECRET=your_client_secret
FOXIT_PDFSERVICES_BASE_URL=https://na1.fusion.foxit.com/pdf-services

# Branding
NEXT_PUBLIC_COMPANY_NAME=YourCompany
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Data Privacy Note
HRFlow is built with privacy in mind. **No employee data is stored on our servers.**
- All employee information and document metadata are stored locally in the browser's `localStorage`.
- PDFs are generated transiently through Foxit's secure API endpoints and are not persisted beyond the user's session.

## 📚 API Documentation Reference
- [Foxit Developer Portal](https://developer-api.foxit.com)
- [Foxit API Documentation](https://docs.developer-api.foxit.com)

---
*Built for the Foxit Document Automation Hackathon 2026.*
