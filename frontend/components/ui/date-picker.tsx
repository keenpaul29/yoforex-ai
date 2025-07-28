"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  popoverClassName?: string
  calendarClassName?: string
  showTimeSelect?: boolean
  timeIntervals?: number
  timeFormat?: string
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  inline?: boolean
  label?: string
  required?: boolean
  error?: string
  id?: string
  name?: string
  onBlur?: () => void
  onFocus?: () => void
  readOnly?: boolean
  autoFocus?: boolean
  tabIndex?: number
  withPortal?: boolean
  showYearDropdown?: boolean
  showMonthDropdown?: boolean
  dropdownMode?: "scroll" | "select"
  scrollableYearDropdown?: boolean
  yearDropdownItemNumber?: number
  onYearChange?: (date: Date) => void
  onMonthChange?: (date: Date) => void
  onDayMouseEnter?: (date: Date) => void
  onMonthScrollStart?: () => void
  onMonthScrollEnd?: () => void
  onYearScrollStart?: () => void
  onYearScrollEnd?: () => void
  renderCustomHeader?: ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: {
    date: Date
    decreaseMonth: () => void
    increaseMonth: () => void
    prevMonthButtonDisabled: boolean
    nextMonthButtonDisabled: boolean
  }) => React.ReactNode
}

const DatePicker = ({
  value = null,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  popoverClassName,
  calendarClassName,
  showTimeSelect = false,
  timeIntervals = 30,
  timeFormat = "h:mm aa",
  dateFormat = "PPP",
  minDate,
  maxDate,
  disabledDates,
  inline = false,
  label,
  required = false,
  error,
  id,
  name,
  onBlur,
  onFocus,
  readOnly = false,
  autoFocus = false,
  tabIndex,
  withPortal = false,
  showYearDropdown = false,
  showMonthDropdown = false,
  dropdownMode = "scroll",
  scrollableYearDropdown = false,
  yearDropdownItemNumber = 12,
  onYearChange,
  onMonthChange,
  onDayMouseEnter,
  onMonthScrollStart,
  onMonthScrollEnd,
  onYearScrollStart,
  onYearScrollEnd,
  renderCustomHeader,
  ...props
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value || null)
  const [timeValue, setTimeValue] = React.useState<string>(
    value ? format(value, timeFormat) : ""
  )

  React.useEffect(() => {
    setSelectedDate(value)
    if (value) {
      setTimeValue(format(value, timeFormat))
    }
  }, [value, timeFormat])

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    
    let newDate = date
    
    // If we have a time value and the date changes, preserve the time
    if (selectedDate && timeValue) {
      const [hours, minutes] = timeValue.split(":")
      newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10))
      newDate.setMinutes(parseInt(minutes, 10))
    }
    
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value
    if (!selectedDate) return
    
    const [hours, minutes] = time.split(":")
    const newDate = new Date(selectedDate)
    newDate.setHours(parseInt(hours, 10))
    newDate.setMinutes(parseInt(minutes, 10))
    
    setTimeValue(time)
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  const handleClose = () => {
    setIsOpen(false)
    onBlur?.()
  }

  const handleOpenChange = (open: boolean) => {
    if (disabled || readOnly) return
    setIsOpen(open)
    if (!open) {
      onBlur?.()
    } else {
      onFocus?.()
    }
  }

  const renderCustomHeaderDefault = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: {
    date: Date
    decreaseMonth: () => void
    increaseMonth: () => void
    prevMonthButtonDisabled: boolean
    nextMonthButtonDisabled: boolean
  }) => (
    <div className="flex items-center justify-between px-4 pt-4">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50",
          prevMonthButtonDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="sr-only">Previous month</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div className="text-sm font-medium">
        {format(date, "MMMM yyyy")}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50",
          nextMonthButtonDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span className="sr-only">Next month</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  )

  const calendar = (
    <div className={cn("space-y-4 p-4", calendarClassName)}>
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleDateChange}
        disabled={disabledDates}
        initialFocus={!inline}
        defaultMonth={selectedDate || new Date()}
        minDate={minDate}
        maxDate={maxDate}
        components={{
          IconLeft: () => null,
          IconRight: () => null,
        }}
        className="w-full"
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
      
      {showTimeSelect && (
        <div className="flex items-center space-x-2">
          <label htmlFor="time" className="text-sm font-medium text-foreground/70">
            Time:
          </label>
          <input
            type="time"
            id="time"
            value={timeValue}
            onChange={handleTimeChange}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedDate(null)
            setTimeValue("")
            onChange?.(undefined)
            handleClose()
          }}
        >
          Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleClose}
        >
          Done
        </Button>
      </div>
    </div>
  )

  if (inline) {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <div className={cn("rounded-md border border-input bg-background p-4 shadow-sm", calendarClassName)}>
          {calendar}
        </div>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50",
              error && "border-destructive"
            )}
            disabled={disabled}
            onBlur={onBlur}
            onFocus={onFocus}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, dateFormat) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto p-0",
            popoverClassName
          )}
          align="start"
          sideOffset={4}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {calendar}
              </motion.div>
            )}
          </AnimatePresence>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { DatePicker }
