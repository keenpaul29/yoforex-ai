/**
 * Format a date to a human-readable string
 * @param date - Date object or string to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date object or string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  const minute = 60
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diffInSeconds < 10) return 'just now'
  if (diffInSeconds < minute) return `${diffInSeconds} seconds ago`
  if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)} minutes ago`
  if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)} hours ago`
  if (diffInSeconds < month) return `${Math.floor(diffInSeconds / day)} days ago`
  if (diffInSeconds < year) return `${Math.floor(diffInSeconds / month)} months ago`
  return `${Math.floor(diffInSeconds / year)} years ago`
}

/**
 * Format a duration in milliseconds to a human-readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns boolean
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Get the start of the day for a given date
 * @param date - Date object
 * @returns Date object at the start of the day
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get the end of the day for a given date
 * @param date - Date object
 * @returns Date object at the end of the day
 */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Add days to a date
 * @param date - Date object
 * @param days - Number of days to add (can be negative)
 * @returns New Date object
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
