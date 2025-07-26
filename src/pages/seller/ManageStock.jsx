import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageStock() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [unit, setUnit] = useState('kg');
    const [category, setCategory] = useState('Vegetables');

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/seller/products');
            setProducts(data);
        } catch (error) {
            toast.error("Failed to fetch your products.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await api.post('/seller/products', { name, price, stock, unit, category });
            toast.success("Product added successfully!");
            fetchProducts();
            setName(''); setPrice(''); setStock('');
        } catch (error) {
            toast.error("Failed to add product.");
        }
    };
    
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/seller/products/${productId}`);
                toast.success("Product deleted!");
                fetchProducts();
            } catch (error) {
                toast.error("Failed to delete product.");
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                    Manage Your Stock
                </h1>
                <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-dark-900">Stock Management</p>
                        <p className="text-sm text-gray-500 dark:text-dark-500">{products.length} Products</p>
                    </div>
                </div>
            </div>
            
            {/* Add Product Form */}
            <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/50 dark:from-emerald-900/10 dark:via-teal-900/5 dark:to-green-900/10 rounded-3xl -z-10"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Add New Product
                    </h2>
                </div>

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Product Name */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                            Product Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Enter product name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 glass-effect border border-emerald-200/50 dark:border-emerald-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                required 
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                            Price (₹)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <input 
                                type="number" 
                                placeholder="Enter price" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 glass-effect border border-yellow-200/50 dark:border-yellow-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                required 
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                            Stock Quantity
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <input 
                                type="number" 
                                placeholder="Enter stock quantity" 
                                value={stock} 
                                onChange={e => setStock(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 glass-effect border border-blue-200/50 dark:border-blue-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-900 dark:text-dark-900 placeholder-gray-500 dark:placeholder-dark-400 transition-all duration-300"
                                required 
                            />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Unit */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                            Unit
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <select 
                                value={unit} 
                                onChange={e => setUnit(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 glass-effect border border-purple-200/50 dark:border-purple-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-gray-900 dark:text-dark-900 transition-all duration-300 appearance-none"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="litre">Litre</option>
                                <option value="dozen">Dozen</option>
                                <option value="piece">Piece</option>
                            </select>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-900 dark:text-dark-900 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 glass-effect border border-pink-200/50 dark:border-pink-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-gray-900 dark:text-dark-900 transition-all duration-300 appearance-none"
                            >
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Essentials">Essentials</option>
                            </select>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 xl:col-span-1">
                        <label className="block text-sm font-medium text-transparent mb-2">
                            Action
                        </label>
                        <button 
                            type="submit" 
                            className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Product</span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>

            {/* Product Listings */}
            <div className="relative glass-effect rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 rounded-3xl -z-10"></div>
                
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Your Current Listings
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-900 mb-2">No products found</h3>
                        <p className="text-gray-500 dark:text-dark-400">Add your first product to start selling!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product._id} className="group relative glass-effect rounded-2xl p-6 border border-white/30 dark:border-gray-600/30 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-blue-500/5 dark:from-gray-800/10 dark:to-blue-900/10 rounded-2xl -z-10"></div>
                                
                                {/* Category Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                                        product.category === 'Vegetables' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                                        product.category === 'Fruits' ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200' :
                                        product.category === 'Dairy' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200' :
                                        'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                                    }`}>
                                        {product.category}
                                    </span>
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                                        product.stock > 10 ? 'bg-green-400' : 
                                        product.stock > 5 ? 'bg-yellow-400' : 'bg-red-400'
                                    }`}></div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-3">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-dark-900 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            <span className="font-semibold text-gray-900 dark:text-dark-900">₹{product.price}</span>
                                            <span className="text-sm text-gray-500 dark:text-dark-400">per {product.unit}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="text-sm text-gray-600 dark:text-dark-300">
                                            Stock: <span className="font-medium">{product.stock} {product.unit}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                                    <button 
                                        onClick={() => handleDeleteProduct(product._id)} 
                                        className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium py-3 px-4 rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transform hover:-translate-y-0.5"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete Product</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
