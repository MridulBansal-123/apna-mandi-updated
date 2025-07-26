import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/admin/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to fetch all orders.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          bg: 'from-yellow-500 to-amber-600',
          text: 'text-yellow-700 dark:text-yellow-400',
          border: 'border-yellow-200/50 dark:border-yellow-700/50'
        };
      case 'accepted':
      case 'confirmed':
        return {
          bg: 'from-blue-500 to-indigo-600',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-200/50 dark:border-blue-700/50'
        };
      case 'out for delivery':
      case 'shipping':
        return {
          bg: 'from-purple-500 to-violet-600',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-200/50 dark:border-purple-700/50'
        };
      case 'delivered':
        return {
          bg: 'from-green-500 to-emerald-600',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-200/50 dark:border-green-700/50'
        };
      case 'declined':
      case 'cancelled':
        return {
          bg: 'from-red-500 to-rose-600',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200/50 dark:border-red-700/50'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-200/50 dark:border-gray-700/50'
        };
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

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
          Manage All Orders
        </h1>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-dark-900">Order Management</p>
            <p className="text-sm text-gray-500 dark:text-dark-500">{filteredOrders.length} orders</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative glass-effect rounded-3xl p-6 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by order ID, buyer, or seller..."
                className="glass-input pl-10 pr-4 py-3 w-full text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              className="glass-input px-4 py-3 w-full text-gray-900 dark:text-dark-900"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className="relative glass-effect rounded-3xl p-12 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-gray-50/30 to-gray-50/50 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 rounded-3xl -z-10"></div>
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 dark:text-dark-400">No orders found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order._id}
                  className={`relative group glass-effect rounded-3xl p-6 border ${statusColor.border} backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/5 to-white/5 dark:from-gray-900/10 dark:via-gray-900/5 dark:to-gray-900/10 rounded-3xl -z-10"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Order Info */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-dark-900 text-lg">
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-dark-300">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.text} bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm capitalize`}>
                          {order.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-dark-300">Buyer:</span>
                          <p className="font-medium text-gray-900 dark:text-dark-900">{order.buyerName || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-300">Seller:</span>
                          <p className="font-medium text-gray-900 dark:text-dark-900">{order.sellerName || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-dark-900">Items</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm p-2 glass-effect rounded-xl">
                            <span className="text-gray-700 dark:text-dark-300">{item.name}</span>
                            <span className="font-medium text-gray-900 dark:text-dark-900">
                              {item.quantity} × ₹{item.price}
                            </span>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500 dark:text-dark-400">No items available</p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex justify-between font-bold text-gray-900 dark:text-dark-900">
                          <span>Total:</span>
                          <span>₹{order.totalAmount?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-dark-900">Actions</h4>
                      <div className="space-y-2">
                        {order.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Accepted')}
                              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/30"
                            >
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Declined')}
                              className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30"
                            >
                              Decline Order
                            </button>
                          </>
                        )}
                        
                        {order.status?.toLowerCase() === 'accepted' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
                          >
                            Mark as Shipping
                          </button>
                        )}
                        
                        {order.status?.toLowerCase() === 'out for delivery' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                          >
                            Mark as Delivered
                          </button>
                        )}

                        <button
                          className="w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gray-500/30"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${statusColor.bg} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-20`}></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
