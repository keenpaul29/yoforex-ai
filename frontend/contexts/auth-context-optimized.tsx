"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth as useAuthHook } from "@/hooks/use-auth"

// Re-export the auth hook types for backward compatibility
export type { User } from "@/hooks/use-auth"

interface AuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>
  register: (data: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: any) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshToken: () => Promise<boolean>
  verifySession: () => Promise<any>
  error: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook()

  // Adapt the new hook interface to the old context interface for backward compatibility
  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    login: async ({ email, password, rememberMe }) => {
      await auth.login({ email, password, rememberMe })
    },
    register: async ({ name, email, password }) => {
      await auth.register({ name, email, password })
    },
    logout: auth.logout,
    updateProfile: auth.updateProfile,
    resetPassword: auth.resetPassword,
    refreshToken: auth.refreshToken,
    verifySession: auth.verifySession,
    error: auth.error,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
