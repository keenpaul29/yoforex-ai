import { z } from "zod";
import { parsePhoneNumber } from "libphonenumber-js";

/**
 * Common validation schemas
 */
export const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password must be less than 100 characters" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

export const phoneSchema = z
  .string()
  .refine(
    (value) => {
      try {
        const phoneNumber = parsePhoneNumber(value);
        return phoneNumber?.isValid();
      } catch (error) {
        return false;
      }
    },
    { message: "Please enter a valid phone number" }
  )
  .optional()
  .or(z.literal(""));

/**
 * Form validation schemas
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: phoneSchema,
    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
});

/**
 * Helper function to format validation errors
 */
export function formatValidationError<T>(error: z.ZodError<T>): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
}

/**
 * Parse and validate form data
 */
export async function validateFormData<T>(
  formData: FormData,
  schema: z.ZodSchema<T>
): Promise<{ data?: T; errors?: Record<string, string> }> {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedData = await schema.parseAsync(data);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: formatValidationError(error) };
    }
    throw error;
  }
}
