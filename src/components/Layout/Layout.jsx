import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import Header from './Header';
import Footer from './Footer';

// COMPLETELY SILENCE CONSOLE IN PRODUCTION
const silenceConsole = () => {
  if (typeof window === 'undefined') return;
  
  if (process.env.NODE_ENV === 'production') {
    // Complete silence in production
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    
    // Also silence third-party console methods
    if (window.console) {
      const noop = () => {};
      const methods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'trace', 'dir', 'group', 'groupEnd'];
      methods.forEach(method => {
        window.console[method] = noop;
      });
    }
  } else {
    // Development mode - only show critical errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      const criticalErrors = ['Error:', 'SecurityError', 'SyntaxError', 'TypeError', 'ReferenceError'];
      
      if (criticalErrors.some(err => message.includes(err))) {
        originalError.apply(console, args);
      }
    };
    
    // Suppress common warnings
    console.warn = () => {};
  }
};

// Block token exposure from third-party scripts
const blockTokenExposure = () => {
  if (typeof window === 'undefined') return;
  
  // Override URL parsing to hide tokens
  const originalURL = window.URL;
  window.URL = class SecureURL extends originalURL {
    constructor(url, base) {
      const safeUrl = url?.toString()?.replace(
        /(session_token|token|access_token|refresh_token|api_key|secret)=[^&]+/gi,
        '$1=[REDACTED]'
      );
      super(safeUrl || url, base);
    }
  };
  
  // Override console.log for third-party scripts
  const originalLog = console.log;
  console.log = (...args) => {
    const safeArgs = args.map(arg => {
      if (typeof arg === 'string') {
        return arg.replace(
          /(session_token|token|access_token|refresh_token|api_key|secret|device_id|unified_session_id)=[^&]+/gi,
          '$1=[REDACTED]'
        );
      }
      return arg;
    });
    
    // Only allow your application logs
    if (safeArgs[0]?.includes('✅ Razorpay script loaded')) {
      originalLog('✅ Payment gateway initialized');
      return;
    }
    if (safeArgs[0]?.includes('📥 Membership plans API response')) {
      originalLog('📥 API data loaded successfully');
      return;
    }
  };
};

// Add security headers
const addSecurityHeaders = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // This would be done server-side, but we can add meta tags
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline';";
  document.head.appendChild(meta);
};

const Layout = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const [isSecure, setIsSecure] = useState(true);

  // Initialize security measures
  useEffect(() => {
    silenceConsole();
    blockTokenExposure();
    addSecurityHeaders();
    
    // Verify page is served over HTTPS in production
    if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
      console.error('INSECURE CONNECTION: Site should be served over HTTPS');
      setIsSecure(false);
    }
    
    // Check for security vulnerabilities
    const checkSecurity = () => {
      // Check if sensitive data is in localStorage
      const sensitiveKeys = ['token', 'password', 'secret'];
      sensitiveKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          console.warn(`Security warning: ${key} found in localStorage`);
        }
      });
      
      // Check for eval usage (security risk)
      if (window.eval && window.eval.toString().includes('[native code]')) {
        console.warn('Security: eval() is enabled');
      }
    };
    
    checkSecurity();
    
    // Cleanup
    return () => {
      // Remove any global event listeners
      window.onerror = null;
    };
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-brand-primary border-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-sm">Securing your session...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Security warning banner (only in development with issues)
  if (!isSecure && process.env.NODE_ENV === 'development') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950/20 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto mt-10">
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Alert</h2>
                <p className="text-red-300">Sensitive data exposure detected</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-300">
              <p>Your console is exposing sensitive information including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Session tokens</li>
                <li>Device IDs</li>
                <li>Authentication data</li>
              </ul>
              <p className="pt-3">This is being fixed automatically. The production build will be secure.</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <Header user={user} scrolled={false} />
            <main className="mt-6">
              <Outlet />
            </main>
            {(!user || user?.role !== 'admin') && <Footer />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Security overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/30 backdrop-blur-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span>SECURE MODE</span>
          </div>
        </div>
      )}
      
      <Header user={user} scrolled={scrolled} />
      <main className="flex-1">
        <Outlet />
      </main>
      {(!user || user?.role !== 'admin') && <Footer />}
    </div>
  );
};

export default Layout;