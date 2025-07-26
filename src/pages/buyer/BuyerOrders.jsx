import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import useStore from '../../store';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function BuyerOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useStore();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/buyer/orders');
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', 
            shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        };
        return colors[status?.toLowerCase()] || colors.pending;
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'confirmed':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'shipped':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
            case 'delivered':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
            case 'cancelled':
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
            default:
                return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    };

    const statusFilters = [
        { id: 'all', name: 'All Orders', count: orders.length },
        { id: 'pending', name: 'Pending', count: orders.filter(o => o.status?.toLowerCase() === 'pending').length },
        { id: 'confirmed', name: 'Confirmed', count: orders.filter(o => o.status?.toLowerCase() === 'confirmed').length },
        { id: 'shipped', name: 'Shipped', count: orders.filter(o => o.status?.toLowerCase() === 'shipped').length },
        { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status?.toLowerCase() === 'delivered').length },
        { id: 'cancelled', name: 'Cancelled', count: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length }
    ];

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus;
        const matchesSearch = !searchTerm || 
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.cart?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-white drop-shadow-lg">
                    Order History
                </h1>
                <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-black text-white drop-shadow-lg">My Orders</p>
                        <p className="text-sm text-white/80 drop-shadow-lg">{orders.length} Total Orders</p>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-indigo-900/10 rounded-3xl -z-10"></div>
                
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">No orders found</h3>
                        <p className="text-gray-500 dark:text-dark-400">Start shopping to see your orders here!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="group relative glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-blue-500/5 dark:from-gray-800/10 dark:to-blue-900/10 rounded-2xl -z-10"></div>
                                
                                {/* Order Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-dark-900">
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-dark-400">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
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
                                        <span className="capitalize">{order.status}</span>
                                    </span>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3 mb-4">
                                    {(order.items || []).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 glass-effect rounded-xl border border-white/20 dark:border-gray-600/20">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-dark-900">{item.product?.name || 'Unknown Product'}</p>
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

                                {/* Order Total */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                        <span className="text-lg font-bold text-gray-900 dark:text-dark-900">
                                            Total: ₹{order.totalAmount}
                                        </span>
                                    </div>
                                    
                                    {order.status === 'delivered' && (
                                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-medium">Delivered</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
