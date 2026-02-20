'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Container,
    Title,
    Text,
    Card,
    Group,
    Stack,
    Button,
    Badge,
    Select,
    SimpleGrid,
    Alert,
    Progress,
    LoadingOverlay,
    Modal,
    ActionIcon,
    Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconFileText,
    IconDownload,
    IconEye,
    IconCheck,
    IconAlertCircle,
    IconBolt,
    IconRefresh,
} from '@tabler/icons-react';
import { Employee, DocumentType, GeneratedDocument, DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_ICONS } from '../../../types';
import { getEmployees, getDocumentsByEmployee, saveDocument, generateId } from '../../../lib/storage';
import { EmployeeCard } from '../../../components/EmployeeCard';

function GenerateDocumentsContent() {
    const searchParams = useSearchParams();
    const preSelectedId = searchParams.get('employeeId');

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
    const [generatingAll, setGeneratingAll] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const emps = getEmployees();
        setEmployees(emps);
        if (preSelectedId) {
            const emp = emps.find((e) => e.id === preSelectedId);
            if (emp) {
                setSelectedEmployee(emp);
                loadDocuments(emp.id);
            }
        }
    }, [preSelectedId]);

    const loadDocuments = (employeeId: string) => {
        const saved = getDocumentsByEmployee(employeeId);
        setDocuments(saved);
    };

    const handleEmployeeSelect = (id: string | null) => {
        if (!id) return;
        const emp = employees.find((e) => e.id === id);
        if (emp) {
            setSelectedEmployee(emp);
            loadDocuments(emp.id);
        }
    };

    const generateDocument = async (docType: DocumentType) => {
        if (!selectedEmployee) return;

        // Update status to generating
        const newDoc: GeneratedDocument = {
            id: generateId(),
            employeeId: selectedEmployee.id,
            employeeName: selectedEmployee.fullName,
            documentType: docType,
            status: 'generating',
        };

        setDocuments((prev) => {
            const filtered = prev.filter((d) => d.documentType !== docType);
            return [...filtered, newDoc];
        });

        try {
            const response = await fetch('/api/generate-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeData: selectedEmployee, documentType: docType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Generation failed');
            }

            const readyDoc: GeneratedDocument = {
                ...newDoc,
                status: 'ready',
                docId: data.docId,
                base64Data: data.base64Data,
                generatedAt: new Date().toISOString(),
                fileSize: data.fileSize,
            };

            setDocuments((prev) => {
                const filtered = prev.filter((d) => d.documentType !== docType);
                return [...filtered, readyDoc];
            });

            saveDocument(readyDoc);

            notifications.show({
                title: `✅ ${DOCUMENT_TYPE_LABELS[docType]}`,
                message: 'Document generated successfully via Foxit DocGen API!',
                color: 'green',
            });
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            const errorDoc: GeneratedDocument = {
                ...newDoc,
                status: 'error',
                errorMessage: errMsg,
            };

            setDocuments((prev) => {
                const filtered = prev.filter((d) => d.documentType !== docType);
                return [...filtered, errorDoc];
            });

            notifications.show({
                title: 'Generation Failed',
                message: errMsg,
                color: 'red',
            });
        }
    };

    const generateAll = async () => {
        if (!selectedEmployee) return;
        setGeneratingAll(true);
        setProgress(0);
        const types = selectedEmployee.documentsToGenerate;
        for (let i = 0; i < types.length; i++) {
            await generateDocument(types[i]);
            setProgress(Math.round(((i + 1) / types.length) * 100));
        }
        setGeneratingAll(false);
        notifications.show({
            title: '🎉 All Documents Generated!',
            message: 'Ready to create the onboarding pack.',
            color: 'green',
        });
    };

    const downloadDocument = (doc: GeneratedDocument) => {
        if (!doc.base64Data) return;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${doc.base64Data}`;
        link.download = `${doc.documentType}-${doc.employeeName.replace(' ', '_')}.pdf`;
        link.click();
    };

    const previewDocument = (doc: GeneratedDocument) => {
        setPreviewDoc(doc);
        setPreviewOpen(true);
    };

    const getDocStatus = (docType: DocumentType): GeneratedDocument | undefined =>
        documents.find((d) => d.documentType === docType);

    const allReady = selectedEmployee?.documentsToGenerate.every((t) => getDocStatus(t)?.status === 'ready');

    return (
        <Container size="xl" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">Generate Documents</Title>
                    <Text c="dimmed" size="sm">Generate HR documents using Foxit Document Generation API</Text>
                </div>
                <Badge size="lg" color="orange" variant="light" radius="md">
                    <IconBolt size={12} style={{ marginRight: 4 }} />
                    Foxit DocGen API
                </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'start' }}>
                {/* Left Panel: Employee Selector */}
                <div>
                    <Card radius="lg" p="lg" mb="md" style={{ border: '1px solid #E9EDF2' }}>
                        <Text fw={700} mb="md">Select Employee</Text>
                        <Select
                            placeholder="Search and select employee..."
                            data={employees.map((e) => ({ value: e.id, label: `${e.fullName} — ${e.designation}` }))}
                            value={selectedEmployee?.id || null}
                            onChange={handleEmployeeSelect}
                            searchable
                            nothingFoundMessage="No employees saved yet. Add one first."
                        />
                    </Card>
                    {selectedEmployee && <EmployeeCard employee={selectedEmployee} />}
                </div>

                {/* Right Panel: Document Generation */}
                <div>
                    {!selectedEmployee ? (
                        <Card radius="lg" p="xl" style={{ border: '2px dashed #E9EDF2', textAlign: 'center' }}>
                            <IconFileText size={48} color="#CCC" style={{ marginBottom: 16 }} />
                            <Text c="dimmed">Select an employee from the left panel to generate their documents</Text>
                        </Card>
                    ) : (
                        <Card radius="lg" p="lg" style={{ border: '1px solid #E9EDF2' }}>
                            <Group justify="space-between" mb="md">
                                <Text fw={700}>Documents to Generate</Text>
                                <Button
                                    size="sm"
                                    color="orange"
                                    variant="filled"
                                    leftSection={<IconBolt size={14} />}
                                    onClick={generateAll}
                                    loading={generatingAll}
                                    disabled={generatingAll}
                                >
                                    Generate All
                                </Button>
                            </Group>

                            {generatingAll && (
                                <Progress value={progress} color="orange" mb="md" animated size="sm" radius="xl" />
                            )}

                            <Stack gap="sm">
                                {selectedEmployee.documentsToGenerate.map((docType) => {
                                    const doc = getDocStatus(docType);
                                    const status = doc?.status || 'pending';
                                    return (
                                        <Card
                                            key={docType}
                                            radius="md"
                                            p="sm"
                                            style={{
                                                border: `1px solid ${status === 'ready' ? '#10B98130' : status === 'error' ? '#EF444430' : '#E9EDF2'}`,
                                                background: status === 'ready' ? '#F0FDF4' : status === 'error' ? '#FEF2F2' : 'white',
                                            }}
                                        >
                                            <Group justify="space-between">
                                                <Group gap="sm">
                                                    <span style={{ fontSize: 22 }}>{DOCUMENT_TYPE_ICONS[docType]}</span>
                                                    <div>
                                                        <Text size="sm" fw={600}>{DOCUMENT_TYPE_LABELS[docType]}</Text>
                                                        {doc?.generatedAt && (
                                                            <Text size="xs" c="dimmed">
                                                                {new Date(doc.generatedAt).toLocaleTimeString()}
                                                            </Text>
                                                        )}
                                                        {doc?.errorMessage && (
                                                            <Text size="xs" c="red">{doc.errorMessage}</Text>
                                                        )}
                                                    </div>
                                                </Group>
                                                <Group gap="xs">
                                                    <Badge
                                                        size="sm"
                                                        color={status === 'ready' ? 'green' : status === 'generating' ? 'orange' : status === 'error' ? 'red' : 'gray'}
                                                        variant="light"
                                                    >
                                                        {status === 'ready' ? '✓ Ready' : status === 'generating' ? 'Generating...' : status === 'error' ? 'Error' : 'Pending'}
                                                    </Badge>
                                                    {status !== 'generating' && (
                                                        <ActionIcon
                                                            variant="light"
                                                            color="orange"
                                                            size="sm"
                                                            onClick={() => generateDocument(docType)}
                                                            title={status === 'ready' ? 'Regenerate' : 'Generate'}
                                                        >
                                                            {status === 'ready' ? <IconRefresh size={14} /> : <IconBolt size={14} />}
                                                        </ActionIcon>
                                                    )}
                                                    {status === 'ready' && (
                                                        <>
                                                            <ActionIcon variant="light" color="blue" size="sm" onClick={() => previewDocument(doc!)} title="Preview">
                                                                <IconEye size={14} />
                                                            </ActionIcon>
                                                            <ActionIcon variant="light" color="green" size="sm" onClick={() => downloadDocument(doc!)} title="Download">
                                                                <IconDownload size={14} />
                                                            </ActionIcon>
                                                        </>
                                                    )}
                                                </Group>
                                            </Group>
                                        </Card>
                                    );
                                })}
                            </Stack>

                            {allReady && (
                                <Alert icon={<IconCheck size={14} />} color="green" mt="md" radius="md">
                                    All documents ready! You can now create an onboarding pack.
                                </Alert>
                            )}

                            {allReady && (
                                <Button
                                    fullWidth
                                    color="orange"
                                    mt="md"
                                    leftSection={<IconFileText size={16} />}
                                    onClick={() => window.location.href = `/app/packs?employeeId=${selectedEmployee.id}`}
                                >
                                    Create Onboarding Pack →
                                </Button>
                            )}
                        </Card>
                    )}
                </div>
            </SimpleGrid>

            {/* PDF Preview Modal */}
            <Modal
                opened={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={previewDoc ? DOCUMENT_TYPE_LABELS[previewDoc.documentType] : 'Preview'}
                size="xl"
                padding="sm"
            >
                {previewDoc?.base64Data && (
                    <iframe
                        src={`data:application/pdf;base64,${previewDoc.base64Data}`}
                        style={{ width: '100%', height: '70vh', border: 'none', borderRadius: 8 }}
                        title="PDF Preview"
                    />
                )}
                <Group justify="flex-end" mt="sm">
                    <Button
                        color="orange"
                        leftSection={<IconDownload size={14} />}
                        onClick={() => previewDoc && downloadDocument(previewDoc)}
                    >
                        Download
                    </Button>
                </Group>
            </Modal>
        </Container>
    );
}

export default function GenerateDocumentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GenerateDocumentsContent />
        </Suspense>
    );
}
