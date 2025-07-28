import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, Variants } from "framer-motion"

type CardVariant = "default" | "gradient" | "glass" | "outline" | "elevated"

const cardVariants: Record<CardVariant, string> = {
  default: "bg-card border-border/20 hover:border-border/40",
  gradient: "bg-gradient-to-br from-card to-card/80 border-transparent",
  glass: "backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10",
  outline: "bg-transparent border-border/20 hover:border-border/40",
  elevated: "bg-card border-border/10 shadow-lg hover:shadow-xl",
}

const hoverVariants: Variants = {
  hover: {
    y: -4,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  initial: {
    y: 0,
  },
}

const scaleVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  initial: {
    scale: 1,
  },
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hoverEffect?: "lift" | "scale" | "none"
  withBorder?: boolean
  withGradientBorder?: boolean
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = "default",
    hoverEffect = "lift",
    withBorder = true,
    withGradientBorder = false,
    as: Component = "div",
    ...props
  }, ref) => {
    const MotionComponent = motion[Component as keyof typeof motion] || motion.div
    
    return (
      <MotionComponent
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-clip-padding transition-all duration-300",
          cardVariants[variant],
          withGradientBorder && "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/50 before:to-secondary/50 before:p-[1px] before:content-['']",
          withGradientBorder && "before:pointer-events-none",
          withGradientBorder && "bg-card/50 backdrop-blur-sm",
          !withBorder && "border-transparent",
          className
        )}
        variants={hoverEffect === "lift" ? hoverVariants : hoverEffect === "scale" ? scaleVariants : {}}
        initial="initial"
        whileHover={hoverEffect !== "none" ? "hover" : undefined}
        {...props}
      >
        {withGradientBorder && (
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        {props.children}
      </MotionComponent>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-3",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl font-bold tracking-tight text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 border-t border-border/20 p-6 pt-4",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  type CardVariant,
}
