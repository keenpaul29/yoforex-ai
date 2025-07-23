import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardLayout from './components/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YoForex AI - Dashboard',
  description: 'Your trading dashboard with AI-powered insights',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  );
}