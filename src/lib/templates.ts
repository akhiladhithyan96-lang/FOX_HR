import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    BorderStyle,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ShadingType,
} from 'docx';
import { DocumentType, Employee } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Template variable definitions for each document type
export const TEMPLATE_VARIABLES: Record<DocumentType, string[]> = {
    'offer-letter': [
        'company_name', 'candidate_name', 'designation', 'department',
        'start_date', 'annual_ctc', 'basic_salary', 'hra',
        'probation_period', 'reporting_manager', 'work_location',
        'employee_id', 'generated_date'
    ],
    'nda': [
        'company_name', 'candidate_name', 'designation',
        'start_date', 'employee_id', 'generated_date'
    ],
    'policy-handbook': [
        'company_name', 'candidate_name', 'designation',
        'department', 'employee_id', 'generated_date'
    ],
    'tax-declaration': [
        'candidate_name', 'employee_id', 'designation',
        'annual_ctc', 'financial_year', 'generated_date'
    ],
    'appointment-letter': [
        'company_name', 'candidate_name', 'designation',
        'department', 'start_date', 'employee_id', 'generated_date'
    ],
};

function makePlaceholder(key: string): string {
    return `{{${key}}}`;
}

function headerSection(title: string, companyName: string = '{{company_name}}'): Paragraph[] {
    return [
        new Paragraph({
            children: [
                new TextRun({
                    text: companyName,
                    bold: true,
                    size: 32,
                    color: 'E8590C',
                }),
            ],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: 'Human Resources Department',
                    size: 20,
                    color: '666666',
                }),
            ],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: '─'.repeat(80), color: 'E8590C' }),
            ],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({
                    text: title,
                    bold: true,
                    size: 28,
                    color: '1A1A2E',
                }),
            ],
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: `Date: ${makePlaceholder('generated_date')}`, size: 20 }),
            ],
            alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({ text: '' }),
    ];
}

function signatureSection(): Paragraph[] {
    return [
        new Paragraph({ text: '' }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: '─'.repeat(40), color: '999999' }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Authorized Signatory', bold: true, size: 20 }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({ text: makePlaceholder('company_name'), size: 18, color: '666666' }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Employee Acceptance:', bold: true, size: 20 }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Signature: ____________________________    Date: _______________', size: 18 }),
            ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
            children: [
                new TextRun({ text: 'Name: ' }),
                new TextRun({ text: makePlaceholder('candidate_name'), bold: true }),
            ],
        }),
    ];
}

function createOfferLetterDoc(): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                ...headerSection('OFFER LETTER'),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Dear ', size: 24 }),
                        new TextRun({ text: makePlaceholder('candidate_name'), bold: true, size: 24 }),
                        new TextRun({ text: ',', size: 24 }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `We are pleased to extend this offer of employment to you at ${makePlaceholder('company_name')} for the position of `,
                            size: 22,
                        }),
                        new TextRun({ text: makePlaceholder('designation'), bold: true, size: 22 }),
                        new TextRun({ text: ` in the ${makePlaceholder('department')} department.`, size: 22 }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Employment Details', bold: true, size: 24, color: 'E8590C' }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Employee ID', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('employee_id') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Designation', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('designation') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Department', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('department') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Start Date', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('start_date') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Work Location', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('work_location') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Reporting Manager', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('reporting_manager') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Probation Period', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('probation_period') })] }),
                            ],
                        }),
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Compensation Package', bold: true, size: 24, color: 'E8590C' }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Annual CTC', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('annual_ctc') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Basic Salary', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('basic_salary') })] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'HRA', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }),
                                new TableCell({ children: [new Paragraph({ text: makePlaceholder('hra') })] }),
                            ],
                        }),
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'This offer is contingent upon successful completion of background verification and document submission. Please sign and return this letter within 7 days of receipt.',
                            size: 20,
                            italics: true,
                            color: '666666',
                        }),
                    ],
                }),
                ...signatureSection(),
            ],
        }],
    });
}

