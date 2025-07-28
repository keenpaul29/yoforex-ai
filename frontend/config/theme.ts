import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    DEFAULT: '#0ea5e9',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    DEFAULT: '#8b5cf6',
  },
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    DEFAULT: '#22c55e',
  },
  destructive: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    DEFAULT: '#ef4444',
  },
  success: {
    DEFAULT: '#10b981',
    light: '#d1fae5',
    dark: '#065f46',
  },
  warning: {
    DEFAULT: '#f59e0b',
    light: '#fef3c7',
    dark: '#92400e',
  },
  info: {
    DEFAULT: '#3b82f6',
    light: '#dbeafe',
    dark: '#1e40af',
  },
}

export const gradients = {
  primary: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)',
  secondary: 'linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-accent-500) 100%)',
  accent: 'linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-primary-500) 100%)',
  dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  light: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
  glow: '0 0 15px rgba(59, 130, 246, 0.5)',
  'glow-primary': '0 0 20px var(--color-primary-500/30)',
  'glow-secondary': '0 0 20px var(--color-secondary-500/30)',
  'glow-accent': '0 0 20px var(--color-accent-500/30)',
}

export const animations = {
  'spin-slow': 'spin 3s linear infinite',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'bounce-slow': 'bounce 3s infinite',
  'float': 'float 6s ease-in-out infinite',
  'blob': 'blob 15s infinite',
  'fade-in': 'fadeIn 0.6s ease-out forwards',
  'slide-in-left': 'slideInFromLeft 0.6s ease-out forwards',
  'slide-in-right': 'slideInFromRight 0.6s ease-out forwards',
  'scale-in': 'scaleIn 0.6s ease-out forwards',
}

export const transitions = {
  'default': 'all 0.3s ease-in-out',
  'fast': 'all 0.15s ease-in-out',
  'slow': 'all 0.5s ease-in-out',
  'bounce': 'all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  'spring': 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}
