'use client';
import { Card, Text, Badge, Group, Stack, Divider } from '@mantine/core';
import { Employee } from '../types';
import { IconUser, IconBuilding, IconCalendar, IconCurrencyRupee } from '@tabler/icons-react';

export function EmployeeCard({ employee }: { employee: Employee }) {
    return (
        <Card shadow="sm" withBorder radius="lg" p="md">
            <Group align="flex-start" gap="sm">
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E8590C, #F76707)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'white',
                        flexShrink: 0,
                    }}
                >
                    {employee.fullName.charAt(0).toUpperCase()}
                </div>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs" align="center">
                        <Text fw={700} size="md">{employee.fullName}</Text>
                        <Badge size="xs" color="orange" variant="light">{employee.employmentType}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{employee.designation} · {employee.department}</Text>
                    <Text size="xs" c="dimmed" ff="mono">{employee.employeeId}</Text>
                </Stack>
            </Group>
            <Divider my="sm" />
            <Stack gap={6}>
                <Group gap="xs">
                    <IconCalendar size={14} color="#E8590C" />
                    <Text size="xs" c="dimmed">Start: {employee.startDate ? new Date(employee.startDate).toLocaleDateString('en-IN') : '—'}</Text>
                </Group>
                <Group gap="xs">
                    <IconBuilding size={14} color="#E8590C" />
                    <Text size="xs" c="dimmed">{employee.workLocation || 'Head Office'} · Reports to: {employee.reportingManager || 'TBD'}</Text>
                </Group>
                <Group gap="xs">
                    <IconCurrencyRupee size={14} color="#E8590C" />
                    <Text size="xs" c="dimmed">CTC: ₹{(employee.annualCTC || 0).toLocaleString('en-IN')}/year</Text>
                </Group>
            </Stack>
        </Card>
    );
}
