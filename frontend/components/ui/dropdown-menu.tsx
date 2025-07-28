"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const dropdownMenuContentVariants = cva(
  "z-50 min-w-[12rem] overflow-hidden rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-border/20 bg-popover/95 backdrop-blur-sm",
        glass: "border-white/10 bg-white/30 dark:bg-black/30 backdrop-blur-lg",
        solid: "bg-popover border-border/20",
      },
      size: {
        default: "p-1.5",
        sm: "p-1 text-xs",
        lg: "p-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const dropdownMenuItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent/50 focus:bg-accent/50 active:bg-accent/70",
        destructive: "text-destructive hover:bg-destructive/10 focus:bg-destructive/10",
        success: "text-green-600 dark:text-green-400 hover:bg-green-500/10 focus:bg-green-500/10",
        warning: "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 focus:bg-amber-500/10",
      },
      size: {
        default: "text-sm px-2 py-1.5",
        sm: "text-xs px-2 py-1",
        lg: "text-base px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface DropdownMenuProps 
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
  trigger: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
  contentClassName?: string
  children: React.ReactNode
}

const DropdownMenu = ({
  trigger,
  children,
  align = "center",
  sideOffset = 8,
  className,
  contentClassName,
  ...props
}: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      <DropdownMenuPrimitive.Trigger asChild className={className}>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuContent 
        align={align} 
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenuPrimitive.Root>
  )
}

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & 
    VariantProps<typeof dropdownMenuItemVariants> & {
      inset?: boolean
      icon?: React.ReactNode
      isLoading?: boolean
    }
>(({ 
  className, 
  inset, 
  children, 
  variant,
  size,
  icon: Icon,
  isLoading = false,
  ...props 
}, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant, size, className }),
      "group relative",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-70" />
    ) : Icon ? (
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        {Icon}
      </span>
    ) : null}
    <span className="flex-1">{children}</span>
    <ChevronRight className="ml-2 h-4 w-4 opacity-50 transition-transform group-data-[state=open]:rotate-90" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
    VariantProps<typeof dropdownMenuContentVariants> & {
      withArrow?: boolean
      arrowClassName?: string
    }
>(({ 
  className, 
  sideOffset = 8, 
  variant,
  size,
  withArrow = true,
  arrowClassName,
  children,
  ...props 
}, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        dropdownMenuContentVariants({ variant, size }),
        "origin-[var(--radix-dropdown-menu-content-transform-origin)] animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          {children}
          {withArrow && (
            <DropdownMenuPrimitive.Arrow 
              className={cn(
                "fill-popover stroke-border/50",
                arrowClassName
              )} 
              width={12} 
              height={6} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </DropdownMenuPrimitive.Content>
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & 
    VariantProps<typeof dropdownMenuItemVariants> & {
      inset?: boolean
      icon?: React.ReactNode
      shortcut?: string
      isLoading?: boolean
    }
>(({ 
  className, 
  inset, 
  variant, 
  size,
  icon: Icon,
  shortcut,
  isLoading = false,
  children,
  ...props 
}, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant, size }),
      "group relative",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-70" />
    ) : Icon ? (
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        {Icon}
      </span>
    ) : null}
    <span className="flex-1">{children}</span>
    {shortcut && (
      <span className="ml-4 text-xs tracking-widest text-muted-foreground opacity-60">
        {shortcut}
      </span>
    )}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
    icon?: React.ReactNode
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "flex items-center px-2 py-1.5 text-xs font-semibold text-muted-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {Icon && <span className="mr-2">{Icon}</span>}
    {children}
  </div>
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-1 my-1 h-px bg-border/20",
      inset && "ml-8",
      className
    )}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-4 text-xs tracking-widest text-muted-foreground opacity-60",
        className
      )}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// DropdownMenuSection component for better organization
const DropdownMenuSection: React.FC<{
  children: React.ReactNode
  className?: string
  title?: string
  titleClassName?: string
}> = ({ children, className, title, titleClassName }) => (
  <div className={cn("space-y-1", className)}>
    {title && (
      <DropdownMenuLabel className={cn("px-2", titleClassName)}>
        {title}
      </DropdownMenuLabel>
    )}
    {children}
  </div>
)

// DropdownMenuAction component for common action items
const DropdownMenuAction = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem> & {
    icon: React.ReactNode
    shortcut?: string
    destructive?: boolean
  }
>(({ icon, shortcut, destructive, children, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    variant={destructive ? "destructive" : "default"}
    {...props}
  >
    <span className="mr-2">{icon}</span>
    <span>{children}</span>
    {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
  </DropdownMenuItem>
))
DropdownMenuAction.displayName = "DropdownMenuAction"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuSection,
  DropdownMenuAction,
}
