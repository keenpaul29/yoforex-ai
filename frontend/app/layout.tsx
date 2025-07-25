import { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "YoForex AI - Advanced Forex Trading Analysis",
  description: "AI-powered forex trading analysis and tools for professional traders",
  keywords: ["forex", "trading", "analysis", "AI", "market", "currency", "exchange"],
  authors: [{ name: "YoForex AI Team" }],
  creator: "YoForex AI",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased transition-colors duration-500">
        <div className="glass-card min-h-screen flex flex-col">
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}
