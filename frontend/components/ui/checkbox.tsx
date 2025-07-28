"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string
    description?: string
    error?: string
    containerClassName?: string
    labelClassName?: string
    descriptionClassName?: string
    errorClassName?: string
    showError?: boolean
    size?: "sm" | "md" | "lg"
    variant?: "default" | "primary" | "secondary" | "destructive"
    showIndeterminateIcon?: boolean
  }
>(
  (
    {
      className,
      label,
      description,
      error,
      containerClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      showError = true,
      size = "md",
      variant = "default",
      showIndeterminateIcon = true,
      checked,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || React.useId()
    const hasError = !!error
    const isIndeterminate = checked === "indeterminate"
    const isChecked = checked === true
    
    // Size classes
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6"
    }
    
    // Variant classes
    const variantClasses = {
      default: {
        unchecked: "border-input bg-background",
        checked: "bg-primary border-primary text-primary-foreground",
        indeterminate: "bg-primary/10 border-primary/50 text-primary-foreground",
        focus: "ring-2 ring-ring ring-offset-2 ring-offset-background"
      },
      primary: {
        unchecked: "border-primary/20 bg-background",
        checked: "bg-primary border-primary text-primary-foreground",
        indeterminate: "bg-primary/10 border-primary/50 text-primary-foreground",
        focus: "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
      },
      secondary: {
        unchecked: "border-muted-foreground/30 bg-background",
        checked: "bg-muted-foreground/90 border-muted-foreground/90 text-foreground",
        indeterminate: "bg-muted-foreground/10 border-muted-foreground/30 text-foreground",
        focus: "ring-2 ring-muted-foreground/30 ring-offset-2 ring-offset-background"
      },
      destructive: {
        unchecked: "border-destructive/30 bg-background",
        checked: "bg-destructive border-destructive text-destructive-foreground",
        indeterminate: "bg-destructive/10 border-destructive/50 text-destructive-foreground",
        focus: "ring-2 ring-destructive/50 ring-offset-2 ring-offset-background"
      }
    }
    
    // Icon size based on checkbox size
    const iconSize = {
      sm: 10,
      md: 14,
      lg: 16
    }
    
    // Animation variants for the checkmark
    const checkVariants = {
      initial: { scale: 0.5, opacity: 0 },
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
        scale: 0.5, 
        opacity: 0,
        transition: { 
          duration: 0.1 
        } 
      }
    }
    
    // Animation variants for error message
    const errorVariants = {
      hidden: { opacity: 0, y: -5 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      },
      exit: { 
        opacity: 0, 
        y: -5,
        transition: { 
          duration: 0.2 
        } 
      }
    }

    return (
      <div className={cn("flex flex-col", containerClassName)}>
        <div className="flex items-start space-x-2">
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            className={cn(
              "peer shrink-0 rounded border-2 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              isChecked 
                ? variantClasses[variant].checked 
                : isIndeterminate 
                  ? variantClasses[variant].indeterminate 
                  : variantClasses[variant].unchecked,
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
              hasError && "border-destructive",
              className
            )}
            checked={isChecked}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${checkboxId}-error` : undefined}
            {...props}
          >
            <CheckboxPrimitive.Indicator 
              className={cn(
                "flex h-full w-full items-center justify-center text-current"
              )}
            >
              <AnimatePresence mode="wait">
                {isIndeterminate && showIndeterminateIcon ? (
                  <motion.div
                    key="indeterminate"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={checkVariants}
                  >
                    <Minus 
                      className={cn(
                        size === "sm" ? "h-2.5 w-2.5" : 
                        size === "md" ? "h-3 w-3" : "h-3.5 w-3.5"
                      )} 
                      strokeWidth={3} 
                    />
                  </motion.div>
                ) : isChecked ? (
                  <motion.div
                    key="checked"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={checkVariants}
                  >
                    <Check 
                      className={cn(
                        size === "sm" ? "h-3 w-3" : 
                        size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
                      )} 
                      strokeWidth={3} 
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          
          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    hasError ? "text-destructive" : "text-foreground",
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
          )}
        </div>
        
        {showError && hasError && (
          <AnimatePresence>
            <motion.div
              id={`${checkboxId}-error`}
              className={cn("mt-1.5 text-sm text-destructive", errorClassName)}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={errorVariants}
              role="alert"
            >
              {error}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
