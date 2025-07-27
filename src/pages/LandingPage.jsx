import React from 'react';
import useStore from '../store';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { GoogleLogin } from '@react-oauth/google';

export default function LandingPage() {
  const { login } = useStore();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      login(res.data);
      toast.success('Login Successful! Please complete your profile.');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? 'Backend endpoint not found. Please check deployment.'
          : 'Google login failed. Please try again.');
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      <div
        className="
        w-full lg:w-1/2
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black
        p-4 md:p-8 lg:p-12
        flex flex-col justify-center items-center lg:items-start
        text-center lg:text-left
        relative overflow-hidden
      ">
        {/* Mobile background blur/animation intensity reduced */}
        <div className="absolute top-8 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-blue-600/10 md:bg-blue-600/20 dark:bg-blue-400/5 md:dark:bg-blue-400/10 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-6 right-2 md:bottom-10 md:right-10 w-20 h-20 md:w-32 md:h-32 bg-indigo-600/10 md:bg-indigo-600/20 dark:bg-indigo-400/5 md:dark:bg-indigo-400/10 rounded-full blur-2xl md:blur-3xl animate-pulse animation-delay-1000"></div>

        {/* Main Container */}
        <div className="bg-white/10 dark:bg-slate-800/40 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-xl md:rounded-3xl relative z-10 animate-slide-up border border-white/10 dark:border-slate-700/30 shadow-lg md:shadow-2xl shadow-black/20 w-full max-w-md md:max-w-lg">
          <div className="flex items-center mb-4 md:mb-6 justify-center lg:justify-start">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mr-3 md:mr-4 shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-white dark:text-slate-100 tracking-tight">Apna Mandi</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white dark:text-slate-100 leading-snug mb-3 md:mb-6 tracking-tight">
            Connecting Local Vendors with Wholesalers
          </h1>
          <p className="text-base md:text-lg text-slate-200 dark:text-slate-300 mb-4 md:mb-8 font-medium leading-relaxed">
            Streamline your procurement, get better prices, and grow your business on a trusted, transparent platform.
          </p>
          {/* Features */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center space-x-2 text-slate-200 dark:text-slate-300">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm md:text-base">Direct supplier connections</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-sm md:text-base">Real-time price tracking</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200 dark:text-slate-300">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-sm md:text-base">Secure transactions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-900 p-4 md:p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Decorative elements, size reduced on mobile, and positioned within bounds */}
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/10 md:dark:from-blue-900/20 dark:to-transparent rounded-full translate-x-12 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-48 md:h-48 bg-gradient-to-tr from-indigo-50 to-transparent dark:from-indigo-900/10 md:dark:from-indigo-900/20 dark:to-transparent rounded-full -translate-x-8 translate-y-8"></div>

        {/* Auth container */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md text-center relative z-10 animate-slide-up px-2 md:px-0">
          <div className="mb-4 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3 tracking-tight">
              Get Started
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-sm md:text-base">
              Sign in with your Google account to join our marketplace.
            </p>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm p-4 md:p-8 rounded-xl md:rounded-2xl shadow-md md:shadow-xl shadow-slate-500/10 dark:shadow-slate-900/20 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-blue-50/10 dark:from-slate-700/15 dark:to-slate-600/5 rounded-2xl -z-10"></div>
            {!googleClientId ? (
              <div className="text-center">
                <div className="text-red-500 text-base md:text-lg font-semibold mb-2">⚠️ Configuration Error</div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-2 md:mb-4">
                  Google Client ID is missing. Please add VITE_GOOGLE_CLIENT_ID to environment variables.
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 md:p-3 rounded-lg">
                  <strong>For developers:</strong><br />
                  1. Add VITE_GOOGLE_CLIENT_ID<br />
                  2. Redeploy<br />
                  3. Clear browser cache
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google login failed.')}
                  useOneTap
                  theme={document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
                  size="large"
                />
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium px-2 leading-snug">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
