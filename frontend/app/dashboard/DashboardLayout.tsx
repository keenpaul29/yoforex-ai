'use client';

import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authAPI } from '@/utils/api';
import Loading from '@/components/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Verify the token with the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const data = await response.json();
        
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid token and redirect to sign-in
        localStorage.removeItem('authToken');
        router.push('/signIn');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  // Show loading state while verifying authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Only render the dashboard if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to sign-in from the useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
