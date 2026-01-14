import { api } from "@/lib/axios";
import { useFetchTasks } from "./useFetchTasks";
import { useEffect, useState } from "react";

export type WorkloadData = {
    [username: string]: {
        dueToday: number;
        dueThisWeek: number;
        overdue: number;
    }
}

export function useWorkload() {
    const [loading, setLoading] = useState(false);
    const [workload, setWorkload] = useState<WorkloadData>({});
    const { tasks } = useFetchTasks();

    useEffect(() => {
        const fetchWorkload = async () => {
            try {
                setLoading(true)

                const res = await api.get('/dashboard/workload')
                setWorkload(res.data.workload);
            } catch (err) {
                console.error("Error fetching workload:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchWorkload();
    }, [])


    return { workload, loading }
}