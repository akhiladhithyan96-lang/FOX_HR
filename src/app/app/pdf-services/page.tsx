'use client';
import { useState, useRef, useCallback } from 'react';
import {
    Container, Title, Text, Card, Group, Stack, Button, Badge,
    Tabs, FileInput, Progress, Alert, TextInput, Select,
    SimpleGrid, ThemeIcon, Divider, ActionIcon, Tooltip,
    NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconFileZip, IconLayersLinked, IconScissors, IconShieldLock,
    IconDroplet, IconHash, IconFileTypePdf, IconFileTypeDocx,
    IconFileTypeXls, IconFileTypePpt, IconPhoto, IconHtml,
    IconCheck, IconDownload, IconUpload, IconX, IconAlertCircle,
    IconSparkles, IconEye, IconGitCompare, IconReplace, IconAlignLeft,
} from '@tabler/icons-react';

// ── Types ──────────────────────────────────────────────────────────────
interface Operation {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    category: 'manage' | 'convert-from' | 'convert-to';
    needsTwoFiles?: boolean;
    extraFields?: 'password' | 'watermarkText' | 'splitAt';
    outputExt?: string;
}

const OPERATIONS: Operation[] = [
    // Manage
    { id: 'compress', label: 'Compress', description: 'Reduce PDF file size', icon: <IconFileZip size={22} />, color: '#E8590C', category: 'manage', outputExt: 'pdf' },
    { id: 'merge', label: 'Merge PDFs', description: 'Combine two PDFs into one', icon: <IconLayersLinked size={22} />, color: '#7950F2', category: 'manage', needsTwoFiles: true, outputExt: 'pdf' },
    { id: 'split', label: 'Split PDF', description: 'Split at specified page', icon: <IconScissors size={22} />, color: '#2F9E44', category: 'manage', extraFields: 'splitAt', outputExt: 'pdf' },
    { id: 'protect', label: 'Password Protect', description: 'Encrypt PDF with a password', icon: <IconShieldLock size={22} />, color: '#1971C2', category: 'manage', extraFields: 'password', outputExt: 'pdf' },
    { id: 'watermark', label: 'Watermark', description: 'Add text watermark to PDF', icon: <IconDroplet size={22} />, color: '#0C8599', category: 'manage', extraFields: 'watermarkText', outputExt: 'pdf' },
    { id: 'pagenumber', label: 'Page Numbers', description: 'Add page numbers to PDF', icon: <IconHash size={22} />, color: '#862E9C', category: 'manage', outputExt: 'pdf' },
    { id: 'flatten', label: 'Flatten', description: 'Flatten form fields & annotations', icon: <IconAlignLeft size={22} />, color: '#C92A2A', category: 'manage', outputExt: 'pdf' },
    { id: 'linearize', label: 'Linearize', description: 'Optimize for web viewing', icon: <IconSparkles size={22} />, color: '#F59F00', category: 'manage', outputExt: 'pdf' },
    { id: 'pdfa', label: 'Convert to PDF/A', description: 'Archive-ready PDF/A-1b format', icon: <IconFileTypePdf size={22} />, color: '#D9480F', category: 'manage', outputExt: 'pdf' },
    { id: 'compare', label: 'Compare PDFs', description: 'Compare two PDF documents', icon: <IconGitCompare size={22} />, color: '#087F5B', category: 'manage', needsTwoFiles: true, outputExt: 'pdf' },
    // Convert FROM PDF
    { id: 'pdf-to-word', label: 'PDF → Word', description: 'Convert PDF to editable DOCX', icon: <IconFileTypeDocx size={22} />, color: '#1971C2', category: 'convert-from', outputExt: 'docx' },
    { id: 'pdf-to-excel', label: 'PDF → Excel', description: 'Extract tables into XLSX', icon: <IconFileTypeXls size={22} />, color: '#2F9E44', category: 'convert-from', outputExt: 'xlsx' },
    { id: 'pdf-to-ppt', label: 'PDF → PPT', description: 'Convert PDF to PowerPoint', icon: <IconFileTypePpt size={22} />, color: '#E8590C', category: 'convert-from', outputExt: 'pptx' },
    { id: 'pdf-to-image', label: 'PDF → Image', description: 'Convert pages to PNG images', icon: <IconPhoto size={22} />, color: '#862E9C', category: 'convert-from', outputExt: 'png' },
    { id: 'pdf-to-html', label: 'PDF → HTML', description: 'Convert PDF to HTML', icon: <IconHtml size={22} />, color: '#087F5B', category: 'convert-from', outputExt: 'html' },
    // Convert TO PDF
    { id: 'word-to-pdf', label: 'Word → PDF', description: 'Convert DOCX to PDF', icon: <IconReplace size={22} />, color: '#1971C2', category: 'convert-to', outputExt: 'pdf' },
    { id: 'excel-to-pdf', label: 'Excel → PDF', description: 'Convert XLSX to PDF', icon: <IconReplace size={22} />, color: '#2F9E44', category: 'convert-to', outputExt: 'pdf' },
];