function createNDADoc(): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                ...headerSection('NON-DISCLOSURE AGREEMENT'),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `This Non-Disclosure Agreement ("Agreement") is entered into as of ${makePlaceholder('generated_date')} between ${makePlaceholder('company_name')} ("Company") and ${makePlaceholder('candidate_name')} ("Employee"), effective from ${makePlaceholder('start_date')}.`,
                            size: 22,
                        }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '1. CONFIDENTIAL INFORMATION', bold: true, size: 22, color: 'E8590C' })] }),
                new Paragraph({
                    children: [new TextRun({ text: 'The Employee agrees to hold in strict confidence all proprietary and confidential information of the Company, including but not limited to trade secrets, business plans, financial data, customer information, technical data, and other proprietary information disclosed or made accessible during employment.', size: 20 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '2. OBLIGATIONS', bold: true, size: 22, color: 'E8590C' })] }),
                new Paragraph({
                    children: [new TextRun({ text: 'Employee (', size: 20 }), new TextRun({ text: makePlaceholder('candidate_name'), bold: true, size: 20 }), new TextRun({ text: `), employed as ${makePlaceholder('designation')} (Employee ID: ${makePlaceholder('employee_id')}), shall not disclose any Confidential Information to third parties without prior written consent.`, size: 20 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '3. DURATION', bold: true, size: 22, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'The obligations under this Agreement shall remain in effect during the term of employment and for a period of two (2) years following the termination of employment.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '4. REMEDIES', bold: true, size: 22, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Any breach of this Agreement may cause irreparable harm to the Company, entitling it to seek injunctive relief in addition to monetary damages.', size: 20 })] }),
                ...signatureSection(),
            ],
        }],
    });
}

function createPolicyHandbookDoc(): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                ...headerSection('EMPLOYEE POLICY HANDBOOK'),
                new Paragraph({
                    children: [new TextRun({ text: `Welcome to ${makePlaceholder('company_name')}!`, bold: true, size: 26 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [new TextRun({ text: `This handbook is prepared for ${makePlaceholder('candidate_name')} (${makePlaceholder('designation')} | ${makePlaceholder('department')} | ID: ${makePlaceholder('employee_id')}).`, size: 22 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '1. Code of Conduct', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'All employees are expected to maintain the highest standards of professional conduct, integrity, and respect for fellow colleagues, clients, and stakeholders. Discrimination, harassment, or any form of misconduct will not be tolerated.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '2. Working Hours', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday. Flexibility may be discussed with your reporting manager. Remote work policies apply as per the current company guidelines.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '3. Leave Policy', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Employees are entitled to 24 days of paid leave per year including casual, sick, and earned leave. Leave must be applied through the HRMS portal at least 48 hours in advance (except emergencies).', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '4. Performance Reviews', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Performance reviews are conducted quarterly and annually. Goals are set at the beginning of each review period. Promotions and salary revisions are tied to performance outcomes.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: '5. IT & Data Security', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'Company equipment and data must be handled with care. Employees must not install unauthorized software or share access credentials. All data breaches must be immediately reported to the IT department.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: `By joining ${makePlaceholder('company_name')}, you agree to abide by all policies stated in this handbook. This document was generated on ${makePlaceholder('generated_date')}.`, size: 20, italics: true, color: '666666' })] }),
            ],
        }],
    });
}

function createTaxDeclarationDoc(): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                ...headerSection('INCOME TAX DECLARATION FORM', ''),
                new Paragraph({
                    children: [new TextRun({ text: `Financial Year: ${makePlaceholder('financial_year')}`, bold: true, size: 24 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: 'Personal Information', bold: true, size: 24, color: 'E8590C' })] }),
                new Table({
                    rows: [
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Employee Name', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }), new TableCell({ children: [new Paragraph({ text: makePlaceholder('candidate_name') })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Employee ID', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }), new TableCell({ children: [new Paragraph({ text: makePlaceholder('employee_id') })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Designation', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }), new TableCell({ children: [new Paragraph({ text: makePlaceholder('designation') })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Annual CTC', bold: true })] })], shading: { type: ShadingType.SOLID, color: 'FFF3E0' } }), new TableCell({ children: [new Paragraph({ text: makePlaceholder('annual_ctc') })] })] }),
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: 'Tax Declaration', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: 'I hereby declare that the information provided above is true and accurate to the best of my knowledge. Any false declaration may result in disciplinary action.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: `Generated on: ${makePlaceholder('generated_date')}`, size: 18, italics: true, color: '666666' })] }),
                ...signatureSection(),
            ],
        }],
    });
}

