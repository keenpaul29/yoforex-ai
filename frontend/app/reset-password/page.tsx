import { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - YoForex AI",
  description: "Set a new password for your YoForex AI account",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[400px] glass-card shadow-2xl p-12 border border-muted/40 rounded-3xl">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
