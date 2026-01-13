'use client'
import { useState } from "react";
import { toast } from "sonner";
import { updateTaskStatus } from "@/lib/fetch-data";
import { AxiosError } from "axios";
import { TaskStatus } from "../models/task";

export function useUpdateTaskStatus(initialStatus: TaskStatus) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState<true | false>(false);

  const updateStatus = async (taskId: string, newStatus: typeof status) => {
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await updateTaskStatus({ id: taskId, newStatus });
      if (res.status === 200) {
        toast.success("Task updated successfully!");
        window.dispatchEvent(new CustomEvent("task:updated"));
        return true;
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to update task");
      setStatus(initialStatus);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { status, setStatus, updateStatus, loading };
}
