import { Inter } from 'next/font/google';
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute type="public">
      <div className={`${inter.className} flex min-h-screen flex-col bg-background`}>
        <div className="flex-1">
          <main className="container mx-auto px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}