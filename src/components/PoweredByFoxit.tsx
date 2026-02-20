'use client';
import { Badge, Tooltip } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';

export function PoweredByFoxit({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
    const sizes = { xs: 10, sm: 11, md: 13 };
    const iconSizes = { xs: 10, sm: 12, md: 14 };

    return (
        <Tooltip label="Built with Foxit Document Generation & PDF Services APIs" position="bottom">
            <span className="powered-badge" style={{ fontSize: sizes[size] }}>
                <IconBolt size={iconSizes[size]} />
                Powered by Foxit
            </span>
        </Tooltip>
    );
}
