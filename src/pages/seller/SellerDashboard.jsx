import React, { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function SellerDashboard({ setCurrentPage }) {
  const [stats, setStats] = useState({ pendingOrders: 0, lowStock: 0, totalProducts: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/seller/orders'),
          api.get('/seller/products')
        ]);
        const pending = ordersRes.data.filter(o => o.status === 'Pending').length;
        const low = productsRes.data.filter(p => p.stock < 10).length;
        setStats({ pendingOrders: pending, lowStock: low, totalProducts: productsRes.data.length });
      } catch (error) {
        console.error("Failed to fetch seller stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    // <div className="space-y-4 px-2 max-w-full md:space-y-6 lg:space-y-8 md:px-0">
    //   {/* Header - Mobile Optimized */}
    //   <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
    //     <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent text-center leading-tight md:text-3xl md:text-left">
    //       Seller Dashboard
    //     </h1>
    //     <div className="flex items-center justify-center space-x-3 md:justify-start">
    //       <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 md:w-12 md:h-12">
    //         <svg className="w-5 h-5 text-white md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    //         </svg>
    //       </div>
    //       <div className="text-center md:text-left">
    //         <p className="font-medium text-gray-900 dark:text-dark-900 text-sm md:text-base">Business Overview</p>
    //         <p className="text-xs text-gray-500 dark:text-dark-500 md:text-sm">Performance Analytics</p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Stats Cards - Mobile First Grid */}
    //   {isLoading ? (
    //     <div className="flex items-center justify-center py-12">
    //       <LoadingSpinner />
    //     </div>
    //   ) : (
    //     <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
    //       <StatCard
    //         title="Pending Orders"
    //         value={stats.pendingOrders}
    //         trend="+5%"
    //         icon={
    //           <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    //           </svg>
    //         }
    //         color="orange"
    //       />
    //       <StatCard
    //         title="Low Stock Items"
    //         value={stats.lowStock}
    //         trend={stats.lowStock > 0 ? "Alert" : "Good"}
    //         icon={
    //           <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
    //           </svg>
    //         }
    //         color={stats.lowStock > 0 ? "red" : "green"}
    //       />
    //       <StatCard
    //         title="Total Products"
    //         value={stats.totalProducts}
    //         trend="+2 this week"
    //         icon={
    //           <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    //           </svg>
    //         }
    //         color="blue"
    //       />
    //     </div>
    //   )}

    //   {/* Quick Actions - Mobile Optimized */}
    //   <div className="relative glass-effect rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl md:rounded-3xl md:p-6 lg:p-8">
    //     <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/50 dark:from-emerald-900/10 dark:via-teal-900/5 dark:to-green-900/10 rounded-2xl -z-10 md:rounded-3xl"></div>

    //     <div className="flex items-center space-x-3 mb-4 md:mb-6">
    //       <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 md:w-10 md:h-10 md:rounded-2xl">
    //         <svg className="w-4 h-4 text-white md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    //         </svg>
    //       </div>
    //       <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent md:text-xl">
    //         Quick Actions
    //       </h2>
    //     </div>

    //     <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
    //       {[
    //         {
    //           title: "Manage Stock",
    //           onClick: () => setCurrentPage('stock'),
    //           color: "from-emerald-500 to-teal-600",
    //           icon: (
    //             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    //             </svg>
    //           ),
    //         },
    //         {
    //           title: "View Orders",
    //           onClick: () => setCurrentPage('orders'),
    //           color: "from-blue-500 to-indigo-600",
    //           icon: (
    //             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    //             </svg>
    //           ),
    //         },
    //         {
    //           title: "Profile",
    //           onClick: () => setCurrentPage('profile'),
    //           color: "from-purple-500 to-pink-600",
    //           icon: (
    //             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    //             </svg>
    //           ),
    //         },
    //         {
    //           title: "Analytics",
    //           onClick: null,
    //           color: "from-orange-500 to-red-600",
    //           icon: (
    //             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //             </svg>
    //           ),
    //         },
    //       ].map((action) => (
    //         <button
    //           key={action.title}
    //           onClick={action.onClick}
    //           className={`
    //             group relative overflow-hidden bg-gradient-to-r ${action.color}
    //             text-white font-semibold py-4 px-4
    //             rounded-xl md:rounded-2xl md:py-4 md:px-6
    //             hover:brightness-105 transition-all duration-300
    //             shadow-lg hover:shadow-xl
    //             min-h-[80px] md:min-h-[88px]
    //             text-xs md:text-sm
    //             flex flex-col items-center justify-center
    //             active:scale-95 touch-manipulation
    //           `}
    //         >
    //           <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    //           <div className="relative flex flex-col items-center space-y-2">
    //             {action.icon}
    //             <span className="text-xs md:text-sm text-center leading-tight font-medium">
    //               {action.title}
    //             </span>
    //           </div>
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Performance Insights - Mobile Optimized */}
    //   <div className="relative glass-effect rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl md:rounded-3xl md:p-6 lg:p-8">
    //     <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-2xl -z-10 md:rounded-3xl"></div>

    //     <div className="flex items-center space-x-3 mb-4 md:mb-6">
    //       <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 md:w-10 md:h-10 md:rounded-2xl">
    //         <svg className="w-4 h-4 text-white md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //         </svg>
    //       </div>
    //       <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:text-xl">
    //         Performance Insights
    //       </h2>
    //     </div>

    //     <div className="grid gap-4 grid-cols-1 md:gap-6 lg:grid-cols-2">
    //       {/* Business Tips */}
    //       <div className="space-y-3 md:space-y-4">
    //         <h3 className="font-semibold text-gray-900 dark:text-dark-900 text-sm md:text-base">
    //           Business Tips
    //         </h3>
    //         <div className="space-y-3">
    //           {stats.lowStock > 0 && (
    //             <div className="flex items-start space-x-3 p-3 glass-effect rounded-xl border border-orange-200/50 dark:border-orange-700/50 md:rounded-xl">
    //               <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
    //                 <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
    //                 </svg>
    //               </div>
    //               <div className="min-w-0 flex-1">
    //                 <p className="text-sm font-medium text-gray-900 dark:text-dark-900">Low Stock Alert</p>
    //                 <p className="text-xs text-gray-600 dark:text-dark-300 leading-relaxed mt-1">
    //                   You have {stats.lowStock} items running low. Restock to avoid missed sales!
    //                 </p>
    //               </div>
    //             </div>
    //           )}
    //           <div className="flex items-start space-x-3 p-3 glass-effect rounded-xl border border-green-200/50 dark:border-green-700/50">
    //             <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
    //               <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    //               </svg>
    //             </div>
    //             <div className="min-w-0 flex-1">
    //               <p className="text-sm font-medium text-gray-900 dark:text-dark-900">Great Job!</p>
    //               <p className="text-xs text-gray-600 dark:text-dark-300 leading-relaxed mt-1">
    //                 You have {stats.totalProducts} products listed. Keep expanding your inventory!
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Quick Stats */}
    //       <div className="space-y-3 md:space-y-4">
    //         <h3 className="font-semibold text-gray-900 dark:text-dark-900 text-sm md:text-base">
    //           Recent Activity
    //         </h3>
    //         <div className="space-y-3">
    //           {/* Orders this week */}
    //           <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-blue-200/50 dark:border-blue-700/50">
    //             <div className="flex items-center space-x-3 min-w-0 flex-1">
    //               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
    //               <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
    //                 Orders this week
    //               </span>
    //             </div>
    //             <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
    //               {stats.pendingOrders + 3}
    //             </span>
    //           </div>
    //           {/* Products added */}
    //           <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-purple-200/50 dark:border-purple-700/50">
    //             <div className="flex items-center space-x-3 min-w-0 flex-1">
    //               <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></div>
    //               <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
    //                 Products added
    //               </span>
    //             </div>
    //             <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
    //               2
    //             </span>
    //           </div>
    //           {/* Revenue this month */}
    //           <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-green-200/50 dark:border-green-700/50">
    //             <div className="flex items-center space-x-3 min-w-0 flex-1">
    //               <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
    //               <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
    //                 Revenue this month
    //               </span>
    //             </div>
    //             <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
    //               ₹{((stats.pendingOrders * 150) + 1200).toLocaleString()}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>


    <div className="space-y-4 px-2 max-w-full md:space-y-6 lg:space-y-8 md:px-0">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent text-center md:text-left leading-tight">
          Seller Dashboard
        </h1>
        <div className="flex items-center justify-center space-x-3 md:justify-start">
          <div className="w-9 h-9 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 md:w-12 md:h-12">
            <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <p className="font-medium text-gray-900 dark:text-dark-900 text-xs md:text-sm">Business Overview</p>
            <p className="text-xs text-gray-500 dark:text-dark-500 md:text-sm">Performance Analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards - More compact grid on mobile */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10 md:py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            trend="+5%"
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="orange"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStock}
            trend={stats.lowStock > 0 ? "Alert" : "Good"}
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
            color={stats.lowStock > 0 ? "red" : "green"}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            trend="+2 this week"
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            color="blue"
          />
        </div>
      )}

      {/* Quick Actions - make grid columns adaptive, min button sizes increased for tap */}
      <div className="relative glass-effect rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/50 dark:from-emerald-900/10 dark:via-teal-900/5 dark:to-green-900/10 rounded-2xl -z-10"></div>

        <div className="flex items-center space-x-3 mb-3 md:mb-6">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent md:text-xl">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            {
              title: "Manage Stock",
              onClick: () => setCurrentPage('stock'),
              color: "from-emerald-500 to-teal-600",
              icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            },
            {
              title: "View Orders",
              onClick: () => setCurrentPage('orders'),
              color: "from-blue-500 to-indigo-600",
              icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              ),
            },
            {
              title: "Profile",
              onClick: () => setCurrentPage('profile'),
              color: "from-purple-500 to-pink-600",
              icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
            },
            {
              title: "Analytics",
              onClick: null,
              color: "from-orange-500 to-red-600",
              icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
            },
          ].map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`
            group relative overflow-hidden bg-gradient-to-r ${action.color}
            text-white font-semibold py-3 sm:py-4 px-4
            rounded-xl md:rounded-2xl md:py-4 md:px-6
            hover:brightness-105 transition-all duration-300
            shadow-lg hover:shadow-xl
            min-h-[72px] md:min-h-[88px]
            text-xs md:text-sm
            flex flex-col items-center justify-center
            active:scale-95 touch-manipulation
          `}
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>
              <div className="relative flex flex-col items-center space-y-2">
                {action.icon}
                <span className="text-xs md:text-sm text-center leading-tight font-medium">
                  {action.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Insights - Mobile Optimized */}
      <div className="relative glass-effect rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-2xl -z-10"></div>

        <div className="flex items-center space-x-3 mb-3 md:mb-6">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:text-xl">
            Performance Insights
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 md:gap-6">
          {/* Business Tips */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-dark-900 text-sm md:text-base">
              Business Tips
            </h3>
            <div className="space-y-3">
              {stats.lowStock > 0 && (
                <div className="flex items-start space-x-3 p-3 glass-effect rounded-xl border border-orange-200/50 dark:border-orange-700/50 md:rounded-xl">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-900">Low Stock Alert</p>
                    <p className="text-xs text-gray-600 dark:text-dark-300 leading-relaxed mt-1">
                      You have {stats.lowStock} items running low. Restock to avoid missed sales!
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3 p-3 glass-effect rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-900">Great Job!</p>
                  <p className="text-xs text-gray-600 dark:text-dark-300 leading-relaxed mt-1">
                    You have {stats.totalProducts} products listed. Keep expanding your inventory!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-dark-900 text-sm md:text-base">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {/* Orders this week */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
                    Orders this week
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
                  {stats.pendingOrders + 3}
                </span>
              </div>
              {/* Products added */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
                    Products added
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
                  2
                </span>
              </div>
              {/* Revenue this month */}
              <div className="flex items-center justify-between p-3 glass-effect rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 dark:text-dark-300 truncate">
                    Revenue this month
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-900 flex-shrink-0 ml-3">
                  ₹{((stats.pendingOrders * 150) + 1200).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
