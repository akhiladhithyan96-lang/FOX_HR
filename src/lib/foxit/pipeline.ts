import { Employee, PackOptions, DocumentType } from '../../types';
import { generateDocumentBase64 } from './docgen';
import {
    uploadDocument,
    mergePDFs,
    compressPDF,
    passwordProtectPDF,
    watermarkPDF,
    addPageNumbers,
    downloadDocument,
} from './pdfservices';
import { getTemplateBase64, buildDocumentValues } from '../templates';

export interface PipelineProgressCallback {
    (step: string, progress: number): void;
}

/**
 * Full orchestration pipeline:
 * 1. Generate individual PDFs from templates using DocGen API
 * 2. Upload each PDF to PDF Services
 * 3. Apply operations (merge, compress, protect, watermark, page numbers)
 * 4. Download and return final PDF Buffer
 */
export async function generateOnboardingPack(
    employee: Employee,
    documentTypes: DocumentType[],
    options: PackOptions,
    onProgress?: PipelineProgressCallback
): Promise<Buffer> {
    const totalSteps = documentTypes.length + (options.merge ? 1 : 0) +
        (options.compress ? 1 : 0) + (options.passwordProtect ? 1 : 0) +
        (options.addWatermark ? 1 : 0) + (options.addPageNumbers ? 1 : 0);

    let currentStep = 0;

    const updateProgress = (step: string) => {
        currentStep++;
        const progress = Math.round((currentStep / totalSteps) * 100);
        console.log(`[Pipeline] ${step} (${progress}%)`);
        onProgress?.(step, progress);
    };

    // Step 1: Generate individual documents via DocGen API
    const pdfBuffers: Buffer[] = [];
    for (const docType of documentTypes) {
        updateProgress(`Generating ${docType}...`);
        console.log(`[Pipeline] Generating document: ${docType}`);

        const templateBase64 = await getTemplateBase64(docType);
        const docValues = buildDocumentValues(employee);

        const resultBase64 = await generateDocumentBase64(templateBase64, docValues, 'pdf');
        const pdfBuffer = Buffer.from(resultBase64, 'base64');
        pdfBuffers.push(pdfBuffer);
        console.log(`[Pipeline] Generated ${docType}: ${pdfBuffer.length} bytes`);
    }

    // If only one doc and no merging
    if (pdfBuffers.length === 0) {
        throw new Error('No documents were generated');
    }

    // Step 2: Upload all PDFs to PDF Services
    let currentDocId: string;

    if (options.merge && pdfBuffers.length > 1) {
        // Upload all and merge
        const docIds: string[] = [];
        for (let i = 0; i < pdfBuffers.length; i++) {
            const docId = await uploadDocument(pdfBuffers[i], `doc_${i}.pdf`);
            docIds.push(docId);
        }

        updateProgress('Merging documents...');
        currentDocId = await mergePDFs(docIds);
    } else {
        // Just upload the first/only PDF
        currentDocId = await uploadDocument(pdfBuffers[0], 'document.pdf');
    }

    // Step 3: Apply PDF Services operations
    if (options.compress) {
        updateProgress('Compressing PDF...');
        currentDocId = await compressPDF(currentDocId);
    }

    if (options.passwordProtect && employee.dob) {
        // Password = DOB in DDMMYYYY format
        const dobDate = new Date(employee.dob);
        const dd = String(dobDate.getDate()).padStart(2, '0');
        const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
        const yyyy = dobDate.getFullYear();
        const password = `${dd}${mm}${yyyy}`;

        updateProgress('Protecting PDF...');
        currentDocId = await passwordProtectPDF(currentDocId, password);
    }

    if (options.addWatermark) {
        const watermarkText = options.watermarkText || `Confidential - ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'TechCorp Solutions'}`;
        updateProgress('Adding watermark...');
        currentDocId = await watermarkPDF(currentDocId, watermarkText);
    }

    if (options.addPageNumbers) {
        updateProgress('Adding page numbers...');
        currentDocId = await addPageNumbers(currentDocId);
    }

    // Step 4: Download final document
    console.log('[Pipeline] Downloading final document:', currentDocId);
    const finalBuffer = await downloadDocument(currentDocId);

    return finalBuffer;
}

/**
 * Generate a single document via DocGen and return base64 PDF
 */
export async function generateSingleDocument(
    employee: Employee,
    documentType: DocumentType
): Promise<string> {
    console.log(`[Pipeline] Generating single document: ${documentType} for ${employee.fullName}`);

    const templateBase64 = await getTemplateBase64(documentType);
    const docValues = buildDocumentValues(employee);

    const resultBase64 = await generateDocumentBase64(templateBase64, docValues, 'pdf');
    return resultBase64;
}
