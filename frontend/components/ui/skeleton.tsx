import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type SkeletonVariant = "text" | "circle" | "rectangle" | "card" | "avatar"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  count?: number
  pulse?: boolean
  shimmer?: boolean
  duration?: number
  rounded?: "sm" | "md" | "lg" | "full" | "none"
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full",
  circle: "rounded-full aspect-square",
  rectangle: "h-24 w-full",
  card: "h-48 w-full rounded-xl",
  avatar: "h-10 w-10 rounded-full",
}

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
  none: "rounded-none",
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant = "text",
    count = 1,
    pulse = true,
    shimmer = true,
    duration = 1.5,
    rounded = "md",
    as: Component = "div",
    style,
    ...props
  }, ref) => {
    const MotionComponent = motion[Component as keyof typeof motion] || motion.div
    
    const baseClasses = cn(
      "relative overflow-hidden bg-muted/30",
      variantClasses[variant],
      rounded !== "none" && roundedClasses[rounded],
      pulse && "animate-pulse",
      className
    )

    const shimmerAnimation = {
      background: `linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      )`,
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: "translateX(-100%)",
      animation: "shimmer 2s infinite",
    }

    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <MotionComponent
            key={i}
            ref={i === 0 ? ref : undefined}
            className={baseClasses}
            style={{
              ...style,
              animationDuration: `${duration}s`,
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            {...props}
          >
            {shimmer && (
              <motion.div
                className="absolute inset-0"
                style={shimmerAnimation}
              />
            )}
          </MotionComponent>
        ))}
      </>
    )
  }
)

Skeleton.displayName = "Skeleton"

export { Skeleton }
