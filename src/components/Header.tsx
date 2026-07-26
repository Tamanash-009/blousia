/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { ShoppingBag, Heart, Search, User, Menu, X, Moon, Sun, Sparkles, BookOpen, Crown, HelpCircle, Phone, MessageSquare, Trash2, LogOut, MapPin, Package, Scissors, ShieldCheck, UserCheck, Lock, Instagram, Facebook, Youtube, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BusinessHoursBadge } from "./BusinessHoursBadge";

export const Header: React.FC = () => {
  const {
    products,
    cart,
    wishlist,
    isDarkMode,
    activeTab,
    setActiveTab,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    selectedCategory,
    setSelectedProduct,
    profile,
    toggleWishlist,
    isLoggedIn,
    setIsLoggedIn,
    setUserRole,
    accountSubTab,
    setAccountSubTab,
    socialLinks,
    requireAuth,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("blousia_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  const addToRecentSearches = (term: string) => {
    if (!term || !term.trim()) return;
    const sanitized = term.trim();
    const updated = [sanitized, ...recentSearches.filter(s => s !== sanitized)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("blousia_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (searchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [searchExpanded]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchExpanded(false);
        setSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Crown },
    { id: "catalog", label: "Boutique Catalog", icon: ShoppingBag },
    { id: "style-advisor", label: "AI Advisor", icon: Sparkles },
    { id: "ai-commerce-agent", label: "AI Commerce Studio", icon: Sparkles },
    { id: "blog", label: "Fashion Blog", icon: BookOpen },
  ];

  const drawerNavItems = [
    { id: "home", label: "Atelier Home", icon: Crown },
    { id: "catalog", label: "Boutique Catalog", icon: ShoppingBag },
    { id: "style-advisor", label: "AI Fashion Stylist", icon: Sparkles },
    { id: "ai-commerce-agent", label: "AI Commerce Agent Studio", icon: Sparkles },
    { id: "blog", label: "Latest Fashion Blog", icon: BookOpen },
    { id: "wishlist", label: "Saved Creations", icon: Heart },
    { id: "cart", label: "Shopping Bag", icon: ShoppingBag },
    { id: "account", label: "Profile & History", icon: User },
  ];

  const popularSearches = ["Bridal", "Silk Blouse", "Boat Neck", "Backless", "Mirror Work"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
    }
    setActiveTab("catalog");
    setSearchExpanded(false);
    setSearchFocused(false);
  };

  const selectPopularSearch = (term: string) => {
    setSearchQuery(term);
    addToRecentSearches(term);
    setActiveTab("catalog");
    setSearchExpanded(false);
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold-100 bg-white/85 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/85">
      <motion.div 
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        
        {/* Logo / Brand Heading */}
        <div 
          onClick={() => { setActiveTab("home"); setSelectedCategory("All"); setSearchQuery(""); }} 
          className="flex cursor-pointer flex-col justify-center select-none group mr-4"
        >
          <div className="flex items-center gap-1">
            <span className="font-serif text-2xl font-light tracking-[0.18em] text-gray-900 uppercase md:text-3xl dark:text-white transition-colors group-hover:text-gold-500">
              Blousia<span className="text-[10px] align-super font-sans">®</span>
            </span>
          </div>
          <p className="hidden font-sans text-[8px] tracking-[0.3em] text-gray-400 uppercase dark:text-gray-500 xs:block mt-0.5 transition-colors group-hover:text-gold-400/80">
            DESIGNED TO DRAPE CONFIDENCE
          </p>
        </div>

        {/* Desktop Navigation Links (Categories / Tabs) */}
        <nav className="hidden space-x-8 md:flex mr-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "catalog") setSelectedCategory("All");
                }}
                className={`relative flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.15em] transition-all duration-200 py-2.5 cursor-pointer ${
                  isActive
                    ? "text-gold-500 font-bold"
                    : "text-gray-600 hover:text-gold-500/75 dark:text-gray-300 dark:hover:text-gold-400/80"
                }`}
              >
                <Icon size={13} className="opacity-80" />
                {item.label}
                {isActive && (
                  <motion.span 
                    layoutId="headerActiveUnderline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gold-500 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Custom Search Overlay Container */}
        <AnimatePresence>
          {searchExpanded && (
            <>
              {/* Backdrop for click outside */}
              <div 
                className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs transition-opacity"
                onClick={() => {
                  setSearchExpanded(false);
                  setSearchFocused(false);
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute left-4 right-4 top-2 z-50 rounded-2xl border border-gray-150 bg-white/95 p-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 md:left-auto md:right-4 md:w-[480px] w-[calc(100%-2rem)]"
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      id="global-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      placeholder="Search exquisite designer blouses..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-4 pr-10 text-sm font-sans tracking-wide text-gray-900 transition-all placeholder:text-gray-400 focus:border-gold-400 focus:bg-white focus:ring-2 focus:ring-gold-100 focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-gray-100 dark:focus:border-gold-500 dark:focus:bg-slate-950"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500">
                      <Search size={16} />
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchFocused(false);
                    }}
                    className="rounded-xl border border-gray-150 p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-800 dark:text-gray-400 dark:hover:bg-slate-900 dark:hover:text-gray-200"
                    aria-label="Close search"
                  >
                    <X size={16} />
                  </button>
                </form>

                {/* Suggestions dropdown container inside the overlay */}
                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-slate-800 max-h-[350px] overflow-y-auto">
                  {searchQuery.trim().length > 0 ? (
                    <div>
                      <p className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500 mb-2">
                        <Sparkles size={11} className="text-gold-400" /> Matches in Boutique
                      </p>
                      <div className="space-y-1.5 pr-1">
                        {products
                          .filter(
                            (p) =>
                              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                setSelectedProduct(prod);
                                setActiveTab("catalog");
                                setSearchExpanded(false);
                                setSearchFocused(false);
                              }}
                              className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-gold-50/50 cursor-pointer transition-colors dark:hover:bg-gold-950/20 text-left"
                            >
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="h-10 w-10 rounded-lg object-cover border border-gray-100 dark:border-slate-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {prod.name}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {prod.category} · <span className="font-semibold text-gold-600 dark:text-gold-400">₹{prod.sellingPrice}</span>
                                </p>
                              </div>
                              <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                            </div>
                          ))}
                        {products.filter(
                          (p) =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="text-xs text-gray-400 italic py-4 text-center">No designer matches found.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentSearches.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500 mb-2">
                            <RefreshCw size={10} className="text-gold-400 animate-spin-slow" /> Recent Searches
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {recentSearches.map((term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => selectPopularSearch(term)}
                                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-sans text-gray-600 transition-colors hover:bg-gold-50 hover:text-gold-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-gold-950 dark:hover:text-gold-400 cursor-pointer"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500 mb-2">
                          <Sparkles size={11} className="text-gold-400" /> Trending Searches
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => selectPopularSearch(term)}
                              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-sans text-gray-600 transition-colors hover:bg-gold-50 hover:text-gold-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-gold-950 dark:hover:text-gold-400 cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Custom Search Trigger Button */}
          <button
            onClick={() => setSearchExpanded(true)}
            id="global-search-trigger-btn"
            aria-label="Search designer blouses"
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gold-500 dark:text-gray-300 dark:hover:bg-slate-900 cursor-pointer border border-gray-150 dark:border-slate-800"
          >
            <Search size={16} />
          </button>
          {/* Light/Dark Toggle Button */}
          <button
            onClick={toggleDarkMode}
            id="theme-toggle-btn"
            aria-label="Toggle visual theme"
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gold-500 dark:text-gray-300 dark:hover:bg-slate-900 cursor-pointer border border-gray-150 dark:border-slate-800"
          >
            {isDarkMode ? <Sun size={16} className="text-gold-400" /> : <Moon size={16} />}
          </button>

          {/* Direct Wishlist Trigger */}
          <button
            onClick={() => requireAuth(() => setActiveTab("wishlist"))}
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gold-500 dark:text-gray-300 dark:hover:bg-slate-900 cursor-pointer border border-gray-150 dark:border-slate-800"
            aria-label="Wishlist Portfolio"
          >
            <Heart size={16} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Direct Cart Trigger */}
          <button
            onClick={() => requireAuth(() => setActiveTab("cart"))}
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gold-500 dark:text-gray-300 dark:hover:bg-slate-900 cursor-pointer border border-gray-150 dark:border-slate-800"
            aria-label="Custom Shopping Bag"
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login Link */}
          <button
            onClick={() => requireAuth(() => setActiveTab("account"))}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-150 p-1 pr-3 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900 cursor-pointer text-gray-750 dark:text-gray-300 hover:border-gold-300 transition-all duration-150"
            aria-label="User Account"
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || "User"}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-gold-200"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-[10px] font-bold text-gold-500 ring-1 ring-gold-200 dark:bg-slate-800">
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={12} />}
              </div>
            )}
            <span className="text-[10px] font-bold tracking-wide max-w-[70px] truncate">
              {isLoggedIn ? (profile.name ? profile.name.split(" ")[0] : "Account") : "Sign In"}
            </span>
          </button>

          {/* Premium Hamburger Menu Button for Drawer Access */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            id="boutique-menu-hamburger-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-gray-150 bg-white dark:border-slate-800 dark:bg-slate-900 text-gray-700 dark:text-gray-300 transition-all duration-150 cursor-pointer active:scale-90 focus:outline-none relative"
          >
            <div className="relative flex flex-col gap-1 items-center justify-center w-5 h-5">
              <motion.div
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="h-[2px] w-4 bg-current rounded-full origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.div
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-[2px] w-4 bg-current rounded-full origin-center"
                transition={{ duration: 0.15 }}
              />
              <motion.div
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                className="h-[2px] w-4 bg-current rounded-full origin-center"
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Unified Atelier Flyout Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            {/* Backdrop with elegant blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Left sliding Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative z-10 w-[85vw] max-w-[420px] bg-white shadow-2xl dark:bg-slate-950 flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden border-r border-gray-100 dark:border-slate-900"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-150 p-4 pt-[calc(1rem+env(safe-area-inset-top))] pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))] dark:border-slate-900 shrink-0 bg-[#FCFBF8] dark:bg-slate-900">
                <div className="flex items-center gap-1.5">
                  <Crown size={18} className="text-gold-500 animate-pulse" />
                  <span className="font-serif font-bold tracking-widest text-gold-500 uppercase leading-none" style={{ fontSize: "clamp(14px, 4vw, 18px)" }}>
                    Blousia Atelier
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu drawer"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-850 dark:text-gray-400 cursor-pointer active:scale-90 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))] space-y-6 focus:outline-none scrollbar-thin">
                
                {/* Search Bar */}
                <div className="space-y-1.5 flex-shrink-0">
                  <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase block">Search Atelier Catalog</span>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setActiveTab("catalog");
                      setMenuOpen(false);
                    }} 
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Search designer blouses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 py-2.5 pl-4 pr-10 text-xs font-sans tracking-wide text-gray-900 transition-all placeholder:text-gray-400 focus:border-gold-300 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-gray-100"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-500 hover:text-gold-600">
                      <Search size={14} />
                    </button>
                  </form>
                </div>

                {/* 1. Shop Section */}
                <div className="space-y-2 flex-shrink-0">
                  <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase block">Shop</span>
                  <div className="space-y-1.5">
                    {/* Home Link */}
                    <button
                      onClick={() => {
                        setActiveTab("home");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "home"
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Crown size={16} className={activeTab === "home" ? "text-gold-600 dark:text-gold-400" : "text-gold-500"} />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Home</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "home" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Shop Link */}
                    <button
                      onClick={() => {
                        setActiveTab("catalog");
                        setSelectedCategory("All");
                        setSearchQuery("");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "catalog" && selectedCategory === "All" && searchQuery === ""
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingBag size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Shop</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "catalog" && selectedCategory === "All" && searchQuery === "" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Categories Link (Expandable) */}
                    <div className="flex flex-col flex-shrink-0">
                      <button
                        onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                        className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                          categoriesExpanded
                            ? "bg-gold-50/30 text-gold-600 dark:bg-gold-950/10 dark:text-gold-400 border-gold-200/20"
                            : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Menu size={16} className="text-gold-500" />
                          <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Categories</span>
                        </span>
                        <ChevronRight size={14} className={`text-gold-500 transition-transform duration-200 ${categoriesExpanded ? "rotate-90" : ""}`} />
                      </button>

                      {/* Expandable Category Items */}
                      <AnimatePresence>
                        {categoriesExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 pr-1 mt-1 space-y-1.5 bg-gray-50/30 dark:bg-slate-900/20 py-2 rounded-xl border border-gray-100/50 dark:border-slate-900/50 flex flex-col flex-shrink-0"
                          >
                            {[
                              "Bridal Blouses",
                              "Silk Blouses",
                              "Cotton Blouses",
                              "Designer Blouses",
                              "Sleeveless",
                              "Puff Sleeve",
                              "Mirror Work",
                              "Boat Neck",
                              "Linen",
                            ].map((catName) => {
                              const isSubActive = selectedCategory === catName && activeTab === "catalog";
                              return (
                                <button
                                  key={catName}
                                  onClick={() => {
                                    setSelectedCategory(catName);
                                    setSearchQuery("");
                                    setActiveTab("catalog");
                                    setMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2 text-[11px] sm:text-xs font-medium tracking-wide transition-all text-left rounded-lg min-h-[50px] flex-shrink-0 ${
                                    isSubActive
                                      ? "bg-gold-50/60 text-gold-600 dark:bg-gold-950/30 dark:text-gold-400 font-bold"
                                      : "text-gray-600 hover:text-gold-500 hover:bg-gold-50/10 dark:text-gray-400 dark:hover:text-gold-400"
                                  }`}
                                >
                                  <span style={{ fontSize: "clamp(11px, 2.8vw, 12px)" }}>{catName}</span>
                                  <ChevronRight size={12} className={isSubActive ? "text-gold-500" : "text-gray-300"} />
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* New Arrivals Link */}
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("new arrivals");
                        setActiveTab("catalog");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "catalog" && searchQuery === "new arrivals"
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>New Arrivals</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "catalog" && searchQuery === "new arrivals" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Best Sellers Link */}
                    <button
                      onClick={() => {
                        setSelectedCategory("All");
                        setSearchQuery("best sellers");
                        setActiveTab("catalog");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "catalog" && searchQuery === "best sellers"
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Crown size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Best Sellers</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "catalog" && searchQuery === "best sellers" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Bridal Collection Link */}
                    <button
                      onClick={() => {
                        setSelectedCategory("Bridal Blouses");
                        setSearchQuery("");
                        setActiveTab("catalog");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "catalog" && selectedCategory === "Bridal Blouses" && searchQuery === ""
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Sparkles size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Bridal Collection</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "catalog" && selectedCategory === "Bridal Blouses" && searchQuery === "" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Designer Collection Link */}
                    <button
                      onClick={() => {
                        setSelectedCategory("Designer Blouses");
                        setSearchQuery("");
                        setActiveTab("catalog");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "catalog" && selectedCategory === "Designer Blouses" && searchQuery === ""
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Crown size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Designer Collection</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "catalog" && selectedCategory === "Designer Blouses" && searchQuery === "" ? "text-gold-500" : "text-gray-400"} />
                    </button>

                    {/* Customize Your Blouse Link */}
                    <button
                      onClick={() => {
                        setActiveTab("style-advisor");
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                        activeTab === "style-advisor"
                          ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                          : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Scissors size={16} className="text-gold-500" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Customize Your Blouse</span>
                      </span>
                      <ChevronRight size={14} className={activeTab === "style-advisor" ? "text-gold-500" : "text-gray-400"} />
                    </button>
                  </div>
                </div>

                {/* 2. User Section */}
                <div className="space-y-2 flex-shrink-0">
                  <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase block">User</span>
                  <div className="space-y-1.5">
                    {!isLoggedIn ? (
                      /* Logged Out view: Login / Sign Up button */
                      <button
                        onClick={() => {
                          setActiveTab("account");
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl border border-gold-200 bg-gold-500/10 hover:bg-gold-500/20 px-4 py-3.5 text-xs font-semibold tracking-wide text-gold-600 transition-all min-h-[56px] flex-shrink-0 cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <UserCheck size={16} className="text-gold-500" />
                          <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Login / Sign Up</span>
                        </span>
                        <ChevronRight size={14} className="text-gold-500" />
                      </button>
                    ) : (
                      /* Logged In sub-menu options */
                      <>
                        {/* Profile Info Summary Card */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 mb-2 dark:border-slate-900 dark:bg-slate-900/30 flex items-center gap-3 shrink-0">
                          {profile.avatar ? (
                            <img
                              src={profile.avatar}
                              alt={profile.name || "User"}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-gold-200 shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-[14px] font-bold text-gold-500 ring-2 ring-gold-200 dark:bg-slate-800">
                              {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={16} />}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="text-[8px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest block">
                              Atelier Member
                            </span>
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate leading-tight">
                              {profile.name || "User"}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {profile.email || "No email provided"}
                            </p>
                          </div>
                        </div>

                        {/* My Profile */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("security");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "account" && accountSubTab === "security"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <User size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>My Profile</span>
                          </span>
                          <ChevronRight size={14} className={activeTab === "account" && accountSubTab === "security" ? "text-gold-500" : "text-gray-400"} />
                        </button>

                        {/* My Orders */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("orders");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "account" && accountSubTab === "orders"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Package size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>My Orders</span>
                          </span>
                          <ChevronRight size={14} className={activeTab === "account" && accountSubTab === "orders" ? "text-gold-500" : "text-gray-400"} />
                        </button>

                        {/* Wishlist */}
                        <button
                          onClick={() => {
                            setActiveTab("wishlist");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "wishlist"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Heart size={16} className="text-rose-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Wishlist</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="rounded-full bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                              {wishlistCount}
                            </span>
                            <ChevronRight size={14} className={activeTab === "wishlist" ? "text-gold-500" : "text-gray-400"} />
                          </span>
                        </button>

                        {/* Cart */}
                        <button
                          onClick={() => {
                            setActiveTab("cart");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "cart"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <ShoppingBag size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Cart</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="rounded-full bg-gold-50 dark:bg-gold-950/40 px-2 py-0.5 text-[9px] font-bold text-gold-600 dark:text-gold-400 border border-gold-100 dark:border-gold-900/40">
                              {cartCount}
                            </span>
                            <ChevronRight size={14} className={activeTab === "cart" ? "text-gold-500" : "text-gray-400"} />
                          </span>
                        </button>

                        {/* Notifications */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("security");
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border border-transparent min-h-[56px] flex-shrink-0"
                        >
                          <span className="flex items-center gap-3">
                            <User size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Notifications</span>
                          </span>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>

                        {/* Saved Addresses */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("addresses");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "account" && accountSubTab === "addresses"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <MapPin size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Saved Addresses</span>
                          </span>
                          <ChevronRight size={14} className={activeTab === "account" && accountSubTab === "addresses" ? "text-gold-500" : "text-gray-400"} />
                        </button>

                        {/* Custom Design Requests */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("custom-requests");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "account" && accountSubTab === "custom-requests"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Scissors size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Custom Design Requests</span>
                          </span>
                          <ChevronRight size={14} className={activeTab === "account" && accountSubTab === "custom-requests" ? "text-gold-500" : "text-gray-400"} />
                        </button>

                        {/* Account Settings */}
                        <button
                          onClick={() => {
                            setActiveTab("account");
                            setAccountSubTab("security");
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            activeTab === "account" && accountSubTab === "security"
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <User size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Account Settings</span>
                          </span>
                          <ChevronRight size={14} className={activeTab === "account" && accountSubTab === "security" ? "text-gold-500" : "text-gray-400"} />
                        </button>

                        {/* Logout */}
                        <button
                          onClick={() => {
                            setIsLoggedIn(false);
                            setUserRole("Customer");
                            setActiveTab("home");
                            setMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between rounded-xl border border-transparent bg-rose-50 hover:bg-rose-100/80 px-4 py-3.5 text-xs font-semibold text-rose-600 transition-all dark:bg-rose-950/20 dark:text-rose-400 min-h-[56px] flex-shrink-0 cursor-pointer"
                        >
                          <span className="flex items-center gap-3">
                            <LogOut size={16} className="text-rose-600 dark:text-rose-400" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Logout</span>
                          </span>
                          <ChevronRight size={14} className="text-rose-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Support Section */}
                <div className="space-y-2 flex-shrink-0">
                  <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase block">Support</span>
                  <div className="space-y-1.5">
                    {[
                      { label: "About Us", id: "about-us", icon: BookOpen },
                      { label: "Contact Us", id: "contact-us", icon: Phone },
                      { label: "FAQs", id: "faqs", icon: HelpCircle },
                      { label: "Shipping Policy", id: "legal-shipping", icon: Package },
                      { label: "Return Policy", id: "legal-refund", icon: RefreshCw },
                      { label: "Privacy Policy", id: "legal-privacy", icon: ShieldCheck },
                      { label: "Terms & Conditions", id: "legal-terms", icon: ShieldCheck },
                    ].map((supportItem) => {
                      const Icon = supportItem.icon;
                      const isActive = activeTab === supportItem.id;
                      return (
                        <button
                          key={supportItem.id}
                          onClick={() => {
                            setActiveTab(supportItem.id);
                            setMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-all text-left border min-h-[56px] flex-shrink-0 ${
                            isActive
                              ? "bg-gold-50/70 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 border-gold-200/50"
                              : "bg-gray-50/40 text-gray-700 hover:bg-gold-50/10 dark:bg-slate-900/40 dark:text-gray-300 dark:hover:bg-slate-900 border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon size={16} className="text-gold-500" />
                            <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>{supportItem.label}</span>
                          </span>
                          <ChevronRight size={14} className={isActive ? "text-gold-500" : "text-gray-400"} />
                        </button>
                      );
                    })}

                    {/* Support Concierge Button */}
                    <button
                      onClick={() => {
                        setShowSupportModal(true);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 min-h-[56px] flex-shrink-0 cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Phone size={16} className="text-gold-400 animate-bounce" />
                        <span style={{ fontSize: "clamp(12px, 3.2vw, 13px)" }}>Live Atelier Concierge</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[8px] bg-gold-500 text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest scale-90">Support</span>
                        <ChevronRight size={14} className="text-gold-400" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* 4. Social Section */}
                <div className="space-y-2 flex-shrink-0">
                  <span className="text-[9px] font-bold tracking-widest text-gold-500 uppercase block">Social Channels</span>
                  <div className="flex items-center justify-around py-3 bg-[#FCFBF8] dark:bg-slate-900/50 border border-gold-200/10 rounded-xl">
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      title="Follow on Instagram"
                      className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold-500 dark:text-gray-400"
                    >
                      <Instagram size={18} className="text-amber-600" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      title="Follow on Facebook"
                      className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold-500 dark:text-gray-400"
                    >
                      <Facebook size={18} className="text-blue-600" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href={socialLinks.pinterest}
                      target="_blank"
                      rel="noreferrer"
                      title="Follow on Pinterest"
                      className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold-500 dark:text-gray-400"
                    >
                      <svg className="w-[18px] h-[18px] text-red-600 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.35-.7-.35-1.74c0-1.63.95-2.85 2.13-2.85 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.88-.27 1.17.6 2.12 1.74 2.12 2.1 0 3.7-2.2 3.7-5.38 0-2.8-2-4.77-4.9-4.77-3.34 0-5.3 2.5-5.3 5.1 0 1 .4 2.1.86 2.65.1.1.1.2.06.33-.1.37-.3.1-.38-.05-1-1.18-1.55-3.3-1.55-5.3 0-4.3 3.1-8.25 9-8.25 4.7 0 8.37 3.37 8.37 7.85 0 4.68-2.95 8.45-7.05 8.45-1.37 0-2.67-.7-3.1-.15-.4 1.5-1.4 5.5-1.4 5.5-.5 1.94-1.9 4.38-2.86 5.86 1.13.35 2.3.54 3.5.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                      </svg>
                      <span>Pinterest</span>
                    </a>
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      title="Subscribe on YouTube"
                      className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold-500 dark:text-gray-400"
                    >
                      <Youtube size={18} className="text-red-500" />
                      <span>YouTube</span>
                    </a>
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp Chat"
                      className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gold-500 dark:text-gray-400"
                    >
                      <MessageSquare size={18} className="text-green-500" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="border-t border-gray-150 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))] bg-[#F9F8F6] dark:bg-slate-900 shrink-0 text-center space-y-0.5">
                <p className="font-serif text-[10px] font-bold text-gold-500 uppercase tracking-widest">BLOUSIA® BOUTIQUE</p>
                <p className="text-[8px] font-sans text-gray-400 tracking-[0.2em] uppercase">
                  Designed to drape confidence
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Support Modal Overlay */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all dark:border-slate-900 dark:bg-slate-950">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-50 px-6 py-4 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-gold-500" size={18} />
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Boutique Concierge & Support
                </h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Welcome to the Blousia® Concierge. Our head designers and support staff are here to assist with size calibrations, fabric choices, or order statuses.
              </p>

              {/* Quick Support Channels */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/918509112927?text=Hello%20Blousia%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20your%20designer%20blouses."
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50/20 p-3 text-center text-green-700 transition-all hover:bg-green-50 dark:border-green-500/30 dark:bg-green-950/10 dark:text-green-400"
                >
                  <MessageSquare size={20} className="text-green-500" />
                  <span className="font-bold">WhatsApp Support</span>
                  <span className="text-[9px] text-gray-400 font-normal">Immediate Response</span>
                  <span className="text-[8px] text-green-600 font-bold bg-green-100/50 px-1.5 py-0.5 rounded">IST Hours: 10:30 AM - 8:00 PM</span>
                </a>

                <a
                  href="mailto:nilanjanahatuya@gmail.com?subject=Blousia Support Inquiry"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gold-200 bg-gold-50/20 p-3 text-center text-gold-700 transition-all hover:bg-gold-50 dark:border-gold-500/30 dark:bg-gold-950/10 dark:text-gold-400"
                >
                  <Phone size={20} className="text-gold-600 dark:text-gold-400" />
                  <span className="font-bold">Email Support Desk</span>
                  <span className="text-[9px] text-gray-400 font-normal">nilanjanahatuya@gmail.com</span>
                </a>
              </div>

              {/* FAQ Accordion */}
              <div className="border-t border-gray-100 pt-4 dark:border-slate-900 space-y-2.5">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Frequently Asked:</p>
                <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-slate-900">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">How long does custom order delivery take?</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Our tailors craft and ship bespoke orders within 7 to 10 business days.</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 dark:bg-slate-900">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Can I request modifications post order?</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Yes, write to nilanjanahatuya@gmail.com or WhatsApp us within 24 hours of ordering.</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full rounded-xl bg-gold-500 py-2.5 text-center font-semibold text-white transition-all hover:bg-gold-600 cursor-pointer"
              >
                Close Support Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
