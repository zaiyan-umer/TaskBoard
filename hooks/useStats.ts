'use client'

import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

async function fetchStats(endpoint: string) {
    const res = await api.get(`/dashboard/${endpoint}`);
    return res.data;
}

export function useStats(endpoint: string) {
    return useQuery({
        queryKey: ["stats", endpoint], // unique key per endpoint
        queryFn: () => fetchStats(endpoint),
        staleTime: 60_000, // 1 min cache before refetch
        gcTime: 5 * 60_000, // 5 min in memory
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}