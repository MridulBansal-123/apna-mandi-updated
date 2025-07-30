import React, { useEffect } from 'react';
import useStore from './store';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import OnboardingPage from './pages/OnboardingPage';
import LoadingSpinner from './components/shared/LoadingSpinner';
import { Toaster } from 'sonner';
import { NotificationProvider } from './contexts/NotificationContext';

export default function App() {
  const { user, token, checkUserSession, isLoading } = useStore();

  useEffect(() => {
    console.log('App component mounted, checking user session...');
    checkUserSession();
  }, []);

  console.log('App render - isLoading:', isLoading, 'token:', !!token, 'user:', user);

  if (isLoading) {
    console.log('App is loading...');
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-100 dark:to-dark-200">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <img src="/assets/logo.svg" alt="Apna Mandi Logo" className="relative h-16 w-auto mb-6 drop-shadow-lg" />
        </div>
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-dark-400 text-sm animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  const renderContent = () => {
    console.log('Rendering content - token:', !!token, 'user role:', user?.role);
    if (!token) {
      console.log('No token, showing LandingPage');
      return <LandingPage />;
    }
    if (user && user.role === 'Pending') {
      console.log('User role is Pending, showing OnboardingPage');
      return <OnboardingPage />;
    }
    if (user) {
      console.log('User exists, showing DashboardLayout');
      return <DashboardLayout />;
    }
    console.log('Fallback loading state');
    return <div className="w-screen h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  };

  return (
    <NotificationProvider>
      <div className="App min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-100 dark:via-dark-200 dark:to-dark-300 transition-all duration-500">
        <Toaster 
          position="top-center" 
          richColors 
          theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
          }}
        />
        {renderContent()}
      </div>
    </NotificationProvider>
  );
}
