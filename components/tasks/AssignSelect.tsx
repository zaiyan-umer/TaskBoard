import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsers } from "@/hooks/useUsers"

type TaskFormData = {
  title: string
  description: string
  priority: string
  assignedTo: string
  dueDate: Date | undefined
}

type AssignSelectProps = {
  formData: TaskFormData
  setFormData: (updater: (prev: TaskFormData) => TaskFormData) => void
  role: string
}

export function AssignSelect({ formData, setFormData, role }: AssignSelectProps) {
  const { users, loading } = useUsers(role)

  if (loading) return <p>Loading users...</p>

  return (
    <div className="space-y-2">
      <label htmlFor="assign" className="text-sm font-medium">
        Assign To
      </label>
      <Select
        value={formData.assignedTo || ""}
        onValueChange={(val) =>
          setFormData((prev) => ({ ...prev, assignedTo: val }))
        }
        disabled={loading}
      >
        <SelectTrigger id="assign" className='cursor-pointer'>
          <SelectValue placeholder={loading ? "Loading..." : "Select User"} />
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
  )
}
