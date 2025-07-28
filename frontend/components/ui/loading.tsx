import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, Variants } from "framer-motion"

type LoadingVariant = "dots" | "spinner" | "bars" | "pulse"

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoadingVariant
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  className?: string
}

const sizeVariants = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
}

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const dotVariants: Variants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      variant = "dots",
      size = "md",
      color = "currentColor",
      className,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeVariants[size]

    if (variant === "spinner") {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
            sizeClass,
            className
          )}
          style={{ color }}
          {...props}
        >
          <span className="sr-only">Loading...</span>
        </div>
      )
    }

    if (variant === "bars") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-4 items-center justify-center gap-1",
            className
          )}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-full w-1 bg-current"
              style={{ backgroundColor: color }}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              custom={i}
            />
          ))}
        </div>
      )
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-4 items-center justify-center gap-1",
            className
          )}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-current"
              style={{ backgroundColor: color }}
              initial={{ opacity: 0.3, scale: 0.5 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )
    }

    // Default to dots
    return (
      <motion.div
        ref={ref}
        className={cn("flex items-center justify-center gap-2", className)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={cn("inline-block rounded-full bg-current", sizeClass, {
              "h-2 w-2": size === "sm",
              "h-3 w-3": size === "md",
              "h-4 w-4": size === "lg",
              "h-5 w-5": size === "xl",
            })}
            style={{ backgroundColor: color }}
            variants={dotVariants}
            custom={i}
          />
        ))}
      </motion.div>
    )
  }
)

Loading.displayName = "Loading"

export { Loading }
