import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { format } from "date-fns"
import { toast } from "sonner"

type UserOption = { _id: string; username: string }

export default function DialogComponent({ role }: { role?: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        dueDate: null as Date | null,
        assignedTo: ""
    })
    const [users, setUsers] = useState<UserOption[]>([])
    const [usersLoading, setUsersLoading] = useState(false)

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

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.valueAsDate
        setFormData(prev => ({
            ...prev,
            dueDate: date
        }))
    }

    useEffect(() => {
        if (role !== "admin") return
        const fetchUsers = async () => {
            try {
                setUsersLoading(true)
                const res = await api.get("/users") // assumes baseURL '/api'
                setUsers(res.data?.users ?? [])
            } catch (err) {
                console.error("Failed to load users", err)
            } finally {
                setUsersLoading(false)
            }
        }
        fetchUsers()
    }, [role])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Title and description are required")
            return
        }

        setLoading(true)
        try {
            const res = await api.post("/tasks", {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
                assignedTo: formData.assignedTo || undefined
            })

            if (res.status === 201) {
                toast.success("Task created successfully!")
                setFormData({
                    title: "",
                    description: "",
                    priority: "medium",
                    dueDate: null,
                    assignedTo: ""
                })
                window.dispatchEvent(new CustomEvent('task:created'))
                setOpen(false)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to create task"
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
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
                            <SelectTrigger id="priority" disabled={loading}>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
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
                                <SelectTrigger id="assign">
                                    <SelectValue placeholder={usersLoading ? "Loading..." : "Select User"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u._id} value={u._id}>
                                            {u.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    }

                    {/* Due Date Input */}
                    <div className="space-y-2">
                        <label htmlFor="dueDate" className="text-sm font-medium">
                            Due Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                id="dueDate"
                                onChange={handleDateChange}
                                disabled={loading}
                                className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        {formData.dueDate && (
                            <p className="text-xs text-gray-500">
                                Selected: {format(formData.dueDate, "PPP")}
                            </p>
                        )}
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