// src/utils/razorpay.js
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Add nonce for CSP
    script.nonce = 'razorpay-nonce';
    
    script.onload = () => {
      console.log('Razorpay loaded successfully');
      resolve(window.Razorpay);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay');
      resolve(null);
    };
    
    document.body.appendChild(script);
  });
};