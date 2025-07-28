"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
  containerClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary" | "destructive"
  showIndicator?: boolean
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      className,
      children,
      label,
      description,
      containerClassName,
      labelClassName,
      descriptionClassName,
      size = "md",
      variant = "default",
      showIndicator = true,
      id,
      ...props
    },
    ref
  ) => {
    const radioId = id || React.useId()
    
    // Size classes
    const sizeClasses = {
      root: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      },
      indicator: {
        sm: "h-1.5 w-1.5",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3"
      },
      spacing: {
        sm: "gap-2",
        md: "gap-2.5",
        lg: "gap-3"
      }
    }
    
    // Variant classes
    const variantClasses = {
      default: {
        unchecked: "border-input text-foreground",
        checked: "border-primary text-primary",
        focus: "ring-2 ring-ring ring-offset-2 ring-offset-background"
      },
      primary: {
        unchecked: "border-primary/20 text-foreground",
        checked: "border-primary text-primary",
        focus: "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
      },
      secondary: {
        unchecked: "border-muted-foreground/30 text-foreground",
        checked: "border-muted-foreground/90 text-foreground",
        focus: "ring-2 ring-muted-foreground/30 ring-offset-2 ring-offset-background"
      },
      destructive: {
        unchecked: "border-destructive/30 text-destructive",
        checked: "border-destructive text-destructive",
        focus: "ring-2 ring-destructive/50 ring-offset-2 ring-offset-background"
      }
    }
    
    // Animation variants for the indicator
    const indicatorVariants = {
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

    return (
      <div className={cn("flex items-start", containerClassName)}>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={radioId}
          className={cn(
            "aspect-square rounded-full border-2 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses.root[size],
            variantClasses[variant].unchecked,
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
            "data-[state=checked]:bg-transparent",
            "relative",
            className
          )}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <AnimatePresence>
              <motion.div
                key="indicator"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={indicatorVariants}
                className={cn(
                  "rounded-full bg-current",
                  sizeClasses.indicator[size]
                )}
              />
            </AnimatePresence>
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
        
        {(label || description || children) && (
          <div className={cn("grid gap-0.5 pl-2 leading-none", sizeClasses.spacing[size])}>
            {label && (
              <label
                htmlFor={radioId}
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
            {children}
          </div>
        )}
      </div>
    )
  }
)
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
