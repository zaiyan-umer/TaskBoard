import { useCallback, useEffect, useState } from "react"
import { fetchAllUsers } from "@/lib/fetch-data"
import { IUser } from "@/models/user"

export function useUsers(role?: string) {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)

  const loadUsers = useCallback(async () => {
    if (role !== "admin") return

    try {
      setLoading(true)
      const res = await fetchAllUsers()
      setUsers(res ?? [])
      
    } catch (err) {
      console.error("Failed to fetch users", err)
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Listen to user update events
  useEffect(() => {
    const handler = () => loadUsers()

    window.addEventListener('user:updated', handler)

    return () => {
      window.removeEventListener('user:updated', handler)
    }
  }, [loadUsers])

  return { users, loading }
}
