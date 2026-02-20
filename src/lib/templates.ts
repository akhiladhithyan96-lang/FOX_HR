import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
} from 'docx';
import { DocumentType, Employee } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// NOTE: Foxit DocGen uses {{variableName}} tokens in plain text runs.
// CRITICAL: Never mix bold/italic formatting across a token – it will be split
// into separate XML runs and Foxit won't recognize the token.
// All tokens must be in a single, standalone TextRun with no formatting change mid-token.

function t(key: string): string {
    return `{{${key}}}`;
}

// Safe paragraph with simply-concatenated text – never split across runs
function plain(text: string): Paragraph {
    return new Paragraph({ children: [new TextRun({ text, size: 22 })] });
}

function heading(text: string): Paragraph {
    return new Paragraph({
        children: [new TextRun({ text, bold: true, size: 28 })],
        alignment: AlignmentType.CENTER,
    });
}

function subheading(text: string): Paragraph {
    return new Paragraph({
        children: [new TextRun({ text, bold: true, size: 24 })],
    });
}

function blank(): Paragraph {
    return new Paragraph({ children: [new TextRun({ text: '' })] });
}

function kv(label: string, value: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({ text: `${label}: `, bold: true, size: 22 }),
            new TextRun({ text: value, size: 22 }),
        ],
    });
}

// ─── OFFER LETTER ─────────────────────────────────────────────────────────────
function createOfferLetterDoc(): Document {
    return new Document({
        sections: [{
            children: [
                heading(`${t('company_name')} - OFFER LETTER`),
                plain(`Date: ${t('generated_date')}`),
                blank(),
                plain(`Dear ${t('candidate_name')},`),
                blank(),
                plain(`We are pleased to offer you the position of ${t('designation')} in the ${t('department')} department at ${t('company_name')}.`),
                blank(),
                subheading('Employment Details'),
                kv('Employee ID', t('employee_id')),
                kv('Designation', t('designation')),
                kv('Department', t('department')),
                kv('Start Date', t('start_date')),
                kv('Work Location', t('work_location')),
                kv('Reporting Manager', t('reporting_manager')),
                kv('Probation Period', t('probation_period')),
                blank(),
                subheading('Compensation Package'),
                kv('Annual CTC', t('annual_ctc')),
                kv('Basic Salary', t('basic_salary')),
                kv('HRA', t('hra')),
                blank(),
                plain('This offer is subject to background verification and document submission. Please sign and return within 7 days.'),
                blank(),
                plain('Sincerely,'),
                plain(`Authorized Signatory, ${t('company_name')}`),
                blank(),
                plain('Employee Acceptance:'),
                plain(`Name: ${t('candidate_name')}`),
                plain('Signature: ____________________________    Date: _______________'),
            ],
        }],
    });
}

// ─── NDA ──────────────────────────────────────────────────────────────────────
function createNDADoc(): Document {
    return new Document({
        sections: [{
            children: [
                heading('NON-DISCLOSURE AGREEMENT'),
                blank(),
                plain(`This Non-Disclosure Agreement is entered into as of ${t('generated_date')} between ${t('company_name')} ("Company") and ${t('candidate_name')} ("Employee"), effective from ${t('start_date')}.`),
                blank(),
                subheading('1. Confidential Information'),
                plain('The Employee agrees to hold in strict confidence all proprietary and confidential information of the Company, including trade secrets, business plans, financial data, customer information, and technical data.'),
                blank(),
                subheading('2. Obligations'),
                plain(`Employee ${t('candidate_name')}, holding the position of ${t('designation')} (Employee ID: ${t('employee_id')}), shall not disclose Confidential Information to third parties without prior written consent.`),
                blank(),
                subheading('3. Duration'),
                plain('Obligations under this Agreement remain in effect during employment and for two (2) years following termination.'),
                blank(),
                subheading('4. Remedies'),
                plain('Any breach may cause irreparable harm, entitling the Company to seek injunctive relief in addition to monetary damages.'),
                blank(),
                plain('Authorized Signatory: ____________________________'),
                plain(`${t('company_name')}`),
                blank(),
                plain(`Employee Signature: ____________________________    Date: _______________`),
                plain(`Name: ${t('candidate_name')}`),
            ],
        }],
    });
}

// ─── POLICY HANDBOOK ──────────────────────────────────────────────────────────
function createPolicyHandbookDoc(): Document {
    return new Document({
        sections: [{
            children: [
                heading('EMPLOYEE POLICY HANDBOOK'),
                blank(),
                plain(`Welcome to ${t('company_name')}!`),
                blank(),
                plain(`This handbook is prepared for ${t('candidate_name')}, ${t('designation')}, ${t('department')} department, Employee ID: ${t('employee_id')}.`),
                blank(),
                subheading('1. Code of Conduct'),
                plain('All employees must maintain the highest standards of professional conduct, integrity, and respect. Discrimination or harassment will not be tolerated.'),
                blank(),
                subheading('2. Working Hours'),
                plain('Standard hours are 9:00 AM to 6:00 PM, Monday through Friday. Flexibility may be arranged with your manager.'),
                blank(),
                subheading('3. Leave Policy'),
                plain('Employees are entitled to 24 days of paid leave per year. Leave must be applied through HRMS at least 48 hours in advance.'),
                blank(),
                subheading('4. Performance Reviews'),
                plain('Reviews are conducted quarterly and annually. Promotions and salary revisions are tied to performance.'),
                blank(),
                subheading('5. IT & Data Security'),
                plain('Company equipment and data must be handled with care. Unauthorized software installation or credential sharing is prohibited.'),
                blank(),
                plain(`By joining ${t('company_name')}, you agree to all policies in this handbook. Generated on: ${t('generated_date')}.`),
            ],
        }],
    });
}

