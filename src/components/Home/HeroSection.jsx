import React, { useState, useEffect } from 'react';
import FreeSessionForm from '../freesession/FreeSessionForm';
import { 
  PlayIcon, 
  ArrowRightIcon, 
  FireIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const HeroSection = () => {
  const [showFreeSessionForm, setShowFreeSessionForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <section 
        className="relative min-h-[calc(100vh-80px)] sm:min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center py-8 sm:py-0"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.9)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-brand-primary/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${0.5 + Math.random()})`
              }}
            />
          ))}
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 lg:mt-20">
          <div className="max-w-6xl mx-auto">
            {/* Main Heading */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-3 mb-6 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 backdrop-blur-sm border border-brand-primary/30 px-6 py-3 rounded-2xl">
                <SparklesIcon className="h-5 w-5 text-brand-primary" />
                <span className="text-white text-sm font-medium">Transform Your Fitness Journey</span>
              </div>
              
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                <span className="block">
                  Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-secondary animate-gradient-x">Fit.</span>
                </span>
                <span className="block mt-2">
                  Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-primary to-brand-secondary animate-gradient-x animation-delay-1000">Strong.</span>
                </span>
                <span className="block mt-2">
                  Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary via-brand-primary to-white animate-gradient-x animation-delay-2000">FITLYF.</span>
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto px-4 sm:px-0 font-light">
                Transform your life with <span className="font-bold text-brand-primary">personalized fitness programs</span>, expert guidance, and a community that supports your journey to excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col xs:flex-row justify-center items-center gap-4 sm:gap-6 px-4 sm:px-0 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <a 
                href="#membership" 
                className="group relative w-full xs:w-auto bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white font-bold py-4 px-8 sm:py-5 sm:px-12 rounded-2xl text-lg sm:text-xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-brand-primary/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Your Journey
                  <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </a>
              
              <button 
                onClick={() => setShowFreeSessionForm(true)}
                className="group relative w-full xs:w-auto bg-transparent border-2 border-brand-primary text-brand-primary hover:text-white font-bold py-4 px-8 sm:py-5 sm:px-12 rounded-2xl text-lg sm:text-xl transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-brand-primary/20 hover:to-brand-secondary/20 shadow-2xl hover:shadow-brand-primary/20"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Try Free Session
                  <PlayIcon className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-primary/30 rounded-2xl transition-all duration-500"></div>
                <div className="absolute -inset-1 bg-brand-primary/5 blur-xl group-hover:bg-brand-primary/10 transition-all duration-500"></div>
              </button>
            </div>

            {/* Stats Bar */}
            <div className={`mt-12 sm:mt-16 mb-8 sm:mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { value: "500+", label: "Happy Members", icon: UserGroupIcon, color: "from-brand-primary to-brand-secondary" },
                  { value: "15+", label: "Expert Trainers", icon: FireIcon, color: "from-orange-500 to-yellow-500" },
                  { value: "50+", label: "Modern Equipment", icon: ShieldCheckIcon, color: "from-blue-500 to-cyan-500" },
                  { value: "24/7", label: "Support", icon: ClockIcon, color: "from-purple-500 to-pink-500" }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/30 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/10"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2 sm:px-0">
                {[
                  {
                    icon: "🏋️‍♂️",
                    title: "Expert Trainers",
                    description: "Certified professionals with personalized training approaches",
                    color: "from-brand-primary/20 to-brand-secondary/20",
                    border: "border-brand-primary/30"
                  },
                  {
                    icon: "💪",
                    title: "Modern Equipment",
                    description: "Latest fitness technology for maximum results",
                    color: "from-blue-500/20 to-cyan-500/20",
                    border: "border-blue-500/30"
                  },
                  {
                    icon: "🤝",
                    title: "Community Support",
                    description: "Join our motivating fitness family",
                    color: "from-purple-500/20 to-pink-500/20",
                    border: "border-purple-500/30"
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="group relative bg-gradient-to-br from-gray-900/40 to-gray-950/40 backdrop-blur-sm border border-gray-800/50 hover:border-brand-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/10"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} ${feature.border} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-10 sm:mt-14 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-3 mb-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 px-6 py-3 rounded-2xl">
                <span className="text-gray-500 text-sm font-medium">Trusted by fitness enthusiasts worldwide</span>
              </div>
              <div className="flex justify-center items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {/* <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /> */}
                  </svg>
                ))}
                {/* <span className="text-white font-bold text-lg sm:text-xl ml-3">4.9/5</span>
                <span className="text-gray-400 text-sm sm:text-base ml-1">(2,500+ Reviews)</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Explore More</span>
            <div className="w-8 h-12 border-2 border-gray-700 rounded-full flex justify-center p-1">
              <div className="w-1.5 h-3 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Session Form Modal */}
      {showFreeSessionForm && (
        <FreeSessionForm 
          onClose={() => setShowFreeSessionForm(false)}
          onSuccess={(data) => {
            console.log('Free session booked successfully:', data);
          }}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(var(--scale, 1)); }
          50% { transform: translateY(-20px) scale(var(--scale, 1)); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </>
  );
};

export default HeroSection;