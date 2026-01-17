'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCreateTask } from "@/hooks/useCreateTask"
import { TaskInputs } from "./TaskInputs"
import { Plus } from "lucide-react"

export default function DialogComponent() {
  const [open, setOpen] = useState(false)
  const { mutate: createTask, isPending: loading } = useCreateTask()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: undefined as Date | undefined
  })


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  createTask(formData, {
    onSuccess: () => {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: undefined,
        assignedTo: ""
      })
      setOpen(false)
    }
  })
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-8 cursor-pointer">
          <Plus className="h-4 w-4" />
          Create New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill the details below to add a new task.
          </DialogDescription>
        </DialogHeader>
        <TaskInputs formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} setOpen={setOpen} loading={loading}/>
      </DialogContent>
    </Dialog>
  )
}