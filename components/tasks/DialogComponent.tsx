"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { TaskForm } from "./TaskForm"

export function CreateTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Create Task</DialogHeader>

        <TaskForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
