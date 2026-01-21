import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'https://fitlyfy.onrender.com:5000';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Shipping, 3: Payment, 4: Confirmation
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India'
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fitlyf_cart');
    if (!savedCart || JSON.parse(savedCart).length === 0) {
      navigate('/store');
      return;
    }
    setCart(JSON.parse(savedCart));
  }, [navigate]);

  // Calculate totals
  const cartTotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const deliveryCharge = cartTotal > 1999 ? 0 : 99;
  const shippingCharges = {
    standard: cartTotal > 1999 ? 0 : 99,
    express: 199,
    overnight: 399
  };
  const tax = cartTotal * 0.18;
  const grandTotal = cartTotal + shippingCharges[shippingMethod] + tax + (giftWrap ? 49 : 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const requiredFields = ['firstName', 'email', 'phone', 'address', 'city', 'pinCode'];
    const missingFields = requiredFields.filter(field => !customerDetails[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    // Phone validation (Indian)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerDetails.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid Indian phone number (10 digits starting with 6-9)');
      return false;
    }
    
    // Pin code validation
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(customerDetails.pinCode)) {
      alert('Please enter a valid 6-digit PIN code');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3 && !termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const placeOrder = async () => {
  try {
    setLoading(true);
    
    // Calculate totals
    const shippingChargesMap = {
      standard: cartTotal > 1999 ? 0 : 99,
      express: 199,
      overnight: 399
    };
    const tax = cartTotal * 0.18;
    const giftWrapCharge = giftWrap ? 49 : 0;
    const grandTotal = cartTotal + shippingChargesMap[shippingMethod] + tax + giftWrapCharge;
    
    const orderData = {
      customer: {
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pinCode: customerDetails.pinCode,
        country: customerDetails.country
      },
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shipping: {
        method: shippingMethod,
        address: customerDetails.address,
        city: customerDetails.city,
        state: customerDetails.state,
        pinCode: customerDetails.pinCode,
        country: customerDetails.country
      },
      payment: {
        method: paymentMethod,
        amount: grandTotal,
        status: paymentMethod === 'cod' ? 'pending' : 'pending'
      },
      orderTotal: {
        subtotal: cartTotal,
        shipping: shippingChargesMap[shippingMethod],
        tax: tax,
        giftWrap: giftWrapCharge,
        total: grandTotal
      },
      notes: orderNotes,
      giftWrap: giftWrap,
      termsAccepted: termsAccepted
    };

    // console.log('Placing order:', orderData);

    // Save order to backend
    const response = await axios.post('/api/orders', orderData);
    
    if (response.data.success) {
      // console.log('✅ Order placed successfully:', response.data.orderId);
      
      // Save order to localStorage for confirmation page
      localStorage.setItem('fitlyf_last_order', JSON.stringify({
        ...orderData,
        orderId: response.data.orderId,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + (shippingMethod === 'standard' ? 7 : shippingMethod === 'express' ? 3 : 1) * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      // Clear cart
      localStorage.removeItem('fitlyf_cart');
      setCart([]);
      
      // Redirect to success page
      navigate(`/order-confirmation/${response.data.orderId}`);
      
    } else {
      throw new Error(response.data.message || 'Failed to place order');
    }
    
  } catch (error) {
    // console.error('❌ Order placement error:', error);
    // console.error('Error details:', error.response?.data);
    
    let errorMessage = 'Failed to place order';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      errorMessage = error.response.data.errors.join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(`Error: ${errorMessage}`);
    
  } finally {
    setLoading(false);
  }
};

  const proceedToPayment = () => {
    if (paymentMethod === 'razorpay') {
      // Initialize Razorpay payment (implement this based on previous Razorpay integration)
      // console.log('Initializing Razorpay payment...');
      // TODO: Add Razorpay payment initialization
    } else if (paymentMethod === 'cod') {
      placeOrder();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">Add some products to proceed to checkout</p>
          <button
            onClick={() => navigate('/store')}
            className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {['Your Details', 'Shipping', 'Payment', 'Confirmation'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step > index + 1 ? 'bg-green-600' :
                  step === index + 1 ? 'bg-brand-primary' :
                  'bg-gray-700'
                }`}>
                  <span className="text-white font-bold">
                    {step > index + 1 ? '✓' : index + 1}
                  </span>
                </div>
                <span className={`text-sm ${
                  step >= index + 1 ? 'text-white' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-800 mt-5 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Details */}
            {step === 1 && (
              <div className="bg-dark-card rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerDetails.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerDetails.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                      maxLength="10"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={customerDetails.pinCode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      required
                      maxLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Country</label>
                    <select
                      name="country"
                      value={customerDetails.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-dark-card rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Shipping Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: cartTotal > 1999 ? 'FREE' : '₹99', desc: 'Free delivery on orders above ₹1999' },
                    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: '₹199', desc: 'Priority handling and faster shipping' },
                    { id: 'overnight', name: 'Overnight Delivery', time: 'Next business day', price: '₹399', desc: 'Get your order by tomorrow' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition duration-300 ${
                        shippingMethod === method.id
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="w-5 h-5 text-brand-primary"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{method.name}</h4>
                            <p className="text-gray-400 text-sm">{method.desc}</p>
                            <p className="text-gray-500 text-sm mt-1">⏱️ {method.time}</p>
                          </div>
                        </div>
                        <span className={`text-lg font-bold ${
                          method.price === 'FREE' ? 'text-green-400' : 'text-white'
                        }`}>
                          {method.price}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Additional Options */}
                <div className="mt-8 space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="w-5 h-5 text-brand-primary"
                    />
                    <span className="text-gray-300">
                      Add gift wrapping (+₹49)
                    </span>
                  </label>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Order Notes (Optional)</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows="3"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                      placeholder="Special instructions for delivery, gift message, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-dark-card rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive your order' },
                    { id: 'razorpay', name: 'Credit/Debit Card & UPI', icon: '💳', desc: 'Secure payment via Razorpay' },
                    { id: 'wallet', name: 'Wallet', icon: '👛', desc: 'Pay using your e-wallet' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition duration-300 ${
                        paymentMethod === method.id
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 text-brand-primary"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold">{method.name}</h4>
                          <p className="text-gray-400 text-sm">{method.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Terms and Conditions */}
                <div className="mt-8">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-brand-primary"
                      required
                    />
                    <span className="text-gray-300 text-sm">
                      I agree to the Terms & Conditions and Privacy Policy. I understand that my personal data will be processed in accordance with the Privacy Policy.
                      <span className="text-red-500"> *</span>
                    </span>
                  </label>
                  
                  <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">🔒 Secure Checkout</h4>
                    <p className="text-gray-400 text-sm">
                      Your payment information is encrypted and secure. We never store your credit card details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Order Review */}
            {step === 4 && (
              <div className="bg-dark-card rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Order Review</h2>
                
                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center justify-between py-3 border-b border-gray-800">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Shipping Address</h3>
                    <div className="bg-gray-800/30 p-4 rounded-lg">
                      <p className="text-white">{customerDetails.firstName} {customerDetails.lastName}</p>
                      <p className="text-gray-300">{customerDetails.address}</p>
                      <p className="text-gray-300">{customerDetails.city}, {customerDetails.state} - {customerDetails.pinCode}</p>
                      <p className="text-gray-300">{customerDetails.country}</p>
                      <p className="text-gray-300">📧 {customerDetails.email}</p>
                      <p className="text-gray-300">📱 {customerDetails.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Shipping & Payment</h3>
                    <div className="bg-gray-800/30 p-4 rounded-lg">
                      <p className="text-white">Shipping: {shippingMethod === 'standard' ? 'Standard' : shippingMethod === 'express' ? 'Express' : 'Overnight'}</p>
                      <p className="text-gray-300">Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'razorpay' ? 'Card/UPI' : 'Wallet'}</p>
                      <p className="text-gray-300">Gift Wrap: {giftWrap ? 'Yes (+₹49)' : 'No'}</p>
                      {orderNotes && (
                        <div className="mt-2">
                          <p className="text-white text-sm">Order Notes:</p>
                          <p className="text-gray-300 text-sm">{orderNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Confirmation */}
                <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <div>
                      <h4 className="text-white font-semibold">Ready to complete your order!</h4>
                      <p className="text-gray-300 text-sm">Review your order details above. Click "Place Order" to confirm.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-300"
                >
                  ← Previous
                </button>
              ) : (
                <button
                  onClick={() => navigate('/store')}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-300"
                >
                  ← Back to Store
                </button>
              )}
              
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-semibold transition duration-300"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={proceedToPayment}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="mb-6 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center mb-4 pb-4 border-b border-gray-800 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        <p className="text-white font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shippingCharges[shippingMethod] === 0 ? 'text-green-400' : 'text-white'}>
                    {shippingCharges[shippingMethod] === 0 ? 'FREE' : `₹${shippingCharges[shippingMethod]}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gift Wrap</span>
                  <span className="text-white">{giftWrap ? '₹49' : '₹0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-brand-primary">₹{grandTotal.toFixed(2)}</span>
                  </div>
                  {shippingCharges[shippingMethod] === 0 && cartTotal < 1999 && (
                    <p className="text-green-400 text-sm mt-2">
                      🎉 You saved ₹99 on shipping!
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">📦 Delivery Estimate</h4>
                <p className="text-gray-300 text-sm">
                  {shippingMethod === 'standard' ? '5-7 business days' :
                   shippingMethod === 'express' ? '2-3 business days' :
                   'Next business day'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Delivery to: {customerDetails.city || 'Your city'}
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center space-x-2">
                <span className="text-green-400">🔒</span>
                <span className="text-gray-400 text-sm">Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;