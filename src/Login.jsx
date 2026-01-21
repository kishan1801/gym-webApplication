import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  EnvelopeIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // console.log("Already authenticated, checking where to redirect...");
      // Get intended destination or default based on role
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location]);

  const loginHandler = async (e) => {
    e?.preventDefault();
    
    // Validation
    if (!email.trim() || !password.trim()) {
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
        setError(result.error || "Login failed. Please check your credentials.");
        return;
      }

      // Show success message
      const successDiv = document.createElement("div");
      successDiv.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center space-x-2";
      successDiv.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Login successful! Redirecting...</span>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.classList.add("animate-fade-out");
        setTimeout(() => successDiv.remove(), 300);
      }, 2000);

      // FIXED: Redirect based on role with fallback
      setTimeout(() => {
        const from = location.state?.from?.pathname;
        
        // console.log("Redirect info:", {
        //   role: result.role,
        //   from: from,
        //   user: result.user
        // });

        // If there's a specific redirect path, use it
        if (from) {
          navigate(from, { replace: true });
          return;
        }

        // Otherwise, redirect based on role
        if (result.role === "admin") {
          // console.log("Redirecting to admin dashboard");
          navigate("/admin", { replace: true });
        } else {
          // console.log("Redirecting to user dashboard");
          navigate("/user/dashboard", { replace: true });
        }
      }, 500);
      
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role = "user") => {
    const credentials = {
      user: { email: "demo@example.com", password: "demo123" },
      admin: { email: "admin@example.com", password: "admin123" }
    };
    
    const creds = credentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    
    // Auto-login after a short delay
    setTimeout(() => {
      loginHandler(new Event('submit'));
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      loginHandler(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-lg text-blue-200">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-shake">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={loginHandler} onKeyPress={handleKeyPress}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-white/5 border border-gray-600 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-blue-400 transition-colors">
                  <KeyIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className="appearance-none block w-full px-3 py-3 pl-10 pr-10 bg-white/5 border border-gray-600 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/5 disabled:opacity-50"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>

            {/* Demo Login Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => handleDemoLogin("user")}
                disabled={loading}
                className="flex-1 py-2 px-4 border border-blue-500 text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
                className="flex-1 py-2 px-4 border border-purple-500 text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                Demo Admin
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
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

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}