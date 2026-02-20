'use client';
import { useState, useCallback } from 'react';
import {
    Container,
    Title,
    Text,
    Card,
    Group,
    Button,
    Table,
    Badge,
    Progress,
    Stack,
    Alert,
    Anchor,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import {
    IconUpload,
    IconFile,
    IconX,
    IconDownload,
    IconBolt,
    IconUsers,
    IconAlertCircle,
} from '@tabler/icons-react';
import { Employee, DocumentType } from '../../../types';
import { saveEmployee, generateEmployeeId, generateId } from '../../../lib/storage';
import dayjs from 'dayjs';

interface CSVRow {
    name: string;
    email: string;
    phone: string;
    dob: string;
    designation: string;
    department: string;
    employment_type: string;
    start_date: string;
    ctc: string;
    reporting_manager: string;
    [key: string]: string;
}

interface ParsedEmployee {
    row: CSVRow;
    valid: boolean;
    errors: string[];
    employee?: Employee;
}

function parseCSV(text: string): CSVRow[] {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map((line) => {
        const values = line.split(',');
        const row: CSVRow = {} as CSVRow;
        headers.forEach((h, i) => { row[h] = (values[i] || '').trim(); });
        return row;
    });
}

function validateRow(row: CSVRow): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!row.name) errors.push('Name required');
    if (!row.email || !/^\S+@\S+$/.test(row.email)) errors.push('Valid email required');
    if (!row.designation) errors.push('Designation required');
    if (!row.start_date) errors.push('Start date required');
    if (!row.ctc) errors.push('CTC required');
    return { valid: errors.length === 0, errors };
}

const SAMPLE_CSV = `name,email,phone,dob,designation,department,employment_type,start_date,ctc,reporting_manager
Arjun Sharma,arjun.sharma@techcorp.com,+91 98765 43210,1995-06-15,Senior Engineer,Engineering,Full-Time,2026-03-01,1500000,Priya Mehta
Rohan Gupta,rohan.gupta@techcorp.com,+91 87654 32109,1998-03-22,Marketing Manager,Marketing,Full-Time,2026-03-15,900000,Sneha Patel
Priya Mehta,priya.mehta@techcorp.com,+91 76543 21098,1992-11-10,HR Lead,HR,Full-Time,2026-02-28,1200000,Kiran Kumar`;

