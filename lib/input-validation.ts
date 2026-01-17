import { toast } from "sonner"

export const validateSignupForm = (email: string, username: string, password: string ): boolean => {
    if (!email.trim()) {
        toast.error("Email is required")
        return false
    }
    if (!username.trim()) {
        toast.error("Username is required")
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address")
        return false
    }
    if (!password.trim()) {
        toast.error("Password is required")
        return false
    }
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return false
    }
    return true
}

export const validateLoginForm = (email: string, password: string): boolean => {
    if (!email.trim()) {
        toast.error("Email is required")
        return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address")
        return false
    }
    if (!password.trim()) {
        toast.error("Password is required")
        return false
    }
    return true
}

