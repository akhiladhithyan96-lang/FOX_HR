'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    AppShell,
    Burger,
    Group,
    NavLink,
    Stack,
    Text,
    Divider,
    ScrollArea,
    Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconHome,
    IconUserPlus,
    IconFileText,
    IconPackage,
    IconUsers,
    IconHistory,
    IconSettings,
    IconBolt,
} from '@tabler/icons-react';
import { FoxLogoWithText } from '../../components/FoxLogo';
import { PoweredByFoxit } from '../../components/PoweredByFoxit';

const NAV_ITEMS = [
    { href: '/app', label: 'Dashboard', icon: IconHome },
    { href: '/app/new-employee', label: 'New Employee', icon: IconUserPlus },
    { href: '/app/generate', label: 'Generate Documents', icon: IconFileText },
    { href: '/app/packs', label: 'Onboarding Packs', icon: IconPackage },
    { href: '/app/bulk', label: 'Bulk Upload', icon: IconUsers },
    { href: '/app/history', label: 'Document History', icon: IconHistory },
    { href: '/app/settings', label: 'Settings', icon: IconSettings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();
    const router = useRouter();

    return (
        <AppShell
            header={{ height: 64 }}
            navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            {/* ── Header ──────────────────────────────── */}
            <AppShell.Header
                style={{
                    background: 'linear-gradient(135deg, #1A1A2E, #16213E)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Group h="100%" px="md" justify="space-between">
                    <Group gap="sm">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
                        <FoxLogoWithText size={36} />
                    </Group>
                    <PoweredByFoxit size="sm" />
                </Group>
            </AppShell.Header>

            {/* ── Sidebar ─────────────────────────────── */}
            <AppShell.Navbar
                p="sm"
                style={{
                    background: '#111827',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <ScrollArea style={{ flex: 1 }}>
                    <Stack gap={4} mt="xs">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <NavLink
                                    key={href}
                                    label={label}
                                    leftSection={<Icon size={18} />}
                                    active={isActive}
                                    onClick={() => router.push(href)}
                                    styles={{
                                        root: {
                                            borderRadius: 10,
                                            color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                            background: isActive
                                                ? 'linear-gradient(135deg, rgba(232,89,12,0.9), rgba(247,103,7,0.9))'
                                                : 'transparent',
                                            fontWeight: isActive ? 600 : 400,
                                            '&:hover': {
                                                background: isActive
                                                    ? 'linear-gradient(135deg, rgba(232,89,12,0.9), rgba(247,103,7,0.9))'
                                                    : 'rgba(255,255,255,0.06)',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                />
                            );
                        })}
                    </Stack>
                </ScrollArea>
                <Divider color="rgba(255,255,255,0.06)" my="sm" />
                <Box p="xs">
                    <div
                        style={{
                            background: 'rgba(232,89,12,0.1)',
                            border: '1px solid rgba(232,89,12,0.2)',
                            borderRadius: 10,
                            padding: '10px 14px',
                        }}
                    >
                        <Group gap="xs" mb={4}>
                            <IconBolt size={14} color="#F76707" />
                            <Text size="xs" fw={600} c="orange.5">Powered by Foxit</Text>
                        </Group>
                        <Text size="xs" c="dimmed" lh={1.5}>
                            Document Generation API + PDF Services API
                        </Text>
                    </div>
                </Box>
            </AppShell.Navbar>

            {/* ── Main ────────────────────────────────── */}
            <AppShell.Main style={{ background: '#F8F9FA' }}>
                <div className="page-enter">{children}</div>
            </AppShell.Main>
        </AppShell>
    );
}
