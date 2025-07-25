import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-animated shadow-lg backdrop-blur-md",
  {
    variants: {
      variant: {
        // Solid variants
        primary:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.98]",
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90 active:scale-[0.98]",
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
        
        // Outline variants
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        "outline-primary":
          "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 active:scale-[0.98]",
        "outline-success":
          "border border-success/30 bg-transparent text-success hover:bg-success/10 active:scale-[0.98]",
        "outline-warning":
          "border border-warning/30 bg-transparent text-warning hover:bg-warning/10 active:scale-[0.98]",
        "outline-destructive":
          "border border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10 active:scale-[0.98]",
        
        // Ghost variants
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        "ghost-primary": "text-primary hover:bg-primary/10 active:scale-[0.98]",
        "ghost-success": "text-success hover:bg-success/10 active:scale-[0.98]",
        "ghost-warning": "text-warning hover:bg-warning/10 active:scale-[0.98]",
        "ghost-destructive": "text-destructive hover:bg-destructive/10 active:scale-[0.98]",
        
        // Text/link variants
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        "link-muted": "text-muted-foreground underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 rounded px-2 text-xs",
        sm: "h-8 rounded px-3 text-sm",
        default: "h-9 px-4 py-2 rounded-md",
        lg: "h-10 rounded-md px-6 text-base",
        xl: "h-12 rounded-md px-8 text-lg",
        icon: "h-9 w-9 rounded-full",
        "icon-sm": "h-7 w-7 rounded-full p-0",
        "icon-lg": "h-11 w-11 rounded-full p-0",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    disabled,
    isLoading = false,
    loadingText,
    children,
    leftIcon,
    rightIcon,
    rounded,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // If loading, disable the button and show loading state
    const isDisabled = disabled || isLoading
    
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            rounded,
            className,
          }),
          {
            "cursor-not-allowed opacity-70": isDisabled,
            "pointer-events-none": isLoading,
          }
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
