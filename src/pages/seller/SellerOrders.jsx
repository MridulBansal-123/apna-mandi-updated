import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/seller/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch received orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/seller/orders/${orderId}`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'from-amber-400 to-orange-500',
      'Accepted': 'from-blue-400 to-indigo-500',
      'Out for Delivery': 'from-purple-400 to-pink-500',
      'Delivered': 'from-green-400 to-emerald-500',
      'Declined': 'from-red-400 to-rose-500'
    };
    return colors[status] || colors['Pending'];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Accepted':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'Out for Delivery':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
      case 'Delivered':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case 'Declined':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      default:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Received Orders
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-dark-900">Order Management</p>
            <p className="text-sm text-gray-500 dark:text-dark-500">{orders.length} Orders</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-900/10 dark:via-purple-900/5 dark:to-pink-900/10 rounded-3xl -z-10"></div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">No orders received</h3>
            <p className="text-gray-500 dark:text-dark-400">Orders from buyers will appear here when they start purchasing your products!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="group relative glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-indigo-500/5 dark:from-gray-800/10 dark:to-indigo-900/10 rounded-2xl -z-10"></div>

                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-dark-900">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        from {order.buyer.name} • {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg bg-gradient-to-r ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass-effect rounded-xl border border-white/20 dark:border-gray-600/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-dark-900">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-gray-500 dark:text-dark-400">
                            Quantity: {item.quantity} {item.product?.unit || 'units'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-dark-900">₹{item.price}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-400">per {item.product?.unit || 'unit'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900 dark:text-dark-900">
                      Total: ₹{order.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {order.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Accepted')}
                          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:-translate-y-0.5"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Accept</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'Declined')}
                          className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium py-2 px-4 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-0.5"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Decline</span>
                          </div>
                        </button>
                      </>
                    )}
                    {order.status === 'Accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span>Ship Order</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
