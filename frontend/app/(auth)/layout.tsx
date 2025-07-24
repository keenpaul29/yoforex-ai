import "../../app/globals.css"
import { Inter } from 'next/font/google';
import ProtectedRoute from "@/components/ProtectedRoute";

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProtectedRoute type="public">
          <div className="flex h-screen bg-background">
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                <div className="container mx-auto px-6 py-6">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </body>
    </html>
  );
}