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
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CheckCheckIcon,
    Clock10Icon,
    ListTodoIcon,
    LoaderCircleIcon,
    Megaphone,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';
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
    flash: {
        message?: string;
    };
    tasks: Tasks[];
}
export default function Index() {
    const [openAdd, setOpenAdd] = useState(false)
    const { flash, tasks } = usePage().props as IndexProps;
    const { data, setData , post, processing, errors } = useForm({
        title: '',
        category: '',
        description: '',
        priority: '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tasks', {
            onSuccess: () => setOpenAdd(false),
        });
    };
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
                    {flash.message && (
                        <Alert className="w-fit border-green-400 shadow-md text-green-600">
                            <Megaphone />
                            <AlertTitle>Notifications</AlertTitle>
                            <AlertDescription className='text-green-500'>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Stats Card */}
                <div className="flex flex-row gap-2">
                    {/* list  */}
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
                {/*  */}
                <div className="mt-4 flex flex-row justify-between gap-2 rounded-lg border p-4">
                    {/* Input Group search */}
                    <InputGroup>
                        <InputGroupInput placeholder="Search Tasks.." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    {/* Select */}
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
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
                    <Select>
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
                    <ListCardTasks tasks={tasks} />
                </div>
            </div>
        </AppLayout>
    );
}

