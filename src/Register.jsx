import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async (e) => {
    e?.preventDefault();
    
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // console.log("Sending to backend:", form);  // DEBUG
      const res = await API.post("/auth/register", form);

      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      
      // Show success message
      setSuccess(res.data.message || "Account created successfully!");
      
      // Success notification
      const successDiv = document.createElement("div");
      successDiv.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
      successDiv.textContent = "Account created successfully! Redirecting...";
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.classList.add("animate-fade-out");
        setTimeout(() => successDiv.remove(), 300);
      }, 2000);

      // Redirect to login after delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(e);
  };

  const handleDemoFill = () => {
    // Pre-fill form with demo data
    setForm({
      username: "demo_user",
      email: "demo@example.com",
      password: "demo123",
      role: "user"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <UserPlusIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-8 text-4xl font-bold text-white">
            Join Our Community
          </h2>
          <p className="mt-2 text-lg text-blue-200">
            Create your account and start your journey
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-purple-400 transition-colors">
                    <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-white/5 border border-gray-600 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-purple-400 transition-colors">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-white/5 border border-gray-600 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-purple-400 transition-colors">
                    <KeyIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 pr-10 bg-white/5 border border-gray-600 rounded-xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                  Account Type
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-purple-400 transition-colors">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400" />
                  </div>
                  <select
                    id="role"
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-white/5 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user" className="bg-gray-800 text-white">Regular User</option>
                    <option value="admin" className="bg-gray-800 text-white">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {form.role === "admin" 
                    ? "📋 Administrators have full system access" 
                    : "👤 Users have standard access privileges"}
                </p>
              </div>
            </div>

            {/* Demo Fill Button */}
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full text-sm text-center py-2 text-blue-300 hover:text-blue-200 transition-colors"
            >
              Fill with demo data
            </button>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-white/5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="font-medium text-purple-300 hover:text-purple-200">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-purple-300 hover:text-purple-200">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
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
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-600">
            <p className="text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="text-white p-4 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-sm font-medium">Secure</p>
          </div>
          <div className="text-white p-4 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium">Fast</p>
          </div>
          <div className="text-white p-4 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium">Reliable</p>
          </div>
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