import StatsCard from '@/components/StatsCard';
import ListCardTasks from '@/components/ui/ListCardTasks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    CheckCheckIcon,
    Clock10Icon,
    FolderX,
    ListTodoIcon,
    LoaderCircleIcon,
    Megaphone,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

interface Tasks {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
}

interface IndexProps {
     tasks: Tasks[];
    stats: {
        total: number;
        pending: number;
        in_progress: number;
        completed: number;
    };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
    };
    flash?: {
        message?: string;
    };
}
export default function Index() {
    const [openAdd, setOpenAdd] = useState(false);
    const { flash, stats,tasks, filters } = usePage().props as IndexProps;
    const  {search, setSearch}  = useState(filters?.search ?? '');
    const [status, setStatus]  = useState(filters?.status ?? '');
    const [ priority, setPriority] = useState(filters?.priority ?? '');
    const [showFlash, setShowFlash] = useState(!!flash?.message);
    useEffect(() => {
    if (flash?.message) {
        setShowFlash(true);

        const timer = setTimeout(() => {
            setShowFlash(false);
        }, 3000); // ⏱️ 3 detik

        return () => clearTimeout(timer);
    }
}, [flash?.message]);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        description: '',
        priority: '',
    });

    const applyFilters = (
        newSearch= search,
        newStatus= status,
        newPriority= priority,
    ) => {
        router.get(
            '/tasks',
            {
                search: newSearch || undefined,
                status: newStatus || undefined,
                priority: newPriority || undefined,
            },
            {
                preserveState: true,
                replace: true,
            }
        )
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => setOpenAdd(false),
        });
    };
    const handleSearch = debounce((value: string) => {
        router.get(
            '/tasks',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
        );
        if (value === '') {
            router.get('/tasks', {}, { replace: true });
        }
    }, 300);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex flex-col gap-2 rounded-xl p-4">
                <div className="flex h-full flex-col overflow-x-auto rounded-xl p-4">
                    <h1 className="text-2xl font-semibold">Tasks Manager</h1>
                    <p>Organize your work and life efficiently</p>
                </div>
                <div className="absolute top-20 right-10 z-auto">
                    {/* Display Message Success */}
                    {showFlash && flash?.message && (
                        <Alert className="w-fit border-green-400 text-green-600 shadow-md">
                            <Megaphone />
                            <AlertTitle>Notifications</AlertTitle>
                            <AlertDescription className="text-green-500">
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Stats Card */}
                <div className="flex flex-row gap-2">
                    {/* list  */}
                    <StatsCard
                        title={'Total Tasks'}
                        value={stats.total.toString()}
                        icon={<ListTodoIcon size={35} />}
                        bgColor="bg-purple-200"
                        iconColor="text-purple-600"
                    />
                    <StatsCard
                        title={'Pending Tasks'}
                        value={stats.pending.toString()}
                        icon={<LoaderCircleIcon size={35} />}
                        bgColor="bg-orange-200"
                        iconColor="text-orange-600"
                    />
                    <StatsCard
                        title={'In Progress Tasks'}
                        value={stats.in_progress.toString()}
                        icon={<Clock10Icon size={35} />}
                        bgColor="bg-blue-200"
                        iconColor="text-blue-600"
                    />
                    <StatsCard
                        title={'Completed Tasks'}
                        value={stats.completed.toString()}
                        icon={<CheckCheckIcon size={35} />}
                        bgColor="bg-green-200"
                        iconColor="text-green-600"
                    />
                </div>
                {/*  */}
                <div className="mt-4 flex flex-row justify-between gap-2 rounded-lg border p-4">
                    {/* Input Group search */}
                    <InputGroup>
                        <InputGroupInput
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search Tasks.."
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    {/* Select */}
                    <Select value={status} onValueChange={(value) => {
                        setStatus(value)
                        applyFilters(search,value,priority)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup >
                                <SelectLabel className="text-xs font-semibold text-gray-500">
                                    Status
                                </SelectLabel>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={priority} onValueChange={(value) => {
                        setPriority(value)
                        applyFilters(search,status,value)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-xs font-semibold text-gray-500">
                                    Priority
                                </SelectLabel>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* Dialog add task Button */}
                    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                        <DialogTrigger asChild>
                            <Button variant="default">
                                <Plus />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                {/* Form to add new task */}
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                </DialogHeader>
                                {/* Add your form fields here */}
                                <div className="mt-4 grid gap-2">
                                    <div>
                                        <Label className="grid gap-2">
                                            Title
                                            <Input
                                                type="text"
                                                placeholder="Task Title"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData(
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Label>
                                    </div>
                                    <div>
                                        <Label className="grid gap-2">
                                            Category
                                            <Input
                                                type="text"
                                                placeholder="Personal,Business,etc.."
                                                value={data.category}
                                                onChange={(e) =>
                                                    setData(
                                                        'category',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Label>
                                    </div>
                                    <div>
                                        <Label className="grid gap-2">
                                            Description
                                            <Textarea
                                                value={data.description}
                                                placeholder="Task Description"
                                                onChange={(e) =>
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Label>
                                    </div>
                                    <div className="flex flex-row gap-4">
                                        <div>
                                            <Select
                                                value={data.priority}
                                                onValueChange={(value) =>
                                                    setData('priority', value)
                                                }
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel className="text-xs font-semibold text-gray-500">
                                                            Priority
                                                        </SelectLabel>
                                                        <SelectItem value="low">
                                                            Low
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            Medium
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            High
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant={'outline'}>
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                disabled={processing}
                                                variant={'default'}
                                                type="submit"
                                            >
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-4 flex h-fit flex-col items-center justify-center gap-3 rounded-lg border p-4">
                    {/* List cards tasks */}
                    {tasks.length > 0 ? (
                        <ListCardTasks tasks={tasks} />
                    ) : (
                        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                            <FolderX size={50} className='' strokeWidth={1.5}/>
                            <h3 className="text-lg mt-5 font-semibold">
                                No tasks found
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Try creating a new task or adjust your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
