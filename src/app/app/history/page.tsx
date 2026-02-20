'use client';
import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Card,
    Table,
    Badge,
    Group,
    ActionIcon,
    Select,
    TextInput,
    Stack,
    Button,
    Anchor,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconDownload, IconRefresh, IconSearch, IconFilter, IconPackage, IconFileText } from '@tabler/icons-react';
import { GeneratedDocument, DocumentType, DOCUMENT_TYPE_LABELS } from '../../../types';
import { getDocuments } from '../../../lib/storage';
import { DocumentStatusBadge } from '../../../components/DocumentStatusBadge';
import { PDFPreviewModal } from '../../../components/PDFPreviewModal';
import dayjs from 'dayjs';

export default function HistoryPage() {
    const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
    const [filtered, setFiltered] = useState<GeneratedDocument[]>([]);
    const [search, setSearch] = useState('');
    const [docTypeFilter, setDocTypeFilter] = useState<string | null>(null);

    useEffect(() => {
        const live = getDocuments();
        const sorted = [...live].sort((a, b) =>
            new Date(b.generatedAt || 0).getTime() - new Date(a.generatedAt || 0).getTime()
        );
        setDocuments(sorted);
        setFiltered(sorted);
    }, []);

    useEffect(() => {
        let result = documents;
        if (search) {
            result = result.filter((d) =>
                d.employeeName.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (docTypeFilter) {
            result = result.filter((d) => d.documentType === docTypeFilter);
        }
        setFiltered(result);
    }, [search, docTypeFilter, documents]);

    const downloadDoc = (doc: GeneratedDocument) => {
        if (doc.docId) {
            window.open(`/api/download/${doc.docId}`, '_blank');
        } else if (doc.base64Data) {
            const link = document.createElement('a');
            link.href = `data:application/pdf;base64,${doc.base64Data}`;
            link.download = `${doc.documentType}-${doc.employeeName.replace(/ /g, '_')}.pdf`;
            link.click();
        }
    };

    return (
        <Container size="xl" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">Document History</Title>
                    <Text c="dimmed" size="sm">All generated documents and their status</Text>
                </div>
                <Badge size="lg" color="blue" variant="light">
                    {filtered.length} documents
                </Badge>
            </Group>

            {/* Filters */}
            <Card radius="lg" p="md" mb="lg" style={{ border: '1px solid #E9EDF2' }}>
                <Group gap="md" align="flex-end">
                    <TextInput
                        placeholder="Search by employee name..."
                        leftSection={<IconSearch size={16} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        style={{ flex: 1 }}
                    />
                    <Select
                        placeholder="All document types"
                        leftSection={<IconFilter size={16} />}
                        data={[
                            { value: '', label: 'All types' },
                            ...Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v })),
                        ]}
                        value={docTypeFilter || ''}
                        onChange={(v) => setDocTypeFilter(v || null)}
                        clearable
                        style={{ minWidth: 200 }}
                    />
                    <Button
                        variant="outline"
                        color="gray"
                        leftSection={<IconRefresh size={14} />}
                        onClick={() => { setSearch(''); setDocTypeFilter(null); }}
                    >
                        Clear
                    </Button>
                </Group>
            </Card>

            {/* Table */}
            <Card radius="lg" p="lg" style={{ border: '1px solid #E9EDF2' }}>
                <Table striped highlightOnHover verticalSpacing="md">
                    <Table.Thead style={{ background: '#F8F9FA' }}>
                        <Table.Tr>
                            <Table.Th>Employee</Table.Th>
                            <Table.Th>Document Type</Table.Th>
                            <Table.Th>Generated At</Table.Th>
                            <Table.Th>File Size</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filtered.length === 0 && (
                            <Table.Tr>
                                <Table.Td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                    <Stack align="center" gap="sm">
                                        <IconFileText size={40} color="#CCC" />
                                        <Text c="dimmed">No documents found</Text>
                                        <Anchor href="/app/generate" c="orange" size="sm">Generate your first document</Anchor>
                                    </Stack>
                                </Table.Td>
                            </Table.Tr>
                        )}
                        {filtered.map((doc) => (
                            <Table.Tr key={doc.id}>
                                <Table.Td>
                                    <Group gap="xs">
                                        <div
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #E8590C, #F76707)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 12,
                                                fontWeight: 800,
                                                color: 'white',
                                            }}
                                        >
                                            {doc.employeeName.charAt(0)}
                                        </div>
                                        <Text size="sm" fw={500}>{doc.employeeName}</Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{DOCUMENT_TYPE_LABELS[doc.documentType] || doc.documentType}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">
                                        {doc.generatedAt
                                            ? dayjs(doc.generatedAt).format('DD MMM YYYY HH:mm')
                                            : '—'}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">
                                        {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : '—'}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        size="sm"
                                        color={doc.status === 'ready' ? 'green' : doc.status === 'generating' ? 'orange' : 'gray'}
                                        variant="light"
                                        radius="sm"
                                    >
                                        {doc.status === 'ready' ? '✓ Ready' : doc.status}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="light"
                                            color="orange"
                                            size="sm"
                                            disabled={!doc.base64Data}
                                            onClick={() => downloadDoc(doc)}
                                            title="Download"
                                        >
                                            <IconDownload size={14} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="light"
                                            color="violet"
                                            size="sm"
                                            onClick={() => window.location.href = `/app/packs?employeeId=${doc.employeeId}`}
                                            title="Add to pack"
                                        >
                                            <IconPackage size={14} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>
        </Container>
    );
}
