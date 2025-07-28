"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  minRows?: number
  maxRows?: number
  showCharacterCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    resize = 'vertical',
    minRows = 3,
    maxRows = 10,
    showCharacterCount = false,
    maxLength,
    onChange,
    value,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '')
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const inputId = id || React.useId()
    const hasError = !!error
    const characterCount = String(internalValue || '').length
    
    // Handle both controlled and uncontrolled components
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e)
      } else {
        setInternalValue(e.target.value)
      }
    }
    
    const currentValue = value !== undefined ? value : internalValue
    
    // Auto-resize functionality
    React.useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      
      // Calculate the height based on content, but respect min/max rows
      const minHeight = minRows * 24 // 1.5rem (24px) per line
      const maxHeight = maxRows * 24
      const contentHeight = textarea.scrollHeight
      
      // Apply the calculated height, respecting min/max
      const newHeight = Math.min(Math.max(contentHeight, minHeight), maxRows ? maxHeight : Infinity)
      textarea.style.height = `${newHeight}px`
    }, [currentValue, minRows, maxRows])
    
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
      sm: "text-xs px-2.5 py-1.5",
      md: "text-sm px-3 py-2",
      lg: "text-base px-4 py-3"
    }

    // Variant classes
    const variantClasses = {
      default: "bg-background border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      filled: "bg-muted border border-transparent hover:bg-muted/80 focus:bg-background focus:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      outline: "bg-background border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      ghost: "bg-transparent border-0 border-b border-input rounded-none px-0 focus:ring-0 focus:border-primary focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
    }
    
    // Resize classes
    const resizeClasses = {
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x',
      vertical: 'resize-y',
    }

    // Icon size based on input size
    const iconSize = {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    }

    return (
      <div className={cn("w-full", fullWidth ? "w-full" : "w-auto", containerClassName)}>
        {(label || (showCharacterCount && maxLength)) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <label 
                htmlFor={inputId}
                className={cn(
                  "block text-sm font-medium text-foreground",
                  hasError && "text-destructive",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {showCharacterCount && maxLength && (
              <span className={cn(
                "text-xs text-muted-foreground",
                characterCount > maxLength && "text-destructive"
              )}>
                {characterCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div 
              className={cn(
                "absolute top-3 left-3",
                onLeftIconClick && "cursor-pointer"
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
          
          <textarea
            id={inputId}
            ref={(node) => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(node)
              } else if (ref) {
                ref.current = node
              }
              textareaRef.current = node
            }}
            className={cn(
              "flex w-full rounded-md font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size],
              variantClasses[variant],
              resizeClasses[resize],
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              hasError ? "border-destructive focus-visible:ring-destructive/50" : "",
              "min-h-[60px]", // Minimum height for better UX
              className
            )}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            onChange={handleChange}
            value={currentValue}
            rows={minRows}
            maxLength={maxLength}
            style={{
              minHeight: `${minRows * 24}px`,
              maxHeight: maxRows ? `${maxRows * 24}px` : 'none',
              overflowY: 'auto'
            }}
            {...props}
          />
          
          {rightIcon && (
            <div 
              className={cn(
                "absolute top-3 right-3",
                onRightIconClick && "cursor-pointer"
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
              initial={animateError ? "hidden" : false}
              animate="visible"
              exit={animateError ? "exit" : false}
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

Textarea.displayName = "Textarea"

export { Textarea }
