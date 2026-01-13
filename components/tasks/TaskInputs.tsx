import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useUser } from "@/store/auth.store"
import { AssignSelect } from "./AssignSelect"
import { DueDatePicker } from "./DueDatePicker"

type TaskFormData = {
  title: string
  description: string
  priority: string
  assignedTo: string
  dueDate: Date | undefined
}

type TaskInputsProps = {
  formData: TaskFormData
  setFormData: (updater: (prev: TaskFormData) => TaskFormData) => void
  handleSubmit: (e: React.FormEvent) => void
  loading: boolean
  setOpen: (open: boolean) => void
}

export function TaskInputs({ formData, setFormData, handleSubmit, loading, setOpen }: TaskInputsProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const user = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
            rows={4}
          />
        </div>

        {/* Priority Select */}
        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <Select value={formData.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger id="priority" disabled={loading} className='cursor-pointer'>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low" className='cursor-pointer'>Low</SelectItem>
              <SelectItem value="medium" className='cursor-pointer'>Medium</SelectItem>
              <SelectItem value="high" className='cursor-pointer'>High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {
          user?.role === "admin" &&
          <AssignSelect formData={formData} setFormData={setFormData} />
        }

        {/* Due Date Input */}
        <DueDatePicker formData={formData} setFormData={setFormData} datePickerOpen={datePickerOpen} setDatePickerOpen={setDatePickerOpen}/>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </>
  )
}
