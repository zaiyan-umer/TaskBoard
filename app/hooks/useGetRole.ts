'use client'
import { api } from "@/lib/axios"
import { useEffect, useState } from "react"

export function useGetRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState<true | false>(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get('/users/role')
        setRole(res.data.role)
      } catch (err) {
        console.error("Failed to fetch role", err)
        setRole("user")
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [])

  return { role, loading }
}
