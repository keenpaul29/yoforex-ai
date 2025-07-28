"use client"

import * as React from "react"
import { Dialog, DialogContent } from "./dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  shouldFilter?: boolean
  filter?: (value: string, search: string) => number
  loop?: boolean
}

const CommandDialog = ({
  children,
  shouldFilter = true,
  filter,
  loop = true,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <AnimatePresence>
        {props.open && (
          <DialogContent className="overflow-hidden p-0 shadow-2xl">
            <Command 
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
              shouldFilter={shouldFilter}
              filter={filter}
              loop={loop}
            >
              {children}
            </Command>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    containerClassName?: string
    searchIcon?: React.ReactNode
  }
>(({ className, containerClassName, searchIcon, ...props }, ref) => (
  <div 
    className={cn(
      "flex items-center border-b px-3",
      containerClassName
    )} 
    cmdk-input-wrapper=""
  >
    {searchIcon || <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> & {
    heading?: React.ReactNode
    headingClassName?: string
  }
>(({ className, heading, headingClassName, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  >
    {heading && (
      <div 
        className={cn(
          "px-2 py-1.5 text-xs font-medium text-muted-foreground",
          headingClassName
        )}
      >
        {heading}
      </div>
    )}
    <div className="space-y-0.5">{props.children}</div>
  </CommandPrimitive.Group>
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    selected?: boolean
    icon?: React.ReactNode
    shortcut?: string
    animate?: boolean
  }
>(({ className, selected, icon, shortcut, animate = true, children, ...props }, ref) => {
  const item = (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selected && "bg-accent/50",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2 flex h-4 w-4 items-center justify-center">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-2 text-xs tracking-widest text-muted-foreground">
          {shortcut}
        </span>
      )}
    </CommandPrimitive.Item>
  )

  return animate ? (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.1 }}
    >
      {item}
    </motion.div>
  ) : (
    item
  )
})
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

// Command loading state
const CommandLoading = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex h-16 flex-col items-center justify-center space-y-2 text-sm text-muted-foreground",
      className
    )}
    {...props}
  >
    {children || "Loading..."}
  </div>
)

// Command skeleton loader
const CommandSkeleton = ({
  className,
  count = 3,
  ...props
}: {
  className?: string
  count?: number
}) => (
  <div className={cn("space-y-2 p-2", className)} {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-9 w-full animate-pulse rounded-md bg-muted"
      />
    ))}
  </div>
)

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandLoading,
  CommandSkeleton,
}
