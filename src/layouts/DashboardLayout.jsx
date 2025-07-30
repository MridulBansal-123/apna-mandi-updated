import React, { useState } from 'react';
import useStore from '../store';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import ProfilePage from '../pages/ProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Dynamic imports for pages
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import BrowseProducts from '../pages/buyer/BrowseProducts';
import BuyerOrders from '../pages/buyer/BuyerOrders';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerOrders from '../pages/seller/SellerOrders';
import ManageStock from '../pages/seller/ManageStock';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageOrders from '../pages/admin/ManageOrders';

export default function DashboardLayout() {
  const { user } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <div className="w-screen h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  const renderPage = () => {
    if (currentPage === 'profile') return <ProfilePage />;
    if (currentPage === 'notifications') return <NotificationsPage />;
    
    const userRole = user.role?.toLowerCase();
    
    switch (userRole) {
      case 'buyer':
        switch (currentPage) {
          case 'dashboard': return <BuyerDashboard setCurrentPage={setCurrentPage} />;
          case 'browse': return <BrowseProducts />;
          case 'orders': return <BuyerOrders />;
          default: return <BuyerDashboard setCurrentPage={setCurrentPage} />;
        }
      case 'seller':
        switch (currentPage) {
          case 'dashboard': return <SellerDashboard setCurrentPage={setCurrentPage} />;
          case 'orders': return <SellerOrders />;
          case 'stock': return <ManageStock />;
          default: return <SellerDashboard setCurrentPage={setCurrentPage} />;
        }
      case 'admin':
        switch (currentPage) {
          case 'dashboard': return <AdminDashboard setCurrentPage={setCurrentPage} />;
          case 'users': return <ManageUsers />;
          case 'orders': return <ManageOrders />;
          default: return <AdminDashboard setCurrentPage={setCurrentPage} />;
        }
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">Invalid User Role</h3>
              <p className="text-gray-500 dark:text-dark-400">
                Role: "{user.role}" is not recognized. Please contact support.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-100 dark:via-dark-200 dark:to-dark-300 flex transition-all duration-500">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col relative z-0">
        <Header setCurrentPage={setCurrentPage} />
        <main className="flex-grow p-6 overflow-auto relative z-0">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
