"use client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/auth/login/email" className="bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition">Login with Email</Link>
        <Link href="/auth/login/otp" className="bg-indigo-600 text-white rounded px-4 py-2 text-center hover:bg-indigo-700 transition">Login with OTP</Link>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs mt-4">
        <Link href="/auth/signup" className="text-blue-700 hover:underline">Don&apos;t have an account? Sign Up</Link>
        <Link href="/auth/forgot" className="text-gray-600 hover:underline">Forgot Password?</Link>
      </div>
    </div>
  );
}