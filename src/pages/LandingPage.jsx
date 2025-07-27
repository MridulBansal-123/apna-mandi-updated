import React from 'react';
import useStore from '../store';
import { toast } from 'sonner';
import { api } from '../utils/api';
import { GoogleLogin } from '@react-oauth/google';

export default function LandingPage() {
  const { login } = useStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('🔑 Google login attempt started');
    try {
        console.log('📡 Making request to backend...');
        const res = await api.post('/auth/google', {
            credential: credentialResponse.credential,
        });
        console.log('✅ Backend response received:', res.status);
        login(res.data);
        toast.success('Login Successful! Please complete your profile.');
    } catch (error) {
        console.error('❌ Google login error:', error);
        console.error('- Status:', error.response?.status);
        console.error('- URL:', error.config?.url);
        console.error('- Response:', error.response?.data);
        
        const message = error.response?.data?.message || 
                       (error.response?.status === 404 ? 'Backend endpoint not found. Please check deployment.' : 
                        'Google login failed. Please try again.');
        toast.error(message);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div 
        className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-black p-8 md:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left relative overflow-hidden" 
      >
        {/* Subtle animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-600/20 dark:bg-indigo-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        
        <div className="bg-white/5 dark:bg-slate-800/30 backdrop-blur-lg p-8 rounded-3xl relative z-10 animate-slide-up border border-white/10 dark:border-slate-700/30 shadow-2xl shadow-black/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-white dark:text-slate-100 tracking-tight">Apna Mandi</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-slate-100 leading-tight mb-6 tracking-tight">
            Connecting Local Vendors with Wholesalers
          </h1>
          <p className="text-lg text-slate-200 dark:text-slate-300 mb-8 font-medium leading-relaxed">
            Streamline your procurement, get better prices, and grow your business on a trusted, transparent platform.
          </p>
          
          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-200 dark:text-slate-300">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Direct supplier connections</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-200">
              <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Real-time price tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-200 dark:text-slate-300">
              <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Secure transactions</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-200 dark:text-slate-300">
              <div className="w-6 h-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Direct supplier connections</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 bg-slate-50 dark:bg-slate-900 p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
        
        <div className="w-full max-w-sm text-center relative z-10 animate-slide-up">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Get Started
            </h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Sign in with your Google account to join our marketplace.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-slate-500/10 dark:shadow-slate-900/20 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-slate-500/20 dark:hover:shadow-slate-800/30 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-blue-50/20 dark:from-slate-700/20 dark:to-slate-600/10 rounded-2xl -z-10"></div>
            
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed.')}
              useOneTap
              theme={document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline'}
              size="large"
            />
          </div>
          
          <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
