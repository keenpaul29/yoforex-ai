import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    sideOffset?: number
    showArrow?: boolean
    arrowClassName?: string
  }
>(
  (
    {
      className,
      sideOffset = 8,
      showArrow = true,
      arrowClassName,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 500,
            mass: 0.5,
          }}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className={cn(
                "fill-popover",
                arrowClassName
              )}
              width={11}
              height={5}
            />
          )}
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Animated Tooltip with delay
interface AnimatedTooltipProps
  extends React.ComponentPropsWithoutRef<typeof Tooltip> {
  content: React.ReactNode
  delayDuration?: number
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
  contentClassName?: string
  arrowClassName?: string
  showArrow?: boolean
}

const AnimatedTooltip = ({
  children,
  content,
  delayDuration = 300,
  defaultOpen,
  open: openProp,
  onOpenChange,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  className,
  contentClassName,
  arrowClassName,
  showArrow = true,
  ...props
}: AnimatedTooltipProps) => {
  const [open, setOpen] = React.useState(defaultOpen || false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (openProp === undefined) {
      setOpen(newOpen)
    }
    
    if (newOpen) {
      clearTimeout(timeoutRef.current)
      setIsVisible(true)
    } else {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 150) // Match the animation duration
    }
  }

  React.useEffect(() => {
    setIsMounted(true)
    return () => {
      clearTimeout(timeoutRef.current)
      setIsMounted(false)
    }
  }, [])

  const controlledOpen = openProp !== undefined ? openProp : open
  const show = isMounted && (controlledOpen || isVisible)

  return (
    <Tooltip
      delayDuration={delayDuration}
      defaultOpen={defaultOpen}
      open={controlledOpen || isVisible}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <AnimatePresence>
        {show && (
          <TooltipContent
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={contentClassName}
            arrowClassName={arrowClassName}
            showArrow={showArrow}
          >
            {content}
          </TooltipContent>
        )}
      </AnimatePresence>
    </Tooltip>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  AnimatedTooltip,
}
