import { useState } from "react"
import { api } from "@/lib/axios"
import { toast } from "sonner"
import { AxiosError } from "axios"

interface CreateTaskPayload {
    title: string
    description: string
    priority: string
    dueDate?: Date
    assignedTo?: string
}

export function useCreateTask() {
    const [loading, setLoading] = useState(false)

    const createTask = async (data: CreateTaskPayload) => {
        if (!data.title.trim() || !data.description.trim()) {
            toast.error("Title and description are required")
            return false
        }

        try {
            setLoading(true)

            const res = await api.post("/tasks", {
                ...data,
                dueDate: data.dueDate ? data.dueDate.toISOString() : null
            })

            toast.success("Task created successfully!")
            window.dispatchEvent(new CustomEvent("task:created"))
            return true
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            toast.error(error.response?.data?.message || "Failed to create task")
            return false
        } finally {
            setLoading(false)
        }
    }

    return { createTask, loading }
}
