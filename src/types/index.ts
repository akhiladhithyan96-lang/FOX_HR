export type Department = 'Engineering' | 'HR' | 'Finance' | 'Marketing' | 'Operations' | 'Sales';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
export type ProbationPeriod = '3 months' | '6 months' | 'None';
export type DocumentType = 'offer-letter' | 'nda' | 'policy-handbook' | 'tax-declaration' | 'appointment-letter';
export type DocumentStatus = 'pending' | 'generating' | 'ready' | 'error';

export interface Employee {
  id: string;
  // Personal
  fullName: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  address: string;
  // Employment
  employeeId: string;
  designation: string;
  department: Department;
  employmentType: EmploymentType;
  startDate: string; // YYYY-MM-DD
  probationPeriod: ProbationPeriod;
  reportingManager: string;
  workLocation: string;
  // Compensation
  annualCTC: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  pfContribution: number;
  // Meta
  createdAt: string;
  documentsToGenerate: DocumentType[];
}

export interface GeneratedDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: DocumentType;
  status: DocumentStatus;
  docId?: string;      // Foxit document ID
  base64Data?: string; // base64 encoded PDF for download
  generatedAt?: string;
  fileSize?: number;
  errorMessage?: string;
  operationsApplied?: string[];
}

export interface PackOptions {
  merge: boolean;
  compress: boolean;
  passwordProtect: boolean;
  convertToPDFA: boolean;
  addWatermark: boolean;
  addPageNumbers: boolean;
  watermarkText?: string;
}

export interface OnboardingPack {
  id: string;
  employeeId: string;
  employeeName: string;
  documentIds: string[];
  options: PackOptions;
  status: 'pending' | 'processing' | 'ready' | 'error';
  resultDocId?: string;
  resultBase64?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalDocuments: number;
  onboardingPacks: number;
  documentsThisMonth: number;
  apiCallsUsed: number;
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  'offer-letter': 'Offer Letter',
  'nda': 'NDA Agreement',
  'policy-handbook': 'Employee Policy Handbook',
  'tax-declaration': 'Tax Declaration Form',
  'appointment-letter': 'Appointment Letter',
};

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  'offer-letter': '📜',
  'nda': '🔏',
  'policy-handbook': '📋',
  'tax-declaration': '💰',
  'appointment-letter': '✉️',
};
