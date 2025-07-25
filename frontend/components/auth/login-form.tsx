"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

import { cn } from "@/lib/utils"
import { toast } from "react-hot-toast"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
})

const phoneLoginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-]+$/, "Please enter a valid phone number"),
  otp: z
    .string()
    .length(4, "OTP must be 4 digits")
    .optional(),
})

type LoginFormData = z.infer<typeof loginSchema>
type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>

export function LoginForm() {
  const { 
    login, 
    requestLoginOtp, 
    verifyLoginOtp, 
    isLoading: isAuthLoading 
  } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPhoneLogin, setShowPhoneLogin] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  type FormData = LoginFormData | PhoneLoginFormData;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(showPhoneLogin ? phoneLoginSchema : loginSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      otp: "",
    },
    mode: "onChange",
  })

  const handlePhoneLogin = async (data: PhoneLoginFormData) => {
    console.log('handlePhoneLogin called with:', data);
    try {
      setIsLoading(true);
      
      // Format phone number to E.164 format
      const formattedPhone = data.phone.trim().startsWith('+') 
        ? data.phone.trim() 
        : `+${data.phone.trim()}`;
      
      if (!otpSent) {
        console.log('Requesting OTP for phone:', formattedPhone);
        
        // Request OTP using the authApi client
        const otpResponse = await authApi.requestLoginOtp(formattedPhone);
        console.log('OTP response:', otpResponse);
        
        // In development, auto-fill the OTP for testing
        if (process.env.NODE_ENV === 'development' && otpResponse.otp) {
          setValue('otp', otpResponse.otp as string, { shouldValidate: true });
        }
        
        setPhoneNumber(formattedPhone);
        setOtpSent(true);
        toast.success("OTP sent to your phone!");
      } else {
        if (!data.otp) {
          throw new Error('Please enter the OTP');
        }
        
        console.log('Verifying OTP for phone:', formattedPhone);
        // Use verifyLoginOtp from auth context which will handle the verification and user state
        await verifyLoginOtp(formattedPhone, data.otp);
        console.log('OTP is verified');
        
        // No need to manually handle redirect here as it's handled in verifyLoginOtp
        toast.success("Login successful!");
      }
    } catch (error: any) {
      console.error('Phone login error:', error);
      const errorMessage = error?.response?.data?.detail?.message || 
                         error?.message || 
                         'Failed to process your request. Please try again.';
      
      if (errorMessage.includes('Invalid OTP') || errorMessage.includes('invalid OTP')) {
        setError('otp', {
          type: 'manual',
          message: 'Invalid or expired OTP. Please try again.'
        });
      } else if (errorMessage.includes('not found') || errorMessage.includes('No user found')) {
        toast.error('No account found with this phone number. Please sign up first.');
      } else if (errorMessage.includes('too many attempts') || errorMessage.includes('rate limit')) {
        toast.error('Too many attempts. Please try again later.');
      } else if (errorMessage.includes('expired')) {
        setError('otp', {
          type: 'manual',
          message: 'OTP has expired. Please request a new one.'
        });
        setOtpSent(false);
      } else {
        toast.error(errorMessage);
      }
      
      // Reset OTP state on error if needed
      if (error?.response?.status === 401) {
        setOtpSent(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmailLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast.success("Login successful!")
      router.push(redirectTo)
    } catch (error: any) {
      console.error('Email login error:', error)
      const errorMessage = error?.response?.data?.detail || error.message || "Login failed. Please try again."
      
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('Incorrect email or password')) {
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        })
        setError("email", { type: "manual" })
      } else if (errorMessage.includes('not verified') || errorMessage.includes('Email not verified')) {
        toast.error("Please verify your email before logging in")
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else if (errorMessage.includes('too many attempts')) {
        setError('password', {
          type: 'manual',
          message: 'Too many attempts. Please try again later.'
        })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: LoginFormData | PhoneLoginFormData) => {
    try {
      setIsLoading(true);
      
      if (showPhoneLogin) {
        const phoneData = data as PhoneLoginFormData;
        const formattedPhone = phoneData.phone.trim().startsWith('+') 
          ? phoneData.phone.trim() 
          : `+${phoneData.phone.trim()}`;
        
        if (!otpSent) {
          // Request OTP
          const otpResponse = await authApi.requestLoginOtp(formattedPhone);
          if (process.env.NODE_ENV === 'development' && otpResponse.otp) {
            setValue('otp', otpResponse.otp as string, { shouldValidate: true });
          }
          setPhoneNumber(formattedPhone);
          setOtpSent(true);
          toast.success("OTP sent to your phone!");
          return; // Don't proceed further after OTP request
        } else if (phoneData.otp) {
          // Verify OTP and handle login - the redirect is handled in auth context
          await verifyLoginOtp(formattedPhone, phoneData.otp);
          return; // Don't proceed further after OTP verification
        }
      } else {
        // Handle email/password login - the redirect is handled in auth context
        const emailData = data as LoginFormData;
        await login(emailData.email, emailData.password);
        return; // Don't proceed further after login
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.detail?.message || 
                         error?.message || 
                         'Failed to process your request. Please try again.';
      
      if (errorMessage.includes('Invalid OTP') || errorMessage.includes('invalid OTP')) {
        setError('otp', {
          type: 'manual',
          message: 'Invalid or expired OTP. Please try again.'
        });
      } else if (errorMessage.includes('Invalid credentials') || errorMessage.includes('Incorrect')) {
        setError('password', {
          type: 'manual',
          message: 'Invalid email or password'
        });
        setError('email', { type: 'manual' });
      } else if (errorMessage.includes('not verified') || errorMessage.includes('Email not verified')) {
        const email = showPhoneLogin ? '' : (data as LoginFormData).email;
        toast.error("Please verify your email before logging in");
        if (email) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }
      } else if (errorMessage.includes('too many attempts') || errorMessage.includes('rate limit')) {
        toast.error('Too many attempts. Please try again later.');
      } else {
        toast.error(errorMessage);
      }
      
      // Re-throw to ensure React Hook Form sees the error
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = () => {
    setShowPhoneLogin(!showPhoneLogin)
    setOtpSent(false)
    reset({
      phone: '',
      otp: '',
      email: '',
      password: '',
    })
  }

  // Debug function to test OTP request
  const testOtpRequest = async () => {
    // console.log('=== TEST OTP REQUEST ===');
    try {
      setIsLoading(true);
      // Use entered phone or a test number, ensure it's in E.164 format
      let testPhone = phoneNumber.trim();
      // console.log(testPhone)
      
      // If no phone number entered, use a test number
      if (!testPhone) {
        testPhone = '+1234567890';
        setPhoneNumber(testPhone);
      } else if (!testPhone.startsWith('+') && /^\d/.test(testPhone)) {
        // Add + if not present and the number starts with a digit
        testPhone = `+${testPhone}`;
        setPhoneNumber(testPhone);
      }
      
      console.log('Sending OTP to:', testPhone);
      await requestLoginOtp(testPhone);
      // console.log('OTP request successful');
      setOtpSent(true);
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error('OTP request failed:', error);
      const errorMessage = error?.response?.data?.detail?.message || 
                         error?.message || 
                         'Failed to send OTP';
      toast.error(`OTP failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-card p-8 shadow-lg border border-border">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to your YoForex AI account
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {showPhoneLogin ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    disabled={otpSent}
                    {...register("phone")}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      register("phone").onChange(e); // This ensures the form state is updated
                    }}
                  />
                  <Icons.phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {'phone' in errors && errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
              
              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                  <div className="relative">
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter 4-digit code"
                      {...register("otp")}
                    />
                    <Icons.lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {'otp' in errors && errors.otp && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.otp.message as string}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    We've sent a verification code to {phoneNumber}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    {...register("email")}
                  />
                  <Icons.mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {!showPhoneLogin && 'email' in errors && errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {!showPhoneLogin && 'password' in errors && errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <Button 
            type="submit"
            
            disabled={isLoading} 
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                {showPhoneLogin ? (otpSent ? 'Verifying...' : 'Sending OTP...') : 'Signing in...'}
              </>
            ) : showPhoneLogin ? (otpSent ? 'Verify OTP' : 'Send OTP') : 'Sign In'}
          </Button>
        </div>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button 
          variant="outline" 
          type="button" 
          onClick={toggleLoginMethod}
          disabled={isLoading}
          className="w-full h-11 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.phone className="mr-2 h-5 w-5" />
          )}
          {showPhoneLogin ? 'Sign in with Email' : 'Sign in with Phone'}
        </Button>
      </div>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
