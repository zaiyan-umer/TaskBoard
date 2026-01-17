import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query";

async function fetchTasks() {
  const res = await api.get('/tasks');
  return res.data;
}

export function useFetchTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  })
}
