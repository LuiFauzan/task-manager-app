import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/Components/ui/badge';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Calendar,
    CheckCheckIcon,
    Clock10Icon,
    PenBoxIcon,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { DialogFooter, DialogHeader } from './dialog';
import { Input } from './input';
import { Textarea } from './textarea';
import { router } from '@inertiajs/react';
interface Props {
    tasks: Tasks[];
}
export default function ListCardTasks({ tasks }: Props) {
    // ? state for open/clode edit dialog
    const [openEdit, setOpenEdit] = useState(false);
    // ? state for selected task to edit
    const [taskSelected, setTaskSelected] = useState<Tasks | null>(null);
    // ? state for edit form
    const { data, setData, put, errors } = useForm({
        title: taskSelected ? taskSelected.title : '',
        description: taskSelected ? taskSelected.description : '',
        priority: taskSelected ? taskSelected.priority : '',
        // status: taskSelected ? taskSelected.status : '',
        category: taskSelected ? taskSelected.category : '',
    });
    const { processing, delete: destroy } = useForm();
    const handleDeleteTask = (id: number, title: string) => {
        // if(confirm('Do you want to delete? ' + id +' '+ title)){
        //     destroy(`/tasks/${id}`);
        // }

        destroy(`/tasks/${id}`);
    };
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (taskSelected) {
            put(`/tasks/${taskSelected.id}`, {
                onSuccess: () => setOpenEdit(false),
            });
        }
    };

    const handleBadgeStatus = (id:number) => {
        router.put(`/tasks/${id}/badge-status`, {} ,{
            preserveScroll: true,
        })

    }
    return (
        <>
            {tasks.map((task) => (
                <div className="flex w-full flex-col gap-2 rounded-lg border p-4 shadow-sm hover:shadow-md ">
                    <div className="flex flex-row justify-between p-2">
                        <div className="flex flex-row items-start gap-3">
                            <div className="text-green-500  cursor-pointer"  onClick={() => handleBadgeStatus(task.id)}>
                                {/* Icon */}
                                {/* <LoaderCircleIcon/> */}
                                {/* <Clock10Icon/> */}
                                <CheckCheckIcon />
                            </div>
                            <div>
                                <h3 className="text-2xl">{task.title}</h3>
                                <p className="text-gray-500">
                                    {task.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            {/* Badges */}
                            <Badge variant={`${task.priority === 'low' ? 'greenday' : task.priority === 'medium' ? 'yellowclow' : task.priority === 'high' ? 'destructive' : 'greenday'}`} className="h-fit">
                                {task.priority}
                            </Badge>
                            <Badge variant={`${task.status === 'completed ' ? 'greenday' : task.status === 'in_progress' ? 'yellowclow' : task.status === 'pending' ? 'destructive' : 'greenday'}`} className="h-fit">
                                {task.status}
                            </Badge>
                            <Badge variant="outline" className="h-fit">
                                {task.category}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between p-2">
                        <div className="flex flex-row gap-4 pl-[36px] text-gray-500">
                            <span className="flex items-center gap-1 text-[13px]">
                                <Calendar size={15} /> 10/10/2025
                            </span>
                            <span className="flex items-center gap-1 text-[13px]">
                                <Clock10Icon size={15} /> 10/10/2025
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {/* Dialog Edit Task */}
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                    setTaskSelected(task);
                                    setData({
                                        title: task.title,
                                        description: task.description,
                                        priority: task.priority,
                                        category: task.category,
                                    });
                                    setOpenEdit(true);
                                }}
                            >
                                <PenBoxIcon />
                            </Button>

                            {/* Dialog Confirm Delete */}
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button
                                        disabled={processing}
                                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                                        size="sm"
                                    >
                                        <Trash2 />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your task
                                            {task.title}
                                            and remove your data from our
                                            servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleDeleteTask(
                                                    task.id,
                                                    task.title,
                                                )
                                            }
                                        >
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            {/* <Button
                    disabled={processing}
                        onClick={() => handleDeleteTask(task.id,task.title)}
                        className="cursor-pointer bg-red-600 hover:bg-red-700"
                        size="sm"
                    >
                        <Trash2 />
                    </Button> */}
                        </div>
                    </div>
                </div>
            ))}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Update Task</DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 grid gap-2">
                            <Label className="grid gap-2">
                                Title
                                <Input
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                />
                            </Label>

                            <Label className="grid gap-2">
                                Category
                                <Input
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                />
                            </Label>

                            <Label className="grid gap-2">
                                Description
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </Label>

                            <Select
                                value={data.priority}
                                onValueChange={(v) => setData('priority', v)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenEdit(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
