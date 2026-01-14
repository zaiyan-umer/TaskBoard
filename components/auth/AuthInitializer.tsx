"use client"

import { useEffect } from "react"
import { api } from "@/lib/axios"
import { useSetUser } from "@/store/auth.store"

export function AuthInitializer() {
  const setUser = useSetUser()

  useEffect(() => {
    let isActive = true

    const hydrateUser = async () => {
      try {
        const res = await api.get("/auth/me")
        if (!isActive) return
        setUser(res.data.user)
      } catch (err) {
        if (!isActive) return
        // Ensure loading flag flips to false even if unauthenticated
        setUser(null)
      }
    }

    hydrateUser()

    return () => {
      isActive = false
    }
  }, [setUser])

  return null
}
