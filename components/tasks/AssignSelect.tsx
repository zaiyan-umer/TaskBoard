import { useUsers } from "@/hooks/useUsers"
import { useUser } from "@/store/auth.store"

export function AssignSelect({ value, onChange }: any) {
  const role = useUser()?.role ?? "user"
  const { users, loading } = useUsers(role)

  if (loading) return <p>Loading users...</p>

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Assign to</option>
      {users.map((u: any) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
    </select>
  )
}
