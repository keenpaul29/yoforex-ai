'use client';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authAPI } from '@/utils/api';
import "../signUp/page.css"

export default function ForgetPassword() {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState('');
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
      setError('Field required');
      return;
    }
    
    // Format phone number to E.164 format
    let phoneNumber = whatsapp.startsWith('+') ? whatsapp : `+${whatsapp}`;
    phoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Basic validation for phone number length (including country code)
    if (phoneNumber.length < 10 || phoneNumber.length > 15) {
      setError('Please enter a valid mobile number with country code');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ phone: phoneNumber });
      if (response?.status === "otp_sent" || response?.success) {
        router.push(`/resetPassword?number=${encodeURIComponent(phoneNumber)}`);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-[5rem]">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mx-4 my-8">
        <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">Forget password</h1>
          {/* <p className="text-gray-400 mt-2 text-sm">
            Enter the 6-digit code sent to your WhatsApp ending with {number?.slice(-4)}
          </p> */}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Whatsapp number</label>
            {/* <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
            /> */}
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
            {error && (
              <div className="flex items-center gap-2 bg-red-600/10 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-2 animate-shake">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            {/* Wrong number?{' '} */}
            <a href="/signIn" className="text-blue-400 font-medium hover:underline">
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}