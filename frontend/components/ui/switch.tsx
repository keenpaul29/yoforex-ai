"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    label?: string
    description?: string
    containerClassName?: string
    labelClassName?: string
    descriptionClassName?: string
    thumbClassName?: string
    size?: "sm" | "md" | "lg"
    variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive"
    showIcons?: boolean
    loading?: boolean
  }
>(
  (
    {
      className,
      label,
      description,
      containerClassName,
      labelClassName,
      descriptionClassName,
      thumbClassName,
      size = "md",
      variant = "default",
      showIcons = false,
      loading = false,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      root: {
        sm: "h-4 w-8",
        md: "h-5 w-10",
        lg: "h-6 w-12"
      },
      thumb: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-4",
        md: "h-4 w-4 data-[state=checked]:translate-x-5",
        lg: "h-5 w-5 data-[state=checked]:translate-x-6"
      },
      icon: {
        sm: "h-2.5 w-2.5",
        md: "h-3 w-3",
        lg: "h-3.5 w-3.5"
      }
    }

    // Variant classes
    const variantClasses = {
      default: {
        root: "bg-input hover:bg-input/80 data-[state=checked]:bg-primary",
        thumb: "bg-background shadow-sm"
      },
      primary: {
        root: "bg-primary/20 hover:bg-primary/30 data-[state=checked]:bg-primary",
        thumb: "bg-background shadow-sm"
      },
      secondary: {
        root: "bg-muted-foreground/20 hover:bg-muted-foreground/30 data-[state=checked]:bg-muted-foreground/90",
        thumb: "bg-background shadow-sm"
      },
      success: {
        root: "bg-success/20 hover:bg-success/30 data-[state=checked]:bg-success",
        thumb: "bg-background shadow-sm"
      },
      warning: {
        root: "bg-warning/20 hover:bg-warning/30 data-[state=checked]:bg-warning",
        thumb: "bg-background shadow-sm"
      },
      destructive: {
        root: "bg-destructive/20 hover:bg-destructive/30 data-[state=checked]:bg-destructive",
        thumb: "bg-background shadow-sm"
      }
    }

    // Animation variants for the thumb
    const thumbVariants = {
      initial: { scale: 0.8, opacity: 0.8 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      },
      exit: { 
        scale: 0.8, 
        opacity: 0.8,
        transition: { 
          duration: 0.15 
        } 
      }
    }

    // Animation variants for the icons
    const iconVariants = {
      initial: { scale: 0.8, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      },
      exit: { 
        scale: 0.8, 
        opacity: 0,
        transition: { 
          duration: 0.15 
        } 
      }
    }

    return (
      <div className={cn("flex items-center justify-between", containerClassName)}>
        <div className="grid gap-1.5">
          {label && (
            <label
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
        
        <SwitchPrimitives.Root
          className={cn(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses.root[size],
            variantClasses[variant].root,
            className
          )}
          disabled={disabled || loading}
          ref={ref}
          {...props}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "pointer-events-none block rounded-full transition-transform duration-200 data-[state=unchecked]:translate-x-0",
              sizeClasses.thumb[size],
              variantClasses[variant].thumb,
              "relative flex items-center justify-center",
              thumbClassName
            )}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  className={cn("absolute inset-0 flex items-center justify-center", sizeClasses.icon[size])}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={iconVariants}
                >
                  <div className="h-3/4 w-3/4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </motion.div>
              ) : showIcons ? (
                <>
                  <motion.span
                    key="checked"
                    className={cn("absolute inset-0 flex items-center justify-center text-foreground", sizeClasses.icon[size])}
                    initial="initial"
                    animate={checked ? "animate" : "exit"}
                    variants={iconVariants}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-full"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.span>
                  <motion.span
                    key="unchecked"
                    className={cn("absolute inset-0 flex items-center justify-center text-foreground", sizeClasses.icon[size])}
                    initial="initial"
                    animate={!checked ? "animate" : "exit"}
                    variants={iconVariants}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-full"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.span>
                </>
              ) : null}
            </AnimatePresence>
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
