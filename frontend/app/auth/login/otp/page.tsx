"use client";
import Link from "next/link";
import { useState } from "react";

export default function OTPLoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/auth/login/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      if (response.ok) {
        setStep("otp");
      } else {
        const data = await response.json();
        setError(data.detail?.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/auth/login/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const data = await response.json();
        setError(data.detail || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 gap-8 animate-fade-in">
      <div className="bg-white/80 dark:bg-gray-900/80 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500 bg-clip-text text-transparent animate-gradient-x">
          {step === "phone" ? "Request OTP" : "Verify OTP"}
        </h1>
        
        {step === "phone" ? (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-4" autoComplete="off">
            <input 
              type="tel" 
              placeholder="Phone (+1234567890)" 
              className="input input-bordered p-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
            {error && <div className="text-red-600 text-sm text-center animate-shake">{error}</div>}
            <button 
              type="submit" 
              className="btn bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-60" 
              disabled={loading}
            >
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4" autoComplete="off">
            <input 
              type="text" 
              placeholder="Enter 4-digit OTP" 
              className="input input-bordered p-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required 
              minLength={4} 
              maxLength={4} 
            />
            {error && <div className="text-red-600 text-sm text-center animate-shake">{error}</div>}
            <button 
              type="submit" 
              className="btn bg-gradient-to-r from-indigo-500 via-blue-500 to-green-500 text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-60" 
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep("phone")}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Change Phone Number
            </button>
          </form>
        )}
        
        <div className="flex flex-col gap-2 text-center">
          <Link href="/auth/login" className="text-blue-700 hover:underline transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
