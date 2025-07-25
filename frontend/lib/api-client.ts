import { toast } from "sonner"

// This function can be called to handle redirects from the component level
let handleUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  handleUnauthorized = handler
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Add default headers
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new ApiError('Request timed out', 408)), REQUEST_TIMEOUT)
    );

    // Create the fetch promise
    const fetchPromise = fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session handling
    });

    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    }

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || response.statusText
      throw new ApiError(errorMessage, response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors (4xx, 5xx)
      console.error(`API Error [${error.status}]:`, error.message)
      toast.error(error.message || 'An error occurred')
      
      // Handle unauthorized errors (401)
      if (error.status === 401 && handleUnauthorized) {
        handleUnauthorized()
      }
      
      throw error
    } else {
      // Handle network errors
      console.error('Network error:', error)
      throw new ApiError('Network error. Please check your connection.', 0)
    }
  }
}

// Auth API
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Allow additional properties
  };
}

export const authApi = {
  /**
   * Login with email/password or phone/OTP
   * @param credentials Object containing either email/password or phone/otp
   * @returns User data with access token
   */
  async login(credentials: 
    | { email: string; password: string }
    | { phone: string; otp: string }
  ) {
    try {
      // Check which type of credentials we have
      if ('email' in credentials) {
        // Email/password login
        const response = await apiRequest<LoginResponse>('/auth/login/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        
        if (response?.access_token) {
          localStorage.setItem('token', response.access_token);
          // Set the token in cookies for server-side auth
          document.cookie = `access_token=${response.access_token}; path=/; samesite=lax`;
        }
        
        return response;
      } else {
        // Phone/OTP login - First verify the OTP
        const response = await apiRequest<LoginResponse>('/auth/login/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: credentials.phone,
            otp: credentials.otp
          })
        });
        
        if (response?.access_token) {
          localStorage.setItem('token', response.access_token);
          // Set the token in cookies for server-side auth
          document.cookie = `access_token=${response.access_token}; path=/; samesite=lax`;
        }
        
        return response;
      }
      
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Request OTP for phone login
   * @param phone Phone number in E.164 format
   */
  async requestOtp(phone: string) {
    return apiRequest<{ message: string }>('/auth/login/request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
  },

  /**
   * Verify OTP for phone login
   * @param phone Phone number in E.164 format
   * @param otp 4-digit OTP
   */
  async verifyOtp(phone: string, otp: string) {
    return apiRequest<{ 
      access_token: string; 
      token_type: string;
      user: {
        id: string;
        email: string | null;
        phone: string;
        is_active: boolean;
        is_verified: boolean;
        created_at: string;
        updated_at: string;
      };
    }>('/auth/login/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ phone, otp }),
    });
  },

  /**
   * Register a new user
   * @param name User's full name
   * @param email User's email
   * @param password User's password
   * @param phone User's phone number in E.164 format (+12345678901)
   */
  async register(name: string, email: string, password: string, phone: string) {
    console.log('Registering user:', { name, email, phone });
    const startTime = Date.now();
    try {
      const result = await apiRequest<{ message: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          phone,
          // Add any additional required fields here
        }),
      });
      console.log('Registration successful, time taken:', Date.now() - startTime, 'ms');
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Request OTP for login
   * @param phone Phone number in E.164 format
   */
  async requestLoginOtp(phone: string) {
    return apiRequest<{ 
      status: string;
      message: string;
      otp: string;
      phone: string;
      timestamp: string;
      wati_response: any; // We can type this more specifically if needed
    }>('/auth/login/request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ 
        phone: phone // Changed back to 'phone' to match backend expectation
      }),
    });
  },

  /**
   * Verify OTP for login
   * @param phone Phone number in E.164 format
   * @param otp 4-digit OTP
   */
  async verifyLoginOtp(phone: string, otp: string) {
    const response = await apiRequest<{ 
      access_token: string;
      user: {
        id: string;
        email: string;
        name: string;
        phone: string;
        is_verified: boolean;
      } 
    }>('/auth/verify-login-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ 
        phone: phone, 
        otp: otp 
      })
    });
    
    if (response?.access_token) {
      localStorage.setItem('token', response.access_token)
      document.cookie = `access_token=${response.access_token}; path=/; samesite=lax`
    }

    return response
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    return apiRequest<{
      id: string;
      email: string;
      name: string;
      phone: string;
      is_verified: boolean;
      attempts: number;
      created_at?: string;
      updated_at?: string;
    }>('/auth/profile')
  },

  /**
   * Update user profile
   * @param data Profile data to update
   */
  async updateProfile(data: { name?: string; email?: string; phone?: string }) {
    return apiRequest<{ message: string }>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Request password reset OTP
   * @param phone Phone number in E.164 format
   */
  async requestPasswordReset(phone: string) {
    return apiRequest<{ message: string }>('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  },

  /**
   * Reset password with OTP
   * @param phone Phone number in E.164 format
   * @param otp 4-digit OTP
   * @param newPassword New password
   */
  async resetPassword(phone: string, otp: string, newPassword: string) {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ 
        phone, 
        otp, 
        new_password: newPassword 
      }),
    })
  },

  /**
   * Verify email with token
   * @param token Email verification token
   */
  async verifyEmail(token: string) {
    return apiRequest<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  /**
   * Logout the current user
   */
  async logout() {
    try {
      await apiRequest('/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Important for clearing HTTP-only cookies
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Clear client-side auth state
      localStorage.removeItem('token')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax'
    }
  },
}

// Example API module for other resources
export const marketApi = {
  async getMarketData() {
    return apiRequest('/market/data')
  },
  // Add more market-related API calls
}

export const forumApi = {
  async getPosts() {
    return apiRequest('/forum/posts')
  },
  // Add more forum-related API calls
}

// Global error handler to show toast notifications
export function handleApiError(error: unknown, defaultMessage = 'An error occurred') {
  if (error instanceof ApiError) {
    const message = error.data?.detail || error.message || defaultMessage
    toast.error(message)
    
    // Handle specific error codes
    if (error.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
    }
    
    return message
  }
  
  // Handle non-ApiError errors
  const message = error instanceof Error ? error.message : String(error)
  toast.error(message || defaultMessage)
  return message
}
