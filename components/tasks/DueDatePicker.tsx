import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChevronDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type TaskFormData = {
  title: string
  description: string
  priority: string
  assignedTo: string
  dueDate: Date | undefined
}

type DatePickerProps = {
  formData: TaskFormData
  setFormData: (updater: (prev: TaskFormData) => TaskFormData) => void
  datePickerOpen: boolean
  setDatePickerOpen: (val: boolean) => void
}
export function DueDatePicker({ formData, setFormData, datePickerOpen, setDatePickerOpen }: DatePickerProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="dueDate" className="text-sm font-medium mr-4">
        Due Date
      </label>

      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal cursor-pointer"
          >
            {formData.dueDate ? formData.dueDate.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.dueDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              setFormData(prev => ({ ...prev, dueDate: date }))
              setDatePickerOpen(false)
            }}

          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
