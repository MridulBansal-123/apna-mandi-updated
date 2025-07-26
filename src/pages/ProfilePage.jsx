import React, { useState } from 'react';
import useStore from '../store';
import { api } from '../utils/api';
import { toast } from 'sonner';
import DeleteAccountModal from '../components/shared/DeleteAccountModal';

export default function ProfilePage() {
    const { user, login } = useStore();
    const [formData, setFormData] = useState({
        name: user.name,
        businessName: user.businessName || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', pincode: '' },
    });
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.address) {
            setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', formData);
            login({ user: data, token: useStore.getState().token });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                        My Profile
                    </h1>
                    <div className="flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <span className="text-white font-bold text-lg">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-dark-900">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-dark-500">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-900/10 dark:via-pink-900/5 dark:to-blue-900/10 rounded-3xl -z-10"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                Owner Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input 
                                    name="name" 
                                    placeholder="Enter your full name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-4 glass-effect border border-purple-200/50 dark:border-purple-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                    required 
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Business Name Field */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                Business Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <input 
                                    name="businessName" 
                                    placeholder="Enter your business name" 
                                    value={formData.businessName} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-4 glass-effect border border-blue-200/50 dark:border-blue-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                    required 
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input 
                                    name="phone" 
                                    placeholder="Enter your mobile number" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-4 py-4 glass-effect border border-green-200/50 dark:border-green-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                    required 
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-900 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Address Information
                            </h3>
                            
                            {/* Street Address */}
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                    Street Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        name="street" 
                                        placeholder="Enter your street address" 
                                        value={formData.address.street} 
                                        onChange={handleChange} 
                                        className="w-full pl-12 pr-4 py-4 glass-effect border border-orange-200/50 dark:border-orange-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                        required 
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            </div>

                            {/* City and Pincode */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                        City
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="city" 
                                            placeholder="Enter your city" 
                                            value={formData.address.city} 
                                            onChange={handleChange} 
                                            className="w-full pl-12 pr-4 py-4 glass-effect border border-indigo-200/50 dark:border-indigo-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                            required 
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                                        Pincode
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                                            </svg>
                                        </div>
                                        <input 
                                            name="pincode" 
                                            placeholder="Enter your pincode" 
                                            value={formData.address.pincode} 
                                            onChange={handleChange} 
                                            className="w-full pl-12 pr-4 py-4 glass-effect border border-red-200/50 dark:border-red-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                            required 
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="relative glass-effect rounded-3xl p-8 border border-red-200/30 dark:border-red-700/50 backdrop-blur-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-pink-50/20 to-orange-50/30 dark:from-red-900/10 dark:via-pink-900/5 dark:to-orange-900/10 rounded-3xl -z-10"></div>
                    
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                Danger Zone
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-dark-400 mt-1 mb-4">
                                Deleting your account is a permanent action and cannot be undone. All your data will be permanently removed.
                            </p>
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)} 
                                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium py-3 px-6 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Delete My Account</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
