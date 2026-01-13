import { api } from "@/lib/axios"
import { useState } from "react"
import { toast } from "sonner"


export function useDeleteTask() {
    const [loading, setIsLoading] = useState<true | false>(false)

    const deleteTask = async (taskId: string) => {
        setIsLoading(true)
        try {
            const res = await api.delete(`/tasks/${taskId}`)
            if (res.status === 200) {
                toast.success("Task deleted successfully!")
                window.dispatchEvent(new CustomEvent('task:deleted'))
                return true;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete task"
            toast.error(errorMessage)
            return false;
        } finally {
            setIsLoading(false)
        }
    }

    return {deleteTask, loading};
}