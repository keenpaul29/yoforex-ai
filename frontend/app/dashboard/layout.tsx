import "../../app/globals.css"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardLayout from './DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YoForex AI - Advanced Trading Platform',
  description: 'Professional forex trading platform with AI-powered analysis',};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}