"use client";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-8">
      <h1 className="text-3xl font-bold">Welcome to Yoforex AI</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/auth/login" className="bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700 transition">Login</Link>
        <Link href="/auth/signup" className="bg-green-600 text-white rounded px-4 py-2 text-center hover:bg-green-700 transition">Sign Up</Link>
      </div>
    </div>
  );
}