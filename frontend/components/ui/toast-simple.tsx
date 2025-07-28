"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive" | "success" | "warning" | "info"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex max-w-md items-center justify-between rounded-lg border p-4 shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive: "bg-destructive/90 text-destructive-foreground border-destructive/50",
        success: "bg-green-500/90 text-white border-green-500/50",
        warning: "bg-amber-500/90 text-white border-amber-500/50",
        info: "bg-blue-500/90 text-white border-blue-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  title: string
  description?: string
  onDismiss?: () => void
  duration?: number
}

export function Toast({ 
  className, 
  variant, 
  title, 
  description, 
  onDismiss,
  duration = 5000,
  ...props 
}: ToastProps) {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

type ToastOptions = Omit<ToastProps, 'onDismiss'>

type ToastContextType = {
  showToast: (options: ToastOptions) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const showToast = React.useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    const newToast: ToastProps = {
      ...options,
      onDismiss: () => {
        setToasts((current) => current.filter((t) => t.id !== id))
      },
      id,
    }

    setToasts((current) => [...current, newToast])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
