import { api } from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const upgradeUser = async (id: string) => {
    const res = await api.patch(`/users/${id}/upgrade`, { role: 'admin' });
    return res.data;
}

export function useUpgradeUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: upgradeUser,
        onSuccess: () => {
            toast.success('User upgraded to admin successfully!');
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            toast.error(error.response?.data?.message || 'Failed to upgrade user');
        }
    })
}

