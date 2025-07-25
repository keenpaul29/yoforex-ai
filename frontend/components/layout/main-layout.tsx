"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

export function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  )
}
