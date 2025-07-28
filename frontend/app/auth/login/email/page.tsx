"use client";
import Link from "next/link";
import { useState } from "react";

export default function EmailLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 gap-8 animate-fade-in">
      <div className="bg-white/80 dark:bg-gray-900/80 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent animate-gradient-x">Login with Email</h1>
        <form className="flex flex-col gap-4" autoComplete="off">
          <input type="email" placeholder="Email" className="input input-bordered" required />
          <input type="password" placeholder="Password" className="input input-bordered" required minLength={8} />
          {error && <div className="text-red-600 text-sm text-center animate-shake">{error}</div>}
          <button type="submit" className="btn bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white font-bold py-2 rounded-lg shadow hover:scale-105 transition-transform disabled:opacity-60" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div className="flex flex-col gap-2 text-center">
          <Link href="/auth/forgot" className="text-gray-600 hover:underline">Forgot Password?</Link>
          <Link href="/auth/login" className="text-blue-700 hover:underline">Back</Link>
        </div>
      </div>
    </div>
  );
}