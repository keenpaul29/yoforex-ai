import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Register - YoForex AI",
  description: "Create a new YoForex AI account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[400px] glass-card shadow-2xl p-12 border border-muted/40 rounded-3xl">
        <div className="flex flex-col space-y-4 text-center">
          <Icons.logo className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-400 drop-shadow-lg" />
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Create an account</h1>
          <p className="text-lg text-muted-foreground font-light mb-2">
            Enter your information to get started
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-blue-600 underline underline-offset-4 transition-colors font-medium"
          >
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
