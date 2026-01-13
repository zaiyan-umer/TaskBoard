'use client'

import { api } from "@/lib/axios"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"


type TaskStatuses = {
    Todo: number
    InProgress: number
    Done: number
}

type TaskPriorities = {
    HighPriority: number
    MediumPriority: number
    LowPriority: number
}

type StatsResponse = {
    Todo?: number
    InProgress?: number
    Done?: number
    HighPriority?: number
    MediumPriority?: number
    LowPriority?: number
}

export function useMyStats( tasks ) {
    const [taskStatuses, setTaskStatuses] = useState<TaskStatuses>({
        Todo: 0,
        InProgress: 0,
        Done: 0,
    })

    const [taskPriorities, setTaskPriorities] = useState<TaskPriorities>({
        HighPriority: 0,
        MediumPriority: 0,
        LowPriority: 0
    })

    useEffect(() => {
        let isMounted = true

        const fetchStats = async () => {
            try {
                const res = await api.get<StatsResponse>('/dashboard/my-stats')
                const {
                    Todo = 0,
                    InProgress = 0,
                    Done = 0,
                    HighPriority = 0,
                    MediumPriority = 0,
                    LowPriority = 0,
                } = res.data || {}

                if (!isMounted) return

                setTaskStatuses({ Todo, InProgress, Done })
                setTaskPriorities({ HighPriority, MediumPriority, LowPriority })
                toast.success('Fetched')
                return true
            } catch (error) {
                const errorMessage = error as AxiosError<{ message: string }>
                toast.error(errorMessage.response?.data?.message || 'Failed to fetch stats')
                return false
            }
        }
        fetchStats()

        return () => {
            isMounted = false
        }
    }, [tasks])

    return {taskStatuses, taskPriorities}
}