export default function BulkUploadPage() {
    const [parsedRows, setParsedRows] = useState<ParsedEmployee[]>([]);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generatedCount, setGeneratedCount] = useState(0);
    const [statuses, setStatuses] = useState<Record<string, 'pending' | 'generating' | 'done' | 'error'>>({});

    const handleDrop = useCallback((files: File[]) => {
        const file = files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const rows = parseCSV(text);
            const parsed: ParsedEmployee[] = rows.map((row) => {
                const { valid, errors } = validateRow(row);
                let employee: Employee | undefined;
                if (valid) {
                    const ctc = parseInt(row.ctc) || 0;
                    const basic = Math.round(ctc * 0.4 / 12);
                    employee = {
                        id: generateId(),
                        fullName: row.name,
                        email: row.email,
                        phone: row.phone || '',
                        dob: row.dob || '',
                        address: '',
                        employeeId: generateEmployeeId(),
                        designation: row.designation,
                        department: row.department as Employee['department'] || 'Engineering',
                        employmentType: (row.employment_type || 'Full-Time') as Employee['employmentType'],
                        startDate: row.start_date,
                        probationPeriod: '3 months',
                        reportingManager: row.reporting_manager || '',
                        workLocation: 'Head Office',
                        annualCTC: ctc,
                        basicSalary: basic,
                        hra: Math.round(basic * 0.2),
                        specialAllowance: 0,
                        pfContribution: 1800,
                        createdAt: new Date().toISOString(),
                        documentsToGenerate: ['offer-letter', 'nda', 'appointment-letter'] as DocumentType[],
                    };
                }
                return { row, valid, errors, employee };
            });
            setParsedRows(parsed);
            notifications.show({
                title: `📋 CSV Parsed`,
                message: `${parsed.length} rows loaded, ${parsed.filter((p) => p.valid).length} valid`,
                color: 'blue',
            });
        };
        reader.readAsText(file);
    }, []);

    const generateAll = async () => {
        const validRows = parsedRows.filter((r) => r.valid && r.employee);
        if (!validRows.length) return;

        setGenerating(true);
        setProgress(0);
        setGeneratedCount(0);

        // Save all employees first
        for (const { employee } of validRows) {
            if (employee) saveEmployee(employee);
        }

        for (let i = 0; i < validRows.length; i++) {
            const { employee } = validRows[i];
            if (!employee) continue;

            setStatuses((prev) => ({ ...prev, [employee.id]: 'generating' }));

            try {
                await fetch('/api/bulk-generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ employees: [employee] }),
                });
                setStatuses((prev) => ({ ...prev, [employee.id]: 'done' }));
                setGeneratedCount((c) => c + 1);
            } catch {
                setStatuses((prev) => ({ ...prev, [employee.id]: 'error' }));
            }

            setProgress(Math.round(((i + 1) / validRows.length) * 100));
        }

        setGenerating(false);
        notifications.show({
            title: '✅ Bulk Generation Complete',
            message: `Documents generated for ${generatedCount} employees`,
            color: 'green',
        });
    };

    const downloadSample = () => {
        const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hrflow-sample-employees.csv';
        a.click();
    };

    return (
        <Container size="xl" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">Bulk Upload</Title>
                    <Text c="dimmed" size="sm">Upload CSV to generate documents for multiple employees at once</Text>
                </div>
                <Button
                    variant="outline"
                    color="orange"
                    leftSection={<IconDownload size={16} />}
                    onClick={downloadSample}
                >
                    Download Sample CSV
                </Button>
            </Group>

            {/* Dropzone */}
            <Card radius="lg" p="xl" mb="lg" style={{ border: '1px solid #E9EDF2' }}>
                <Dropzone
                    onDrop={handleDrop}
                    accept={[MIME_TYPES.csv]}
                    maxSize={5 * 1024 * 1024}
                    multiple={false}
                    styles={{
                        root: {
                            border: '2px dashed #E8590C40',
                            borderRadius: 16,
                            background: '#FFF5F030',
                            padding: '32px',
                            cursor: 'pointer',
                        },
                    }}
                >
                    <Stack align="center" gap="md">
                        <Dropzone.Accept>
                            <IconUpload size={50} color="#E8590C" />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX size={50} color="red" />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconFile size={50} color="#E8590C" />
                        </Dropzone.Idle>
                        <div style={{ textAlign: 'center' }}>
                            <Text size="xl" fw={700}>Drop CSV file here</Text>
                            <Text c="dimmed" size="sm" mt={4}>CSV with employee data — or click to browse</Text>
                        </div>
                    </Stack>
                </Dropzone>
            </Card>

            {/* CSV Columns Reference */}
            <Alert icon={<IconUsers size={14} />} color="blue" variant="light" mb="lg" radius="md">
                <Text size="sm" fw={600}>Required CSV columns:</Text>
                <Text size="xs" ff="mono" mt={4} c="dimmed">
                    name, email, phone, dob (YYYY-MM-DD), designation, department, employment_type, start_date (YYYY-MM-DD), ctc, reporting_manager
                </Text>
            </Alert>

            {/* Preview Table */}
            {parsedRows.length > 0 && (
                <Card radius="lg" p="lg" mb="lg" style={{ border: '1px solid #E9EDF2' }}>
                    <Group justify="space-between" mb="md">
                        <Text fw={700}>Preview ({parsedRows.length} rows)</Text>
                        <Group gap="xs">
                            <Badge color="green" variant="light">{parsedRows.filter((r) => r.valid).length} valid</Badge>
                            <Badge color="red" variant="light">{parsedRows.filter((r) => !r.valid).length} errors</Badge>
                        </Group>
                    </Group>
                    <Table striped highlightOnHover style={{ overflowX: 'auto' }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Designation</Table.Th>
                                <Table.Th>Department</Table.Th>
                                <Table.Th>CTC</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {parsedRows.map((row, i) => (
                                <Table.Tr
                                    key={i}
                                    style={{ background: !row.valid ? '#FEF2F2' : undefined }}
                                >
                                    <Table.Td><Text size="sm" fw={500}>{row.row.name || '—'}</Text></Table.Td>
                                    <Table.Td><Text size="sm">{row.row.email || '—'}</Text></Table.Td>
                                    <Table.Td><Text size="sm">{row.row.designation || '—'}</Text></Table.Td>
                                    <Table.Td><Text size="sm">{row.row.department || '—'}</Text></Table.Td>
                                    <Table.Td><Text size="sm">₹{parseInt(row.row.ctc || '0').toLocaleString('en-IN')}</Text></Table.Td>
                                    <Table.Td>
                                        {row.valid ? (
                                            <Badge
                                                size="xs"
                                                color={
                                                    statuses[row.employee?.id || ''] === 'done' ? 'green' :
                                                        statuses[row.employee?.id || ''] === 'generating' ? 'orange' :
                                                            statuses[row.employee?.id || ''] === 'error' ? 'red' : 'gray'
                                                }
                                                variant="light"
                                            >
                                                {statuses[row.employee?.id || ''] || '✓ Valid'}
                                            </Badge>
                                        ) : (
                                            <Badge size="xs" color="red" variant="light" title={row.errors.join(', ')}>
                                                ⚠ {row.errors[0]}
                                            </Badge>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>
            )}

            {/* Generate Button */}
            {parsedRows.length > 0 && (
                <Card radius="lg" p="lg" style={{ border: '1px solid #E9EDF2' }}>
                    {generating && (
                        <Stack mb="md" gap="xs">
                            <Progress value={progress} color="orange" animated size="md" radius="xl" />
                            <Text size="xs" c="dimmed" ta="center">
                                Generating documents... {progress}% ({generatedCount}/{parsedRows.filter((r) => r.valid).length})
                            </Text>
                        </Stack>
                    )}
                    <Group justify="flex-end">
                        <Button
                            size="md"
                            color="orange"
                            leftSection={<IconBolt size={16} />}
                            loading={generating}
                            onClick={generateAll}
                            disabled={!parsedRows.some((r) => r.valid) || generating}
                        >
                            Generate All Documents ({parsedRows.filter((r) => r.valid).length} employees)
                        </Button>
                    </Group>
                </Card>
            )}
        </Container>
    );
}
