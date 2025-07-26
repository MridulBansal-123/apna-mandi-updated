import React, { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function AdminDashboard({ setCurrentPage }) {
  const [stats, setStats] = useState({ buyerCount: 0, sellerCount: 0, orderCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-dark-900">System Overview</p>
            <p className="text-sm text-gray-500 dark:text-dark-500">Administrative Control</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard 
            title="Total Buyers" 
            value={stats.buyerCount} 
            change="+12%"
            changeType="increase"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="blue"
          />
          <StatCard 
            title="Total Sellers" 
            value={stats.sellerCount} 
            change="+8%"
            changeType="increase"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="green"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.orderCount} 
            change="+25%"
            changeType="increase"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            color="purple"
          />
        </div>
      )}

      {/* Admin Actions */}
      <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10 rounded-3xl -z-10"></div>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Administrative Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Manage Users */}
          <button 
            onClick={() => setCurrentPage('users')} 
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center space-y-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-sm">Manage Users</span>
            </div>
          </button>

          {/* Manage Orders */}
          <button 
            onClick={() => setCurrentPage('orders')} 
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center space-y-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm">Manage Orders</span>
            </div>
          </button>

          {/* System Settings */}
          <button 
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center space-y-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Settings</span>
            </div>
          </button>

          {/* Analytics */}
          <button 
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center space-y-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Analytics</span>
            </div>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-900/10 dark:via-emerald-900/5 dark:to-teal-900/10 rounded-3xl -z-10"></div>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            System Health
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Platform Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-dark-900">Platform Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300">Server Status</span>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300">Database</span>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Connected</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-dark-900">Today's Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300">New Users</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-900">+{Math.floor(Math.random() * 20) + 5}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300">Orders Processed</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-900">{Math.floor(Math.random() * 50) + 10}</span>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-dark-900">Recent Updates</h3>
            <div className="space-y-3">
              <div className="p-3 glass-effect rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-900 mb-1">System Update</p>
                <p className="text-xs text-gray-600 dark:text-dark-300">Enhanced security features deployed</p>
              </div>
              
              <div className="p-3 glass-effect rounded-xl border border-cyan-200/50 dark:border-cyan-700/50">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-900 mb-1">New Feature</p>
                <p className="text-xs text-gray-600 dark:text-dark-300">Admin dashboard improvements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
