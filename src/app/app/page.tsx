'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Title,
    Text,
    SimpleGrid,
    Card,
    Group,
    Stack,
    Badge,
    Button,
    Table,
    ActionIcon,
    Anchor,
} from '@mantine/core';
import {
    IconFileText,
    IconPackage,
    IconTrendingUp,
    IconBolt,
    IconArrowRight,
    IconDownload,
    IconPlus,
    IconUsers,
} from '@tabler/icons-react';
import { getStats, getDocuments } from '../../lib/storage';

interface StatCard {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({ totalDocuments: 0, onboardingPacks: 0, documentsThisMonth: 0, apiCallsUsed: 0 });
    const [recentDocs, setRecentDocs] = useState<any[]>([]);

    useEffect(() => {
        const liveStats = getStats();
        setStats(liveStats);

        const liveDocs = getDocuments();
        if (liveDocs.length > 0) {
            setRecentDocs(
                liveDocs.sort((a, b) =>
                    new Date(b.generatedAt || 0).getTime() - new Date(a.generatedAt || 0).getTime()
                ).slice(0, 8)
            );
        }
    }, []);

    const statCards: StatCard[] = [
        { label: 'Total Documents', value: stats.totalDocuments, icon: <IconFileText size={28} />, color: '#E8590C', trend: '+12%' },
        { label: 'Onboarding Packs', value: stats.onboardingPacks, icon: <IconPackage size={28} />, color: '#7C3AED', trend: '+3' },
        { label: 'This Month', value: stats.documentsThisMonth, icon: <IconTrendingUp size={28} />, color: '#0EA5E9', trend: '+8%' },
        { label: 'API Calls Used', value: stats.apiCallsUsed, icon: <IconBolt size={28} />, color: '#10B981', trend: 'Active' },
    ];

    return (
        <Container size="xl" py="lg">
            {/* Header */}
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} style={{ color: '#1A1A2E' }}>Dashboard</Title>
                    <Text c="dimmed" size="sm" mt={4}>
                        Fox HR — Smart HR Documents, Delivered Instantly
                    </Text>
                </div>
                <Button
                    color="orange"
                    radius="md"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => router.push('/app/new-employee')}
                >
                    New Employee
                </Button>
            </Group>

            {/* Stats */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="xl">
                {statCards.map(({ label, value, icon, color, trend }) => (
                    <Card key={label} radius="lg" p="lg" style={{ background: 'white', border: '1px solid #E9EDF2' }}>
                        <Group justify="space-between" mb="sm">
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: `${color}18`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color,
                                }}
                            >
                                {icon}
                            </div>
                            <Badge size="xs" color="green" variant="light">{trend}</Badge>
                        </Group>
                        <Text fw={800} size="2xl" style={{ fontSize: 32, color: '#1A1A2E', lineHeight: 1 }}>
                            {value}
                        </Text>
                        <Text size="sm" c="dimmed" mt={4}>{label}</Text>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Quick Actions */}
            <Card radius="lg" p="lg" mb="xl" style={{ background: 'linear-gradient(135deg, #1A1A2E, #16213E)', border: 'none' }}>
                <Text fw={700} c="white" mb="sm">Quick Actions</Text>
                <Group gap="sm" wrap="wrap">
                    <Button
                        variant="filled"
                        color="orange"
                        radius="md"
                        leftSection={<IconFileText size={16} />}
                        onClick={() => router.push('/app/generate')}
                        rightSection={<IconArrowRight size={14} />}
                    >
                        Generate Documents
                    </Button>
                    <Button
                        variant="outline"
                        radius="md"
                        leftSection={<IconPackage size={16} />}
                        onClick={() => router.push('/app/packs')}
                        style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
                    >
                        Create Onboarding Pack
                    </Button>
                    <Button
                        variant="outline"
                        radius="md"
                        leftSection={<IconUsers size={16} />}
                        onClick={() => router.push('/app/bulk')}
                        style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
                    >
                        Bulk Upload CSV
                    </Button>
                </Group>
            </Card>

            {/* Recent Activity */}
            <Card radius="lg" p="lg" style={{ background: 'white', border: '1px solid #E9EDF2' }}>
                <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Recent Activity</Text>
                    <Anchor size="sm" c="orange" onClick={() => router.push('/app/history')}>
                        View all
                    </Anchor>
                </Group>
                <Table striped highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr style={{ background: '#F8F9FA' }}>
                            <Table.Th>Employee</Table.Th>
                            <Table.Th>Document Type</Table.Th>
                            <Table.Th>Generated At</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {recentDocs.slice(0, 8).map((row) => (
                            <Table.Tr key={row.id}>
                                <Table.Td>
                                    <Group gap="xs">
                                        <div
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #E8590C, #F76707)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                color: 'white',
                                            }}
                                        >
                                            {row.employeeName.charAt(0)}
                                        </div>
                                        <Text size="sm" fw={500}>{row.employeeName}</Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{row.documentType}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">
                                        {new Date(row.generatedAt).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        size="sm"
                                        color={row.status === 'ready' ? 'green' : row.status === 'pending' ? 'gray' : 'orange'}
                                        variant="light"
                                        radius="sm"
                                    >
                                        {row.status === 'ready' ? '✓ Ready' : row.status === 'pending' ? 'Pending' : row.status}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <ActionIcon
                                        variant="light"
                                        color="orange"
                                        size="sm"
                                        disabled={row.status !== 'ready'}
                                        onClick={() => {
                                            if (row.docId) {
                                                window.open(`/api/download/${row.docId}`, '_blank');
                                            }
                                        }}
                                    >
                                        <IconDownload size={14} />
                                    </ActionIcon>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>
        </Container>
    );
}
