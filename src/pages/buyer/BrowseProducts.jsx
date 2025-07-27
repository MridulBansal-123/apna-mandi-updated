import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ProductCard from '../../components/buyer/ProductCard';
import useStore from '../../store';

export default function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const { cart, clearCart } = useStore();

  // Categories list
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'oils', name: 'Oils', icon: '🫒' },
  ];

  const sortOptions = [
    { id: 'name', name: 'Name (A-Z)' },
    { id: 'name-desc', name: 'Name (Z-A)' },
    { id: 'price-low', name: 'Price (Low to High)' },
    { id: 'price-high', name: 'Price (High to Low)' },
    { id: 'stock', name: 'Stock Available' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/buyer/products');
        setProducts(data);

        // Calculate max price for range slider
        const prices = data.map(p => p.price);
        const max = Math.max(...prices);
        setMaxPrice(max);
        setPriceRange([0, max]);
      } catch (error) {
        toast.error('Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ||
        product.category?.toLowerCase() === selectedCategory ||
        product.name.toLowerCase().includes(selectedCategory);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const handlePlaceOrder = async () => {
    const cartItems = Object.keys(cart)
      .map(productId => {
        const product = products.find(p => p._id === productId);
        if (!product) return null;
        return { ...product, quantity: cart[productId] };
      })
      .filter(Boolean);

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const ordersBySeller = cartItems.reduce((acc, item) => {
      const sellerId = item.seller?._id;
      if (!sellerId) return acc;
      if (!acc[sellerId]) {
        acc[sellerId] = { sellerId, items: [], totalPrice: 0 };
      }
      acc[sellerId].items.push(item);
      acc[sellerId].totalPrice += item.price * item.quantity;
      return acc;
    }, {});

    try {
      for (const sellerOrder of Object.values(ordersBySeller)) {
        await api.post('/buyer/orders', {
          cart: sellerOrder.items,
          sellerId: sellerOrder.sellerId,
          totalPrice: sellerOrder.totalPrice,
          deliveryAddress: { pincode: '12345' }
        });
      }
      toast.success("All orders placed successfully!");
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place one or more orders.");
    }
  };

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-96">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Combined Header and Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              Browse Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Discover fresh products from local sellers • <span className="text-blue-600 dark:text-blue-400 font-semibold">{filteredProducts.length}</span> items available
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-72 text-sm border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-600 mb-8"></div>

        {/* Filters Section */}
        <div className="space-y-6">
          {/* Top Row: Categories and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Categories */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${selectedCategory === category.id
                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600 hover:text-blue-700 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600'
                      }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 text-sm w-48 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">View</label>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Price Range Filter */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => setPriceRange([0, maxPrice])}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Reset Price
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {filteredProducts.length === 0 && !isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }`}>
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Floating Cart */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={handlePlaceOrder}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Place Order ({cartItemCount})</span>
          </button>
        </div>
      )}
    </div>
  );
}
