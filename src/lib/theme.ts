import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'orange',
    primaryShade: 7,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeight: '700',
    },
    colors: {
        orange: [
            '#fff4e6',
            '#ffe8cc',
            '#ffd09b',
            '#ffb864',
            '#ffa036',
            '#ff8c1a',
            '#ff820a',
            '#e8590c',  // primary - index 7
            '#d44f08',
            '#bc4300',
        ],
        brand: [
            '#fff3e0',
            '#ffe0b2',
            '#ffcc80',
            '#ffb74d',
            '#ffa726',
            '#ff9800',
            '#fb8c00',
            '#f76707',
            '#ef6c00',
            '#e65100',
        ],
    },
    defaultRadius: 'md',
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'lg',
                shadow: 'sm',
            },
        },
        TextInput: {
            defaultProps: {
                radius: 'md',
            },
        },
        Select: {
            defaultProps: {
                radius: 'md',
            },
        },
        NumberInput: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
