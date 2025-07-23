'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postData } from '../../../utils/api';
import 'react-phone-input-2/lib/material.css';
import "../signUp/page.css"

export default function resetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const number = searchParams.get('number') || '';
    const [form, setForm] = useState({
        whatsapp: '',
        otp: "",
        new_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let newErrors: { [key: string]: string } = {};
        // if (!form.whatsapp) newErrors.whatsapp = "WhatsApp number is required";
        if (!form.otp) newErrors.otp = "Password is required";
        if (!form.new_password) newErrors.new_password = "Password is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            const phone = `+${number.replace(/\D/g, '')}`;
            const payload = {
                phone: phone,
                otp: form.otp,
                new_password: form.new_password
            };

            await postData('/auth/reset-password', payload);
            router.push(`/signIn`);
        } catch (err: any) {
            let msg = err.message;
            if (err?.response?.detail) {
                if (Array.isArray(err.response.detail)) {
                    msg = err.response.detail.map((d: any) => d.msg).join(', ');
                } else {
                    msg = err.response.detail;
                }
            }
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center mt-[2rem]">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mx-4 my-8">
                {/* Header */}
                <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    {/* <p className="text-gray-400 mt-2 text-sm">
                        One account to access all DeepSeek services
                    </p> */}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {apiError && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-400 text-red-300 px-4 py-3 rounded-lg mb-2 animate-shake">
                            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{apiError}</span>
                        </div>
                    )}

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">OTP</label>
                        <input
                            name="otp"
                            placeholder="Type your OTP sent to your mobile no."
                            value={form.otp}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400 autofill:bg-gray-700"
                        />
                        {errors.otp && <p className="text-red-500 text-xs">{errors.otp}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">New Password</label>
                        <input
                            name="new_password"
                            type="password"
                            placeholder="Create a new password"
                            value={form.new_password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400 autofill:bg-gray-700"
                        />
                        {errors.new_password && <p className="text-red-500 text-xs">{errors.new_password}</p>}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mt-6"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
                    <p className="text-sm text-gray-400">
                        {/* Go to{' '} */}
                        <a href="/login" className="text-blue-400 font-medium hover:underline">
                            Go back to login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}