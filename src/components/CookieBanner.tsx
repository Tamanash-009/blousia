import React, { useState, useEffect } from "react";
import { Shield, Settings, X, Check } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytical, setAnalytical] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if the cookie or local storage already exists
    const consent = getCookie("blousia_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax; Secure`;
  };

  const handleAcceptAll = () => {
    const preferences = { necessary: true, functional: true, analytical: true, marketing: true };
    setCookie("blousia_cookie_consent", JSON.stringify(preferences), 365);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const preferences = { necessary: true, functional, analytical, marketing };
    setCookie("blousia_cookie_consent", JSON.stringify(preferences), 365);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const preferences = { necessary: true, functional: false, analytical: false, marketing: false };
    setCookie("blousia_cookie_consent", JSON.stringify(preferences), 365);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slideUp">
      <div className="rounded-3xl border border-gold-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gold-50 p-2 text-gold-600 dark:bg-slate-800 dark:text-gold-400">
            <Shield size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-serif text-sm font-bold text-gray-950 dark:text-white">Bespoke Privacy Consent</h4>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-gray-500 leading-relaxed dark:text-gray-400">
              Blousia® uses premium micro-cookies to retain your tailoring measurements, shopping cart fits, and theme settings. We design to drape confidence safely.
            </p>

            {showSettings && (
              <div className="mt-4 border-t border-gray-100 pt-3 space-y-2.5 dark:border-slate-800">
                <div className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white block">Tailoring Essentials</span>
                    <span className="text-[9px] text-gray-400 block">Required for fitting & checkout state</span>
                  </div>
                  <span className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">Always Active</span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white block">Functional Memories</span>
                    <span className="text-[9px] text-gray-400 block">Saves your dark mode & wishlist history</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFunctional(!functional)}
                    className={`h-4 w-8 rounded-full transition-all relative ${functional ? "bg-gold-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${functional ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white block">Styling Analytics</span>
                    <span className="text-[9px] text-gray-400 block">Helps our master tailors identify popular designs</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAnalytical(!analytical)}
                    className={`h-4 w-8 rounded-full transition-all relative ${analytical ? "bg-gold-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${analytical ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-white block">VIP Personalization</span>
                    <span className="text-[9px] text-gray-400 block">Bespoke fashion notifications & special offers</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMarketing(!marketing)}
                    className={`h-4 w-8 rounded-full transition-all relative ${marketing ? "bg-gold-500" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${marketing ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-xl border border-gray-100 dark:border-slate-800 px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
              >
                <Settings size={12} />
                {showSettings ? "Hide Settings" : "Configure"}
              </button>
              
              {showSettings ? (
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="rounded-xl bg-gold-500 px-4 py-1.5 text-[10px] font-bold text-white hover:bg-gold-600 cursor-pointer"
                >
                  Save Selection
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptNecessary}
                    className="rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-bold text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="rounded-xl bg-gold-600 px-4 py-1.5 text-[10px] font-bold text-white hover:bg-gold-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={12} />
                    Accept All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
