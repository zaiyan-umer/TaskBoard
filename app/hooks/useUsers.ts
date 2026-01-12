import { useEffect, useState } from "react"
import { fetchAllUsers } from "@/lib/fetch-data"
import { IUser } from "@/app/models/user"

export function useUsers(role?: string) {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role !== "admin") return

    const loadUsers = async () => {
      try {
        setLoading(true)
        const res = await fetchAllUsers()
        setUsers(res ?? [])
      } catch (err) {
        console.error("Failed to fetch users", err)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [role])

  return { users, loading }
}
