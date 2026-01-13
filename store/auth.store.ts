import { create } from "zustand"
import type { IUser } from "@/models/user"

type AuthState = {
    user: IUser | null
    loading: boolean
    setUser: (user: IUser | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user, loading: false }),
    logout: () => set({ user: null, loading: false }),
}))


export const useUser = () =>
    useAuthStore((state) => state.user)

export const useAuthLoading = () =>
    useAuthStore((state) => state.loading)

export const useSetUser = () =>
    useAuthStore((state) => state.setUser)

export const useLogout = () =>
    useAuthStore((state) => state.logout)
