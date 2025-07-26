import React, { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function BuyerDashboard({ setCurrentPage }) {
  const [stats, setStats] = useState({ active: 0, completed: 0, totalSpent: 0, savedMoney: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/buyer/orders');
        const active = data.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
        const completed = data.filter(o => o.status === 'Delivered').length;
        const totalSpent = data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const savedMoney = Math.floor(totalSpent * 0.15); // Assuming 15% savings
        
        setStats({ active, completed, totalSpent, savedMoney });
        setRecentOrders(data.slice(0, 5)); // Get 5 most recent orders
      } catch (error) {
        console.error("Failed to fetch buyer stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 relative overflow-hidden shadow-2xl shadow-emerald-500/10 dark:shadow-slate-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-green-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-green-900/20 rounded-3xl -z-10"></div>
        <div className="absolute inset-0 bg-white/10 dark:bg-slate-800/20 backdrop-blur-xl rounded-3xl -z-5"></div>
        <div className="absolute inset-0 ring-1 ring-inset ring-emerald-200/30 dark:ring-emerald-600/20 rounded-3xl"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black text-white dark:text-white mb-3 flex items-center tracking-tight drop-shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-emerald-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              Buyer Dashboard
            </h1>
            <p className="text-white dark:text-white text-lg font-semibold drop-shadow-md">
              Track your orders and discover fresh products from local sellers
            </p>
          </div>
          
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setCurrentPage('browse')}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transform hover:-translate-y-1 border border-emerald-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Browse Products</span>
              </span>
            </button>
            
            <button
              onClick={() => setCurrentPage('orders')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl transform hover:-translate-y-1 border border-blue-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>View Orders</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-blue-500/10 dark:shadow-slate-900/20 hover:shadow-blue-500/20 dark:hover:shadow-slate-800/30 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/5 rounded-2xl -z-10"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-blue-200/20 dark:ring-blue-600/10 rounded-2xl"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Active Orders</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Orders in progress</p>
        </div>
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-emerald-500/10 dark:shadow-slate-900/20 hover:shadow-emerald-500/20 dark:hover:shadow-slate-800/30 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-900/10 dark:to-teal-900/5 rounded-2xl -z-10"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-200/20 dark:ring-emerald-600/10 rounded-2xl"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Completed Orders</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Successfully delivered</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-indigo-500/10 dark:shadow-slate-900/20 hover:shadow-indigo-500/20 dark:hover:shadow-slate-800/30 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/5 rounded-2xl -z-10"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-indigo-200/20 dark:ring-indigo-600/10 rounded-2xl"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">₹{stats.totalSpent.toLocaleString()}</div>
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Total Spent</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Lifetime purchases</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-amber-500/10 dark:shadow-slate-900/20 hover:shadow-amber-500/20 dark:hover:shadow-slate-800/30 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5 rounded-2xl -z-10"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-amber-200/20 dark:ring-amber-600/10 rounded-2xl"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">₹{stats.savedMoney.toLocaleString()}</div>
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Money Saved</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Through our platform</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-3xl -z-10"></div>
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <span className="mr-3">📋</span>
            Recent Orders
          </h2>
          <button
            onClick={() => setCurrentPage('orders')}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No orders yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => setCurrentPage('browse')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Start Shopping</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={order._id || index} className="glass-effect rounded-2xl p-6 border border-white/30 dark:border-slate-600/30 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-blue-500/5 dark:from-slate-800/10 dark:to-blue-900/10 rounded-2xl -z-10"></div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Order #{order._id?.slice(-6) || `${index + 1}`}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {order.cart?.length || 0} items • Total: ₹{order.totalPrice?.toLocaleString() || '0'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v16l-8-2-8 2V1a1 1 0 011-1h2a1 1 0 011 1v3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Support</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Get help with your orders</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Reviews</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Rate your recent purchases</p>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Wallet</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Manage payment methods</p>
        </div>
      </div>
    </div>
  );
}
