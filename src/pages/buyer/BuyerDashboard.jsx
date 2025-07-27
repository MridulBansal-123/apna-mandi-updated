import React, { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Chatbot from '../../components/chat/Chatbot';


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
    <div className="space-y-6 px-4 sm:space-y-8 sm:px-6 md:px-8 max-w-full">
      {/* Header Section - Made more compact for mobile */}
      <div className="glass-effect rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 relative overflow-hidden shadow-xl sm:shadow-2xl shadow-emerald-500/10 dark:shadow-slate-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-green-50/80 dark:from-emerald-900/20 dark:via-teal-900/15 dark:to-green-900/20 rounded-2xl sm:rounded-3xl -z-10"></div>
        <div className="absolute inset-0 bg-white/10 dark:bg-slate-800/20 backdrop-blur-lg sm:backdrop-blur-xl rounded-2xl sm:rounded-3xl -z-5"></div>
        <div className="absolute inset-0 ring-1 ring-inset ring-emerald-200/30 dark:ring-emerald-600/20 rounded-2xl sm:rounded-3xl"></div>

        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white dark:text-white mb-2 sm:mb-3 flex items-center tracking-tight drop-shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4 shadow-md sm:shadow-lg shadow-emerald-500/30">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              Buyer Dashboard
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white dark:text-white drop-shadow-md max-w-md">
              Track your orders and discover fresh products
            </p>
          </div>

          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-3">
            <button
              onClick={() => setCurrentPage('browse')}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-xl sm:rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-md sm:shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 border border-emerald-400/50 min-w-[120px] sm:min-w-[140px] flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Browse</span>
            </button>

            <button
              onClick={() => setCurrentPage('orders')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md sm:shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 border border-blue-400/50 min-w-[120px] sm:min-w-[140px] flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Changed to 2 columns on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{
          title: "Active Orders",
          iconBg: "from-blue-500 to-indigo-600",
          icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
          value: stats.active,
          colorText: "text-blue-600 dark:text-blue-400",
          description: "In progress",
        }, {
          title: "Completed",
          iconBg: "from-emerald-500 to-teal-600",
          icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          value: stats.completed,
          colorText: "text-emerald-600 dark:text-emerald-400",
          description: "Delivered",
        }, {
          title: "Total Spent",
          iconBg: "from-indigo-500 to-purple-600",
          icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          ),
          value: `₹${stats.totalSpent.toLocaleString()}`,
          colorText: "text-indigo-600 dark:text-indigo-400",
          description: "Lifetime",
        }, {
          title: "Money Saved",
          iconBg: "from-amber-500 to-orange-600",
          icon: (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
          value: `₹${stats.savedMoney.toLocaleString()}`,
          colorText: "text-amber-600 dark:text-amber-400",
          description: "Savings",
        }].map(({ title, iconBg, icon, value, colorText, description }, idx) => (
          <div
            key={title}
            className="glass-effect rounded-xl p-3 sm:p-4 md:p-5 md:rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-md sm:shadow-xl dark:shadow-slate-900/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${iconBg} rounded-xl md:rounded-2xl opacity-10 -z-10`}></div>
            <div className={`absolute inset-0 ring-1 ring-inset ${iconBg.replace('from-', 'from-').replace('to-', 'to-')} rounded-xl md:rounded-2xl opacity-20 -z-5`}></div>

            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br ${iconBg} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md sm:shadow-lg shadow-white/20`}>
                {icon}
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${colorText}`}>{value}</div>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide truncate">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">{description}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Section - Simplified for mobile */}
      <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-2xl sm:rounded-3xl -z-10"></div>

        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center whitespace-nowrap">
            <span className="mr-2 sm:mr-3">📋</span>
            Recent Orders
          </h2>
          <button
            onClick={() => setCurrentPage('orders')}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center space-x-1 whitespace-nowrap text-sm sm:text-base"
            type="button"
          >
            <span>View All</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-6 sm:py-8 md:py-10 px-2 sm:px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">No orders yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-xs mx-auto text-sm sm:text-base">Start shopping to see orders</p>
            <button
              onClick={() => setCurrentPage('browse')}
              className="inline-flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
              type="button"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Shop Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {recentOrders.slice(0, 3).map((order, index) => (
              <div key={order._id || index} className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/30 dark:border-slate-600/30 backdrop-blur-sm hover:shadow-md sm:hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-blue-500/5 dark:from-slate-800/10 dark:to-blue-900/10 rounded-xl sm:rounded-2xl -z-10"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2 flex-wrap">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                        #{order._id?.slice(-6) || `${index + 1}`}
                      </h3>
                      <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                      {order.cart?.length || 0} items • ₹{order.totalPrice?.toLocaleString() || '0'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-xxs sm:text-xs mt-0.5">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-0">
                    <button
                      className="p-1 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      type="button"
                      aria-label="View order details"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Quick Actions - Stacked on mobile */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        {[
          {
            title: "Support",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/20",
            icon: (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v16l-8-2-8 2V1a1 1 0 011-1h2a1 1 0 011 1v3z" />
              </svg>
            ),
            description: "Get help with orders",
          },
          {
            title: "Reviews",
            iconBg: "bg-blue-100 dark:bg-blue-900/20",
            icon: (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            ),
            description: "Rate purchases",
          },
          {
            title: "Wallet",
            iconBg: "bg-purple-100 dark:bg-purple-900/20",
            icon: (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
            description: "Payment methods",
          },
        ].map(({ title, iconBg, icon, description }) => (
          <div key={title} className="glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/20 dark:border-slate-700/50 text-center hover:shadow-md sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1">
            <div className={`${iconBg} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16`}>
              {icon}
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2 truncate">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{description}</p>
          </div>
        ))}
      </div>
      <Chatbot />
    </div>
  );
}
