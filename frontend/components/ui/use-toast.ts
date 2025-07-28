import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:right-4 sm:top-4 sm:flex-col-reverse sm:p-4",
  {}
)

type ToastVariant = "default" | "destructive"

const toastItemVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-destructive/50 bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: ToastVariant
  title?: string
  description?: string
  action?: React.ReactNode
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastItemVariants({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {action}
      </div>
    )
  }
)
Toast.displayName = "Toast"

// ToastProvider Component
type ToastProviderProps = {
  children: React.ReactNode
  swipeDirection?: "up" | "down" | "left" | "right"
  swipeThreshold?: number
  duration?: number
}

const ToastProvider = ({
  children,
  swipeDirection = "right",
  swipeThreshold = 50,
  duration = 5000,
}: ToastProviderProps) => {
  return (
    <>
      {children}
      <ToastViewport
        swipeDirection={swipeDirection}
        swipeThreshold={swipeThreshold}
      />
    </>
  )
}

// ToastViewport Component
type ToastViewportProps = {
  swipeDirection?: "up" | "down" | "left" | "right"
  swipeThreshold?: number
  className?: string
}

const ToastViewport = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement> & ToastViewportProps
>(({ className, swipeDirection = "right", swipeThreshold = 50, ...props }, ref) => {
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(toastVariants(), className)}
      {...props}
    />
  )
})
ToastViewport.displayName = "ToastViewport"

// Toast hook
type ToastData = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

const toastContext = React.createContext<{
  toasts: ToastData[]
  toast: (props: Omit<ToastData, 'id'>) => void
  dismiss: (id: string) => void
} | null>(null)

const ToastProviderWithContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([])

  const toast = React.useCallback(({ title, description, variant = 'default', duration = 5000 }: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant, duration },
    ])

    // Auto-dismiss
    setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  return (
    <toastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport>
        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant}>
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && <div className="text-sm opacity-90">{description}</div>}
            </div>
            <button
              onClick={() => dismiss(id)}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Toast>
        ))}
      </ToastViewport>
    </toastContext.Provider>
  )
}

const useToast = () => {
  const context = React.useContext(toastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { Toast, ToastProvider, ToastProviderWithContext, ToastViewport, useToast }
