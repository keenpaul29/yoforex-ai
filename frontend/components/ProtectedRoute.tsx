'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/api";
import Loading from "./Loading";

export default function ProtectedRoute({
  children,
  type = "protected"
}: {
  children: React.ReactNode;
  type?: "protected" | "public";
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures we're on the client side
    setIsClient(true);
    
    const checkAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') return;

      // For public routes, we don't need to check authentication
      if (type === "public") {
        const token = localStorage.getItem('authToken');
        if (token) {
          setIsAuth(true);
          router.replace("/dashboard");
          return;
        }
        setIsAuth(false);
        return;
      }

      // For protected routes, check authentication
      try {
        const token = localStorage.getItem('authToken');
        console.log('Auth token from localStorage:', token);
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // Make the profile request with the token
        const profile = await getData("/auth/profile");
        console.log('Profile response:', profile);
        
        if (profile) {
          setIsAuth(true);
        } else {
          throw new Error('Invalid profile response');
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
        setIsAuth(false);
        
        if (type === "protected") {
          router.replace("/signIn");
        }
      }
    };

    checkAuth();
  }, [type, router]);

  // Show loading state until we know if user is authenticated
  if (!isClient || isAuth === null) {
    return <Loading />;
  }

  // If it's a protected route and not authenticated, or public route and authenticated, show nothing
  if ((type === "protected" && !isAuth) || (type === "public" && isAuth)) {
    return null;
  }

  // If we get here, render the protected content
  return <>{children}</>;
}