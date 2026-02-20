'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Container,
    Title,
    Text,
    Stepper,
    Card,
    Select,
    Group,
    Stack,
    Button,
    Checkbox,
    Badge,
    Alert,
    Progress,
    Timeline,
    Divider,
    SimpleGrid,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconUser,
    IconFileText,
    IconSettings,
    IconPackage,
    IconCheck,
    IconDownload,
    IconBolt,
    IconShieldLock,
    IconMinimize,
    IconLayersLinked,
    IconDroplet,
    IconHash,
} from '@tabler/icons-react';
import { Employee, DocumentType, PackOptions, DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_ICONS } from '../../../types';
import { getEmployees, getDocumentsByEmployee, savePack, generateId } from '../../../lib/storage';
import { EmployeeCard } from '../../../components/EmployeeCard';

function OnboardingPackContent() {
    const searchParams = useSearchParams();
    const preSelectedId = searchParams.get('employeeId');

    const [active, setActive] = useState(0);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedDocTypes, setSelectedDocTypes] = useState<DocumentType[]>([]);
    const [packOptions, setPackOptions] = useState<PackOptions>({
        merge: true,
        compress: true,
        passwordProtect: true,
        convertToPDFA: false,
        addWatermark: true,
        addPageNumbers: true,
        watermarkText: 'Confidential',
    });
    const [processing, setProcessing] = useState(false);
    const [progressSteps, setProgressSteps] = useState<{ step: string; done: boolean }[]>([]);
    const [progress, setProgress] = useState(0);
    const [resultBase64, setResultBase64] = useState<string | null>(null);

    useEffect(() => {
        const emps = getEmployees();
        setEmployees(emps);
        if (preSelectedId) {
            const emp = emps.find((e) => e.id === preSelectedId);
            if (emp) {
                setSelectedEmployee(emp);
                const readyDocs = getDocumentsByEmployee(emp.id).filter((d) => d.status === 'ready');
                setSelectedDocTypes(readyDocs.map((d) => d.documentType));
                if (readyDocs.length > 0) setActive(1);
            }
        }
    }, [preSelectedId]);

    const handleEmployeeSelect = (id: string | null) => {
        if (!id) return;
        const emp = employees.find((e) => e.id === id);
        if (emp) {
            setSelectedEmployee(emp);
            const readyDocs = getDocumentsByEmployee(emp.id).filter((d) => d.status === 'ready');
            setSelectedDocTypes(readyDocs.map((d) => d.documentType));
        }
    };

    const createPack = async () => {
        if (!selectedEmployee || !selectedDocTypes.length) return;
        setProcessing(true);
        setProgress(0);
        setProgressSteps([]);

        const steps = [
            ...selectedDocTypes.map((t) => `Generating ${DOCUMENT_TYPE_LABELS[t]}...`),
            packOptions.merge ? 'Merging documents...' : null,
            packOptions.compress ? 'Compressing PDF...' : null,
            packOptions.passwordProtect ? 'Protecting with password...' : null,
            packOptions.addWatermark ? 'Adding watermark...' : null,
            packOptions.addPageNumbers ? 'Adding page numbers...' : null,
            'Finalizing pack...',
        ].filter(Boolean) as string[];

        const addStep = (step: string, done = false) => {
            setProgressSteps((prev) => [...prev, { step, done }]);
        };

        try {
            const response = await fetch('/api/create-pack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employee: selectedEmployee,
                    documentTypes: selectedDocTypes,
                    options: packOptions,
                }),
            });

            // Simulate step-by-step progress
            for (let i = 0; i < steps.length; i++) {
                addStep(steps[i]);
                await new Promise((r) => setTimeout(r, 600));
                setProgressSteps((prev) => prev.map((s, idx) => idx === prev.length - 1 ? { ...s, done: true } : s));
                setProgress(Math.round(((i + 1) / steps.length) * 100));
            }

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Pack creation failed');

            setResultBase64(data.base64Data);

            savePack({
                id: generateId(),
                employeeId: selectedEmployee.id,
                employeeName: selectedEmployee.fullName,
                documentIds: selectedDocTypes,
                options: packOptions,
                status: 'ready',
                resultBase64: data.base64Data,
                createdAt: new Date().toISOString(),
            });

            setActive(4);
            notifications.show({
                title: '🎉 Onboarding Pack Ready!',
                message: `Complete pack for ${selectedEmployee.fullName} is ready to download.`,
                color: 'green',
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create pack';
            notifications.show({ title: 'Error', message: msg, color: 'red' });
        } finally {
            setProcessing(false);
        }
    };

    const downloadPack = () => {
        if (!resultBase64 || !selectedEmployee) return;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${resultBase64}`;
        link.download = `onboarding-pack-${selectedEmployee.employeeId}.pdf`;
        link.click();
    };

    const nextStep = () => setActive((a) => Math.min(a + 1, 3));
    const prevStep = () => setActive((a) => Math.max(a - 1, 0));

    const renderStep = () => {
        switch (active) {
            case 0:
                return (
                    <Stack gap="md">
                        <Select
                            label="Select Employee"
                            placeholder="Search employee..."
                            data={employees.map((e) => ({ value: e.id, label: `${e.fullName} — ${e.designation}` }))}
                            value={selectedEmployee?.id || null}
                            onChange={handleEmployeeSelect}
                            searchable
                            nothingFoundMessage="No employees yet"
                            size="md"
                        />
                        {selectedEmployee && <EmployeeCard employee={selectedEmployee} />}
                        <Group justify="flex-end">
                            <Button color="orange" disabled={!selectedEmployee} onClick={nextStep} rightSection={<IconCheck size={14} />}>
                                Continue
                            </Button>
                        </Group>
                    </Stack>
                );

            case 1:
                const allDocs = selectedEmployee?.documentsToGenerate || [];
                const generatedDocs = selectedEmployee ? getDocumentsByEmployee(selectedEmployee.id) : [];
                return (
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">Select documents to include in the onboarding pack:</Text>
                        <Checkbox.Group
                            value={selectedDocTypes}
                            onChange={(v) => setSelectedDocTypes(v as DocumentType[])}
                        >
                            <Stack gap="sm">
                                {allDocs.map((docType) => {
                                    const existing = generatedDocs.find((d) => d.documentType === docType);
                                    return (
                                        <Card key={docType} radius="md" p="sm" style={{ border: '1px solid #E9EDF2' }}>
                                            <Group justify="space-between">
                                                <Checkbox
                                                    value={docType}
                                                    label={
                                                        <Group gap="xs">
                                                            <span>{DOCUMENT_TYPE_ICONS[docType]}</span>
                                                            <Text size="sm" fw={500}>{DOCUMENT_TYPE_LABELS[docType]}</Text>
                                                        </Group>
                                                    }
                                                />
                                                <Badge
                                                    size="xs"
                                                    color={existing?.status === 'ready' ? 'green' : 'gray'}
                                                    variant="light"
                                                >
                                                    {existing?.status === 'ready' ? '✓ Generated' : 'Will generate'}
                                                </Badge>
                                            </Group>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        </Checkbox.Group>
                        <Group justify="space-between">
                            <Button variant="default" onClick={prevStep}>Back</Button>
                            <Button color="orange" disabled={!selectedDocTypes.length} onClick={nextStep}>Continue</Button>
                        </Group>
                    </Stack>
                );

            case 2:
                return (
                    <Stack gap="md">
                        <Text size="sm" c="dimmed">Choose PDF Services operations to apply:</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                            {[
                                { key: 'merge', label: 'Merge all into one PDF', icon: <IconLayersLinked size={18} />, desc: 'Combine all selected documents' },
                                { key: 'compress', label: 'Compress for email delivery', icon: <IconMinimize size={18} />, desc: 'Reduce file size' },
                                { key: 'passwordProtect', label: 'Password protect', icon: <IconShieldLock size={18} />, desc: `Password = DOB (DDMMYYYY)` },
                                { key: 'convertToPDFA', label: 'Convert to PDF/A', icon: <IconFileText size={18} />, desc: 'Archive format' },
                                { key: 'addWatermark', label: 'Add watermark', icon: <IconDroplet size={18} />, desc: '"Confidential - Company"' },
                                { key: 'addPageNumbers', label: 'Add page numbers', icon: <IconHash size={18} />, desc: 'Auto-number pages' },
                            ].map(({ key, label, icon, desc }) => (
                                <Card
                                    key={key}
                                    radius="md"
                                    p="md"
                                    style={{
                                        border: `2px solid ${packOptions[key as keyof PackOptions] ? '#E8590C40' : '#E9EDF2'}`,
                                        background: packOptions[key as keyof PackOptions] ? '#FFF5F0' : 'white',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setPackOptions((o) => ({ ...o, [key]: !o[key as keyof PackOptions] }))}
                                >
                                    <Group gap="sm">
                                        <Checkbox
                                            checked={!!packOptions[key as keyof PackOptions]}
                                            onChange={() => setPackOptions((o) => ({ ...o, [key]: !o[key as keyof PackOptions] }))}
                                            color="orange"
                                        />
                                        <div style={{ color: '#E8590C' }}>{icon}</div>
                                        <div>
                                            <Text size="sm" fw={500}>{label}</Text>
                                            <Text size="xs" c="dimmed">{desc}</Text>
                                        </div>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                        <Group justify="space-between">
                            <Button variant="default" onClick={prevStep}>Back</Button>
                            <Button color="orange" onClick={nextStep}>Review & Create</Button>
                        </Group>
                    </Stack>
                );

            case 3:
                return (
                    <Stack gap="md">
                        <Text fw={600}>Summary</Text>
                        <Card radius="md" p="md" style={{ border: '1px solid #E9EDF2' }}>
                            <Stack gap="xs">
                                <Group><Text size="sm" fw={500}>Employee:</Text><Text size="sm">{selectedEmployee?.fullName}</Text></Group>
                                <Group><Text size="sm" fw={500}>Documents:</Text><Text size="sm">{selectedDocTypes.map((t) => DOCUMENT_TYPE_LABELS[t]).join(', ')}</Text></Group>
                                <Group>
                                    <Text size="sm" fw={500}>Operations:</Text>
                                    <Group gap="xs" wrap="wrap">
                                        {Object.entries(packOptions)
                                            .filter(([, v]) => v === true)
                                            .map(([k]) => (
                                                <Badge key={k} size="xs" color="orange" variant="light">{k}</Badge>
                                            ))}
                                    </Group>
                                </Group>
                            </Stack>
                        </Card>

                        {processing && (
                            <Stack gap="xs">
                                <Progress value={progress} color="orange" animated size="md" radius="xl" />
                                <Text size="xs" c="dimmed" ta="center">{progress}% complete</Text>
                                <Stack gap={4}>
                                    {progressSteps.map((s, i) => (
                                        <Group key={i} gap="xs">
                                            {s.done ? <IconCheck size={14} color="green" /> : <IconBolt size={14} color="orange" />}
                                            <Text size="xs" c={s.done ? 'dimmed' : 'default'}>{s.step}</Text>
                                        </Group>
                                    ))}
                                </Stack>
                            </Stack>
                        )}

                        <Group justify="space-between">
                            <Button variant="default" onClick={prevStep} disabled={processing}>Back</Button>
                            <Button
                                color="orange"
                                size="md"
                                loading={processing}
                                leftSection={<IconBolt size={16} />}
                                onClick={createPack}
                                disabled={processing}
                            >
                                Create Onboarding Pack
                            </Button>
                        </Group>
                    </Stack>
                );

            case 4:
                return (
                    <Stack align="center" gap="md" py="xl">
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconCheck size={40} color="white" />
                        </div>
                        <Title order={3} fw={800} c="#1A1A2E">Onboarding Pack Ready! 🎉</Title>
                        <Text c="dimmed" ta="center">
                            Complete pack for <strong>{selectedEmployee?.fullName}</strong> has been generated using Foxit APIs.
                        </Text>
                        <Button
                            size="lg"
                            color="orange"
                            leftSection={<IconDownload size={18} />}
                            onClick={downloadPack}
                            radius="xl"
                        >
                            Download Onboarding Pack
                        </Button>
                    </Stack>
                );

            default:
                return null;
        }
    };

    return (
        <Container size="md" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">Onboarding Pack</Title>
                    <Text c="dimmed" size="sm">Create complete document bundles with Foxit PDF Services</Text>
                </div>
                <Badge size="lg" color="purple" variant="light">4-step wizard</Badge>
            </Group>

            <Card radius="xl" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                <Stepper active={active} color="orange" size="sm" mb="xl">
                    <Stepper.Step label="Employee" icon={<IconUser size={16} />} />
                    <Stepper.Step label="Documents" icon={<IconFileText size={16} />} />
                    <Stepper.Step label="Operations" icon={<IconSettings size={16} />} />
                    <Stepper.Step label="Create Pack" icon={<IconPackage size={16} />} />
                </Stepper>
                {renderStep()}
            </Card>
        </Container>
    );
}

export default function OnboardingPackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingPackContent />
        </Suspense>
    );
}
