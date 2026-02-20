'use client';
import { Badge } from '@mantine/core';
import { DocumentStatus } from '../types';

const STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'gray' },
    generating: { label: 'Generating...', color: 'orange' },
    ready: { label: '✓ Ready', color: 'green' },
    error: { label: 'Error', color: 'red' },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
        <Badge color={config.color} variant="light" size="sm" radius="sm">
            {config.label}
        </Badge>
    );
}
