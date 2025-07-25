"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Icons } from "@/components/icons"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const passwordRequirements = [
  { id: "length", text: "At least 8 characters", validate: (val: string) => val.length >= 8 },
  { id: "uppercase", text: "At least one uppercase letter", validate: (val: string) => /[A-Z]/.test(val) },
  { id: "lowercase", text: "At least one lowercase letter", validate: (val: string) => /[a-z]/.test(val) },
  { id: "number", text: "At least one number", validate: (val: string) => /[0-9]/.test(val) },
  { id: "special", text: "At least one special character", validate: (val: string) => /[^A-Za-z0-9]/.test(val) },
]

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[0-9\s-]+$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<Record<string, boolean>>({})
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData, any, RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  // Watch password changes to update strength meter
  const password = watch("password")
  
  // Check if all password requirements are met
  const allRequirementsMet = password && Object.values(passwordStrength).every(Boolean)
  
  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const strength: Record<string, boolean> = {}
      passwordRequirements.forEach((req) => {
        strength[req.id] = req.validate(password)
      })
      setPasswordStrength(strength)
      
      // Re-validate confirm password when password changes
      if (watch("confirmPassword")) {
        trigger("confirmPassword")
      }
    }
  }, [password, trigger, watch])

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setIsLoading(true)
      const { name, email, password, phone } = data
      await registerUser(name, email, password, phone)
      toast.success("Registration successful! Please check your email to verify your account.")
      router.push("/login")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <Input
              id="name"
              placeholder="John Doe"
              className={cn("pr-10", errors.name && "border-destructive")}
              disabled={isLoading}
              {...register("name")}
            />
            <Icons.user className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn("pr-10", errors.email && "border-destructive")}
              disabled={isLoading}
              {...register("email")}
            />
            <Icons.mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className={cn("pr-10", errors.phone && "border-destructive")}
              disabled={isLoading}
              {...register("phone")}
            />
            
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pr-10", errors.password && "border-destructive")}
              disabled={isLoading}
              {...register("password")}
            />
            <Icons.lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          
          {/* Password strength meter */}
          {password && (
            <div className="mt-2 space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div 
                  className={cn("h-full transition-all duration-300", {
                    'w-1/5 bg-destructive': !allRequirementsMet && password.length > 0,
                    'w-2/5 bg-amber-500': password.length >= 8 && !allRequirementsMet,
                    'w-3/4 bg-yellow-500': password.length >= 12 && !allRequirementsMet,
                    'w-full bg-green-500': allRequirementsMet,
                  })}
                />
              </div>
              <div className="space-y-1.5">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center text-xs">
                    <Icons.checkCircle 
                      className={cn("mr-2 h-3.5 w-3.5 flex-shrink-0", {
                        'text-green-500': passwordStrength[req.id],
                        'text-muted-foreground/40': !passwordStrength[req.id],
                      })} 
                    />
                    <span className={cn({
                      'text-muted-foreground/70': !passwordStrength[req.id]
                    })}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pr-10", errors.confirmPassword && "border-destructive")}
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            <Icons.lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        
        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2 pt-2">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="terms"
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                errors.terms && "border-destructive"
              )}
              {...register("terms")}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms.message}</p>
        )}
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full mt-2" 
          disabled={isLoading || !allRequirementsMet}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
        
        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-medium text-primary hover:underline"
            onClick={(e) => {
              if (isLoading) e.preventDefault()
            }}
          >
            Sign in
          </Link>
        </p>
      </form>
      
    </div>
  )
}
