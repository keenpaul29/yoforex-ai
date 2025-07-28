import { ReactNode } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navigation/Navbar';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const metadata = {
  title: 'YoForex AI',
  description: 'AI-Powered Forex Trading Platform',
};

export default function MainLayout({
  children,
  title = 'YoForex AI',
  description = 'AI-Powered Forex Trading Platform',
  className = '',
}: MainLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable, className)}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
