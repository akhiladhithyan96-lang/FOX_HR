'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container,
    Title,
    Text,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    SegmentedControl,
    Button,
    Card,
    SimpleGrid,
    Group,
    Stack,
    Divider,
    Checkbox,
    Badge,
    Alert,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser, IconBriefcase, IconCurrencyRupee, IconFileText, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { Employee, DocumentType, DOCUMENT_TYPE_LABELS } from '../../../types';
import { saveEmployee, generateEmployeeId, generateId } from '../../../lib/storage';
import dayjs from 'dayjs';

export default function NewEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            fullName: '',
            email: '',
            phone: '',
            dob: null as Date | null,
            address: '',
            employeeId: generateEmployeeId(),
            designation: '',
            department: 'Engineering' as string,
            employmentType: 'Full-Time',
            startDate: null as Date | null,
            probationPeriod: '3 months' as string,
            reportingManager: '',
            workLocation: '',
            annualCTC: 0,
            basicSalary: 0,
            hra: 0,
            specialAllowance: 0,
            pfContribution: 1800,
            documentsToGenerate: ['offer-letter', 'nda', 'appointment-letter'] as DocumentType[],
        },
        validate: {
            fullName: (v) => (!v ? 'Full name is required' : null),
            email: (v) => (!v || !/^\S+@\S+$/.test(v) ? 'Invalid email' : null),
            designation: (v) => (!v ? 'Designation is required' : null),
            startDate: (v) => (!v ? 'Start date is required' : null),
            annualCTC: (v) => (!v || v <= 0 ? 'CTC is required' : null),
            documentsToGenerate: (v) => (!v.length ? 'Select at least one document' : null),
        },
    });

    // Auto-calculate derived salary fields
    const handleCTCChange = (ctc: string | number) => {
        const val = Number(ctc) || 0;
        const basic = Math.round(val * 0.4 / 12);
        const hra = Math.round(basic * 0.2);
        form.setFieldValue('annualCTC', val);
        form.setFieldValue('basicSalary', basic);
        form.setFieldValue('hra', hra);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const employee: Employee = {
                id: generateId(),
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '',
                address: values.address,
                employeeId: values.employeeId,
                designation: values.designation,
                department: values.department as Employee['department'],
                employmentType: values.employmentType as Employee['employmentType'],
                startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
                probationPeriod: values.probationPeriod as Employee['probationPeriod'],
                reportingManager: values.reportingManager,
                workLocation: values.workLocation,
                annualCTC: values.annualCTC,
                basicSalary: values.basicSalary,
                hra: values.hra,
                specialAllowance: values.specialAllowance,
                pfContribution: values.pfContribution,
                createdAt: new Date().toISOString(),
                documentsToGenerate: values.documentsToGenerate,
            };

            saveEmployee(employee);

            notifications.show({
                title: '✅ Employee Saved!',
                message: `${employee.fullName} has been saved. Redirecting to document generation...`,
                color: 'green',
            });

            setTimeout(() => {
                router.push(`/app/generate?employeeId=${employee.id}`);
            }, 1000);
        } catch (err) {
            notifications.show({
                title: 'Error',
                message: 'Failed to save employee. Please try again.',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
        <Group gap="sm" mb="md">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #E8590C, #F76707)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {icon}
            </div>
            <div>
                <Text fw={700} size="md">{title}</Text>
                {subtitle && <Text size="xs" c="dimmed">{subtitle}</Text>}
            </div>
        </Group>
    );

    return (
        <Container size="lg" py="lg">
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={2} fw={800} c="#1A1A2E">New Employee</Title>
                    <Text c="dimmed" size="sm">Add a new employee and select documents to generate</Text>
                </div>
                <Badge size="lg" color="orange" variant="light" radius="md">
                    ID: {form.values.employeeId}
                </Badge>
            </Group>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                    {/* Section 1: Personal Details */}
                    <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                        <SectionHeader icon={<IconUser size={20} />} title="Personal Details" subtitle="Basic employee information" />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput
                                label="Full Name"
                                placeholder="Arjun Sharma"
                                required
                                {...form.getInputProps('fullName')}
                            />
                            <TextInput
                                label="Personal Email"
                                placeholder="arjun@email.com"
                                required
                                type="email"
                                {...form.getInputProps('email')}
                            />
                            <TextInput
                                label="Phone Number"
                                placeholder="+91 98765 43210"
                                {...form.getInputProps('phone')}
                            />
                            <DateInput
                                label="Date of Birth"
                                placeholder="Select date"
                                description="Used for password protection of documents"
                                {...form.getInputProps('dob')}
                            />
                            <Textarea
                                label="Address"
                                placeholder="123 Main St, Mumbai, Maharashtra 400001"
                                style={{ gridColumn: '1 / -1' }}
                                autosize
                                minRows={2}
                                {...form.getInputProps('address')}
                            />
                        </SimpleGrid>
                    </Card>

                    {/* Section 2: Employment Details */}
                    <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                        <SectionHeader icon={<IconBriefcase size={20} />} title="Employment Details" subtitle="Role, department and schedule information" />
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                            <TextInput
                                label="Employee ID"
                                {...form.getInputProps('employeeId')}
                                description="Auto-generated"
                            />
                            <TextInput
                                label="Designation / Role"
                                placeholder="Senior Software Engineer"
                                required
                                {...form.getInputProps('designation')}
                            />
                            <Select
                                label="Department"
                                data={['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']}
                                {...form.getInputProps('department')}
                            />
                            <DateInput
                                label="Start Date / Joining Date"
                                placeholder="Select date"
                                required
                                {...form.getInputProps('startDate')}
                            />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Text size="sm" fw={500} mb={8}>Employment Type</Text>
                                <SegmentedControl
                                    data={['Full-Time', 'Part-Time', 'Contract', 'Intern']}
                                    color="orange"
                                    {...form.getInputProps('employmentType')}
                                />
                            </div>
                            <Select
                                label="Probation Period"
                                data={['3 months', '6 months', 'None']}
                                {...form.getInputProps('probationPeriod')}
                            />
                            <TextInput
                                label="Reporting Manager"
                                placeholder="Priya Mehta"
                                {...form.getInputProps('reportingManager')}
                            />
                            <TextInput
                                label="Work Location"
                                placeholder="Mumbai HQ"
                                {...form.getInputProps('workLocation')}
                            />
                        </SimpleGrid>
                    </Card>

                    {/* Section 3: Compensation */}
                    <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                        <SectionHeader icon={<IconCurrencyRupee size={20} />} title="Compensation" subtitle="Salary and benefits structure" />
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                            <NumberInput
                                label="Annual CTC (₹)"
                                placeholder="1200000"
                                required
                                min={0}
                                thousandSeparator=","
                                prefix="₹"
                                value={form.values.annualCTC}
                                onChange={handleCTCChange}
                                error={form.errors.annualCTC}
                            />
                            <NumberInput
                                label="Basic Salary / month (₹)"
                                description="Auto: 40% of CTC ÷ 12"
                                prefix="₹"
                                thousandSeparator=","
                                {...form.getInputProps('basicSalary')}
                            />
                            <NumberInput
                                label="HRA / month (₹)"
                                description="Auto: 20% of Basic"
                                prefix="₹"
                                thousandSeparator=","
                                {...form.getInputProps('hra')}
                            />
                            <NumberInput
                                label="Special Allowance (₹)"
                                prefix="₹"
                                thousandSeparator=","
                                {...form.getInputProps('specialAllowance')}
                            />
                            <NumberInput
                                label="PF Contribution (₹)"
                                description="Default: ₹1,800/month"
                                prefix="₹"
                                thousandSeparator=","
                                {...form.getInputProps('pfContribution')}
                            />
                        </SimpleGrid>
                    </Card>

                    {/* Section 4: Documents to Generate */}
                    <Card radius="lg" p="xl" style={{ border: '1px solid #E9EDF2' }}>
                        <SectionHeader icon={<IconFileText size={20} />} title="Documents to Generate" subtitle="Select which HR documents to create for this employee" />
                        <Checkbox.Group
                            {...form.getInputProps('documentsToGenerate')}
                            error={form.errors.documentsToGenerate}
                        >
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                                {(Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][]).map(([type, label]) => (
                                    <Checkbox
                                        key={type}
                                        value={type}
                                        label={
                                            <Group gap="xs">
                                                <Text size="sm" fw={500}>{label}</Text>
                                            </Group>
                                        }
                                        styles={{ label: { cursor: 'pointer' } }}
                                    />
                                ))}
                            </SimpleGrid>
                        </Checkbox.Group>

                        {form.values.documentsToGenerate.length > 0 && (
                            <Alert
                                icon={<IconCheck size={14} />}
                                color="orange"
                                variant="light"
                                mt="md"
                                radius="md"
                            >
                                {form.values.documentsToGenerate.length} document{form.values.documentsToGenerate.length > 1 ? 's' : ''} will be generated using the Foxit Document Generation API
                            </Alert>
                        )}
                    </Card>

                    {/* Submit */}
                    <Group justify="flex-end">
                        <Button variant="outline" color="gray" onClick={() => router.push('/app')}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="orange"
                            size="md"
                            loading={loading}
                            rightSection={<IconFileText size={16} />}
                            radius="md"
                        >
                            Save &amp; Generate Documents →
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Container>
    );
}
