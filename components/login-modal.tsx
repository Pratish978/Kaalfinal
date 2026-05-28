"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'; 
import { supabase } from '@/app/utils/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isRendered, setIsRendered] = useState(false);

  // Smooth unmounting animation state orchestration
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  // Handles production-ready Magic Link routing via custom api/route configurations
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/`, 
        },
      });

      if (error) throw error;
      
      setStatusMessage({ 
        type: 'success', 
        text: "Success! Check your inbox for the login link." 
      });
    } catch (error: any) {
      console.error("KAAL Auth Protocol Exception:", error.message);
      setStatusMessage({ 
        type: 'error', 
        text: error.message || "Login failed. Please verify your connection." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-all duration-500 ease-in-out" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className={`relative bg-white w-full max-w-md rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-2xl flex flex-col items-center max-h-[calc(100dvh-2rem)] overflow-y-auto transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#E9B96E]/40 to-transparent" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-black transition-all duration-300 bg-transparent border-none cursor-pointer group active:scale-95 z-10"
          aria-label="Close authentication panel"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        {/* Logo Iconography Segment */}
        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-4 mt-2 shadow-sm shrink-0">
          <Sparkles className="w-4 h-4 text-[#E9B96E]" />
        </div>

        {/* Title Content */}
        <h2 className="text-xl md:text-2xl font-serif text-gray-800 mb-1.5 text-center px-2 shrink-0">
          Save your journey with KAAL
        </h2>
        <p className="text-xs md:text-sm text-gray-500 text-center mb-6 md:mb-8 leading-relaxed max-w-[320px] shrink-0">
          Sign in to securely store your reflections and conversations.
        </p>

        {/* Buttons Stack */}
        <div className="w-full flex flex-col gap-3 md:gap-4 shrink-0">
          
          {/* Google Button - Placeholder for UI */}
          <button 
            type="button"
            className="w-full bg-[#E9B96E] opacity-70 cursor-not-allowed text-white font-bold py-3.5 md:py-4 rounded-full flex items-center justify-center gap-3 border-none shadow-sm select-none"
          >
            <span className="text-xs md:text-sm">Continue with Google</span>
          </button>

          {/* Phone Button - Placeholder for UI */}
          <button 
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-300 font-medium py-3.5 md:py-4 rounded-full flex items-center justify-center gap-3 cursor-not-allowed select-none"
          >
            <Phone className="w-4 h-4 text-gray-300" />
            <span className="text-xs md:text-sm">Continue with Phone</span>
          </button>

          {/* Email Login Section */}
          {!showEmailInput ? (
            <button 
              onClick={() => setShowEmailInput(true)}
              className="w-full bg-white border border-gray-200 hover:border-[#E9B96E] text-gray-700 font-medium py-3.5 md:py-4 rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Mail className="w-4 h-4 text-gray-500 transition-transform group-hover:scale-110" />
              <span className="text-xs md:text-sm">Continue with Email</span>
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 w-full transition-all duration-500 ease-out animate-in slide-in-from-top-2">
              <div className="relative w-full">
                <input 
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-3.5 md:py-4 bg-gray-50 border border-gray-200 rounded-full text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E9B96E] transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-3.5 md:py-4 rounded-full transition-all duration-300 active:scale-[0.98] flex items-center justify-center disabled:opacity-50 cursor-pointer group"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5 text-white" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm">Send Magic Link</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </button>
              
              {/* Context Feedback System */}
              {statusMessage.text && (
                <p className={`text-[10px] text-center mt-0.5 font-medium px-2 leading-relaxed animate-in fade-in duration-200 ${
                  statusMessage.type === 'success' ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {statusMessage.text}
                </p>
              )}
            </form>
          )}

          {/* Skip Button */}
          <button 
            onClick={onClose}
            className="w-full bg-transparent text-gray-400 hover:text-gray-600 text-xs py-1.5 mt-1 transition-colors duration-200 border-none cursor-pointer"
          >
            Continue without signing
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-5 border-t border-gray-100 w-full text-center px-4 shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E9B96E]" />
            <span>Secure Storage Access</span>
          </div>
          <p className="text-[9px] md:text-[10px] text-gray-400 leading-normal uppercase tracking-wider max-w-[290px] mx-auto">
            You can continue without signing in. <br/>
            Signing in simply helps you return to your conversations anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;