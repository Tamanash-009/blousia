/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, Heart, Instagram, Facebook, Twitter, MessageSquare, Clock } from "lucide-react";
import { BusinessHoursBadge } from "./BusinessHoursBadge";

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, setSearchQuery, setAccountSubTab, socialLinks, isDarkMode, requireAuth } = useApp();
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSignedUp(true);
      setEmail("");
      setTimeout(() => setSignedUp(false), 5000);
    }
  };

  const footerCategories = [
    { label: "Bridal Blouses", cat: "Bridal Blouses" },
    { label: "Banarasi & Silk", cat: "Silk Blouses" },
    { label: "Organic Cotton", cat: "Cotton Blouses" },
    { label: "Designer Collection", cat: "Designer Blouses" },
    { label: "Mirror & Sequin Work", cat: "Mirror Work" },
    { label: "Sleeveless Minimal", cat: "Sleeveless" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", tab: "legal-privacy" },
    { label: "Terms & Conditions", tab: "legal-terms" },
    { label: "Shipping Policy", tab: "legal-shipping" },
    { label: "Refund & Return Policy", tab: "legal-refund" },
    { label: "Cookie Policy", tab: "legal-cookie" },
  ];

  return (
    <footer className="w-full border-t border-gray-100 bg-slate-50 text-gray-700 transition-colors dark:border-slate-900 dark:bg-slate-950 dark:text-gray-300">
      
      {/* Upper Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-none border border-black/5 dark:border-white/5 bg-[#F7F5F2] dark:bg-slate-900 px-6 py-12 md:px-12 md:py-16">
          
          <span className="text-[120px] font-serif text-black/[0.02] dark:text-white/[0.01] absolute right-4 bottom-[-20px] select-none pointer-events-none font-bold">
            EST. 26
          </span>

          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row z-10">
            <div className="max-w-md text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-bold block mb-2">
                Newsletter
              </span>
              <h3 className="font-serif text-2xl italic font-light text-gray-900 dark:text-white md:text-3xl leading-tight">
                Join the Inner Circle
              </h3>
              <p className="mt-3 font-sans text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                Unlock exclusive previews of bridal collections, hand-crafted drops, and updates from our boutique.
              </p>
            </div>

            <div className="w-full max-w-sm">
              {signedUp ? (
                <div className="flex items-center gap-2 rounded-none bg-black/[0.02] dark:bg-white/[0.02] border border-gold-400/50 p-4 text-xs text-gold-600 dark:text-gold-400">
                  <ShieldCheck size={16} />
                  <span>Welcome. A personal code has been sent to your email.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center border-b border-gray-900 dark:border-white pb-1.5 w-full">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-transparent text-[11px] font-sans tracking-widest text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="ml-2 text-sm font-bold text-gray-900 dark:text-white hover:opacity-50 transition-opacity"
                    aria-label="Subscribe"
                  >
                    →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sitemaps / Brand details */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-slate-900 mt-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-xs">
          
          {/* Column 1: Blousia® */}
          <div className="space-y-4">
            <p className="font-serif text-lg font-bold tracking-widest text-gold-500 uppercase">
              Blousia<span className="text-[10px] align-super">®</span>
            </p>
            <p className="font-sans text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              Blousia® specializes exclusively in high-end women's blouses, curating pristine tailoring with deep textile heritage.
            </p>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => setActiveTab("brand-story")} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 hover:underline cursor-pointer">
                  Brand Story
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about-us")} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 hover:underline cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("our-mission")} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 hover:underline cursor-pointer">
                  Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("why-choose-us")} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 hover:underline cursor-pointer">
                  Why Choose Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-wide text-gray-900 dark:text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => { setActiveTab("home"); window.scrollTo({top:0, behavior: "smooth"}); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setActiveTab("catalog"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Shop
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setActiveTab("catalog"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery("new arrivals"); setActiveTab("catalog"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery("best sellers"); setActiveTab("catalog"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory("Bridal Blouses"); setSearchQuery(""); setActiveTab("catalog"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Bridal Collection
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("style-advisor"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Custom Blouse Design
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("wishlist"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("cart"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Cart
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("contact-us"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-wide text-gray-900 dark:text-white uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => { setActiveTab("account"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  My Account
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("account"); setAccountSubTab("orders"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("legal-shipping"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("legal-refund"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("faqs"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("help-center"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("contact-us"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-wide text-gray-900 dark:text-white uppercase">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => { setActiveTab("legal-privacy"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("legal-terms"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("legal-cookie"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab("legal-disclaimer"); }} className="text-gray-500 transition-colors hover:text-gold-500 dark:text-gray-400 cursor-pointer">
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Info & Follow Us */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold tracking-wide text-gray-900 dark:text-white uppercase">
              Contact & Follow Us
            </h4>
            <div className="space-y-3 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-emerald-500 shrink-0" />
                <button onClick={() => requireAuth(() => window.open(socialLinks.whatsapp, '_blank'))} className="hover:text-gold-500 hover:underline">
                  WhatsApp Support
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold-500 shrink-0" />
                <a href="mailto:nilanjanahatuya@gmail.com" className="hover:text-gold-500 hover:underline font-medium">
                  nilanjanahatuya@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold-500 shrink-0" />
                <a href="tel:+918509112927" className="hover:text-gold-500 hover:underline font-medium">
                  +91 85091 12927
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock size={14} className="text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-900 dark:text-white">Service Hours:</span>
                  <span>Sunday – Saturday</span>
                  <span className="block">10:30 AM – 8:00 PM (IST)</span>
                  <div className="mt-1">
                    <BusinessHoursBadge showTime={false} />
                  </div>
                </div>
              </div>
            </div>

            {/* Social media icons grid with tooltips */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Connect Socially</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => requireAuth(() => window.open(socialLinks.instagram, '_blank'))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gold-500 hover:text-white dark:bg-slate-900 dark:text-gray-400"
                  title="Follow on Instagram"
                >
                  <Instagram size={14} />
                </button>
                <button 
                  onClick={() => requireAuth(() => window.open(socialLinks.facebook, '_blank'))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gold-500 hover:text-white dark:bg-slate-900 dark:text-gray-400"
                  title="Like on Facebook"
                >
                  <Facebook size={14} />
                </button>
                <button 
                  onClick={() => requireAuth(() => window.open(socialLinks.pinterest, '_blank'))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gold-500 hover:text-white dark:bg-slate-900 dark:text-gray-400"
                  title="Pin on Pinterest"
                >
                  <Heart size={14} />
                </button>
                <button 
                  onClick={() => requireAuth(() => window.open(socialLinks.youtube, '_blank'))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gold-500 hover:text-white dark:bg-slate-900 dark:text-gray-400"
                  title="Watch on YouTube"
                >
                  <Sparkles size={14} />
                </button>
                <a 
                  href={socialLinks.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gold-500 hover:text-white dark:bg-slate-900 dark:text-gray-400"
                  title="Follow on X (Twitter)"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Packaging and Copywrite */}
        <div className="mt-8 border-t border-gray-200/60 pt-6 text-center dark:border-slate-900">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-[11px] text-gray-400">
            <p>
              © {new Date().getFullYear()} Blousia Boutique Pvt Ltd. All Rights Reserved. Designed to Drape Confidence. Dedicated email: <a href="mailto:nilanjanahatuya@gmail.com" className="hover:text-gold-500 font-sans">nilanjanahatuya@gmail.com</a>
            </p>
            <div className="flex items-center gap-1">
              <span>Made with premium dedication</span>
              <Heart size={10} className="fill-rose-500 text-rose-500" />
              <span>for Indian Fashion</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
