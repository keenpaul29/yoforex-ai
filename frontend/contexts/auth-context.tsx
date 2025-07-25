"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

interface User {
  id: string
  email: string
  name: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  sendVerificationEmail: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement token refresh if needed
        const token = localStorage.getItem("token")
        
        if (token) {
          // TODO: Verify token with backend
          // const response = await fetch("/api/auth/me", {
          //   headers: { Authorization: `Bearer ${token}` }
          // })
          // if (response.ok) {
          //   const userData = await response.json()
          //   setUser(userData)
          // }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"]
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    if (!user && !isPublicPath) {
      router.push("/login")
    } else if (user && isPublicPath) {
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password })
      // })
      // const data = await response.json()
      
      // if (!response.ok) throw new Error(data.message || "Login failed")
      
      // localStorage.setItem("token", data.token)
      // setUser(data.user)
      
      // Mock successful login for now
      const mockUser = { id: "1", email, name: "Test User", isVerified: true }
      localStorage.setItem("token", "mock-token")
      setUser(mockUser)
      
      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.")
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password })
      // })
      // const data = await response.json()
      
      // if (!response.ok) throw new Error(data.message || "Registration failed")
      
      // Mock successful registration for now
      toast.success("Registration successful! Please check your email to verify your account.")
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const sendVerificationEmail = async () => {
    try {
      // TODO: Implement verification email sending
      toast.success("Verification email sent!")
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Failed to send verification email. Please try again.")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement password reset
      toast.success("If an account exists with this email, you will receive a password reset link.")
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Failed to process password reset. Please try again.")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        sendVerificationEmail,
        resetPassword,
        updateUser,
      }}
    >
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
