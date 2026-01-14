import { create } from "zustand"
import { PopulatedTask } from "@/models/task"

type TasksState = {
    task: PopulatedTask | null
    tasks: PopulatedTask[] | []
    loading: boolean
    setTasks: (tasks: PopulatedTask[] | []) => void
}

export const useTasksStore = create<TasksState>((set) => ({
    task: null,
    tasks: [],
    loading: true,

    setTasks: (tasks) => set({ tasks, loading: false })
}))

export const useTasks = () =>
    useTasksStore((state) => state.tasks)

export const useSetTasks = () =>
    useTasksStore((state) => state.setTasks)

export const useTasksLoading = () =>
    useTasksStore((state) => state.loading)
