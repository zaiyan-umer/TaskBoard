'use client'
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, User } from 'lucide-react';
import { toast } from "sonner"; 
import { Button } from "./ui/button"; 
import { PopulatedTask, TaskStatus } from "@/models/task"; 
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useUpdateTaskStatus } from "@/hooks/useUpdateTaskStatus";

type Color = {
    bg: string; border: string; icon: string; text: string; badge: string
}

const CardComponent = ({ task, colors }: {task: PopulatedTask, colors: Color}) => {
    const {deleteTask} = useDeleteTask();
    const {status, updateStatus, loading} = useUpdateTaskStatus(task.status as TaskStatus);

    const handleDelete = async () => {
        await deleteTask(task._id?.toString() as string);
    }

    const handleStatusChange = async (newStatus: TaskStatus) => {
        if (!task._id) {
            toast.error("Invalid task")
            return
        }
        await updateStatus(task._id?.toString(), newStatus);  
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'No date';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getPriorityBorderColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-500 hover:border-red-600';
            case 'medium': return 'border-amber-500 hover:border-amber-600';
            case 'low': return 'border-emerald-500 hover:border-emerald-600';
            default: return 'border-gray-500 hover:border-gray-600';
        }
    };

    return (
        <Card className={`border-2 relative shadow-lg hover:shadow-xl transition-all duration-300 ${getPriorityBorderColor(task.priority)} flex flex-col`}>
            <CardHeader className="space-y-3 sm:space-y-4 pb-4 flex-1">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <CardTitle className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 wrap-break-word'>
                        {task.title}
                    </CardTitle>
                    <div className="flex flex-col gap-2 shrink-0">
                        <Badge variant="secondary" className={`${colors.badge} font-medium border text-xs sm:text-sm`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </Badge>
                        <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
                            <SelectTrigger className="w-32 sm:w-40 cursor-pointer">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem className="cursor-pointer" value="todo">📋 To Do</SelectItem>
                                <SelectItem className="cursor-pointer" value="in_progress">⚙️ In Progress</SelectItem>
                                <SelectItem className="cursor-pointer" value="done">✅ Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <CardDescription className='text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {task.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 sm:pt-4 border-t px-0 mt-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm justify-center">
                    <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                        <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colors.icon}`} />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            <span className="hidden sm:inline">Created by: </span>
                            <span className={`${colors.text} font-semibold`}>{task.createdBy.username}</span>
                        </span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 px-2.5 sm:px-0">
                        Due: {formatDate(task.dueDate)}
                    </div>
                    <Button
                        variant="destructive"
                        className="justify-start max-w-full rounded-sm cursor-pointer"
                        onClick={handleDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default CardComponent