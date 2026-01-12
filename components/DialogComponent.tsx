import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDownIcon, Plus } from "lucide-react"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCreateTask } from "@/app/hooks/useCreateTask"
import { useUsers } from "@/app/hooks/useUsers"

export default function DialogComponent({ role }: { role?: string }) {
    const [open, setOpen] = useState(false)
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        dueDate: undefined as Date | undefined
    })

    const { users, loading: usersLoading } = useUsers(role)
    const { createTask, loading } = useCreateTask()

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await createTask(formData)
        if (!success) return

        setFormData({
            title: "",
            description: "",
            priority: "medium",
            dueDate: undefined,
            assignedTo: ""
        })
        setOpen(false)
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
                        role === "admin" &&
                        <div className="space-y-2">
                            <label htmlFor="assign" className="text-sm font-medium">
                                Assign To
                            </label>
                            <Select
                                value={formData.assignedTo || ""}
                                onValueChange={(val) =>
                                    setFormData((prev) => ({ ...prev, assignedTo: val }))
                                }
                                disabled={loading || usersLoading}
                            >
                                <SelectTrigger id="assign" className='cursor-pointer'>
                                    <SelectValue placeholder={usersLoading ? "Loading..." : "Select User"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u._id?.toString()} value={u._id?.toString() as string} className='cursor-pointer'>
                                            {u.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }

                    {/* Due Date Input */}
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
            </DialogContent>
        </Dialog>
    )
}