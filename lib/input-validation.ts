import { toast } from "sonner"

export const validateSignupForm = (email: string, username: string, password: string, setError: (error: string) => void ): boolean => {
    if (!email.trim()) {
        setError("Email is required")
        toast.error("Email is required")
        return false
    }
    if (!username.trim()) {
        setError("Username is required")
        toast.error("Username is required")
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        toast.error("Please enter a valid email address")
        return false
    }
    if (!password.trim()) {
        setError("Password is required")
        toast.error("Password is required")
        return false
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters")
        toast.error("Password must be at least 6 characters")
        return false
    }
    return true
}

export const validateLoginForm = (email: string, password: string, setError: (error: string) => void ): boolean => {
    if (!email.trim()) {
        setError("Email is required")
        toast.error("Email is required")
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        toast.error("Please enter a valid email address")
        return false
    }
    if (!password.trim()) {
        setError("Password is required")
        toast.error("Password is required")
        return false
    }
    return true
}

