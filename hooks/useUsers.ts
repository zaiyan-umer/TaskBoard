import { IUser } from "@/models/user"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

const getUsers = async () => {
  const res = await api.get('/users');
  return res.data.users;
}

export function useUsers(role?: string) {
  return useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
    enabled: role === "admin",
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}