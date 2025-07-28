import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LabelProps 
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  tooltip?: string
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, tooltip, ...props }, ref) => {
    const label = (
      <>
        {children}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </>
    )

    return (
      <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
      >
        {tooltip ? (
          <span className="flex items-center gap-1">
            {label}
            <span 
              className="text-muted-foreground cursor-help" 
              title={tooltip}
            >
              ⓘ
            </span>
          </span>
        ) : (
          label
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label }
