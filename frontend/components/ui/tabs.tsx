"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "pills" | "underlined"
    fullWidth?: boolean
  }
>(({ className, variant = "default", fullWidth = false, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      variant === "pills" && "space-x-1",
      variant === "underlined" && "bg-transparent border-b border-border space-x-6 rounded-none p-0",
      fullWidth && "w-full",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "pills" | "underlined"
    indicatorClassName?: string
  }
>(({ className, variant = "default", indicatorClassName, children, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-foreground",
        variant === "default" && "data-[state=active]:bg-background data-[state=active]:shadow-sm",
        variant === "pills" && "rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm",
        variant === "underlined" && "relative rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 text-sm font-medium text-muted-foreground shadow-none transition-none hover:text-foreground hover:border-foreground/30 data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none",
        className
      )}
      {...props}
    >
      {children}
      {variant === "underlined" && (
        <motion.div
          className={cn(
            "absolute bottom-[-1px] left-0 right-0 h-0.5 bg-foreground",
            indicatorClassName
          )}
          layoutId="activeTabIndicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    animate?: boolean
  }
>(({ className, animate = true, children, ...props }, ref) => {
  const content = (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  )

  return animate ? (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  ) : (
    content
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

// TabsGroup component for better organization
const TabsGroup: React.FC<{
  children: React.ReactNode
  className?: string
  title?: string
  titleClassName?: string
  description?: string
  descriptionClassName?: string
}> = ({ 
  children, 
  className, 
  title, 
  titleClassName,
  description,
  descriptionClassName
}) => (
  <div className={cn("space-y-2", className)}>
    {(title || description) && (
      <div className="space-y-1">
        {title && (
          <h3 className={cn("text-base font-medium leading-none", titleClassName)}>
            {title}
          </h3>
        )}
        {description && (
          <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </div>
)

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsGroup,
}
