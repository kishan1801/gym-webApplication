import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About & CTA */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                FITLYF<span className="text-brand-primary">.</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Your personal fitness partner, available anytime, anywhere.
            </p>
            <Link 
              to="/membership" 
              className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold px-8 py-4 rounded-2xl inline-block transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-primary/30"
            >
              Start Your Free Trial
            </Link>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Programs
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/trainers" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Trainers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} FITLYF. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;