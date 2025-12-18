import StatsCard from '@/components/StatsCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCheckIcon, Clock10Icon, ListTodoIcon, LoaderCircleIcon, LoaderIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-row gap-1  p-2">
                    <StatsCard
                        title={'Total Tasks'}
                        value="0"
                        icon={<ListTodoIcon size={35} />}
                        bgColor="bg-purple-200"
                        iconColor="text-purple-600"
                    />
                    <StatsCard
                        title={'Pending Tasks'}
                        value="0"
                        icon={<LoaderCircleIcon size={35} />}
                        bgColor="bg-orange-200"
                        iconColor="text-orange-600"
                    />
                    <StatsCard
                        title={'In Progress Tasks'}
                        value="0"
                        icon={<Clock10Icon size={35} />}
                        bgColor="bg-blue-200"
                        iconColor="text-blue-600"
                    />
                    <StatsCard
                        title={'Completed Tasks'}
                        value="0"
                        icon={<CheckCheckIcon size={35} />}
                        bgColor="bg-green-200"
                        iconColor="text-green-600"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
