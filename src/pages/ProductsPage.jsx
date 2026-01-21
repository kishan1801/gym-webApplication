import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProductForm from '../components/Product/ProductForm';

// Set axios baseURL
axios.defaults.baseURL = 'https://fitlyfy.onrender.com';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState({});

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access product management, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchProducts();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // console.log('🔄 Fetching products from API...');
      
      const response = await axios.get('/api/products');
      
      // console.log(`✅ Found ${response.data.count || response.data.length} products`);
      
      setProducts(response.data.data || response.data);
      
    } catch (error) {
      // console.error('❌ Error fetching products:', error);
      setError(`Failed to load products. Make sure backend is running on http://localhost:5000`);
      
      // Show dummy data for development
      setProducts([]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsDeleting(prev => ({ ...prev, [productId]: true }));
        await axios.delete(`/api/products/${productId}`);
        fetchProducts(); // Refresh the list
      } catch (error) {
        // console.error('Error deleting product:', error);
        alert('Failed to delete product');
      } finally {
        setIsDeleting(prev => ({ ...prev, [productId]: false }));
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Refresh the list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // If user is not admin, show unauthorized message
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900/30 rounded-full mb-4">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              title="Back to Admin"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-gray-400">Manage your store products</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                  Backend: http://localhost:5000
                </span>
                <button
                  onClick={logout}
                  className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded hover:bg-red-800/50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Add New Product
          </button>
        </div>

        {/* Connection Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center h-10 w-10 bg-red-900/50 rounded-full">
                  <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-300">Connection Error</h3>
                <div className="mt-1 text-red-200">
                  <p>{error}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">💡 Make sure:</span>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Backend server is running (npm start in backend folder)</li>
                      <li>MongoDB is installed and running</li>
                      <li>Server URL is http://localhost:5000</li>
                    </ul>
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={fetchProducts}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Form (when adding/editing) */}
        {showForm && (
          <div className="mb-8">
            <ProductForm
              productToEdit={editingProduct}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900/30 rounded-xl mr-4">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-900/30 rounded-xl mr-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">In Stock</p>
                <p className="text-2xl font-bold text-white">
                  {products.filter(p => p.inStock).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-red-900/30 rounded-xl mr-4">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Best Sellers</p>
                <p className="text-2xl font-bold text-white">
                  {products.filter(p => p.isBestSeller).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Products List</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button
                  onClick={fetchProducts}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                {!showForm && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center"
                  >
                    <span className="mr-2">+</span> Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {loading && products.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400 mb-6">Add your first product to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                + Add First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Product</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Stock</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                            }}
                          />
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm line-clamp-1">
                              {product.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm capitalize border border-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-white font-bold">₹{product.price?.toLocaleString()}</p>
                        {product.originalPrice && (
                          <p className="text-gray-400 text-sm line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50' 
                            : 'bg-red-900/30 text-red-400 border border-red-700/50'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {product.isBestSeller && (
                          <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-xs font-medium border border-red-700/50">
                            Best Seller
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-gray-700 hover:bg-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleViewDetails(product._id)}
                            className="p-2 bg-gray-700 hover:bg-emerald-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting[product._id]}
                            className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {isDeleting[product._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            ) : (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-900/30 rounded-lg mr-3">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">💡 Quick Tips</h3>
          </div>
          <ul className="text-gray-400 text-sm space-y-2 ml-10">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Make sure MongoDB is running before starting the backend</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Test the connection before adding products</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use high-quality image URLs from Unsplash or similar sites</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>All fields with * are required</span>
            </li>
          </ul>
        </div> */}

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>User ID: {currentUser?._id}</p>
          <p>Total Products: {products.length}</p>
          <p>Backend URL: {axios.defaults.baseURL}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ProductsPage;