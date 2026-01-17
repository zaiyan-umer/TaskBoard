import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type WorkloadData = {
    [username: string]: {
        dueToday: number;
        dueThisWeek: number;
        overdue: number;
    }
}

async function fetchWorkload() {
    const res = await api.get('/dashboard/workload');
    return res.data;
}

export function useWorkload() {
    return useQuery({
        queryKey: ["workload"],
        queryFn: fetchWorkload,
        staleTime: 60_000, // 1 min cache before refetch
        gcTime: 5 * 60_000, // 5 min in memory
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1
    })
}