function createAppointmentLetterDoc(): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                ...headerSection('APPOINTMENT LETTER'),
                new Paragraph({
                    children: [new TextRun({ text: 'To,', size: 22 })],
                }),
                new Paragraph({
                    children: [new TextRun({ text: makePlaceholder('candidate_name'), bold: true, size: 22 })],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Sub: Appointment as ${makePlaceholder('designation')} at ${makePlaceholder('company_name')}`, bold: true, size: 22 }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `We are pleased to appoint you as `, size: 22 }),
                        new TextRun({ text: makePlaceholder('designation'), bold: true, size: 22 }),
                        new TextRun({ text: ` in the ${makePlaceholder('department')} department at ${makePlaceholder('company_name')}, effective from ${makePlaceholder('start_date')}.`, size: 22 }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Your Employee ID is ${makePlaceholder('employee_id')}. You will be expected to report on your start date with all required documentation.`, size: 22 }),
                    ],
                }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: 'Terms and Conditions', bold: true, size: 24, color: 'E8590C' })] }),
                new Paragraph({ children: [new TextRun({ text: '1. This appointment is subject to all terms and conditions mentioned in the accompanying Offer Letter.', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: '2. The appointment will be confirmed upon successful completion of the probation period.', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: '3. You are required to maintain confidentiality of all company information as per the NDA signed separately.', size: 20 })] }),
                new Paragraph({ text: '' }),
                new Paragraph({ children: [new TextRun({ text: `This letter was generated on ${makePlaceholder('generated_date')}.`, size: 18, italics: true, color: '666666' })] }),
                ...signatureSection(),
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
 * Get base64-encoded DOCX template for a given document type.
 * Generates the template programmatically using docx library.
 */
export async function getTemplateBase64(docType: DocumentType): Promise<string> {
    // Check if pre-generated template exists on disk
    const templatePath = path.join(process.cwd(), 'templates', `${docType}.docx`);

    if (fs.existsSync(templatePath)) {
        console.log(`[Templates] Using existing template: ${templatePath}`);
        const buffer = fs.readFileSync(templatePath);
        return buffer.toString('base64');
    }

    // Generate template programmatically
    console.log(`[Templates] Generating template programmatically for: ${docType}`);
    const generator = DOCUMENT_GENERATORS[docType];
    if (!generator) throw new Error(`Unknown document type: ${docType}`);

    const doc = generator();
    const buffer = await Packer.toBuffer(doc);

    // Save for future use
    const templatesDir = path.join(process.cwd(), 'templates');
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }
    fs.writeFileSync(templatePath, buffer);
    console.log(`[Templates] Saved template: ${templatePath}`);

    return buffer.toString('base64');
}

/**
 * Build document values object from employee data
 */
export function buildDocumentValues(employee: Employee): Record<string, string> {
    const now = new Date();
    const generatedDate = now.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });

    const startDateFormatted = employee.startDate
        ? new Date(employee.startDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        })
        : '';

    const currentYear = now.getFullYear();
    const financialYear = now.getMonth() < 3
        ? `${currentYear - 1}-${currentYear}`
        : `${currentYear}-${currentYear + 1}`;

    return {
        company_name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'TechCorp Solutions',
        candidate_name: employee.fullName,
        designation: employee.designation,
        department: employee.department,
        start_date: startDateFormatted,
        annual_ctc: `₹${employee.annualCTC.toLocaleString('en-IN')} per annum`,
        basic_salary: `₹${employee.basicSalary.toLocaleString('en-IN')} per month`,
        hra: `₹${employee.hra.toLocaleString('en-IN')} per month`,
        probation_period: employee.probationPeriod,
        reporting_manager: employee.reportingManager || 'To be assigned',
        work_location: employee.workLocation || 'Head Office',
        employee_id: employee.employeeId,
        generated_date: generatedDate,
        financial_year: financialYear,
    };
}
