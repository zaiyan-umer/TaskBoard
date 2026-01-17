'use client'

import { api } from "@/lib/axios"
import { validateLoginForm, validateSignupForm } from "@/lib/input-validation"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSetUser } from "@/store/auth.store"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type LoginParams = { email: string; password: string }

const login = async ({ email, password }: LoginParams) => {
    const res = await api.post("/auth/login", { email, password })
    return res.data
}

export function useLogin() {
    const router = useRouter()
    const setUser = useSetUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (params: LoginParams) => {
            const isValid = validateLoginForm(params.email, params.password)
            if (!isValid) throw new Error("Validation failed")
            return login(params)
        },
        onSuccess: (data) => {
            queryClient.clear() // drop cached data from previous session
            toast.success("Login successful!")
            setUser(data.user)
            router.push(data.user.role === "admin" ? "/admin-panel" : "/")
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            const message = error.response?.data?.message || "Failed to login"
            toast.error(message)
        }
    })
}

export function useSignup() {
    const router = useRouter()

    return useMutation({
        mutationFn: async (params: { email: string; username: string; password: string }) => {
            const isValid = validateSignupForm(params.email, params.username, params.password)
            if (!isValid) throw new Error("Validation failed")
            const res = await api.post("/auth/register", params)
            return res.data
        },
        onSuccess: (data) => {
            toast.success("Registration successful!")
            router.push(data.role === "admin" ? "/dashboard" : "/")
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            const message = error.response?.data?.message || "Failed to signup"
            toast.error(message)
        }
    })
}

export function useLogout() {
    const router = useRouter()
    const setUser = useSetUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const res = await api.get("/auth/logout")
            return res.data
        },
        onSuccess: () => {
            queryClient.clear() // clear all cached queries on logout
            toast.success("Logged out successfully!")
            setUser(null)
            router.push("/auth/login")
        },
        onError: (err) => {
            const error = err as AxiosError<{ message: string }>
            const message = error.response?.data?.message || "Failed to logout"
            toast.error(message)
        }
    })
}
