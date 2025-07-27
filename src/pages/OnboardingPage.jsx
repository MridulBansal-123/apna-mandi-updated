import React, { useState } from 'react';
import useStore from '../store';
import { api } from '../utils/api';
import { toast } from 'sonner';
import useGeolocation from '../hooks/useGeolocation';

const RoleSelector = ({ onSelect }) => (
    <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Welcome to Apna Mandi!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">To get started, please tell us who you are.</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
            <button
                onClick={() => onSelect('Buyer')}
                className="group relative w-full p-8 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-400 bg-white/60 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 shadow-lg shadow-slate-500/10 dark:shadow-slate-900/20 hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/10 backdrop-blur-sm hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/20 dark:from-emerald-900/10 dark:to-teal-900/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I'm a Buyer</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">I am a local vendor looking to purchase raw materials.</p>
            </button>
            <button
                onClick={() => onSelect('Seller')}
                className="group relative w-full p-8 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 bg-white/60 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 shadow-lg shadow-slate-500/10 dark:shadow-slate-900/20 hover:shadow-blue-500/20 dark:hover:shadow-blue-400/10 backdrop-blur-sm hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 dark:from-blue-900/10 dark:to-indigo-900/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">I'm a Seller</h3>
                <p className="text-slate-600 dark:text-slate-300 font-medium">I am a wholesaler looking to sell my products.</p>
            </button>
        </div>
    </div>
);

const OnboardingForm = ({ role }) => {
    const { login } = useStore();
    const { location, error: geoError, getLocation } = useGeolocation();
    const [formData, setFormData] = useState({
        businessName: '', gstNumber: '', businessCategory: '', phone: '',
        address: { street: '', city: '', pincode: '', coordinates: null }
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.address) {
            setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGetLocation = async () => {
        await getLocation();
        if (location?.coordinates) {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, coordinates: location.coordinates }
            }));
            toast.success("Location captured!");
        } else if (geoError) {
            toast.error(geoError);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                role,
                ...formData,
                address: {
                    ...formData.address,
                    coordinates: location?.coordinates || formData.address.coordinates
                }
            };
            const { data } = await api.post('/auth/onboarding', payload);
            login(data);
            toast.success("Profile created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-effect rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-500/10 dark:shadow-slate-900/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-slate-50/30 to-blue-50/40 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-slate-600/40 rounded-3xl -z-10"></div>

            <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${role === 'Buyer' ? 'from-emerald-500 to-teal-600' : 'from-blue-500 to-indigo-600'} rounded-2xl flex items-center justify-center mr-4 shadow-lg ${role === 'Buyer' ? 'shadow-emerald-500/30' : 'shadow-blue-500/30'}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {role === 'Buyer' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        )}
                    </svg>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Register as a {role}</h2>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Please provide your business details to continue.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        name="businessName"
                        placeholder="Business Name"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                        required
                    />
                    <input
                        name="gstNumber"
                        placeholder="GST Number (Optional)"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        name="businessCategory"
                        placeholder="Category (e.g., Street Food, Restaurant)"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                        required
                    />
                    <input
                        name="phone"
                        placeholder="Mobile Number"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                        required
                    />
                </div>

                <input
                    name="street"
                    placeholder="Street Address"
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        name="city"
                        placeholder="City"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                        required
                    />
                    <input
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 font-medium backdrop-blur-sm"
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={handleGetLocation}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 border-2 ${location?.coordinates
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 border-emerald-400'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/30 hover:shadow-blue-500/50 border-blue-400'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{location?.coordinates ? 'Location Captured!' : 'Capture My Location'}</span>
                </button>

                {geoError && (
                    <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl font-medium">
                        {geoError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 border-2 ${role === 'Buyer'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-emerald-300 disabled:to-teal-400 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 border-emerald-400'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-blue-300 disabled:to-indigo-400 text-white shadow-blue-500/30 hover:shadow-blue-500/50 border-blue-400'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                    {loading && (
                        <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )}
                    <span>{loading ? 'Saving...' : 'Complete Registration'}</span>
                </button>
            </form>
        </div>
    );
};

export default function OnboardingPage() {
    const [selectedRole, setSelectedRole] = useState(null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <div className="w-full max-w-2xl bg-black p-8 rounded-xl shadow-xlg">
                {!selectedRole ? (
                    <RoleSelector onSelect={setSelectedRole} />
                ) : (
                    <OnboardingForm role={selectedRole} />
                )}
            </div>
        </div>
    );
}