const MIME_MAP: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    png: 'image/png',
    html: 'text/html',
};

// ── OperationCard ──────────────────────────────────────────────────────
function OperationCard({ op, selected, onClick }: { op: Operation; selected: boolean; onClick: () => void }) {
    return (
        <Card
            radius="lg" p="md"
            style={{
                border: `2px solid ${selected ? op.color : '#E9EDF2'}`,
                background: selected ? `${op.color}12` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
            }}
            onClick={onClick}
        >
            <Group gap="sm" align="flex-start">
                <ThemeIcon size={44} radius="md" style={{ background: `${op.color}18`, color: op.color, flexShrink: 0 }}>
                    {op.icon}
                </ThemeIcon>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <Group gap={6} wrap="nowrap">
                        <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>{op.label}</Text>
                        {selected && (
                            <ThemeIcon size={18} radius="xl" color="green" style={{ flexShrink: 0 }}>
                                <IconCheck size={12} />
                            </ThemeIcon>
                        )}
                    </Group>
                    <Text size="xs" c="dimmed" mt={2} lineClamp={2}>{op.description}</Text>
                </div>
            </Group>
        </Card>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function PDFServicesPage() {
    const [activeTab, setActiveTab] = useState<string>('manage');
    const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [splitAt, setSplitAt] = useState<number>(1);

    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<{ base64: string; size: number; ext: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const catOps = OPERATIONS.filter(o => o.category === activeTab);

    const reset = () => {
        setFile1(null); setFile2(null); setResult(null); setError(null);
        setPassword(''); setWatermarkText('CONFIDENTIAL'); setSplitAt(1);
        setProcessing(false); setProgress(0);
    };

    const selectOp = (op: Operation) => {
        setSelectedOp(op);
        reset();
    };

    const handleTabChange = (v: string | null) => {
        if (!v) return;
        setActiveTab(v);
        setSelectedOp(null);
        reset();
    };

    const runOperation = async () => {
        if (!selectedOp || !file1) return;
        if (selectedOp.needsTwoFiles && !file2) {
            notifications.show({ title: 'Missing file', message: 'Please upload both files', color: 'red' });
            return;
        }

        setProcessing(true); setProgress(0); setResult(null); setError(null);

        // Animate progress
        const interval = setInterval(() => setProgress(p => Math.min(p + 2, 88)), 600);

        try {
            const form = new FormData();
            form.append('operation', selectedOp.id);
            form.append('file', file1);
            if (file2 && selectedOp.needsTwoFiles) form.append('file2', file2);
            if (selectedOp.extraFields === 'password') form.append('password', password || 'password123');
            if (selectedOp.extraFields === 'watermarkText') form.append('text', watermarkText);
            if (selectedOp.extraFields === 'splitAt') form.append('splitAt', String(splitAt));

            const res = await fetch('/api/pdf-services', { method: 'POST', body: form });
            const data = await res.json();

            if (!res.ok || !data.success) throw new Error(data.error || 'Operation failed');

            clearInterval(interval);
            setProgress(100);
            setResult({ base64: data.base64, size: data.size, ext: selectedOp.outputExt || 'pdf' });
            notifications.show({ title: '✅ Done!', message: `${selectedOp.label} completed successfully`, color: 'green' });
        } catch (err: unknown) {
            clearInterval(interval);
            const msg = err instanceof Error ? err.message : 'Operation failed';
            setError(msg);
            notifications.show({ title: 'Error', message: msg, color: 'red' });
        } finally {
            setProcessing(false);
        }
    };

    const downloadResult = () => {
        if (!result) return;
        const ext = result.ext;
        const mime = MIME_MAP[ext] || 'application/octet-stream';
        const filename = `${selectedOp?.id || 'result'}-${Date.now()}.${ext}`;
        const link = document.createElement('a');
        link.href = `data:${mime};base64,${result.base64}`;
        link.download = filename;
        link.click();
    };

    const tabCategories = [
        { value: 'manage', label: '⚙️ Manage & Optimize', count: OPERATIONS.filter(o => o.category === 'manage').length },
        { value: 'convert-from', label: '📤 Convert from PDF', count: OPERATIONS.filter(o => o.category === 'convert-from').length },
        { value: 'convert-to', label: '📥 Convert to PDF', count: OPERATIONS.filter(o => o.category === 'convert-to').length },
    ];

    return (
        <Container size="xl" py="lg">
            {/* Header */}
            <Group justify="space-between" mb="xl" align="flex-start">
                <div>
                    <Group gap="sm" mb={4}>
                        <ThemeIcon size={42} radius="xl" style={{ background: 'linear-gradient(135deg, #E8590C, #F76707)' }}>
                            <IconFileTypePdf size={24} color="white" />
                        </ThemeIcon>
                        <div>
                            <Title order={2} fw={800} c="#1A1A2E">PDF Services</Title>
                            <Text c="dimmed" size="sm">Powered by Foxit PDF Services API</Text>
                        </div>
                    </Group>
                </div>
                <Group gap="xs">
                    {['Compress', 'Merge', 'Convert', 'Protect'].map(tag => (
                        <Badge key={tag} size="sm" variant="light" color="orange">{tag}</Badge>
                    ))}
                </Group>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                {/* LEFT: Operation picker */}
                <div style={{ gridColumn: 'span 1' }}>
                    <Card radius="xl" p="md" style={{ border: '1px solid #E9EDF2', position: 'sticky', top: 20 }}>
                        <Text fw={700} size="sm" mb="md" c="#1A1A2E">Select Operation</Text>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tabs.List mb="sm" style={{ flexWrap: 'wrap', gap: 4 }}>
                                {tabCategories.map(t => (
                                    <Tabs.Tab key={t.value} value={t.value} style={{ fontSize: 11, padding: '6px 10px' }}>
                                        {t.label} <Badge size="xs" ml={4} variant="light" color="orange">{t.count}</Badge>
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs>
                        <Stack gap="xs">
                            {catOps.map(op => (
                                <OperationCard
                                    key={op.id}
                                    op={op}
                                    selected={selectedOp?.id === op.id}
                                    onClick={() => selectOp(op)}
                                />
                            ))}
                        </Stack>
                    </Card>
                </div>

                {/* RIGHT: File upload + action */}
                <div style={{ gridColumn: 'span 2' }}>
                    {!selectedOp ? (
                        <Card radius="xl" p="xl" style={{ border: '2px dashed #E9EDF2', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Stack align="center" gap="md">
                                <ThemeIcon size={80} radius="xl" style={{ background: 'linear-gradient(135deg, #FFF3EC, #FFE5D4)' }}>
                                    <IconFileTypePdf size={40} color="#E8590C" />
                                </ThemeIcon>
                                <Title order={3} fw={700} c="#1A1A2E">Select an Operation</Title>
                                <Text c="dimmed" ta="center" maw={320}>
                                    Choose from {OPERATIONS.length} PDF operations — manage, optimize, and convert your documents instantly.
                                </Text>
                            </Stack>
                        </Card>
                    ) : (
                        <Card radius="xl" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                            {/* Operation header */}
                            <Group mb="xl" justify="space-between">
                                <Group gap="md">
                                    <ThemeIcon size={52} radius="xl" style={{ background: `${selectedOp.color}15`, color: selectedOp.color }}>
                                        {selectedOp.icon}
                                    </ThemeIcon>
                                    <div>
                                        <Title order={3} fw={800} c="#1A1A2E">{selectedOp.label}</Title>
                                        <Text c="dimmed" size="sm">{selectedOp.description}</Text>
                                    </div>
                                </Group>
                                <ActionIcon variant="subtle" color="gray" onClick={() => { setSelectedOp(null); reset(); }}>
                                    <IconX size={18} />
                                </ActionIcon>
                            </Group>

                            <Stack gap="lg">
                                {/* File 1 */}
                                <div>
                                    <Text size="sm" fw={600} mb="xs">
                                        {selectedOp.needsTwoFiles ? 'First PDF File' : 'Upload File'}
                                    </Text>
                                    <FileInput
                                        placeholder={
                                            selectedOp.category === 'convert-to'
                                                ? `Upload ${selectedOp.id.split('-')[0].toUpperCase()} file`
                                                : 'Upload PDF file'
                                        }
                                        leftSection={<IconUpload size={16} />}
                                        value={file1}
                                        onChange={setFile1}
                                        accept={selectedOp.category === 'convert-to'
                                            ? selectedOp.id.includes('word') ? '.doc,.docx' : '.xls,.xlsx'
                                            : '.pdf'
                                        }
                                        clearable
                                        radius="md"
                                        size="md"
                                    />
                                    {file1 && (
                                        <Group gap="xs" mt="xs">
                                            <Badge size="xs" color="green" variant="light">✓ {file1.name}</Badge>
                                            <Text size="xs" c="dimmed">{(file1.size / 1024).toFixed(1)} KB</Text>
                                        </Group>
                                    )}
                                </div>

                                {/* File 2 (merge, compare) */}
                                {selectedOp.needsTwoFiles && (
                                    <div>
                                        <Text size="sm" fw={600} mb="xs">Second PDF File</Text>
                                        <FileInput
                                            placeholder="Upload second PDF file"
                                            leftSection={<IconUpload size={16} />}
                                            value={file2}
                                            onChange={setFile2}
                                            accept=".pdf"
                                            clearable
                                            radius="md"
                                            size="md"
                                        />
                                        {file2 && (
                                            <Group gap="xs" mt="xs">
                                                <Badge size="xs" color="blue" variant="light">✓ {file2.name}</Badge>
                                                <Text size="xs" c="dimmed">{(file2.size / 1024).toFixed(1)} KB</Text>
                                            </Group>
                                        )}
                                    </div>
                                )}

                                {/* Extra fields */}
                                {selectedOp.extraFields === 'password' && (
                                    <TextInput
                                        label="Password"
                                        placeholder="Enter password to protect PDF"
                                        value={password}
                                        onChange={e => setPassword(e.currentTarget.value)}
                                        leftSection={<IconShieldLock size={16} />}
                                        radius="md"
                                        size="md"
                                    />
                                )}
                                {selectedOp.extraFields === 'watermarkText' && (
                                    <TextInput
                                        label="Watermark Text"
                                        placeholder="e.g. CONFIDENTIAL"
                                        value={watermarkText}
                                        onChange={e => setWatermarkText(e.currentTarget.value)}
                                        leftSection={<IconDroplet size={16} />}
                                        radius="md"
                                        size="md"
                                    />
                                )}
                                {selectedOp.extraFields === 'splitAt' && (
                                    <NumberInput
                                        label="Split at page"
                                        description="PDF will be split after this page number"
                                        value={splitAt}
                                        onChange={v => setSplitAt(Number(v))}
                                        min={1}
                                        radius="md"
                                        size="md"
                                    />
                                )}

                                <Divider />

                                {/* Progress */}
                                {processing && (
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text size="sm" fw={500}>Processing...</Text>
                                            <Text size="sm" c="dimmed">{progress}%</Text>
                                        </Group>
                                        <Progress value={progress} color="orange" animated size="lg" radius="xl" />
                                        <Text size="xs" c="dimmed" ta="center">Sending to Foxit PDF Services API...</Text>
                                    </Stack>
                                )}

                                {/* Error */}
                                {error && (
                                    <Alert icon={<IconAlertCircle size={18} />} color="red" radius="md">
                                        <Text size="sm">{error}</Text>
                                    </Alert>
                                )}

                                {/* Result */}
                                {result && (
                                    <Card radius="lg" p="md" style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #6EE7B7' }}>
                                        <Group justify="space-between">
                                            <Group gap="sm">
                                                <ThemeIcon size={40} radius="xl" color="green">
                                                    <IconCheck size={22} />
                                                </ThemeIcon>
                                                <div>
                                                    <Text fw={700} size="sm" c="#065F46">Operation Complete!</Text>
                                                    <Text size="xs" c="dimmed">
                                                        Output: {(result.size / 1024).toFixed(1)} KB · .{result.ext.toUpperCase()}
                                                    </Text>
                                                </div>
                                            </Group>
                                            <Button
                                                color="green"
                                                leftSection={<IconDownload size={16} />}
                                                onClick={downloadResult}
                                                radius="xl"
                                            >
                                                Download
                                            </Button>
                                        </Group>
                                    </Card>
                                )}

                                {/* Action button */}
                                {!processing && !result && (
                                    <Button
                                        size="lg"
                                        fullWidth
                                        radius="xl"
                                        disabled={!file1 || (selectedOp.needsTwoFiles && !file2)}
                                        loading={processing}
                                        onClick={runOperation}
                                        style={{
                                            background: file1 ? `linear-gradient(135deg, ${selectedOp.color}, ${selectedOp.color}CC)` : undefined,
                                        }}
                                        leftSection={selectedOp.icon}
                                    >
                                        Run {selectedOp.label}
                                    </Button>
                                )}

                                {result && (
                                    <Button variant="outline" color="orange" fullWidth radius="xl" onClick={() => { reset(); }}>
                                        Process Another File
                                    </Button>
                                )}
                            </Stack>
                        </Card>
                    )}

                    {/* Stats row */}
                    <SimpleGrid cols={3} mt="lg" spacing="md">
                        {[
                            { label: 'Manage Operations', count: OPERATIONS.filter(o => o.category === 'manage').length, color: '#E8590C' },
                            { label: 'Convert From PDF', count: OPERATIONS.filter(o => o.category === 'convert-from').length, color: '#7950F2' },
                            { label: 'Convert To PDF', count: OPERATIONS.filter(o => o.category === 'convert-to').length, color: '#2F9E44' },
                        ].map(stat => (
                            <Card key={stat.label} radius="lg" p="md" style={{ border: '1px solid #E9EDF2', textAlign: 'center' }}>
                                <Text size="xl" fw={800} style={{ color: stat.color }}>{stat.count}</Text>
                                <Text size="xs" c="dimmed">{stat.label}</Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                </div>
            </SimpleGrid>
        </Container>
    );
}
