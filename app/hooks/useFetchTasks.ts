import { useCallback, useEffect, useState } from "react"
import { PopulatedTask } from "../models/task"
import { api } from "@/lib/axios"

export function useFetchTasks() {
  const [tasks, setTasks] = useState<PopulatedTask[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)

      const res = await api.get('/tasks')
      setTasks(res.data?.tasks ?? [])
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Re-fetch on task events
  useEffect(() => {
    const handler = () => fetchTasks()

    window.addEventListener('task:created', handler)
    window.addEventListener('task:updated', handler)
    window.addEventListener('task:deleted', handler)

    return () => {
      window.removeEventListener('task:created', handler)
      window.removeEventListener('task:updated', handler)
      window.removeEventListener('task:deleted', handler)
    }
  }, [fetchTasks])

  return {tasks,loading, refetch: fetchTasks}
}
