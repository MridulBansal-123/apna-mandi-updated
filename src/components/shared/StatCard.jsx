import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color = 'primary', 
  trend = [], 
  onClick,
  loading = false 
}) {
  const colorClasses = {
    primary: {
      bg: 'from-slate-50/50 via-slate-50/30 to-slate-50/50 dark:from-slate-900/10 dark:via-slate-900/5 dark:to-slate-900/10',
      border: 'border-slate-200/50 dark:border-slate-700/50',
      icon: 'from-slate-600 to-slate-700',
      text: 'from-slate-700 to-slate-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    blue: {
      bg: 'from-blue-50/50 via-blue-50/30 to-blue-50/50 dark:from-blue-900/10 dark:via-blue-900/5 dark:to-blue-900/10',
      border: 'border-blue-200/50 dark:border-blue-700/50',
      icon: 'from-blue-600 to-blue-700',
      text: 'from-blue-700 to-blue-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    purple: {
      bg: 'from-indigo-50/50 via-indigo-50/30 to-indigo-50/50 dark:from-indigo-900/10 dark:via-indigo-900/5 dark:to-indigo-900/10',
      border: 'border-indigo-200/50 dark:border-indigo-700/50',
      icon: 'from-indigo-600 to-indigo-700',
      text: 'from-indigo-700 to-indigo-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    orange: {
      bg: 'from-amber-50/50 via-amber-50/30 to-amber-50/50 dark:from-amber-900/10 dark:via-amber-900/5 dark:to-amber-900/10',
      border: 'border-amber-200/50 dark:border-amber-700/50',
      icon: 'from-amber-600 to-amber-700',
      text: 'from-amber-700 to-amber-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    green: {
      bg: 'from-emerald-50/50 via-emerald-50/30 to-emerald-50/50 dark:from-emerald-900/10 dark:via-emerald-900/5 dark:to-emerald-900/10',
      border: 'border-emerald-200/50 dark:border-emerald-700/50',
      icon: 'from-emerald-600 to-emerald-700',
      text: 'from-emerald-700 to-emerald-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    },
    red: {
      bg: 'from-red-50/50 via-red-50/30 to-red-50/50 dark:from-red-900/10 dark:via-red-900/5 dark:to-red-900/10',
      border: 'border-red-200/50 dark:border-red-700/50',
      icon: 'from-red-600 to-red-700',
      text: 'from-red-700 to-red-800',
      change: changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.primary;

  if (loading) {
    return (
      <div className="relative glass-effect rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-gray-50/30 to-gray-50/50 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 rounded-3xl -z-10"></div>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-dark-300 rounded-2xl"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-dark-300 rounded-full"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 dark:bg-dark-300 rounded mb-2"></div>
          <div className="w-20 h-4 bg-gray-200 dark:bg-dark-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Main Card */}
      <div 
        className={`relative glass-effect rounded-3xl p-6 border ${currentColor.border} backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform ${onClick ? 'cursor-pointer' : ''} animate-slide-up`}
        onClick={onClick}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} rounded-3xl -z-10`}></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {icon && (
            <div className={`w-12 h-12 bg-gradient-to-r ${currentColor.icon} rounded-2xl flex items-center justify-center shadow-lg shadow-${color}-500/30 group-hover:shadow-${color}-500/50 transition-all duration-300 group-hover:scale-110`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
          )}
          {change && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${currentColor.change} px-3 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm`}>
              {changeType === 'increase' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7h-10v10" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 7h10v10" />
                </svg>
              )}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className={`text-3xl font-bold bg-gradient-to-r ${currentColor.text} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>

        {/* Title */}
        <p className="text-sm text-gray-600 dark:text-dark-400 font-medium uppercase tracking-wide">
          {title}
        </p>

        {/* Trend line (if provided) */}
        {Array.isArray(trend) && trend.length > 0 && (
          <div className="mt-4 h-8 flex items-end space-x-1">
            {trend.map((point, index) => (
              <div
                key={index}
                className={`bg-gradient-to-t ${currentColor.icon} rounded-sm opacity-60 group-hover:opacity-100 transition-all duration-300`}
                style={{
                  height: `${(point / Math.max(...trend)) * 100}%`,
                  width: `${100 / trend.length}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-50"></div>
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-full opacity-30"></div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${currentColor.icon} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-20`}></div>
    </div>
  );
}