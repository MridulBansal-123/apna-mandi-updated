import React from 'react';
import useStore from '../../store';

// SVG Icon Components
const DashboardIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BrowseIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const OrdersIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const StockIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4 8-4M12 15v4" /></svg>;
const UsersIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016-5.197M15 21a9 9 0 00-9-9" /></svg>;

const NavItem = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive
      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-500/20'
      : 'text-gray-600 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-200 hover:text-gray-900 dark:hover:text-dark-900 hover:shadow-card dark:hover:shadow-card-dark'
      }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="ml-3 transition-all duration-300">{label}</span>
    {isActive && (
      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
    )}
  </button>
);

export default function Sidebar({ currentPage, setCurrentPage }) {
  const { user } = useStore();
  if (!user) return null;

  const buyerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'browse', label: 'Browse Products', icon: <BrowseIcon /> },
    { id: 'orders', label: 'My Orders', icon: <OrdersIcon /> },
  ];
  const sellerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'orders', label: 'Received Orders', icon: <OrdersIcon /> },
    { id: 'stock', label: 'Manage Stock', icon: <StockIcon /> },
  ];
  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'users', label: 'Manage Users', icon: <UsersIcon /> },
    { id: 'orders', label: 'All Orders', icon: <OrdersIcon /> },
  ];

  const navItems =
    user.role?.toLowerCase() === 'buyer'
      ? buyerNav
      : user.role?.toLowerCase() === 'seller'
        ? sellerNav
        : adminNav;

  return (
    <aside className="fixed bottom-0 left-0 right-0 md:relative md:w-64 bg-white dark:bg-dark-100 border-t md:border-r border-gray-200 dark:border-dark-200 flex-shrink-0 flex md:flex-col backdrop-blur-md z-50 transition-all duration-300">
      {/* Mobile: Bottom bar navigation */}
      <div className="flex md:hidden w-full">
        <nav className="flex justify-around items-center w-full p-2">
          {navItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`p-2 rounded-lg flex flex-col items-center ${currentPage === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-dark-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop: Full sidebar */}
      <div className="hidden md:flex md:flex-col w-full">
        {/* Logo Header */}
        <div className="h-24 flex items-center px-6 border-b border-gray-200 dark:border-dark-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src="/assets/logo.svg" alt="Apna Mandi Logo" className="h-8 w-auto drop-shadow-md" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-dark-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Apna Mandi
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-dark-500 font-semibold mb-3">
              {user.role} Portal
            </h3>
            <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
          </div>

          <nav className="space-y-2">
            {navItems.map(item => (
              <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${navItems.indexOf(item) * 0.1}s` }}>
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPage === item.id}
                  onClick={() => setCurrentPage(item.id)}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-200">
          <div className="text-xs text-gray-500 dark:text-dark-500 text-center">
            <p className="font-semibold">Apna Mandi v2.0</p>
            <p className="mt-1">© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