// ─── TAX DECLARATION ──────────────────────────────────────────────────────────
function createTaxDeclarationDoc(): Document {
    return new Document({
        sections: [{
            children: [
                heading('INCOME TAX DECLARATION FORM'),
                plain(`Financial Year: ${t('financial_year')}`),
                blank(),
                subheading('Personal Information'),
                kv('Employee Name', t('candidate_name')),
                kv('Employee ID', t('employee_id')),
                kv('Designation', t('designation')),
                kv('Annual CTC', t('annual_ctc')),
                blank(),
                subheading('Tax Declaration'),
                plain('I hereby declare that the information provided is true and accurate. Any false declaration may result in disciplinary action.'),
                blank(),
                plain(`Generated on: ${t('generated_date')}`),
                blank(),
                plain('Employee Signature: ____________________________'),
                plain(`Name: ${t('candidate_name')}`),
            ],
        }],
    });
}

// ─── APPOINTMENT LETTER ───────────────────────────────────────────────────────
function createAppointmentLetterDoc(): Document {
    return new Document({
        sections: [{
            children: [
                heading('APPOINTMENT LETTER'),
                blank(),
                plain(`To: ${t('candidate_name')}`),
                blank(),
                plain(`Subject: Appointment as ${t('designation')} at ${t('company_name')}`),
                blank(),
                plain(`We are pleased to appoint you as ${t('designation')} in the ${t('department')} department at ${t('company_name')}, effective from ${t('start_date')}.`),
                blank(),
                plain(`Your Employee ID is ${t('employee_id')}. Please report on your start date with all required documentation.`),
                blank(),
                subheading('Terms and Conditions'),
                plain('1. This appointment is subject to all terms in the accompanying Offer Letter.'),
                plain('2. The appointment will be confirmed upon successful completion of the probation period.'),
                plain('3. You are required to maintain confidentiality as per the NDA signed separately.'),
                blank(),
                plain(`Generated on: ${t('generated_date')}`),
                blank(),
                plain('Authorized Signatory: ____________________________'),
                plain(`${t('company_name')}`),
            ],
        }],
    });
}

const DOCUMENT_GENERATORS: Record<DocumentType, () => Document> = {
    'offer-letter': createOfferLetterDoc,
    'nda': createNDADoc,
    'policy-handbook': createPolicyHandbookDoc,
    'tax-declaration': createTaxDeclarationDoc,
    'appointment-letter': createAppointmentLetterDoc,
};

/**
 * Get base64-encoded DOCX template. Always regenerates fresh to avoid stale cached templates.
 */
export async function getTemplateBase64(docType: DocumentType): Promise<string> {
    const generator = DOCUMENT_GENERATORS[docType];
    if (!generator) throw new Error(`Unknown document type: ${docType}`);

    // Always regenerate fresh to avoid cached templates with broken tokens
    const doc = generator();
    const buffer = await Packer.toBuffer(doc);

    // Optionally save for debugging
    try {
        const templatesDir = path.join(process.cwd(), 'templates');
        if (!fs.existsSync(templatesDir)) {
            fs.mkdirSync(templatesDir, { recursive: true });
        }
        fs.writeFileSync(path.join(templatesDir, `${docType}.docx`), buffer);
    } catch {
        // Ignore file write errors in read-only environments (e.g. Lambda)
    }

    return buffer.toString('base64');
}

/**
 * Build document values object from employee data.
 * Keys must EXACTLY match the {{token}} names used in templates above.
 */
export function buildDocumentValues(employee: Employee): Record<string, string> {
    const now = new Date();
    const generatedDate = now.toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: '2-digit',
    });

    const startDateFormatted = employee.startDate
        ? new Date(employee.startDate).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: '2-digit',
        })
        : 'To be confirmed';

    const currentYear = now.getFullYear();
    const financialYear = now.getMonth() < 3
        ? `${currentYear - 1}-${currentYear}`
        : `${currentYear}-${currentYear + 1}`;

    return {
        company_name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'TechCorp Solutions',
        candidate_name: employee.fullName || 'N/A',
        designation: employee.designation || 'N/A',
        department: employee.department || 'N/A',
        start_date: startDateFormatted,
        annual_ctc: `INR ${(employee.annualCTC || 0).toLocaleString('en-IN')} per annum`,
        basic_salary: `INR ${(employee.basicSalary || 0).toLocaleString('en-IN')} per month`,
        hra: `INR ${(employee.hra || 0).toLocaleString('en-IN')} per month`,
        probation_period: employee.probationPeriod || '3 months',
        reporting_manager: employee.reportingManager || 'To be assigned',
        work_location: employee.workLocation || 'Head Office',
        employee_id: employee.employeeId || 'TBD',
        generated_date: generatedDate,
        financial_year: financialYear,
    };
}

// Template variable definitions (informational)
export const TEMPLATE_VARIABLES: Record<DocumentType, string[]> = {
    'offer-letter': ['company_name', 'candidate_name', 'designation', 'department', 'start_date', 'annual_ctc', 'basic_salary', 'hra', 'probation_period', 'reporting_manager', 'work_location', 'employee_id', 'generated_date'],
    'nda': ['company_name', 'candidate_name', 'designation', 'start_date', 'employee_id', 'generated_date'],
    'policy-handbook': ['company_name', 'candidate_name', 'designation', 'department', 'employee_id', 'generated_date'],
    'tax-declaration': ['candidate_name', 'employee_id', 'designation', 'annual_ctc', 'financial_year', 'generated_date'],
    'appointment-letter': ['company_name', 'candidate_name', 'designation', 'department', 'start_date', 'employee_id', 'generated_date'],
};
