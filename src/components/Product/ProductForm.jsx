import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ productToEdit, onSave, onCancel }) => {
  // Set axios baseURL
  axios.defaults.baseURL = 'https://fitlyfy.onrender.com';
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'supplements',
    price: '',
    originalPrice: '',
    image: '',
    rating: '',
    reviews: '',
    description: '',
    features: [''],
    inStock: true,
    isBestSeller: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionTested, setConnectionTested] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category: productToEdit.category || 'supplements',
        price: productToEdit.price?.toString() || '',
        originalPrice: productToEdit.originalPrice?.toString() || '',
        image: productToEdit.image || '',
        rating: productToEdit.rating?.toString() || '',
        reviews: productToEdit.reviews?.toString() || '',
        description: productToEdit.description || '',
        features: productToEdit.features?.length > 0 ? [...productToEdit.features, ''] : [''],
        inStock: productToEdit.inStock !== undefined ? productToEdit.inStock : true,
        isBestSeller: productToEdit.isBestSeller || false
      });
    }
    
    // Test connection on component mount
    testConnection();
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      // console.log('🔌 Testing backend connection...');
      
      const response = await axios.get('/api/health');
      
      setSuccess(`✅ Backend connected! MongoDB: ${response.data.mongodb}`);
      setConnectionTested(true);
      console.log('✅ Connection test successful:', response.data);
      
    } catch (err) {
      console.error('❌ Connection test failed:', err);
      setError(`⚠️ Cannot connect to backend. Make sure the server is running on https://fitlyfy.onrender.com:5000`);
      setConnectionTested(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: formData.price,
        image: formData.image.trim(),
        description: formData.description.trim(),
        inStock: formData.inStock,
        isBestSeller: formData.isBestSeller
      };

      // Add optional fields
      if (formData.originalPrice.trim() !== '') {
        productData.originalPrice = formData.originalPrice;
      }
      if (formData.rating.trim() !== '') {
        productData.rating = formData.rating;
      }
      if (formData.reviews.trim() !== '') {
        productData.reviews = formData.reviews;
      }

      // Filter out empty features
      const filteredFeatures = formData.features.filter(f => f.trim() !== '');
      if (filteredFeatures.length > 0) {
        productData.features = filteredFeatures;
      }

      console.log('📤 Submitting product data:', productData);

      let response;
      if (productToEdit?._id) {
        // Update
        response = await axios.put(`/api/products/${productToEdit._id}`, productData);
        setSuccess('✅ Product updated successfully! Refreshing list...');
      } else {
        // Create
        response = await axios.post('/api/products', productData);
        setSuccess('✅ Product added successfully! Adding another...');
        
        // Reset form
        setFormData({
          name: '',
          category: 'supplements',
          price: '',
          originalPrice: '',
          image: '',
          rating: '',
          reviews: '',
          description: '',
          features: [''],
          inStock: true,
          isBestSeller: false
        });
      }

      console.log('📥 Server response:', response.data);

      // Call onSave after delay
      setTimeout(() => {
        onSave();
      }, 1500);

    } catch (err) {
      console.error('❌ Submission error:', err);
      
      let errorMsg = 'Something went wrong!';
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        errorMsg = err.response.data.message || 
                   err.response.data.error || 
                   `Server error (${err.response.status})`;
        
        if (err.response.data.errors) {
          errorMsg += ': ' + err.response.data.errors.join(', ');
        }
      } else if (err.request) {
        errorMsg = 'No response from server. Check if backend is running.';
      } else {
        errorMsg = err.message;
      }
      
      setError(`❌ ${errorMsg}`);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 mb-6 border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {productToEdit ? '✏️ Edit Product' : '➕ Add New Product'}
        </h2>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm ${connectionTested ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
            {connectionTested ? '✅ Connected' : '⚠️ Not Connected'}
          </span>
          <button
            type="button"
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition duration-300"
            disabled={loading}
          >
            🔌 Test Connection
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
          <div className="flex items-center">
            <span className="text-xl mr-2">❌</span>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs mt-2 text-red-400">
                💡 Make sure: Backend server is running on https://fitlyfy.onrender.com:5000
              </p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg">
          <div className="flex items-center">
            <span className="text-xl mr-2">✅</span>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-300 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="e.g., Whey Protein Powder"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            >
              <option value="supplements">Supplements</option>
              <option value="equipment">Equipment</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-300 mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="2499.00"
            />
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-gray-300 mb-2">Original Price (₹)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="2999.00 (optional)"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="https://images.unsplash.com/photo-..."
            />
            {formData.image && (
              <div className="mt-2">
                <p className="text-gray-400 text-sm mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-300 mb-2">Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="4.5"
            />
          </div>

          {/* Reviews */}
          <div>
            <label className="block text-gray-300 mb-2">Number of Reviews</label>
            <input
              type="number"
              name="reviews"
              value={formData.reviews}
              onChange={handleChange}
              min="0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="156"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              placeholder="Describe your product..."
            />
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-300">Features</label>
              <button
                type="button"
                onClick={addFeatureField}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm"
              >
                + Add Feature
              </button>
            </div>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="ml-2 px-3 py-3 bg-red-900/30 hover:bg-red-800/40 text-red-400 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2 flex flex-wrap gap-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-5 h-5 text-brand-primary bg-gray-700 rounded focus:ring-2 focus:ring-brand-primary"
              />
              <span className="text-gray-300">In Stock</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-5 h-5 text-brand-primary bg-gray-700 rounded focus:ring-2 focus:ring-brand-primary"
              />
              <span className="text-gray-300">Best Seller</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !connectionTested}
            className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {productToEdit ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              productToEdit ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </form>

      {/* Debug Info */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>🔗 Backend URL: https://fitlyfy.onrender.com</p>
          <p>📊 MongoDB: {connectionTested ? 'Connected' : 'Not connected'}</p>
          <p>📁 API Endpoint: /api/products</p>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;