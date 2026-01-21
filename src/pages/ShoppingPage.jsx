import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set axios baseURL
axios.defaults.baseURL = 'https://fitlyfy.onrender.com';

const ShoppingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('fitlyf_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [error, setError] = useState('');
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const navigate = useNavigate();

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('fitlyf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/products');
      const productsData = response.data.data || response.data || [];
      
      setProducts(productsData);
      
    } catch (error) {
      // console.error('Error fetching products:', error);
      setError('Unable to load products. Showing demo products instead.');
      
      // Fallback demo data
      setProducts([
        {
          _id: 'demo1',
          name: "Whey Protein Powder",
          category: "supplements",
          price: 2499,
          originalPrice: 2999,
          image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
          rating: 4.8,
          reviews: 156,
          description: "Premium 100% Whey Protein Isolate for rapid muscle recovery and growth. Contains 24g protein per serving with minimal fat and carbs.",
          features: ["24g Protein per scoop", "Instant Mixing", "Lactose Free", "No Artificial Sweeteners", "BCAAs Enriched"],
          inStock: true,
          isBestSeller: true,
          stock: 45,
          brand: "MuscleTech",
          weight: "2kg",
          flavors: ["Chocolate", "Vanilla", "Strawberry"],
          servingSize: "30g",
          servings: 66
        },
        {
          _id: 'demo2',
          name: "Adjustable Dumbbell Set",
          category: "equipment",
          price: 8999,
          originalPrice: 10999,
          image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?w=800&q=80",
          rating: 4.7,
          reviews: 89,
          description: "Professional adjustable dumbbell set with quick-change weight system. Perfect for home gyms and commercial use.",
          features: ["5-25kg Adjustable", "Quick Change System", "Non-Slip Grip", "Compact Design", "10 Year Warranty"],
          inStock: true,
          isBestSeller: true,
          stock: 23,
          brand: "Bowflex",
          weight: "25kg max",
          material: "Steel/Neoprene",
          warranty: "10 years"
        },
        {
          _id: 'demo3',
          name: "Yoga Mat Premium",
          category: "accessories",
          price: 1299,
          originalPrice: 1999,
          image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80",
          rating: 4.9,
          reviews: 234,
          description: "Eco-friendly premium yoga mat with superior cushioning and non-slip surface for all types of yoga.",
          features: ["Eco-Friendly Material", "Non-Slip Surface", "6mm Thickness", "Carry Strap Included", "Easy to Clean"],
          inStock: true,
          isBestSeller: true,
          stock: 78,
          brand: "Liforme",
          dimensions: "183cm x 61cm",
          thickness: "6mm",
          weight: "2.5kg",
          color: "Ocean Blue"
        },
        {
          _id: 'demo4',
          name: "Fitness Tracker Pro",
          category: "accessories",
          price: 4999,
          originalPrice: 6499,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
          rating: 4.6,
          reviews: 189,
          description: "Advanced fitness tracker with heart rate monitoring, sleep tracking, and 7-day battery life.",
          features: ["Heart Rate Monitor", "Sleep Tracking", "Water Resistant", "7-Day Battery", "Smart Notifications"],
          inStock: true,
          isBestSeller: false,
          stock: 34,
          brand: "Fitbit",
          battery: "7 days",
          display: "AMOLED",
          waterResistance: "50m"
        },
        {
          _id: 'demo5',
          name: "Pre-Workout Energizer",
          category: "supplements",
          price: 1999,
          originalPrice: 2499,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
          rating: 4.5,
          reviews: 112,
          description: "Powerful pre-workout formula for increased energy, focus, and endurance during intense workouts.",
          features: ["Increased Energy", "Better Focus", "Enhanced Endurance", "Pump & Vascularity", "Stimulant Based"],
          inStock: true,
          isBestSeller: true,
          stock: 56,
          brand: "C4",
          servings: 30,
          flavor: "Fruit Punch",
          stimulants: "Caffeine, Beta-Alanine"
        },
        {
          _id: 'demo6',
          name: "Resistance Band Set",
          category: "equipment",
          price: 899,
          originalPrice: 1499,
          image: "https://images.unsplash.com/photo-1595079676349-09115ccb6c8a?w=800&q=80",
          rating: 4.8,
          reviews: 267,
          description: "Complete resistance band set with 5 different resistance levels for full-body workouts.",
          features: ["5 Resistance Levels", "Door Anchor Included", "Carry Bag", "Exercise Guide", "Latex Free"],
          inStock: true,
          isBestSeller: false,
          stock: 92,
          brand: "Fit Simplify",
          resistance: "10-50 lbs",
          material: "Natural Rubber",
          included: "5 bands + accessories"
        }
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  // Categories data
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', count: products.length },
    { id: 'supplements', name: 'Supplements', icon: '💊', count: products.filter(p => p.category === 'supplements').length },
    { id: 'equipment', name: 'Equipment', icon: '🏋️', count: products.filter(p => p.category === 'equipment').length },
    { id: 'accessories', name: 'Accessories', icon: '🎽', count: products.filter(p => p.category === 'accessories').length },
    { id: 'best-sellers', name: 'Best Sellers', icon: '⭐', count: products.filter(p => p.isBestSeller).length },
    { id: 'new-arrivals', name: 'New Arrivals', icon: '🆕', count: products.filter(p => p.isNew).length }
  ];

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'best-sellers') return product.isBestSeller;
    if (activeCategory === 'new-arrivals') return product.isNew;
    return product.category === activeCategory;
  }).filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default: return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Cart Functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showToast(`Increased quantity of ${product.name}`, 'success');
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1,
        addedAt: new Date().toISOString()
      }]);
      showToast(`${product.name} added to cart`, 'success');
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
    showToast('Item removed from cart', 'error');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item =>
      item._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };

  // Cart calculations
  const cartTotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const cartCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);
  const deliveryCharge = cartTotal > 1999 ? 0 : 99;
  const tax = cartTotal * 0.18;
  const grandTotal = cartTotal + deliveryCharge + tax;

  // Toast notification
  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl text-white backdrop-blur-sm ${
      type === 'success' ? 'bg-green-600/90 border border-green-500/50' :
      type === 'error' ? 'bg-red-600/90 border border-red-500/50' :
      type === 'info' ? 'bg-blue-600/90 border border-blue-500/50' : 'bg-gray-800/90 border border-gray-700/50'
    }`;
    toast.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    setShowCartSidebar(false);
    navigate('/checkout');
  };

  // Quick View function
  const showQuickView = (product) => {
    setSelectedProduct(product);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate stats
  const calculateStats = () => {
    if (products.length === 0) return { avgRating: 0, totalReviews: 0, avgPrice: 0, bestSellers: 0 };
    
    const avgRating = (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1);
    const totalReviews = products.reduce((sum, p) => sum + (p.reviews || 0), 0);
    const avgPrice = products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length;
    const bestSellers = products.filter(p => p.isBestSeller).length;
    
    return { avgRating, totalReviews, avgPrice: Math.round(avgPrice), bestSellers };
  };

  const stats = calculateStats();

  return (
    <>
      <section className="pt-20 min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                FITLYF <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary  text-white">STORE</span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Premium fitness equipment and supplements for your transformative journey
              </p>
            </div>

            {error && (
              <div className="max-w-3xl mx-auto mb-8">
                <div className="relative bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 backdrop-blur-sm border border-yellow-800/50 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-3xl"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Demo Mode Active</h3>
                      <p className="text-yellow-300 text-sm">{error}</p>
                    </div>
                    <button
                      onClick={fetchProducts}
                      className="ml-auto bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {[
                { label: 'Average Rating', value: stats.avgRating, icon: '⭐', color: 'from-yellow-500 to-yellow-600' },
                { label: 'Total Reviews', value: `${stats.totalReviews}+`, icon: '💬', color: 'from-blue-500 to-blue-600' },
                { label: 'Average Price', value: `₹${stats.avgPrice}`, icon: '💰', color: 'from-green-500 to-green-600' },
                { label: 'Best Sellers', value: stats.bestSellers, icon: '🏆', color: 'from-purple-500 to-purple-600' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl transform group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div> */}

            {/* Search and Filters */}
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products by name, category, or brand..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-4 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Results Count and Sort */}
                <div className="flex items-center gap-6">
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-4">
                    <div className="text-white text-2xl font-bold">{sortedProducts.length}</div>
                    <div className="text-gray-400 text-sm">Products Found</div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 hidden md:block">Sort by:</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-center">
                  Browse by <span className="text-brand-primary">Category</span>
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`group relative px-4 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                          : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeCategory === category.id 
                          ? 'bg-white/20' 
                          : 'bg-gray-800'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-brand-primary rounded-full animate-spin"></div>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Loading Products</h3>
                <p className="text-gray-400">Fetching premium fitness products...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
                {currentProducts.map((product) => {
                  const isInCart = cart.find(item => item._id === product._id);
                  
                  return (
                    <div 
                      key={product._id} 
                      className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                    >
                      {/* Product Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden" onClick={() => showQuickView(product)}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                        
                        {/* Badges */}
                        {product.isBestSeller && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                              BEST SELLER
                            </span>
                          </div>
                        )}
                        
                        {product.isNew && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-green-600 to-green-800 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
                              NEW
                            </span>
                          </div>
                        )}
                        
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <span className="text-white font-bold text-lg backdrop-blur-sm px-4 py-2 rounded-xl">OUT OF STOCK</span>
                          </div>
                        )}
                        
                        {/* Quick View Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showQuickView(product);
                          }}
                          className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-110"
                          title="Quick View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {/* Category Badge */}
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-gray-900/80 backdrop-blur-sm text-gray-300 px-3 py-1.5 rounded-full text-xs font-bold">
                            {product.category.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        {/* Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-700'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-white text-sm font-medium">{product.rating || 'N/A'}</span>
                          </div>
                          {product.brand && (
                            <span className="text-gray-400 text-xs font-medium">{product.brand}</span>
                          )}
                        </div>

                        {/* Name and Description */}
                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                        {/* Features */}
                        <div className="mb-4">
                          {product.features?.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center text-gray-400 text-sm mb-2">
                              <div className="w-5 h-5 bg-brand-primary/20 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                <svg className="w-3 h-3 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="truncate">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                          <div>
                            <p className="text-2xl font-bold text-white">{formatCurrency(product.price)}</p>
                            {product.originalPrice && (
                              <p className="text-gray-500 line-through text-sm">{formatCurrency(product.originalPrice)}</p>
                            )}
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`relative overflow-hidden px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                              isInCart
                                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                                : product.inStock
                                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {isInCart ? (
                              <>
                                <span className="mr-2">✓</span> Added
                              </>
                            ) : product.inStock ? (
                              'Add to Cart'
                            ) : (
                              'Out of Stock'
                            )}
                          </button>
                        </div>

                        {/* Stock Indicator */}
                        {product.stock && product.stock < 10 && product.inStock && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-yellow-400">Only {product.stock} left!</span>
                              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                                  style={{ width: `${(product.stock / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-800/50 text-gray-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800/50 transition-all duration-300"
                  >
                    ← Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                              : 'bg-gray-900/50 border border-gray-800/50 text-gray-400 hover:bg-gray-800/50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-gray-600">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-900/50 border border-gray-800/50 text-gray-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Next →
                  </button>
                </div>
              )}

              {sortedProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-12 overflow-hidden">
                      <div className="relative text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl">🔍</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No Products Found</h3>
                        <p className="text-gray-400 text-sm mb-8">
                          {searchQuery 
                            ? `No products match your search for "${searchQuery}"`
                            : `No products available in ${categories.find(c => c.id === activeCategory)?.name || 'this category'}`
                          }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setActiveCategory('all');
                            }}
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-8 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            View All Products
                          </button>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white py-3 px-8 rounded-xl text-sm font-bold hover:bg-gray-700/50 transition-all duration-300"
                          >
                            Clear Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Featured Categories */}
          {/* <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Category</span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Explore our curated collections of premium fitness products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {categories.slice(1, 4).map((category) => (
                <div
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${category.id === 'supplements' ? '1593095948071-474c5cc2989d' : category.id === 'equipment' ? '1536922246289-88c42f957773' : '1599901860904-17e6ed7083a0'}?w=800&q=80`}
                    alt={category.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6 sm:p-8">
                    <div>
                      <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-300 text-sm">{category.count} premium products</p>
                      <button className="mt-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4">
                        Shop Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Why Shop With Us */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Why Shop at <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary text-white">FITLYF Store</span>
              </h2>
              <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
                Experience the difference with our premium fitness shopping experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: '⭐',
                  title: 'Premium Quality',
                  description: 'Curated selection of certified fitness brands and products',
                  color: 'from-yellow-500/20 to-yellow-600/20',
                  border: 'border-yellow-500/30'
                },
                {
                  icon: '✓',
                  title: 'Authentic Products',
                  description: '100% genuine products with manufacturer warranty',
                  color: 'from-green-500/20 to-green-600/20',
                  border: 'border-green-500/30'
                },
                {
                  icon: '🚚',
                  title: 'Free Delivery',
                  description: 'Free shipping on orders above ₹1999 across India',
                  color: 'from-blue-500/20 to-blue-600/20',
                  border: 'border-blue-500/30'
                },
                {
                  icon: '↩️',
                  title: 'Easy Returns',
                  description: '30-day hassle-free return policy on all products',
                  color: 'from-purple-500/20 to-purple-600/20',
                  border: 'border-purple-500/30'
                }
              ].map((feature, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02]">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} ${feature.border} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3">{feature.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          {/* <div className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 sm:p-10 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-brand-secondary/10"></div>
            <div className="relative text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Updated</span>
              </h3>
              <p className="text-gray-300 text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto">
                Subscribe to get exclusive deals, new arrivals, and expert fitness tips delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="flex-grow bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent placeholder-gray-500"
                />
                <button className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-8 rounded-2xl text-base transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02] whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-sm sm:text-base mt-6 sm:mt-8">
                No spam ever. Unsubscribe anytime.
              </p>
            </div>
          </div> */}
        </div>

        {/* Cart Sidebar */}
        {showCartSidebar && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 w-full md:w-1/3 h-full overflow-y-auto border-l border-gray-800/50">
              <div className="p-6">
                {/* Cart Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12  bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                      <span className="text-2xl mt-6">🛒</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Shopping Cart</h2>
                      <p className="text-gray-400 text-sm">{cartCount} items</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCartSidebar(false)}
                    className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800/50 rounded-xl transition-all duration-300"
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="max-w-sm mx-auto">
                      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-12 overflow-hidden">
                        <div className="relative text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🛒</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h3>
                          <p className="text-gray-400 text-sm mb-8">
                            Add some amazing fitness products to get started on your journey
                          </p>
                          <button
                            onClick={() => setShowCartSidebar(false)}
                            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-8 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-4 mb-8">
                      {cart.map((item) => (
                        <div key={item._id} className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-4 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">{item.name}</h4>
                              <p className="text-brand-primary font-bold text-lg">{formatCurrency(item.price)}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300"
                                >
                                  -
                                </button>
                                <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="ml-auto text-red-400 hover:text-red-300 text-sm transition-all duration-300"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="border-t border-gray-800/50 pt-8">
                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Delivery</span>
                          <span className={deliveryCharge === 0 ? 'text-green-400' : 'text-white'}>
                            {deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax (18% GST)</span>
                          <span className="text-white font-medium">{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-700">
                          <span className="text-white">Total</span>
                          <span className="text-brand-primary">{formatCurrency(grandTotal)}</span>
                        </div>
                        
                        {deliveryCharge > 0 && cartTotal < 1999 && (
                          <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-950/20 border border-yellow-800/50 rounded-xl p-3">
                            <p className="text-yellow-300 text-sm text-center">
                              🎉 Add {formatCurrency(1999 - cartTotal)} more for FREE delivery!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Cart Actions */}
                      <div className="space-y-3">
                        <button
                          onClick={proceedToCheckout}
                          className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-4 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]"
                        >
                          Proceed to Checkout
                        </button>
                        <button
                          onClick={clearCart}
                          className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white py-4 px-4 rounded-2xl transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600"
                        >
                          Clear Cart
                        </button>
                        <button
                          onClick={() => setShowCartSidebar(false)}
                          className="w-full bg-transparent border border-gray-600 text-gray-300 hover:text-white py-4 px-4 rounded-2xl transition-all duration-300 hover:border-gray-500"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cart Button */}
        <div className="fixed top-20 right-4 z-40">
          <div className="relative">
            <button
              onClick={() => setShowCartSidebar(true)}
              className="group relative bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-4 rounded-2xl shadow-2xl shadow-brand-primary/30 transition-all duration-500 hover:scale-110 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-gray-950">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 hover:bg-gray-800 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Product Header */}
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {selectedProduct.isBestSeller && (
                        <span className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                          BEST SELLER
                        </span>
                      )}
                      {selectedProduct.isNew && (
                        <span className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                          NEW ARRIVAL
                        </span>
                      )}
                      {!selectedProduct.inStock && (
                        <span className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  {/* Category and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-500' : 'text-gray-700'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-white font-medium">{selectedProduct.rating || 'N/A'}</span>
                      <span className="text-gray-500 text-sm">({selectedProduct.reviews || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Name and Brand */}
                  <h2 className="text-3xl font-bold text-white mb-3">{selectedProduct.name}</h2>
                  {selectedProduct.brand && (
                    <p className="text-gray-400 mb-6">By {selectedProduct.brand}</p>
                  )}

                  {/* Description */}
                  <p className="text-gray-300 text-base leading-relaxed mb-8">{selectedProduct.description}</p>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-white font-bold text-lg mb-4">Key Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProduct.features?.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 14.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm flex-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="mb-8">
                    <h4 className="text-white font-bold text-lg mb-4">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProduct.weight && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Weight</p>
                          <p className="text-white font-medium">{selectedProduct.weight}</p>
                        </div>
                      )}
                      {selectedProduct.flavors && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Flavors</p>
                          <p className="text-white font-medium">{selectedProduct.flavors.join(', ')}</p>
                        </div>
                      )}
                      {selectedProduct.servings && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Servings</p>
                          <p className="text-white font-medium">{selectedProduct.servings}</p>
                        </div>
                      )}
                      {selectedProduct.stock !== undefined && (
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Stock</p>
                          <p className={`font-medium ${selectedProduct.stock > 10 ? 'text-green-400' : selectedProduct.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} units` : 'Out of Stock'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="border-t border-gray-800/50 pt-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-4xl font-bold text-white">{formatCurrency(selectedProduct.price)}</p>
                        {selectedProduct.originalPrice && (
                          <p className="text-gray-500 line-through text-lg">{formatCurrency(selectedProduct.originalPrice)}</p>
                        )}
                        {selectedProduct.originalPrice && (
                          <p className="text-green-400 text-sm">
                            Save {formatCurrency(selectedProduct.originalPrice - selectedProduct.price)} ({Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        disabled={!selectedProduct.inStock}
                        className={`flex-1 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 text-base ${
                          selectedProduct.inStock
                            ? 'bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-2xl hover:shadow-brand-primary/40 transform hover:scale-[1.02]'
                            : 'bg-gray-700 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {selectedProduct.inStock 
                          ? `Add to Cart - ${formatCurrency(selectedProduct.price)}`
                          : 'Out of Stock'
                        }
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white font-bold py-4 px-6 rounded-2xl text-base hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingPage;