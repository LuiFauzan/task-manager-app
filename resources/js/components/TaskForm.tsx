import { DialogFooter, DialogHeader,DialogClose, DialogTitle } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFormProps {
    data: {
        title: string;
        description: string;
        priority: string;
        category: string;
    };
    setData(key: string, value: string): void;
    onSubmit(e: React.FormEvent): void;
    processing: boolean;
    submitLabel: string;
}

export default function TaskForm  ({
    data,
    setData,
    onSubmit,
    processing,
    submitLabel,
}: TaskFormProps) {
    return (
        <>
            <form onSubmit={onSubmit}>
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
                        <SelectGroup>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={processing}>
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </form>
        </>
    );
};
