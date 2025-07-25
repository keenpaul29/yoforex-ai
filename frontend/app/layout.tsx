import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthProvider } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: {
    default: "YoForex AI",
    template: "%s | YoForex AI"
  },
  description: "AI-powered forex trading analysis and tools for professional traders",
  keywords: ["forex", "trading", "analysis", "AI", "market", "currency", "exchange"],
  authors: [{ name: "YoForex AI Team" }],
  creator: "YoForex AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoforex.ai",
    title: "YoForex AI - Advanced Trading Analytics",
    description: "AI-powered forex trading analysis and tools for professional traders",
    siteName: "YoForex AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "YoForex AI - Advanced Trading Analytics",
    description: "AI-powered forex trading analysis and tools for professional traders",
    creator: "@yoforexai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        GeistSans.variable,
        GeistMono.variable,
        inter.variable
      )}
    >
      <body className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <AuthProvider>
          <MainLayout>
            <div className="flex-1 flex flex-col min-h-screen">
              {children}
            </div>
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
