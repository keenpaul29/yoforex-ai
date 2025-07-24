'use client';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../signUp/page.css"
import { authAPI } from '@/utils/api';

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [whatsapp, setWhatsapp] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showError = (err: any) => {
    let msg = err.message;
    if (err?.response?.detail) {
      if (Array.isArray(err.response.detail)) {
        msg = err.response.detail.map((d: any) => d.msg).join(', ');
      } else {
        msg = err.response.detail;
      }
    }
    setError(msg);
  };

  const handleRequestOtp = async () => {
    setError('');
    if (!whatsapp.trim()) {
      setError('Phone number is required');
      return;
    }
    
    // Ensure the phone number is in E.164 format
    let phoneNumber = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`;
    
    // Remove any non-digit characters except the leading +
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Basic validation for phone number length (including country code)
    if (phoneNumber.length < 10 || phoneNumber.length > 15) {
      setError('Please enter a valid mobile number with country code');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.requestOtp({ phone: phoneNumber });
      // console.log(response);
      
      if (response?.status === 'success' || response?.success) {
        setStep('verify');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    
    // Format phone number consistently with requestOtp
    let phoneNumber = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`;
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.verifyLoginOtp({ phone: phoneNumber, otp });

      // Check for successful login response
      if (response?.token || response?.status === 'success' || 
          response?.status === 'login_successful' || response?.status === 'verified') {
        // Store the token if received
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('isAuthenticated', 'true');
        }
        router.push('/dashboard');
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (err: any) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.loginWithEmail({ email, password });
      
      if (response?.token || response?.status === 'success' || response?.status === 'login_successful') {
        // Store the token if received
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('isAuthenticated', 'true');
        }
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-[3rem] items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mx-4 my-8">
        <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">YoForex AI</h1>
          <p className="text-gray-400 mt-2 text-sm">Login to access your dashboard</p>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('whatsapp')}
              className={`flex-1 py-2 text-sm font-medium ${mode === 'whatsapp' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              WhatsApp Login
            </button>
            <button
              onClick={() => setMode('email')}
              className={`flex-1 py-2 text-sm font-medium ${mode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Email Login
            </button>
          </div>

          {mode === 'whatsapp' && (
            step === 'request' ? (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
                  <div className="flex items-center space-x-2">
                    <PhoneInput
                      value={whatsapp}
                      onChange={(value) => setWhatsapp(value)}
                      country="in"
                      enableSearch
                      enableLongNumbers={15}
                      placeholder="Enter mobile no."
                      inputStyle={{
                        width: '100%',
                        height: '40px',
                        background: 'transparent',
                        borderRadius: '4px',
                        paddingLeft: '50px',
                        color: 'white'
                      }}
                      buttonStyle={{
                        background: 'transparent'
                      }}
                      dropdownStyle={{ background: 'white', color: 'black' }}
                    />
                  </div>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg mt-4"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                    required
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg mt-4"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            )
          )}

          {mode === 'email' && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.03 0 2.02.155 2.96.44M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 3.09A9.956 9.956 0 0021 12c0-3-4-7-9-7-.71 0-1.4.07-2.07.2M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3-4 7-9 7s-9-4-9-7 4-7 9-7 9 4 9 7z" />
                    </svg>
                  )}
                </button>
                <a href="/forgetPassword">Forget password</a>
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-4"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <a href="/signUp" className="text-blue-400 font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}