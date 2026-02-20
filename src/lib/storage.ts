import { Employee, GeneratedDocument, OnboardingPack } from '../types';

const KEYS = {
    EMPLOYEES: 'hrflow_employees',
    DOCUMENTS: 'hrflow_documents',
    PACKS: 'hrflow_packs',
    STATS: 'hrflow_stats',
};

// --- Employee ---
const SAMPLE_EMPLOYEES: Employee[] = [
    {
        id: '1', employeeId: 'FX-2026-001', fullName: 'Arjun Sharma', email: 'arjun.sharma@techcorp.com',
        phone: '+91 98765 43210', dob: '1992-05-15', address: '42, Skyline Towers, Mumbai, MH',
        designation: 'Senior Software Engineer', department: 'Engineering', employmentType: 'Full-Time',
        startDate: '2026-03-01', probationPeriod: '3 months', reportingManager: 'Sarah Jenkins',
        workLocation: 'Mumbai', annualCTC: 2400000, basicSalary: 1200000, hra: 480000,
        specialAllowance: 600000, pfContribution: 120000, createdAt: new Date().toISOString(),
        documentsToGenerate: ['offer-letter', 'nda', 'policy-handbook']
    },
    {
        id: '2', employeeId: 'FX-2026-002', fullName: 'Priya Mehta', email: 'priya.mehta@techcorp.com',
        phone: '+91 91234 56789', dob: '1995-12-10', address: '8, Meadows Colony, Bangalore, KA',
        designation: 'HR Manager', department: 'HR', employmentType: 'Full-Time',
        startDate: '2026-02-15', probationPeriod: 'None', reportingManager: 'David Wang',
        workLocation: 'Remote', annualCTC: 1800000, basicSalary: 900000, hra: 360000,
        specialAllowance: 450000, pfContribution: 90000, createdAt: new Date().toISOString(),
        documentsToGenerate: ['offer-letter', 'nda', 'appointment-letter']
    },
    {
        id: '3', employeeId: 'FX-2026-003', fullName: 'Rohan Gupta', email: 'rohan.gupta@techcorp.com',
        phone: '+91 88888 77777', dob: '1990-08-22', address: 'B-10, Green Park, Delhi, DL',
        designation: 'Product Analyst', department: 'Operations', employmentType: 'Contract',
        startDate: '2026-04-10', probationPeriod: '6 months', reportingManager: 'Sarah Jenkins',
        workLocation: 'Delhi', annualCTC: 1500000, basicSalary: 750000, hra: 300000,
        specialAllowance: 375000, pfContribution: 75000, createdAt: new Date().toISOString(),
        documentsToGenerate: ['nda', 'policy-handbook']
    }
];

export function getEmployees(): Employee[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(KEYS.EMPLOYEES);
        if (!stored) {
            localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(SAMPLE_EMPLOYEES));

            // Seed some sample documents too if totally empty
            const sampleDocs: GeneratedDocument[] = [
                { id: 'd1', employeeId: '1', employeeName: 'Arjun Sharma', documentType: 'offer-letter', status: 'ready', generatedAt: '2026-02-18T10:30:00Z', docId: 'doc_001' },
                { id: 'd2', employeeId: '2', employeeName: 'Priya Mehta', documentType: 'nda', status: 'ready', generatedAt: '2026-02-18T11:00:00Z', docId: 'doc_002' },
                { id: 'd3', employeeId: '2', employeeName: 'Priya Mehta', documentType: 'appointment-letter', status: 'ready', generatedAt: '2026-02-19T09:15:00Z', docId: 'doc_003' },
            ];
            localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(sampleDocs));

            return SAMPLE_EMPLOYEES;
        }
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

export function saveEmployee(employee: Employee): void {
    const employees = getEmployees();
    const idx = employees.findIndex((e) => e.id === employee.id);
    if (idx >= 0) employees[idx] = employee;
    else employees.push(employee);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
}

export function getEmployee(id: string): Employee | undefined {
    return getEmployees().find((e) => e.id === id);
}

export function deleteEmployee(id: string): void {
    const employees = getEmployees().filter((e) => e.id !== id);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
}

// --- Documents ---
export function getDocuments(): GeneratedDocument[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEYS.DOCUMENTS) || '[]');
    } catch {
        return [];
    }
}

export function saveDocument(doc: GeneratedDocument): void {
    const docs = getDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx >= 0) docs[idx] = doc;
    else docs.push(doc);
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
}

export function getDocumentsByEmployee(employeeId: string): GeneratedDocument[] {
    return getDocuments().filter((d) => d.employeeId === employeeId);
}

// --- Packs ---
export function getPacks(): OnboardingPack[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEYS.PACKS) || '[]');
    } catch {
        return [];
    }
}

export function savePack(pack: OnboardingPack): void {
    const packs = getPacks();
    const idx = packs.findIndex((p) => p.id === pack.id);
    if (idx >= 0) packs[idx] = pack;
    else packs.push(pack);
    localStorage.setItem(KEYS.PACKS, JSON.stringify(packs));
}

// --- Stats ---
export function getStats() {
    const docs = getDocuments();
    const packs = getPacks();
    const now = new Date();
    const thisMonth = docs.filter((d) => {
        if (!d.generatedAt) return false;
        const dt = new Date(d.generatedAt);
        return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
    });

    return {
        totalDocuments: docs.length,
        onboardingPacks: packs.length,
        documentsThisMonth: thisMonth.length,
        apiCallsUsed: docs.length + packs.length,
    };
}

// --- Utils ---
export function generateEmployeeId(): string {
    const year = new Date().getFullYear();
    const seq = String(getEmployees().length + 1).padStart(3, '0');
    return `EMP-${year}-${seq}`;
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
