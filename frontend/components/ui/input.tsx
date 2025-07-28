"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  showError?: boolean
  variant?: "default" | "filled" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  animateError?: boolean
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    containerClassName,
    label,
    error,
    leftIcon,
    rightIcon,
    labelClassName,
    errorClassName,
    showError = true,
    variant = "outline",
    size = "md",
    fullWidth = false,
    animateError = true,
    onLeftIconClick,
    onRightIconClick,
    id,
    disabled,
    ...props
  }, ref) => {
    const inputId = id || React.useId()
    const hasError = !!error
    
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

    // Size classes
    const sizeClasses = {
      sm: "h-8 text-xs px-2.5",
      md: "h-10 text-sm px-3",
      lg: "h-12 text-base px-4"
    }

    // Variant classes
    const variantClasses = {
      default: "bg-background border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      filled: "bg-muted border border-transparent hover:bg-muted/80 focus:bg-background focus:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      outline: "bg-background border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      ghost: "bg-transparent border-0 border-b border-input rounded-none px-0 focus:ring-0 focus:border-primary focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
    }

    // Icon size based on input size
    const iconSize = {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }

    return (
      <div className={cn("w-full", fullWidth ? "w-full" : "w-auto", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-foreground mb-1.5",
              hasError && "text-destructive",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div 
              className={cn(
                "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                onLeftIconClick && "pointer-events-auto cursor-pointer"
              )}
              onClick={onLeftIconClick}
            >
              {React.cloneElement(leftIcon as React.ReactElement, {
                className: cn(
                  iconSize[size],
                  "text-muted-foreground",
                  (leftIcon as React.ReactElement).props.className
                )
              })}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              "flex w-full rounded-md font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              variantClasses[variant],
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              hasError ? "border-destructive focus-visible:ring-destructive/50" : "",
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div 
              className={cn(
                "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                onRightIconClick && "pointer-events-auto cursor-pointer"
              )}
              onClick={onRightIconClick}
            >
              {React.cloneElement(rightIcon as React.ReactElement, {
                className: cn(
                  iconSize[size],
                  "text-muted-foreground",
                  (rightIcon as React.ReactElement).props.className
                )
              })}
            </div>
          )}
        </div>
        
        {showError && hasError && (
          <AnimatePresence>
            <motion.div
              id={`${inputId}-error`}
              className={cn("mt-1.5 text-sm text-destructive", errorClassName)}
              initial={animateError ? "hidden" : undefined}
              animate="visible"
              exit={animateError ? "exit" : undefined}
              variants={animateError ? errorVariants : undefined}
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

Input.displayName = "Input"

export { Input }
