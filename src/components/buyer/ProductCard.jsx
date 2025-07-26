import React, { useState } from 'react';
import useStore from '../../store';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { cart, addToCart, removeFromCart } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const quantity = cart[product._id] || 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    removeFromCart(product._id);
  };

  const getStockColor = (stock) => {
    if (stock > 50) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
    if (stock > 20) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const getStockText = (stock) => {
    if (stock > 50) return 'In Stock';
    if (stock > 20) return 'Low Stock';
    if (stock > 0) return 'Very Low';
    return 'Out of Stock';
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="glass-effect rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 group cursor-pointer animate-slide-up relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 rounded-2xl -z-10"></div>
        
        <div className="flex items-center space-x-6">
          {/* Image */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl overflow-hidden flex-shrink-0">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={product.image || 'https://placehold.co/300x200/e2e8f0/e2e8f0'}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
              {product.description || 'Fresh and high quality product from local sellers'}
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStockColor(product.stock)}`}>
                {getStockText(product.stock)} ({product.stock})
              </span>
              {product.seller?.name && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  by {product.seller.name}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {quantity > 0 && (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2">
                <button 
                  onClick={handleRemoveFromCart}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="mx-3 font-semibold text-blue-600 min-w-[2rem] text-center">{quantity}</span>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            )}
            
            {quantity === 0 && (
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div 
      className="glass-effect rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group cursor-pointer animate-slide-up relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 rounded-2xl -z-10"></div>
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-200 dark:to-dark-300 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={product.image || 'https://placehold.co/300x200/e2e8f0/e2e8f0'}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Quick actions overlay */}
        <div className={`absolute top-4 right-4 transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <button 
            onClick={handleAddToCart}
            className="p-2 bg-white dark:bg-dark-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/btn"
          >
            <svg className="w-5 h-5 text-primary-600 group-hover/btn:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-primary-100/80 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 backdrop-blur-md">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-900 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>

        {/* Seller */}
        <p className="text-sm text-gray-600 dark:text-dark-400 mb-4">
          Seller: {product.seller?.name || 'Unknown Seller'}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 dark:text-dark-900">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-dark-500">
              per {product.unit || 'kg'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-primary-500/30"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2 animate-scale-in">
                <button 
                  onClick={handleRemoveFromCart}
                  className="w-8 h-8 rounded-full bg-white dark:bg-dark-100 shadow-md hover:shadow-lg font-bold text-lg flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
                >
                  -
                </button>
                <span className="font-semibold text-primary-700 dark:text-primary-300 min-w-[1.5rem] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={handleAddToCart}
                  className="w-8 h-8 rounded-full bg-white dark:bg-dark-100 shadow-md hover:shadow-lg font-bold text-lg flex items-center justify-center text-primary-600 hover:text-primary-700 transition-all duration-300 hover:scale-110"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}