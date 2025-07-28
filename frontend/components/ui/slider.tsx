"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  label?: string
  description?: string
  containerClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  trackClassName?: string
  rangeClassName?: string
  thumbClassName?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive"
  showValue?: boolean
  valueFormat?: (value: number) => string
  showTooltip?: boolean
  tooltipPosition?: "top" | "bottom" | "left" | "right"
  showMarks?: boolean
  marks?: { value: number; label?: string }[]
  step?: number
  min?: number
  max?: number
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      description,
      containerClassName,
      labelClassName,
      descriptionClassName,
      trackClassName,
      rangeClassName,
      thumbClassName,
      size = "md",
      variant = "default",
      showValue = false,
      valueFormat = (value) => value.toString(),
      showTooltip = true,
      tooltipPosition = "top",
      showMarks = false,
      marks,
      step = 1,
      min = 0,
      max = 100,
      value: propValue,
      defaultValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue || [min + (max - min) / 2]
    )
    const [isDragging, setIsDragging] = React.useState(false)
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const value = propValue !== undefined ? propValue : internalValue
    
    // Handle controlled and uncontrolled state
    const handleValueChange = (newValue: number[]) => {
      if (propValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    // Size classes
    const sizeClasses = {
      root: {
        sm: "h-2",
        md: "h-2.5",
        lg: "h-3"
      },
      thumb: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
      },
      tooltip: {
        sm: "text-xs py-0.5 px-1.5 -mt-7",
        md: "text-xs py-0.5 px-2 -mt-8",
        lg: "text-sm py-1 px-2.5 -mt-9"
      },
      mark: {
        sm: "h-1 w-1 -ml-0.5 -translate-y-1/2",
        md: "h-1.5 w-1.5 -ml-0.5 -translate-y-1/2",
        lg: "h-2 w-2 -ml-1 -translate-y-1/2"
      },
      markLabel: {
        sm: "text-xs mt-1.5 -translate-x-1/2",
        md: "text-xs mt-1.5 -translate-x-1/2",
        lg: "text-sm mt-2 -translate-x-1/2"
      }
    }

    // Variant classes
    const variantClasses = {
      default: {
        track: "bg-muted",
        range: "bg-primary",
        thumb: "bg-background border-2 border-primary ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      },
      primary: {
        track: "bg-primary/20",
        range: "bg-primary",
        thumb: "bg-background border-2 border-primary ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      },
      secondary: {
        track: "bg-muted-foreground/20",
        range: "bg-muted-foreground/90",
        thumb: "bg-background border-2 border-muted-foreground/90 ring-offset-background focus-visible:ring-2 focus-visible:ring-muted-foreground/30 focus-visible:ring-offset-2"
      },
      success: {
        track: "bg-success/20",
        range: "bg-success",
        thumb: "bg-background border-2 border-success ring-offset-background focus-visible:ring-2 focus-visible:ring-success/50 focus-visible:ring-offset-2"
      },
      warning: {
        track: "bg-warning/20",
        range: "bg-warning",
        thumb: "bg-background border-2 border-warning ring-offset-background focus-visible:ring-2 focus-visible:ring-warning/50 focus-visible:ring-offset-2"
      },
      destructive: {
        track: "bg-destructive/20",
        range: "bg-destructive",
        thumb: "bg-background border-2 border-destructive ring-offset-background focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-2"
      }
    }

    // Generate marks if not provided
    const generatedMarks = React.useMemo(() => {
      if (marks) return marks
      
      const markCount = 5
      const step = (max - min) / (markCount - 1)
      return Array.from({ length: markCount }, (_, i) => ({
        value: min + i * step,
        label: (min + i * step).toString()
      }))
    }, [marks, min, max])

    // Tooltip position classes
    const tooltipPositionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2"
    }

    return (
      <div className={cn("w-full", containerClassName)}>
        {(label || (showValue && value.length === 1)) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label
                className={cn(
                  "text-sm font-medium text-foreground",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {showValue && value.length === 1 && (
              <span className="text-sm font-medium text-muted-foreground">
                {valueFormat(value[0])}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              "relative flex w-full touch-none select-none items-center",
              sizeClasses.root[size],
              className
            )}
            value={value}
            onValueChange={handleValueChange}
            min={min}
            max={max}
            step={step}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
            {...props}
          >
            <SliderPrimitive.Track
              className={cn(
                "relative h-full w-full grow overflow-hidden rounded-full",
                variantClasses[variant].track,
                trackClassName
              )}
            >
              <SliderPrimitive.Range
                className={cn(
                  "absolute h-full rounded-full",
                  variantClasses[variant].range,
                  rangeClassName
                )}
              />
            </SliderPrimitive.Track>
            
            {value.map((val, index) => {
              const tooltipX = useTransform(() => {
                const percentage = ((val - min) / (max - min)) * 100
                return `${percentage}%`
              })
              
              return (
                <SliderPrimitive.Thumb
                  key={index}
                  className={cn(
                    "block cursor-pointer rounded-full border-2 shadow-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    sizeClasses.thumb[size],
                    variantClasses[variant].thumb,
                    thumbClassName,
                    isDragging && "scale-110"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {showTooltip && (isDragging || hoveredIndex === index) && (
                    <motion.div
                      className={cn(
                        "absolute rounded-md bg-primary text-primary-foreground font-medium whitespace-nowrap pointer-events-none",
                        sizeClasses.tooltip[size],
                        tooltipPositionClasses[tooltipPosition],
                        "shadow-md"
                      )}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {valueFormat(val)}
                      <div 
                        className={cn(
                          "absolute bg-primary w-2 h-2 rotate-45 -z-10",
                          tooltipPosition === 'top' && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                          tooltipPosition === 'bottom' && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                          tooltipPosition === 'left' && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
                          tooltipPosition === 'right' && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        )}
                      />
                    </motion.div>
                  )}
                </SliderPrimitive.Thumb>
              )
            })}
          </SliderPrimitive.Root>
          
          {showMarks && (
            <div className="relative w-full mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-between">
                {generatedMarks.map((mark, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "rounded-full bg-muted-foreground",
                        sizeClasses.mark[size]
                      )}
                    />
                    {mark.label && (
                      <span className={cn("text-muted-foreground text-center", sizeClasses.markLabel[size])}>
                        {mark.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {description && (
          <p className={cn("mt-1.5 text-sm text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
