import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // IMPORTANT: Check this path
import { 
  EnvelopeIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth(); // Get user and authLoading from context
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      // console.log("Already logged in, redirecting...");
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, rememberMe);
      
      // console.log("Login result:", result);

      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }

      // Show success message
      const successMsg = result.message || "Login successful!";
      
      // Small success notification
      const successDiv = document.createElement("div");
      successDiv.className = "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn";
      successDiv.textContent = successMsg;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.classList.add("animate-fade-out");
        setTimeout(() => successDiv.remove(), 300);
      }, 2000);

      // IMPORTANT: Don't redirect here, let the useEffect above handle it
      // The useEffect will pick up the user state change from AuthContext
      
    } catch (err) {
      // console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role = "user") => {
    // Demo credentials - you can remove this in production
    const demoCredentials = {
      user: { email: "demo@example.com", password: "demo123" },
      admin: { email: "admin@example.com", password: "admin123" }
    };
    
    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    
    // Auto-login after a short delay
    setTimeout(() => {
      handleLogin(new Event('submit'));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-lg text-emerald-200">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Debug Info - Remove in production */}
          

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-700/50 rounded-xl p-4 animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-emerald-400 transition-colors">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={loading || authLoading}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                {/* <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-emerald-400 transition-colors">
                  <KeyIcon className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading || authLoading}
                  className="appearance-none block w-full px-3 py-3 pl-10 pr-10 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || authLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Demo Login */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  disabled={loading || authLoading}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-gray-900 disabled:opacity-50"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              
              <div className="flex space-x-2">
                 
                 
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || authLoading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div> */}

            {/* Social Login Buttons */}
            {/* <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading || authLoading}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-700 rounded-xl text-sm font-medium text-white bg-gray-900/50 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                disabled={loading || authLoading}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-700 rounded-xl text-sm font-medium text-white bg-gray-900/50 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div> */}
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2024 FITLYF. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}