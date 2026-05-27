"use client";
import React, { useState } from 'react';
import { X, Mail, Phone, Loader2 } from 'lucide-react'; 
import { supabase } from '@/app/utils/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  // Function to handle Email OTP (Magic Link) login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`, 
        },
      });

      if (error) throw error;
      setMessage("Success! Check your inbox for the login link.");
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[40px] p-8 md:p-10 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <h2 className="text-2xl font-serif text-gray-800 mb-2 mt-4 text-center">
          Save your journey with KAAL
        </h2>
        <p className="text-sm text-gray-500 text-center mb-10 leading-relaxed">
          Sign in to securely store your reflections and conversations.
        </p>

        {/* Buttons Stack */}
        <div className="w-full flex flex-col gap-4">
          
          {/* Google Button - Placeholder for UI */}
          <button 
            type="button"
            className="w-full bg-[#E9B96E] opacity-70 cursor-not-allowed text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 border-none shadow-sm"
          >
            <span className="text-sm">Continue with Google</span>
          </button>

          {/* Phone Button - Placeholder for UI */}
          <button 
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-300 font-medium py-4 rounded-full flex items-center justify-center gap-3 cursor-not-allowed"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Continue with Phone</span>
          </button>

          {/* Email Login Section */}
          {!showEmailInput ? (
            <button 
              onClick={() => setShowEmailInput(true)}
              className="w-full bg-white border border-gray-200 hover:border-[#E9B96E] text-gray-700 font-medium py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Continue with Email</span>
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#E9B96E]"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Send Magic Link"}
              </button>
              {message && <p className="text-[10px] text-green-600 text-center font-medium">{message}</p>}
            </form>
          )}

          {/* Skip Button */}
          <button 
            onClick={onClose}
            className="w-full bg-transparent text-gray-400 hover:text-gray-600 text-xs py-2 mt-2 transition-colors border-none cursor-pointer"
          >
            Continue without signing
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-10 pt-6 border-t border-gray-100 w-full text-center px-4">
          <p className="text-[10px] text-gray-400 leading-normal uppercase tracking-wider">
            You can continue without signing in. <br/>
            Signing in simply helps you return to your conversations anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;