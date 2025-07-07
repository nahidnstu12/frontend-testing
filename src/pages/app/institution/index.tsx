import DataTable from '@/components/datatable';
import { ConfirmationDialog } from '@/components/wrapper/ConfirmationDialog';
import { DrawerContainer } from '@/components/wrapper/drawer-container';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import useDrawer from '@/hooks/useDrawer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types/shared';
import { type CustomColumnDef } from '@/components/datatable/type';
import { Eye, Pencil, Trash } from 'lucide-react';
import Form from './Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Institutions',
        href: '/institutions',
    },
];

interface InstitutionListProps {
    institutions: {
        data: any[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        name?: string;
        registration_no?: string;
        type?: string;
        status?: boolean;
        sort_field?: string;
        sort_direction?: 'asc' | 'desc';
        per_page?: number;
        user_email?: string;
    };
}

function InstitutionList() {
    const { isOpen, mode, itemId, openDrawer, closeDrawer } = useDrawer();

    const columns: CustomColumnDef<any>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: () => <div className="text-center">Name</div>,
            cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>,
            enableColumnFilter: true,
            filterField: 'input',
            
        },
        {
            accessorFn: (row) => row.user.name,
            id: 'user.name',
            header: () => <div className="text-center">User Name</div>,
            cell: ({ row }) => {
                const username = row.original.user.name;
                return <div className="text-center font-medium">{username}</div>;
            },
            enableSorting: false,
        },
        {
            accessorFn: (row) => row.user.email,
            id: 'user_email',
            header: () => <div className="text-center">User Email</div>,
            cell: ({ row }) => {
                const email = row.original.user.email;
                return <div className="text-center font-medium">{email}</div>;
            },
            enableColumnFilter: true,
            filterField: 'input',
           
        },
        {
            accessorKey: 'registration_no',
            header: () => <div className="text-center">Registration No</div>,
            cell: ({ row }) => {
                const registration_no = row.getValue('registration_no') as string;
                return <div className="text-center font-medium">{registration_no}</div>;
            },
            enableSorting: false,
            enableColumnFilter: true,
            filterField: 'input',
        },
        {
            accessorKey: 'no_of_students',
            enableSorting: true,
            header: () => <div className="text-center">No of Students</div>,
            cell: ({ row }) => {
                const no_of_students = row.getValue('no_of_students') as number;
                return <div className="text-center font-medium">{no_of_students}</div>;
            },
        },
        {
            accessorKey: 'no_of_teachers',
            header: () => <div className="text-center">No of Teachers</div>,
            cell: ({ row }) => {
                const no_of_teachers = row.getValue('no_of_teachers') as number;
                return <div className="text-center font-medium">{no_of_teachers}</div>;
            },
        },
        {
            accessorKey: 'type',
            header: () => <div className="text-center">Type</div>,
            cell: ({ row }) => {
                const type = row.getValue('type');

                return <div className="text-center font-medium">{type === 'tertiary' ? 'Collage' : type === 'secondary' ? 'Secondary' : 'Primary'}</div>;
            },
            enableColumnFilter: true,
            filterField: 'select',
            filteredItems: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Collage', value: 'tertiary' },
            ],
            
        },
        {
            id: 'actions',
            enableHiding: false,
            enableSorting: false,
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center gap-2">
                        <Button variant="outline" onClick={() => openDrawer('read', row.original.id)}>
                            <Eye />{' '}
                        </Button>
                        <Button variant="outline" onClick={() => openDrawer('edit', row.original.id)}>
                            <Pencil />{' '}
                        </Button>
                        <ConfirmationDialog
                            title="Delete Institution"
                            description="Are you sure you want to delete this institution?"
                            deleteText="Delete"
                            cancelText="Cancel"
                            route={`/institutions/${row.original.id}`}
                        >
                            <Button variant="outline">
                                <Trash />{' '}
                            </Button>
                        </ConfirmationDialog>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto my-10 w-full">
                <h1 className="mb-4 text-center text-2xl font-bold">Institutions List</h1>
                <DataTable
                    columns={columns}
                    data={institutions.data}
                    openDrawer={openDrawer}
                    title="Institution"
                    filters={filters}
                    routeName={'/institutions'}
                    paginationMeta={{
                        current_page: institutions.current_page,
                        last_page: institutions.last_page,
                        per_page: institutions.per_page,
                        total: institutions.total,
                    }}
                />
            </div>
            <DrawerContainer
                drawerSettings={{ isOpen, onClose: closeDrawer, mode, itemId }}
                formSettings={{
                    initialData: {
                        user_name: '',
                        name: '',
                        registration_no: '',
                        no_of_students: '',
                        no_of_teachers: '',
                        type: 'primary',
                        cover_photo: '',
                        logo: '',
                        location: '',
                        status: true as const,
                        limit: '',
                        extra_infos: '',
                        user_email: '',
                    },
                    postRoute: '/institutions',
                    updateRoute: '/institutions',
                    showRoute: '/institutions',
                    transformResponse: (data) => ({
                        user_name: data.user?.name || '',
                        name: data.name || '',
                        registration_no: data.registration_no || '',
                        no_of_students: data.no_of_students || '',
                        no_of_teachers: data.no_of_teachers || '',
                        type: data.type || 1,
                        cover_photo: data.cover_photo || '',
                        logo: data.logo || '',
                        location: data.location || '',
                        status: data.status || true,
                        limit: data.limit || '',
                        extra_infos: data.extra_infos || '',
                        user_email: data.user?.email || '',
                    }),
                }}
                featureTitle="Institution"
            >
                {({ data, setData, errors, mode }) => <Form data={data} setData={setData} errors={errors} mode={mode} options={{}} />}
            </DrawerContainer>
        </AppLayout>
    );
}

export default InstitutionList;
