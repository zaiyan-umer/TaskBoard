"use client"

import { useState } from "react"
import { useCreateTask } from "@/hooks/useCreateTask"
import { useUser } from "@/store/auth.store"
import { TaskInputs } from "./TaskInputs"
import { AssignSelect } from "./AssignSelect"
import { DueDatePicker } from "./DueDatePicker"
import { ActionButtons } from "./ActionButtons"

export function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const user = useUser()
  const role = user?.role ?? "user"
  const { createTask, loading } = useCreateTask()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: new Date(),
  })

  const update = (key: string, value: any) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  async function handleSubmit() {
    const success = await createTask(formData)
    if (success) onSuccess()
  }

  return (
    <div className="space-y-4">
      <TaskInputs formData={formData} update={update} />

      {role === "admin" && (
        <AssignSelect
          value={formData.assignedTo}
          onChange={(v) => update("assignedTo", v)}
        />
      )}

      <DueDatePicker
        value={formData.dueDate}
        onChange={(date) => update("dueDate", date)}
      />

      <ActionButtons loading={loading} onSubmit={handleSubmit} />
    </div>
  )
}
