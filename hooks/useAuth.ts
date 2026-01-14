'use client'

import { api } from "@/lib/axios"
import { validateLoginForm, validateSignupForm } from "@/lib/input-validation"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useSetUser } from "@/store/auth.store"

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const router = useRouter()
    const setUser = useSetUser()

    const login = async ({ email, password }: { email: string; password: string }) => {
        setError("")

        const isValid = validateLoginForm(email, password, setError)
        if (!isValid) return false

        setLoading(true)
        try {
            const res = await api.post("/auth/login", { email, password })

            toast.success("Login successful!")

            setUser(res.data.user);
            

            router.push(res.data.user.role === "admin" ? "/dashboard" : "/")
            return true
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            const message =
                error.response?.data?.message || "Failed to login. Please try again."

            setError(message)
            setUser(null);
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { login, loading, error }
}

export function useSignup() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const router = useRouter()

    const signup = async ({ email, username, password }: { email: string; username: string; password: string }) => {
        setError("")

        const isValid = validateSignupForm(email, username, password, setError)
        if (!isValid) return false

        setLoading(true)
        try {
            const res = await api.post("/auth/register", { email, username, password })

            toast.success("Registration successful!")

            router.push(res.data.role === "admin" ? "/dashboard" : "/")
            return true
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            const message =
                error.response?.data?.message || "Failed to signup. Please try again."

            setError(message)
            toast.error(message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { signup, loading, error }
}

export function useLogout() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const router = useRouter()
    const setUser = useSetUser()

    const logout = async () => {
        setError("")

        setLoading(true)

        try {
            const res = await api.get("/auth/logout");
            if (res.status === 200) {
                toast.success("Logged out successfully!");
                router.push("/auth/login");
                setUser(null);
                return true
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            const errorMessage = error.response?.data?.message || "Failed to logout. Please try again.";
            setError(errorMessage)
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return { logout, loading, error }
}
