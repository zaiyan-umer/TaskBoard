import { api } from "@/lib/axios"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateTaskPayload {
    title: string
    description: string
    priority: string
    dueDate?: Date
    assignedTo?: string
}

const createTask = async (data: CreateTaskPayload) => {
    const res = await api.post("/tasks", {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null
    })

    return res.data;
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            toast.error(error.response?.data?.message || "Failed to create task")
        },
        onSuccess: () => {
            toast.success("Task created successfully!")
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            queryClient.invalidateQueries({ queryKey: ["workload"] });
        }
    })
}
