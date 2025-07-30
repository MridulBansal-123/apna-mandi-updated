import React, { useState, useEffect, useRef } from 'react';
import useStore from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationList from './NotificationList';

export default function Header({ setCurrentPage }) {
  const { user, logout } = useStore();
  const { isDark, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    refreshNotifications
  } = useNotifications();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
      case 'seller':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'buyer':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getWelcomeMessage = () => {
    const time = new Date().getHours();
    if (time < 12) return 'Good Morning';
    if (time < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="bg-white dark:bg-dark-100 shadow-sm border-b border-gray-200 dark:border-dark-200 backdrop-blur-md transition-all duration-300 sticky top-0 z-[10000]" style={{ isolation: 'isolate' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome message */}
          <div className="flex items-center space-x-4">
            <div className="animate-slide-up">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-dark-900">
                Hi, {user?.name || 'User'}!
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${getRoleColor(user?.role)}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-dark-400 dark:hover:text-dark-600 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-all duration-300 hover:scale-110 group"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-6 h-6 rotate-0 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 rotate-0 group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-dark-400 dark:hover:text-dark-600 relative rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-all duration-300 hover:scale-110 group"
              >
                {loading ? (
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 group-hover:animate-bounce-gentle transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5a2 2 0 114 0c0 7.5 1.5 9 3 9H7c1.5 0 3-1.5 3-9zM9 21h6" />
                  </svg>
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[10000]"
                    onClick={() => setNotificationOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-100 rounded-xl shadow-xl border border-gray-200 dark:border-dark-200 py-2 z-[10001] animate-scale-in backdrop-blur-md max-h-96 overflow-hidden">
                    <NotificationList
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      loading={loading}
                      unreadCount={unreadCount}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onClearAll={handleClearAllNotifications}
                      onRefresh={refreshNotifications}
                    />
                  </div>
                </>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-200 transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-dark-400">{user?.email}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 dark:text-dark-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[10000]"
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-100 rounded-xl shadow-xl border border-gray-200 dark:border-dark-200 py-2 z-[10001] animate-scale-in backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-200">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-400 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-200 transition-all duration-200 hover:pl-6"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage('settings');
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-700 hover:bg-gray-50 dark:hover:bg-dark-200 transition-all duration-200 hover:pl-6"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>

                    <div className="border-t border-gray-100 dark:border-dark-200 mt-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:pl-6"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}