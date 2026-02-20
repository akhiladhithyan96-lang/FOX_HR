'use client';
import { Modal, Button, Group } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { GeneratedDocument, DOCUMENT_TYPE_LABELS } from '../types';

interface PDFPreviewModalProps {
    opened: boolean;
    onClose: () => void;
    document: GeneratedDocument | null;
}

export function PDFPreviewModal({ opened, onClose, document }: PDFPreviewModalProps) {
    const download = () => {
        if (!document?.base64Data) return;
        const link = window.document.createElement('a');
        link.href = `data:application/pdf;base64,${document.base64Data}`;
        link.download = `${document.documentType}-${document.employeeName.replace(/ /g, '_')}.pdf`;
        link.click();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={document ? DOCUMENT_TYPE_LABELS[document.documentType] || 'Document Preview' : 'Preview'}
            size="xl"
            padding="sm"
            radius="lg"
        >
            {document?.base64Data ? (
                <iframe
                    src={`data:application/pdf;base64,${document.base64Data}`}
                    style={{ width: '100%', height: '70vh', border: 'none', borderRadius: 8 }}
                    title="PDF Preview"
                />
            ) : (
                <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No preview data available
                </div>
            )}
            <Group justify="flex-end" mt="sm">
                <Button
                    color="orange"
                    leftSection={<IconDownload size={14} />}
                    onClick={download}
                >
                    Download PDF
                </Button>
            </Group>
        </Modal>
    );
}
