import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Scissors, ShieldCheck, Sparkles, ChevronLeft, ArrowRight, User } from "lucide-react";
import { useApp } from "../context/AppContext";

const ONBOARDING_SLIDES = [
  {
    id: "welcome",
    title: "Welcome to Blousia®",
    subtitle: "Premium Designer Blouses",
    description: "Discover a curated collection of handcrafted, luxury blouses designed for the modern woman.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "custom",
    title: "Bespoke Customization",
    subtitle: "Your Design, Your Fit",
    description: "Experience our premium tailoring service. Customize fabrics, necklines, and embroidery to match your vision.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1584036533827-45bce166ad94?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: "secure",
    title: "Secure & Fast",
    subtitle: "Premium Shopping Experience",
    description: "Enjoy secure checkouts, fast worldwide delivery, and dedicated WhatsApp concierge support.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
  }
];

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const { setShowAuthModal, setAccountSubTab, setActiveTab } = useApp();

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setShowAuthChoice(true);
    }
  };

  const handleSkip = () => {
    setShowAuthChoice(true);
  };

  const handleGuest = () => {
    localStorage.setItem("blousia_onboarding_complete", "true");
    onComplete();
  };

  const handleLogin = () => {
    localStorage.setItem("blousia_onboarding_complete", "true");
    onComplete();
    setActiveTab("account");
    setShowAuthModal(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col h-[100dvh] overflow-hidden">
      <AnimatePresence mode="wait">
        {!showAuthChoice ? (
          <motion.div 
            key="slides"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center p-6 shrink-0">
              <div className="font-serif text-xl font-bold tracking-widest text-gold-500 uppercase">
                Blousia<sup className="text-[10px]">&reg;</sup>
              </div>
              <button 
                onClick={handleSkip}
                className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Slides */}
            <div className="flex-1 relative overflow-hidden flex flex-col justify-center px-6 pb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col items-center text-center space-y-8"
                >
                  <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={ONBOARDING_SLIDES[currentSlide].image} 
                      alt={ONBOARDING_SLIDES[currentSlide].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center text-gold-400">
                      {React.createElement(ONBOARDING_SLIDES[currentSlide].icon, { size: 48, className: "drop-shadow-lg" })}
                    </div>
                  </div>

                  <div className="space-y-4 max-w-sm mx-auto">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                        {ONBOARDING_SLIDES[currentSlide].title}
                      </h2>
                      <p className="text-xs font-semibold tracking-widest uppercase text-gold-500 mt-2">
                        {ONBOARDING_SLIDES[currentSlide].subtitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {ONBOARDING_SLIDES[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="p-6 shrink-0 flex items-center justify-between pb-8">
              {/* Dots */}
              <div className="flex gap-2">
                {ONBOARDING_SLIDES.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-6 bg-gold-500" : "w-1.5 bg-gray-200 dark:bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-white shadow-lg transition-transform active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-choice"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 h-full text-center space-y-10"
          >
            <div className="space-y-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-50 dark:bg-gold-500/10 text-gold-500 mb-4">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                You're all set
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Join the Blousia® community to track orders, manage custom requests, and save your wishlist.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-900 dark:bg-white px-6 py-4 text-sm font-semibold text-white dark:text-gray-900 transition-transform active:scale-95 shadow-xl shadow-gray-900/20 dark:shadow-white/10"
              >
                <User size={18} />
                Login / Create Account
              </button>
              
              <button
                onClick={handleGuest}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 transition-transform active:scale-95 hover:border-gold-300 dark:hover:border-gold-500"
              >
                Continue as Guest
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
