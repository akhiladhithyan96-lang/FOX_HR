'use client';
import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Card,
    TextInput,
    Stack,
    Group,
    Button,
    Divider,
    Badge,
    Alert,
} from '@mantine/core';
import { IconSettings, IconBolt, IconKey, IconBuilding, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export default function SettingsPage() {
    const [companyName, setCompanyName] = useState('TechCorp Solutions');
    const [hrEmail, setHrEmail] = useState('hr@techcorp.com');
    const [address, setAddress] = useState('1/1 Business Park, Mumbai, Maharashtra 400051');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('foxhr_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                setCompanyName(parsed.companyName || 'TechCorp Solutions');
                setHrEmail(parsed.hrEmail || 'hr@techcorp.com');
                setAddress(parsed.address || '1/1 Business Park, Mumbai, Maharashtra 400051');
            }
        }
    }, []);

    const saveSettings = () => {
        localStorage.setItem('foxhr_settings', JSON.stringify({ companyName, hrEmail, address }));
        notifications.show({ title: 'Saved', message: 'Company settings updated', color: 'green' });
    };

    return (
        <Container size="md" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">Settings</Title>
                    <Text c="dimmed" size="sm">Configure Fox HR company settings</Text>
                </div>
                <Badge size="lg" color="gray" variant="light">
                    <IconSettings size={14} style={{ marginRight: 4 }} />
                    Configuration
                </Badge>
            </Group>

            <Stack gap="lg">
                {/* Company Settings */}
                <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                    <Group gap="sm" mb="md">
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #E8590C, #F76707)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconBuilding size={18} color="white" />
                        </div>
                        <div>
                            <Text fw={700}>Company Settings</Text>
                            <Text size="xs" c="dimmed">Default company information for documents</Text>
                        </div>
                    </Group>
                    <Stack gap="md">
                        <TextInput
                            label="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            description="Appears in all generated HR documents"
                        />
                        <TextInput
                            label="HR Contact Email"
                            value={hrEmail}
                            onChange={(e) => setHrEmail(e.target.value)}
                        />
                        <TextInput
                            label="Company Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Stack>
                    <Group justify="flex-end" mt="md">
                        <Button color="orange" size="sm" leftSection={<IconCheck size={14} />} onClick={saveSettings}>
                            Save Changes
                        </Button>
                    </Group>
                </Card>


                {/* Data Privacy */}
                <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2', background: '#F8FBF8' }}>
                    <Text fw={700} mb="sm">🔒 Data Privacy</Text>
                    <Text size="sm" c="dimmed" lh={1.7}>
                        No employee data is stored on our servers. All employee information lives in your{' '}
                        <strong>browser localStorage</strong> only. PDFs are generated transiently via the Foxit API
                        and not persisted beyond your session. Clear your browser data to remove all stored information.
                    </Text>
                </Card>
            </Stack>
        </Container>
    );
}
