import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/store/authContext';
import { type BreadcrumbItem } from '@/types/shared';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { user } = useAuth();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* <Head title="Dashboard" /> */}
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1>Dashboard</h1>
                <p>Welcome, {user?.username}</p>
                
            </div>
        </AppLayout>
    );
}
