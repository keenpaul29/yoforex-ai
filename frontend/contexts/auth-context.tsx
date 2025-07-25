"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { setUnauthorizedHandler } from "@/lib/api-client"
import { authApi, handleApiError } from "@/lib/api-client"

interface User {
  id: string
  email: string
  name: string
  phone: string
  is_verified: boolean
  isVerified: boolean // For backward compatibility
  created_at?: string
  updated_at?: string
  // Add any other properties that come from the API
  [key: string]: any // Allow additional properties
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Email/Password auth
  login: (email: string, password: string) => Promise<void>;
  // OTP-based auth
  requestLoginOtp: (phone: string) => Promise<void>;
  verifyLoginOtp: (phone: string, otp: string) => Promise<void>;
  // Registration
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  // Password reset
  requestPasswordReset: (phone: string) => Promise<void>;
  resetPassword: (phone: string, otp: string, newPassword: string) => Promise<void>;
  // Profile
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<void>;
  // Session
  logout: () => Promise<void>;
  // Email verification
  sendVerificationEmail: () => Promise<void>;
  // User state
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Set up unauthorized handler
  useEffect(() => {
    setUnauthorizedHandler(() => {
      // Clear any existing tokens
      localStorage.removeItem('token')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      
      // Update state
      setUser(null)
      
      // Show toast
      toast.error('Your session has expired. Please log in again.')
      
      // Redirect to login
      router.push('/login')
    })
  }, [router])

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (token) {
          try {
            // Verify token with backend
            const userData = await authApi.getProfile();
            setUser({
              ...userData,
              // Add backward compatibility for isVerified
              isVerified: userData.is_verified
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem('token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Redirect to login if not authenticated and not on a public page
  useEffect(() => {
    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ]
    
    if (!isLoading && !user && !publicPaths.includes(pathname)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, pathname, router])

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      if (response && response.user) {
        const { user: userData } = response;
        
        // Set user data with values from response
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name || 'User',
          phone: userData.phone || '',
          is_verified: userData.is_verified || false,
          isVerified: userData.is_verified || false,
          created_at: userData.created_at || '',
          updated_at: userData.updated_at || ''
        };
        
        setUser(user);
        
        // If we have an access token, store it
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          // Also set in cookies for server-side auth
          document.cookie = `access_token=${response.access_token}; path=/; samesite=lax`;
        }
        
        // Check if email is verified
        if (!user.is_verified) {
          toast.error('Please verify your email before logging in');
          router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
          return;
        }
        
        toast.success("Successfully logged in");
        
        // Redirect to dashboard or previous page
        const redirectTo = searchParams?.get('redirect') || '/dashboard';
        router.push(redirectTo);
      }
    } catch (error:any) {
      console.error('Login error:', error);
      handleApiError(error, 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Request OTP for phone login
   */
  const requestLoginOtp = async (phone: string): Promise<void> => {
    try {
      // Ensure phone number is in E.164 format (e.g., +1234567890)
      let formattedPhone = phone.trim();
      
      // Add + if not present and the number starts with a digit
      if (!formattedPhone.startsWith('+') && /^\d/.test(formattedPhone)) {
        formattedPhone = `+${formattedPhone}`;
      }
      
      console.log('Sending OTP to:', formattedPhone);
      await authApi.requestLoginOtp(formattedPhone);
      toast.success("OTP sent to your phone");
    } catch (error: any) {
      console.error('OTP request error:', error);
      const errorMessage = error?.response?.data?.detail?.message || 
                         error?.message || 
                         'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  };
  
  /**
   * Verify OTP for phone login
   */
  const verifyLoginOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const { user: userData } = await authApi.verifyLoginOtp(phone, otp);
      
      setUser({
        ...userData,
        isVerified: userData.is_verified
      });
      
      toast.success("Successfully logged in");
      
      // Redirect to dashboard or previous page
      const redirectTo = searchParams?.get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      handleApiError(error, 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true);
    try {
      await authApi.register(name, email, password, phone);
      toast.success("Registration successful! Please verify your email to continue.");
      router.push("/verify-email?email=" + encodeURIComponent(email));
    } catch (error) {
      handleApiError(error, 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Request password reset OTP
   */
  const requestPasswordReset = async (phone: string) => {
    try {
      await authApi.requestPasswordReset(phone);
      toast.success("OTP sent to your phone");
    } catch (error) {
      handleApiError(error, 'Failed to send OTP');
      throw error;
    }
  };
  
  /**
   * Reset password with OTP
   */
  const resetPassword = async (phone: string, otp: string, newPassword: string) => {
    try {
      await authApi.resetPassword(phone, otp, newPassword);
      toast.success("Password reset successful. Please login with your new password.");
      router.push("/login");
    } catch (error) {
      handleApiError(error, 'Password reset failed');
      throw error;
    }
  };
  
  /**
   * Update user profile
   */
  const updateProfile = async (data: { name?: string; email?: string; phone?: string }) => {
    try {
      await authApi.updateProfile(data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
      throw error;
    }
  };

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear all auth state
      setUser(null);
      localStorage.removeItem("token");
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      
      // Redirect to login
      router.push("/login");
    }
  }, [router]);

  /**
   * Send verification email
   */
  const sendVerificationEmail = async () => {
    try {
      if (!user?.email) throw new Error('No user email found');
      await authApi.verifyEmail(user.email);
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      handleApiError(error, 'Failed to send verification email');
      throw error;
    }
  };



  /**
   * Update user state
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prev: User | null) => (prev ? { ...prev, ...userData } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        // Authentication
        login,
        requestLoginOtp,
        verifyLoginOtp,
        register,
        logout,
        // Password reset
        requestPasswordReset,
        resetPassword,
        // Profile
        updateProfile,
        // Email verification
        sendVerificationEmail,
        // User state
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
