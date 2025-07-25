import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({
  className,
  size = "md",
  text,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size]
        )}
      />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}
