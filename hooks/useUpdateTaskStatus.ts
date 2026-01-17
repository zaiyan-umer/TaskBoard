'use client'
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TaskStatus } from "../models/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type UpdateStatusParams = {
  taskId: string;
  newStatus: TaskStatus;
}

const updateStatus = async ({ taskId, newStatus }: UpdateStatusParams) => {
  const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
   return res.data;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      toast.success("Task updated successfully!");
      // Invalidate and refetch tasks automatically
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["workload"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to update task");
    }
  })
}
