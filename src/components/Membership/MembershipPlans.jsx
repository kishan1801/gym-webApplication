import React, { useState, useEffect } from 'react';
import API from '../../api';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const MembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [upiId, setUpiId] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMembershipPlans();
    loadRazorpayScript();
    
    // Try to get saved user details from localStorage
    const savedUser = localStorage.getItem('paymentUser');
    if (savedUser) {
      try {
        setUserDetails(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
  }, []);

  const fetchMembershipPlans = async () => {
    try {
      setLoading(true);
      const response = await API.get('/memberships?active=true');
      console.log('📥 Membership plans API response:', response.data);
      
      if (response.data.success) {
        const transformedPlans = response.data.memberships.map((membership, index) => ({
          _id: membership._id,
          name: membership.name,
          price: membership.price,
          duration: `${membership.duration} ${membership.durationType}`,
          durationValue: membership.duration,
          durationType: membership.durationType,
          features: membership.features || [],
          description: membership.description,
          gymAccess: membership.gymAccess,
          poolAccess: membership.poolAccess,
          spaAccess: membership.spaAccess,
          maxClassesPerWeek: membership.maxClassesPerWeek,
          personalTrainingSessions: membership.personalTrainingSessions,
          isActive: membership.isActive,
          category: membership.category || 'general',
          popular: membership.isPopular || index === 1,
          recommended: membership.isRecommended || index === 0
        }));
        
        setPlans(transformedPlans);
      }
    } catch (err) {
      console.error('Error fetching membership plans:', err);
      setError('Failed to load membership plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get user details via modal
  const getUserDetails = () => {
    return new Promise((resolve) => {
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div class="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 overflow-hidden">
            <!-- Animated background elements -->
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-secondary/10 rounded-full blur-3xl"></div>
            
            <div class="relative text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl mb-4 shadow-xl">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Welcome to FITLYF!</h3>
              <p class="text-gray-400 text-sm">Please provide your details to proceed</p>
            </div>
            
            <div class="relative space-y-4">
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Full Name *</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="customerName"
                    class="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                    value="${userDetails.name}"
                    required
                  >
                  <div class="absolute right-3 top-3">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
                <div class="relative">
                  <input 
                    type="email" 
                    id="customerEmail"
                    class="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    value="${userDetails.email}"
                    required
                  >
                  <div class="absolute right-3 top-3">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-gray-300 text-sm font-medium mb-2">Phone Number *</label>
                <div class="relative">
                  <input 
                    type="tel" 
                    id="customerPhone"
                    class="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-300"
                    placeholder="Enter your phone number"
                    value="${userDetails.phone}"
                    required
                  >
                  <div class="absolute right-3 top-3">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="relative flex flex-col sm:flex-row gap-3 mt-8">
              <button 
                id="cancelBtn"
                class="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button 
                id="submitBtn"
                class="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transform hover:scale-[1.02] transition-all duration-300"
              >
                Continue to Payment
                <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modalContainer);
      
      // Add event listeners
      const cancelBtn = document.getElementById('cancelBtn');
      const submitBtn = document.getElementById('submitBtn');
      const nameInput = document.getElementById('customerName');
      const emailInput = document.getElementById('customerEmail');
      const phoneInput = document.getElementById('customerPhone');
      
      const closeModal = () => {
        document.body.removeChild(modalContainer);
      };
      
      cancelBtn.onclick = () => {
        closeModal();
        resolve(null);
      };
      
      submitBtn.onclick = () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        // Basic validation
        if (!name || !email || !phone) {
          alert('Please fill in all required fields.');
          return;
        }
        
        if (!isValidEmail(email)) {
          alert('Please enter a valid email address.');
          return;
        }
        
        if (!isValidPhone(phone)) {
          alert('Please enter a valid 10-digit phone number.');
          return;
        }
        
        const userData = { name, email, phone };
        
        // Update local state
        setUserDetails(userData);
        
        closeModal();
        resolve(userData);
      };
      
      // Allow closing with Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          resolve(null);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
    });
  };

  // Show payment method selection modal
  const showPaymentMethodModal = (userData, plan) => {
    return new Promise((resolve) => {
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div class="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 overflow-hidden">
            <!-- Animated background elements -->
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
            
            <div class="relative text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-4 shadow-xl">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Select Payment Method</h3>
              <p class="text-gray-400 text-sm">How would you like to pay for your membership?</p>
            </div>
            
            <div class="relative space-y-4 mb-6">
              <!-- Card Payment -->
              <div class="group payment-method-option bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-900/10 transition-all duration-300"
                   onclick="document.getElementById('method_card').checked = true; document.getElementById('upiInput').style.display = 'none';">
                <div class="flex items-center">
                  <div class="relative mr-4">
                    <input type="radio" id="method_card" name="paymentMethod" value="card" class="sr-only" checked>
                    <div class="w-6 h-6 border-2 border-gray-600 rounded-full group-hover:border-blue-500 transition-colors duration-300">
                      <div class="w-3 h-3 bg-blue-500 rounded-full m-0.5 transform scale-0 group-[:has(input:checked)]:scale-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-900/50 transition-colors duration-300">
                      <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <label for="method_card" class="text-white font-medium text-base cursor-pointer">Credit/Debit Card</label>
                      <p class="text-gray-400 text-sm">Pay using Visa, Mastercard, RuPay, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- UPI Payment -->
              <div class="group payment-method-option bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-green-500/50 hover:bg-green-900/10 transition-all duration-300"
                   onclick="document.getElementById('method_upi').checked = true; document.getElementById('upiInput').style.display = 'block';">
                <div class="flex items-center">
                  <div class="relative mr-4">
                    <input type="radio" id="method_upi" name="paymentMethod" value="upi" class="sr-only">
                    <div class="w-6 h-6 border-2 border-gray-600 rounded-full group-hover:border-green-500 transition-colors duration-300">
                      <div class="w-3 h-3 bg-green-500 rounded-full m-0.5 transform scale-0 group-[:has(input:checked)]:scale-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-900/50 transition-colors duration-300">
                      <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <label for="method_upi" class="text-white font-medium text-base cursor-pointer">UPI Payment</label>
                      <p class="text-gray-400 text-sm">Google Pay, PhonePe, Paytm, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- UPI ID Input (hidden by default) -->
              <div id="upiInput" class="mt-4 hidden animate-slideDown">
                <label class="block text-gray-300 text-sm font-medium mb-2">Enter UPI ID</label>
                <div class="relative">
                  <input 
                    type="text" 
                    id="upiIdInput"
                    class="w-full bg-gray-900/50 backdrop-blur-sm border border-green-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="username@okicici"
                    value="${upiId}"
                  >
                  <div class="absolute right-3 top-3">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500 text-xs mt-2">Examples: username@okicici, username@ybl, username@axl</p>
              </div>
            </div>
            
            <div class="relative flex flex-col sm:flex-row gap-3">
              <button 
                id="cancelPaymentBtn"
                class="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Back
              </button>
              <button 
                id="proceedPaymentBtn"
                class="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transform hover:scale-[1.02] transition-all duration-300"
              >
                Pay ₹${formatPrice(plan.price)}
                <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modalContainer);
      
      // Add event listeners
      const cancelBtn = document.getElementById('cancelPaymentBtn');
      const proceedBtn = document.getElementById('proceedPaymentBtn');
      const methodCard = document.getElementById('method_card');
      const methodUpi = document.getElementById('method_upi');
      const upiIdInput = document.getElementById('upiIdInput');
      const upiInputDiv = document.getElementById('upiInput');
      
      const closeModal = () => {
        document.body.removeChild(modalContainer);
      };
      
      // Radio button event listeners
      const handleRadioChange = () => {
        if (methodCard.checked) {
          upiInputDiv.classList.remove('hidden');
          upiInputDiv.classList.add('hidden');
        } else {
          upiInputDiv.classList.remove('hidden');
          upiInputDiv.classList.add('animate-slideDown');
        }
      };
      
      methodCard?.addEventListener('change', handleRadioChange);
      methodUpi?.addEventListener('change', handleRadioChange);
      
      cancelBtn.onclick = () => {
        closeModal();
        resolve(null);
      };
      
      proceedBtn.onclick = () => {
        const selectedMethod = methodCard.checked ? 'card' : 'upi';
        let upiIdValue = '';
        
        if (selectedMethod === 'upi') {
          upiIdValue = upiIdInput?.value.trim() || '';
          if (!isValidUpiId(upiIdValue)) {
            alert('Please enter a valid UPI ID (e.g., username@okicici)');
            return;
          }
        }
        
        closeModal();
        resolve({
          method: selectedMethod,
          upiId: upiIdValue
        });
      };
    });
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async (plan, userData, paymentMethod) => {
    try {
      setProcessing(true);
      setSelectedPlan(plan);

      // First, create an order on your backend
      const orderResponse = await API.post('/payment/create-order', {
        planId: plan._id,
        customerDetails: userData,
        paymentMethod: paymentMethod.method
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      // Razorpay options configuration
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'FITLYF Fitness Center',
        description: `${plan.name} Membership - ${plan.duration}`,
        order_id: orderId,
        handler: async function (response) {
          console.log('✅ Payment successful:', response);
          
          // Verify payment on your backend
          try {
            const verificationResponse = await API.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
              customerDetails: userData,
              paymentMethod: paymentMethod.method,
              upiId: paymentMethod.upiId
            });

            if (verificationResponse.data.success) {
              // Set payment details for success modal
              setPaymentDetails({
                planName: plan.name,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: plan.price,
                duration: plan.duration,
                customerName: userData.name,
                customerEmail: userData.email,
                paymentMethod: paymentMethod.method === 'upi' ? 'UPI' : 'Card'
              });
              
              // Show success modal
              setShowSuccessModal(true);
              
              // Save user details for future payments
              localStorage.setItem('paymentUser', JSON.stringify(userData));
            } else {
              alert('❌ Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('❌ Payment verification failed. Please contact support.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone
        },
        notes: {
          plan: plan.name,
          planId: plan._id,
          duration: plan.duration,
          customerName: userData.name,
          customerEmail: userData.email,
          paymentMethod: paymentMethod.method,
          upiId: paymentMethod.upiId
        },
        theme: {
          color: '#10B981'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed by user');
            setProcessing(false);
          },
          escape: true,
          backdropclose: false
        }
      };

      // Add UPI configuration if selected
      if (paymentMethod.method === 'upi' && paymentMethod.upiId) {
        options.method = 'upi';
        options.upi = {
          flow: 'collect',
          vpa: paymentMethod.upiId
        };
        // Don't hide UPI methods
        delete options.config;
      } else {
        // For card payments, you can optionally hide UPI
        options.config = {
          display: {
            // You can choose which methods to show/hide
          }
        };
      }

      // Initialize Razorpay payment
      const razorpay = new window.Razorpay(options);
      
      // Event handlers
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        let errorMessage = `Payment Failed: ${response.error.description || 'Unknown error'}`;
        
        // Add specific guidance for UPI failures
        if (paymentMethod.method === 'upi') {
          errorMessage += '\n\n💡 UPI Payment Tips:';
          errorMessage += '\n• Ensure UPI ID is correct (e.g., username@okicici)';
          errorMessage += '\n• Check UPI app for pending requests';
          errorMessage += '\n• Ensure sufficient balance';
          errorMessage += '\n• Try again in a few minutes';
        }
        
        alert(errorMessage);
        setProcessing(false);
      });

      // Open Razorpay payment modal
      razorpay.open();

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      alert(error.message || 'Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  // Handle payment button click
  const handlePayment = async (plan) => {
    if (!plan.isActive) {
      alert('This plan is not available for purchase at the moment.');
      return;
    }

    if (processing) return;

    console.log('Selected plan for payment:', plan);

    // Check if Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Payment gateway is currently unavailable. Please try again later.');
      return;
    }

    // Get user details first
    const userData = await getUserDetails();
    if (!userData) {
      return; // User cancelled
    }

    // Show payment method selection
    const paymentMethod = await showPaymentMethodModal(userData, plan);
    if (!paymentMethod) {
      return; // User cancelled
    }

    // Save UPI ID if provided
    if (paymentMethod.upiId) {
      setUpiId(paymentMethod.upiId);
    }

    // Initialize Razorpay payment with selected method
    initializeRazorpayPayment(plan, userData, paymentMethod);
  };

  // Helper functions for validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const isValidUpiId = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
    return upiRegex.test(upiId);
  };

  const SuccessModal = () => {
    if (!showSuccessModal || !paymentDetails) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/50 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            {/* Success Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Welcome to FITLYF! 🎉</h3>
            <p className="text-gray-300 text-sm mb-6">
              Your <span className="text-brand-primary font-bold">{paymentDetails.planName}</span> membership has been activated
            </p>
            
            {/* Payment Details Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Name:</span>
                  <span className="text-white text-sm font-medium">{paymentDetails.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Email:</span>
                  <span className="text-white text-sm font-medium">{paymentDetails.customerEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Amount Paid:</span>
                  <span className="text-green-400 text-sm font-bold">₹{formatPrice(paymentDetails.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Duration:</span>
                  <span className="text-white text-sm font-medium">{paymentDetails.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Payment ID:</span>
                  <span className="text-blue-400 text-xs font-mono truncate ml-2">
                    {paymentDetails.paymentId?.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="mb-6 text-left">
              <h4 className="text-white font-semibold text-sm mb-3">What's Next?</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Confirmation email sent to {paymentDetails.customerEmail}
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Visit our center to complete registration
                </div>
                <div className="flex items-center text-gray-300 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Bring your ID proof for verification
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setPaymentDetails(null);
                }}
                className="flex-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white py-3 px-6 rounded-xl text-sm font-medium hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setPaymentDetails(null);
                  window.location.href = '/';
                }}
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-6 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transform hover:scale-[1.02] transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </div>
            
            <p className="text-gray-500 text-xs mt-4 text-center">
              Need assistance? Contact support@fitlyf.com
            </p>
          </div>
        </div>
      </div>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getFeaturesList = (plan) => {
    const features = [];
    
    if (plan.features && plan.features.length > 0) {
      features.push(...plan.features);
    }
    
    if (plan.gymAccess) features.push('24/7 Gym Access');
    if (plan.poolAccess) features.push('Swimming Pool Access');
    if (plan.spaAccess) features.push('Spa & Sauna Facility');
    
    if (plan.maxClassesPerWeek) {
      features.push(`${plan.maxClassesPerWeek} Group Classes/Week`);
    } else {
      features.push('Unlimited Group Classes');
    }
    
    if (plan.personalTrainingSessions > 0) {
      features.push(`${plan.personalTrainingSessions} Personal Training Sessions`);
    }
    
    // Add default features
    features.push('Locker Facility');
    features.push('Free WiFi');
    features.push('Nutrition Consultation');
    
    return features;
  };

  const calculateDailyRate = (plan) => {
    const durationMatch = plan.duration.match(/\d+/);
    const duration = durationMatch ? parseInt(durationMatch[0]) : 30;
    return (plan.price / duration).toFixed(2);
  };

  const filteredPlans = activeTab === 'all' 
    ? plans 
    : plans.filter(plan => plan.category === activeTab);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950" id="membership">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">Membership Plans</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Loading our exclusive fitness packages...
            </p>
          </div>
          
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-brand-primary rounded-full animate-spin absolute top-0"></div>
              </div>
              <p className="text-gray-400 text-sm mt-4">Preparing your membership options...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950" id="membership">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">Membership Plans</span>
            </h2>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="relative bg-gradient-to-br from-red-900/20 to-red-950/20 backdrop-blur-sm border border-red-800/50 rounded-2xl p-8 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Unable to Load Plans</h3>
                <p className="text-gray-300 text-sm mb-6">{error}</p>
                <button 
                  onClick={fetchMembershipPlans}
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-8 rounded-xl text-sm font-bold hover:shadow-2xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-900 to-gray-950" id="membership">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary">Membership Plans</span>
            </h2>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 overflow-hidden">
              <div className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Plans Coming Soon</h3>
                <p className="text-gray-400 text-sm mb-6">We're curating exceptional membership packages for you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className=" sm:py-10 md:py-10 bg-gradient-to-b from-gray-900 to-gray-950 " id="membership">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mb-6"></div>
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Transform With Our <span className="text-transparent bg-clip-text bg-gradient-to-r  text-white from-brand-primary via-white to-brand-secondary">Premium Plans</span>
            </h2>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Choose from our expertly crafted membership tiers designed to match your fitness goals and lifestyle preferences
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                  : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              All Plans
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === 'general'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                  : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === 'premium'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                  : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              Premium
            </button>
            <button
              onClick={() => setActiveTab('elite')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === 'elite'
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-2xl shadow-brand-primary/30'
                  : 'bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              Elite
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8  mb-12 sm:mb-16">
            {filteredPlans.map((plan, index) => {
              const features = getFeaturesList(plan);
              
              return (
                <div 
                  key={plan._id} 
                  className={`group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-[1.02] overflow-hidden ${
                    plan.popular 
                      ? 'border-brand-primary/50 shadow-2xl shadow-brand-primary/20' 
                      : plan.recommended
                      ? 'border-brand-secondary/50 shadow-xl shadow-brand-secondary/10'
                      : 'border-gray-800/50'
                  }`}
                >
                  {/* Animated background */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  {/* Badges */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-brand-primary to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-2xl">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  {plan.recommended && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-gradient-to-r from-brand-secondary to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xl">
                        RECOMMENDED
                      </span>
                    </div>
                  )}
                  
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
                      {plan.category === 'premium' ? '⭐' : plan.category === 'elite' ? '👑' : '💪'}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors duration-300">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-4xl md:text-5xl font-black text-white mb-1">
                        ₹{formatPrice(plan.price)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        per {plan.duration}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total Value: ₹{(plan.price * 1.5).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-3 h-0.5 bg-brand-primary mr-2"></span>
                      Included Features
                    </h4>
                    <ul className="space-y-3">
                      {features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start group/feature">
                          <div className="w-5 h-5 bg-brand-primary/20 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/feature:scale-110 transition-transform duration-300">
                            <svg className="w-3 h-3 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-300 text-sm flex-1">{feature}</span>
                        </li>
                      ))}
                      {features.length > 6 && (
                        <li className="text-brand-primary text-sm font-medium pl-8">
                          + {features.length - 6} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">VISA</span>
                      </div>
                      <span>Card</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <div className="w-6 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">UPI</span>
                      </div>
                      <span>UPI</span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="mb-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      plan.isActive
                        ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${plan.isActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                      {plan.isActive ? 'Available Now' : 'Coming Soon'}
                    </span>
                  </div>
                  
                  {/* CTA Button */}
                  <button 
                    onClick={() => handlePayment(plan)}
                    disabled={!plan.isActive || processing}
                    className={`group/btn relative w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white transition-all duration-500 ${
                      processing && selectedPlan?._id === plan._id 
                        ? 'bg-gray-800 cursor-not-allowed' 
                        : plan.popular
                          ? 'bg-gradient-to-r from-brand-primary to-emerald-600'
                          : plan.recommended
                          ? 'bg-gradient-to-r from-brand-secondary to-purple-600'
                          : 'bg-gradient-to-r from-gray-800 to-gray-900'
                    } ${!plan.isActive ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-brand-primary/40'}`}
                  >
                    {processing && selectedPlan?._id === plan._id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : plan.isActive ? (
                      <div className="flex items-center justify-center">
                        Get Started Now
                        <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    ) : (
                      'Notify Me'
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Process & Payment Info */}
          <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Simple & Secure <span className="text-brand-primary">Payment Process</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
                {[
                  {
                    step: 1,
                    title: "Select Your Plan",
                    description: "Choose from our premium membership tiers",
                    icon: "M9 5l7 7-7 7"
                  },
                  {
                    step: 2,
                    title: "Enter Details",
                    description: "Provide your information securely",
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  },
                  {
                    step: 3,
                    title: "Instant Access",
                    description: "Get immediate membership confirmation",
                    icon: "M5 13l4 4L19 7"
                  }
                ].map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group hover:from-brand-primary hover:to-brand-secondary transition-all duration-500">
                      <div className="text-2xl font-bold text-white">{step.step}</div>
                    </div>
                    <h4 className="text-white font-semibold text-lg mb-2">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Payment Methods */}
              <div className="text-center">
                <h4 className="text-white font-semibold text-lg mb-4">Secure Payment Methods</h4>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">VISA</span>
                    </div>
                    <span className="text-gray-300 text-sm">Visa/Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <div className="w-8 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">UPI</span>
                    </div>
                    <span className="text-gray-300 text-sm">UPI Payment</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 text-sm">SSL Secured</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-6">
                  *All payments are secured with 256-bit SSL encryption. No card details are stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked <span className="text-brand-primary">Questions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  q: "Can I upgrade or downgrade my plan later?",
                  a: "Yes, you can upgrade or downgrade at any time. The difference will be prorated based on your remaining membership period."
                },
                {
                  q: "Is there a trial period available?",
                  a: "We offer a 7-day trial for all new members. Contact our support team to arrange your trial experience."
                },
                {
                  q: "What payment methods are accepted?",
                  a: "We accept all major credit/debit cards and UPI payments through secure payment gateways."
                },
                {
                  q: "Can I cancel my membership?",
                  a: "Yes, you can cancel your membership with 30 days notice. Refunds are processed based on our cancellation policy."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-5 hover:border-brand-primary/30 transition-all duration-300">
                  <h4 className="text-white font-semibold text-base mb-2">{faq.q}</h4>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Modal */}
      <SuccessModal />
    </>
  );
};

export default MembershipPlans;