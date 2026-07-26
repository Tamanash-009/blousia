/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { ProductCard } from "./components/ProductCard";
import { ProductDetails } from "./components/ProductDetails";
import { QuickViewModal } from "./components/QuickViewModal";
import { CartView } from "./components/CartView";
import { UserAccount } from "./components/UserAccount";
import { AdminPanel } from "./components/AdminPanel";
import { AIChatBot } from "./components/AIChatBot";
import { FashionBlog } from "./components/FashionBlog";
import { StyleAdvisor } from "./components/StyleAdvisor";
import { CookieBanner } from "./components/CookieBanner";
import { SpeedDialSupport } from "./components/SpeedDialSupport";
import { GoogleBusinessReviews } from "./components/GoogleBusinessReviews";
import { SplashScreen } from "./components/SplashScreen";
import { Onboarding } from "./components/Onboarding";
import { Authentication } from "./components/Authentication";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SEO } from "./components/SEO";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Sparkles, Heart, ShieldAlert, BookOpen, Star, RefreshCw, SlidersHorizontal, Filter, RotateCcw, MapPin, Phone, Mail, Clock, Compass, ExternalLink, MessageSquare, X } from "lucide-react";

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    quickViewProduct,
    setQuickViewProduct,
    wishlist,
    showAuthModal,
    setShowAuthModal,
    onAuthSuccess,
  } = useApp();

  // Advanced Sidebar Filter states
  const [maxPriceFilter, setMaxPriceFilter] = React.useState<number>(8500);
  const [selectedFabrics, setSelectedFabrics] = React.useState<string[]>([]);
  const [selectedEmbroideries, setSelectedEmbroideries] = React.useState<string[]>([]);
  const [catalogSortBy, setCatalogSortBy] = React.useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = React.useState<boolean>(false);

  // Global Scroll Restoration for Route Transitions
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activeTab, selectedProduct]);

  // Helper for classifying fabric
  const getFabricType = (p: typeof products[0]) => {
    const f = p.specifications.fabric.toLowerCase();
    if (f.includes("silk")) return "Silk";
    if (f.includes("cotton")) return "Cotton";
    return "Other";
  };

  // Helper for classifying embroidery
  const getEmbroideryStyle = (p: typeof products[0]) => {
    const name = p.name.toLowerCase();
    const desc = p.description.toLowerCase();
    const fab = p.specifications.fabric.toLowerCase();
    if (
      name.includes("zardozi") ||
      desc.includes("zardozi") ||
      name.includes("zari") ||
      desc.includes("zari") ||
      fab.includes("brocade") ||
      name.includes("brocade")
    ) {
      return "Zari & Zardozi";
    }
    if (
      name.includes("sequin") ||
      desc.includes("sequin") ||
      name.includes("mirror") ||
      desc.includes("mirror") ||
      name.includes("cutdana") ||
      desc.includes("cutdana")
    ) {
      return "Sequin & Mirror Work";
    }
    if (
      name.includes("handblock") ||
      desc.includes("handblock") ||
      name.includes("block print") ||
      desc.includes("kalamkari") ||
      name.includes("printed")
    ) {
      return "Handblock & Prints";
    }
    return "Minimalist & Plain";
  };

  // Filter products by search, category, price range, fabric type, and embroidery style
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specifications.fabric.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    const matchesPrice = p.sellingPrice <= maxPriceFilter;

    const matchesFabric =
      selectedFabrics.length === 0 || selectedFabrics.includes(getFabricType(p));

    const matchesEmbroidery =
      selectedEmbroideries.length === 0 || selectedEmbroideries.includes(getEmbroideryStyle(p));

    return matchesSearch && matchesCategory && matchesPrice && matchesFabric && matchesEmbroidery;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (catalogSortBy === "price-low-high") {
      return a.sellingPrice - b.sellingPrice;
    }
    if (catalogSortBy === "price-high-low") {
      return b.sellingPrice - a.sellingPrice;
    }
    if (catalogSortBy === "rating-high-low") {
      return b.ratings - a.ratings;
    }
    return 0; // "featured" maintains database order
  });

  const renderActiveView = () => {
    // Handle standard tabs
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-16 pb-16 animate-fadeIn">
            <HeroSection />

            {/* Curated Best Sellers Grid */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between border-b border-gray-100 pb-5 dark:border-slate-900">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Premium Curations</span>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-gray-950 dark:text-white">Our Masterpiece Best Sellers</h2>
                </div>
                <button
                  onClick={() => { setSelectedCategory("All"); setActiveTab("catalog"); }}
                  className="text-xs font-semibold text-gold-500 hover:text-gold-600 underline"
                >
                  View full catalog
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products
                  .filter((p) => p.isBestSeller)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>

            {/* Curated New Arrivals Block */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between border-b border-gray-100 pb-5 dark:border-slate-900">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Just Styled</span>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-gray-950 dark:text-white">New Arrivals Fresh off the Sketchbook</h2>
                </div>
                <button
                  onClick={() => { setSelectedCategory("All"); setActiveTab("catalog"); }}
                  className="text-xs font-semibold text-gold-500 hover:text-gold-600 underline"
                >
                  Browse all
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products
                  .filter((p) => p.isNewArrival)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>

            {/* Google Business Reviews Social Proof Section */}
            <GoogleBusinessReviews />
          </div>
        );

      case "catalog":
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
            {/* Top Title Bar */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-gray-100 pb-5 mb-8 dark:border-slate-900 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Studio Catalog</span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-gray-950 dark:text-white">
                  {selectedCategory === "All" ? "The Bespoke Portfolio" : `${selectedCategory} Collection`}
                </h2>
                {searchQuery && (
                  <p className="mt-1 text-xs text-gray-400">Search results for "{searchQuery}" ({filteredProducts.length} items found)</p>
                )}
              </div>

              {/* Quick Category Select inside Catalog */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-[10px]">
                {["All", "Bridal Blouses", "Silk Blouses", "Cotton Blouses", "Designer Blouses"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 font-semibold uppercase tracking-widest transition-all border rounded-none shrink-0 ${
                      (cat === "All" && selectedCategory === "All") || selectedCategory === cat
                        ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                        : "border-gray-200 bg-white text-gray-500 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    {cat === "All" ? "All Designs" : cat.replace(" Blouses", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Layout: Filter Sidebar Left, Products Right */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Mobile Filter Toggle & Sort Header */}
              <div className="lg:hidden w-full flex items-center justify-between p-3 border border-gray-100 bg-gray-50 dark:bg-slate-900/40 dark:border-slate-800 rounded-none mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300"
                >
                  <SlidersHorizontal size={14} className="text-gold-500" />
                  {showMobileFilters ? "Hide Sidebar Filters" : "Show Sidebar Filters"}
                </button>
                
                {/* Mobile Sort */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Sort:</span>
                  <select
                    value={catalogSortBy}
                    onChange={(e) => setCatalogSortBy(e.target.value)}
                    className="bg-transparent border-none text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low-high">Price: Low-High</option>
                    <option value="price-high-low">Price: High-Low</option>
                    <option value="rating-high-low">Rating</option>
                  </select>
                </div>
              </div>

              {/* Sidebar filter column */}
              <div className={`w-full lg:w-64 shrink-0 space-y-6 lg:border-r lg:border-gray-100 lg:pr-6 dark:border-slate-900 ${showMobileFilters ? "block" : "hidden lg:block"} animate-fadeIn`}>
                
                {/* Reset header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-slate-900">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter size={13} className="text-gold-500" />
                    Refine Selection
                  </span>
                  {(maxPriceFilter !== 8500 || selectedFabrics.length > 0 || selectedEmbroideries.length > 0 || catalogSortBy !== "featured") && (
                    <button
                      onClick={() => {
                        setMaxPriceFilter(8500);
                        setSelectedFabrics([]);
                        setSelectedEmbroideries([]);
                        setCatalogSortBy("featured");
                      }}
                      className="text-[9px] font-bold text-gold-500 hover:text-gold-600 uppercase tracking-widest flex items-center gap-1"
                    >
                      <RotateCcw size={10} />
                      Reset
                    </button>
                  )}
                </div>

                {/* Desktop Sort Dropdown */}
                <div className="hidden lg:block space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sort By</label>
                  <select
                    value={catalogSortBy}
                    onChange={(e) => setCatalogSortBy(e.target.value)}
                    className="w-full border border-gray-200 p-2 text-xs font-semibold text-gray-700 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-300 focus:outline-none focus:border-gold-500 rounded-none"
                  >
                    <option value="featured">Featured Curations</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating-high-low">Customer Rating</option>
                  </select>
                </div>

                {/* 1. Price Range Selector */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price Limit</label>
                    <span className="font-mono text-xs font-bold text-gold-500">₹{maxPriceFilter.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="8500"
                    step="250"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-500 dark:bg-slate-800"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>Min: ₹1,000</span>
                    <span>Max: ₹8,500</span>
                  </div>

                  {/* Price Brackets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: "Under ₹2,000", value: 2000 },
                      { label: "Under ₹4,000", value: 4000 },
                      { label: "Under ₹6,000", value: 6000 }
                    ].map((bracket) => (
                      <button
                        key={bracket.label}
                        onClick={() => setMaxPriceFilter(bracket.value)}
                        className={`px-2 py-1 text-[9px] font-semibold border transition-all ${
                          maxPriceFilter === bracket.value
                            ? "bg-gold-500 text-white border-gold-500"
                            : "bg-white text-gray-500 border-gray-200 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-400 hover:border-gold-300"
                        }`}
                      >
                        {bracket.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fabric Type (Silk / Cotton) */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Fabric Type</label>
                  <div className="space-y-2">
                    {[
                      { id: "Silk", label: "Authentic Silk" },
                      { id: "Cotton", label: "Premium Cotton" },
                      { id: "Other", label: "Other Luxury Textiles" }
                    ].map((fabric) => {
                      const isChecked = selectedFabrics.includes(fabric.id);
                      return (
                        <label
                          key={fabric.id}
                          className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 cursor-pointer group select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedFabrics(selectedFabrics.filter((f) => f !== fabric.id));
                              } else {
                                setSelectedFabrics([...selectedFabrics, fabric.id]);
                              }
                            }}
                            className="h-3.5 w-3.5 rounded-none border-gray-300 text-gold-500 focus:ring-gold-400 accent-gold-500"
                          />
                          <span className={`transition-colors ${isChecked ? "text-gold-500 font-semibold" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}>
                            {fabric.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Embroidery Style */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Embroidery Style</label>
                  <div className="space-y-2">
                    {[
                      { id: "Zari & Zardozi", label: "Zari & Heavy Zardozi" },
                      { id: "Sequin & Mirror Work", label: "Sequins & Mirror Work" },
                      { id: "Handblock & Prints", label: "Kalamkari & Handblock" },
                      { id: "Minimalist & Plain", label: "Minimalist / Solid Base" }
                    ].map((emb) => {
                      const isChecked = selectedEmbroideries.includes(emb.id);
                      return (
                        <label
                          key={emb.id}
                          className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 cursor-pointer group select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedEmbroideries(selectedEmbroideries.filter((e) => e !== emb.id));
                              } else {
                                setSelectedEmbroideries([...selectedEmbroideries, emb.id]);
                              }
                            }}
                            className="h-3.5 w-3.5 rounded-none border-gray-300 text-gold-500 focus:ring-gold-400 accent-gold-500"
                          />
                          <span className={`transition-colors ${isChecked ? "text-gold-500 font-semibold" : "group-hover:text-gray-900 dark:group-hover:text-white"}`}>
                            {emb.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Active Count status indicator */}
                <div className="pt-2 border-t border-gray-100 dark:border-slate-900">
                  <p className="text-[10px] text-gray-400 leading-normal">
                    Showing <span className="font-bold text-gray-700 dark:text-gray-200">{sortedProducts.length}</span> of {products.length} exquisite drapes matching filters.
                  </p>
                </div>
              </div>

              {/* Products Area */}
              <div className="flex-1 w-full">
                {sortedProducts.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-gray-100 dark:border-slate-900 rounded-none px-4">
                    <span className="text-gray-300 block text-3xl font-serif">No Matches Found</span>
                    <p className="mt-2 text-xs text-gray-400 max-w-md mx-auto">
                      Adjust your price slider, fabric selections, or embroidery styles above to explore more tailored boutique pieces, or chat with our AI Stylist.
                    </p>
                    <button
                      onClick={() => {
                        setMaxPriceFilter(8500);
                        setSelectedFabrics([]);
                        setSelectedEmbroideries([]);
                        setCatalogSortBy("featured");
                      }}
                      className="mt-6 border border-gray-900 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all rounded-none"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-3">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        );

      case "wishlist":
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-gray-900 border-b border-gray-100 pb-5 mb-8 dark:text-white dark:border-slate-900">
              Your Wishlist Favorites ({wishlist.length})
            </h2>

            {wishlist.length === 0 ? (
              <div className="py-20 text-center">
                <Heart size={44} className="mx-auto text-gray-300" />
                <h3 className="mt-4 font-serif text-lg font-bold text-gray-900 dark:text-white">Wishlist is empty</h3>
                <p className="mt-1 text-xs text-gray-400">Keep track of elegant blouse tailoring designs you love.</p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="mt-6 rounded-xl bg-gold-400 px-6 py-3 text-xs font-semibold text-white hover:bg-gold-500"
                >
                  Explore catalogs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {wishlist.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        );

      case "cart":
        return <CartView />;

      case "account":
        return <UserAccount />;

      case "admin":
        return <AdminPanel />;

      case "blog":
        return <FashionBlog />;

      case "style-advisor":
        return <StyleAdvisor />;

      // Fully customized production-ready Legal documents
      case "legal-privacy":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy & Client Data Protection</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026 | Revision 4.1</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Information We Securely Collect</p>
                <p>At Blousia®, your sartorial and personal data are treated with utmost confidentiality. We collect standard identity elements (including name, contact parameters, and shipping coordinates) along with customized measurement metrics (chest size, padded preferences, sleeve specifications, and alteration histories) to ensure immaculate tailoring precision.</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. SSL & Tokenization Protections</p>
                <p>All financial transactions are tokenized via enterprise-grade secured payment gateways (such as Razorpay, Stripe, and secure UPI channels). Blousia® does not store, review, or persist raw credit/debit card numbers, CVV codes, or bank login credentials on our servers, aligning strictly with OWASP security best practices.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">3. Cookies and Choice</p>
                <p>We leverage small state files on your browser to hold active carts, wishlist additions, local theme settings, and smart tailoring suggestions from our AI assistant. You may choose to disable cookies at any time from your device browser settings, though it may alter active session persistence.</p>
              </div>
            </div>
          </div>
        );

      case "legal-terms":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Terms of Bespoke Service</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026 | Revision 3.0</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Handcrafted Variations</p>
                <p>Because each garment is handcrafted by senior weavers utilizing traditional Indian silks, flax, and cotton looms, minor variations in thread count, zari alignments, and sequin placements are hallmarks of genuine luxury craftsmanship rather than manufacturing defects.</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. Measurement Warranties</p>
                <p>Customers are responsible for selecting the chest size that aligns with their personal dimensions. To accommodate slight adjustments, Blousia® incorporates a standard 2-inch expandable inner stitch margin on all blouses.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">3. Intellectual Property Rights</p>
                <p>All designs, high-definition photography, vector assets, and bespoke templates featured on the Blousia® platform are the exclusive property of Blousia Boutique Private Limited and are protected by global trademark laws.</p>
              </div>
            </div>
          </div>
        );

      case "legal-shipping":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Boutique Shipping & Delivery Policy</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Tailoring & Fulfillment Timelines</p>
                <p>Since Blousia® operates as a premium couture house rather than a fast-fashion house, please allow 1 to 2 business days for our designers to complete double-stitching and padding fitments. Delivery transit times range from 2 days (metros) to 5 days (remote locations).</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. Secure Wooden Crate Packaging</p>
                <p>To avoid folds, creases, or embroidery damage during transit, all orders are dispatched in custom luxury gift packaging, sealed in dustproof, eco-friendly garment cases.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">3. Shipping Surcharges</p>
                <p>We provide complimentary secure express shipping for all domestic orders within India. International shipments may attract standard customs duties and regional tax levies depending on destination laws.</p>
              </div>
            </div>
          </div>
        );

      case "legal-refund":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Easy Returns & Exchanges Guidelines</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Hassle-Free 7-Day Window</p>
                <p>If you are not entirely satisfied with the drape fit, textile feel, or embroidery weight of your blouse, you can initiate a return or size exchange directly from your User Account portal within 7 days of delivery receipt.</p>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. Condition & Pick-Up</p>
                <p>Returned items must remain unworn with original tags attached and returned inside the boutique packaging. Our priority couriers will perform doorstep verification and reverse pick-up within 48 hours of your request.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">3. Custom Tailoring Exemptions</p>
                <p>Products that have been custom modified, customized with personalized fabrics, or stitched to customer-specified custom sizes from the bespoke customizer cannot be returned, but they qualify for our complimentary resizing program.</p>
              </div>
            </div>
          </div>
        );

      case "legal-cookie":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Cookie & Personal Preference Settings</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Why We Use Cookies</p>
                <p>We use localized browser state and cookie parameters to persist your dark mode settings, retain products inside your shopping bag, save design wishlist picks, and tailor individual styling insights from our AI fashion stylist consultant.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. Controlling Your Choice</p>
                <p>You can adjust, revoke, or toggle cookie acceptance directly via the cookie preference banner or through your browser control dashboard at any time.</p>
              </div>
            </div>
          </div>
        );

      case "legal-disclaimer":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <span className="rounded bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest dark:bg-slate-900 dark:text-gray-400">Legal Standard</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-gray-900 dark:text-white">Legal Disclaimer & Disclosures</h2>
            <p className="mt-1.5 font-mono text-[10px] text-gray-400">Effective Date: June 28, 2026</p>
            
            <div className="mt-8 font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">1. Thread Alignments and Dye Variations</p>
                <p>Blousia® specializes in highly luxury, handcrafted products. Since we utilize organic dyes and handloom silk yarns, minor inconsistencies in color tone, dye density, or zari thread alignment are completely normal and represent authentic handwork.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">2. Screen Color Calibration</p>
                <p>Actual fabric colors may vary slightly depending on digital display device specifications, brightness alignments, or screen color calibrations. We strive to represent true color depths in our raw, unedited high-definition catalog images.</p>
              </div>
            </div>
          </div>
        );

      case "brand-story":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">The Artisan Legacy</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">The Legend of Blousia®</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">TRADITION MEETING LUXURY DESIGN</p>
            </div>

            <div className="font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-4">
              <p>
                Blousia® began in a small atelier on Colaba Causeway, fueled by a simple yet bold ambition: <strong>to revolutionize Indian blouse tailoring into an elite global luxury artform</strong>. For generations, the blouse was treated as an afterthought, an accessory to the saree. We chose to change that narrative.
              </p>
              <p>
                We put the blouse at the center of the fashion sketchbook. By partnering with senior master karigars, we combined centuries-old zari embroideries with mathematically precise contemporary structures to create garments that drape like second skin.
              </p>
              <p>
                Today, Blousia® is synonymous with high-end luxury Indian fashion, serving a discerning clientele who appreciate the pristine weights, organic silk drapes, and precise double-stitching of a tailored masterpiece.
              </p>
            </div>
          </div>
        );

      case "about-us":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">The Atelier Legacy</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">About Blousia® Couture</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">ESTABLISHED 2026 | COUTURE HANDCRAFT</p>
            </div>

            <div className="font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-4">
              <p>
                Welcome to <strong className="text-gray-900 dark:text-white">Blousia®</strong>, where we specialize exclusively in high-end women's blouses, curating pristine tailoring with deep textile heritage. Every piece of fabric we drape, stitch, or embellish is treated as a masterpiece.
              </p>
              <p>
                Our mission is simple: <strong>to drape every customer in absolute confidence and grace</strong>. By merging traditional handloom silks, flax, and cotton weaves with modern, comfortable cuts, we establish Indian blouse tailoring as an elite worldwide luxury artform.
              </p>
              <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white pt-2">Our Atelier Philosophy</h3>
              <p>
                Each garment is handcrafted by senior master artisans (karigars) utilizing premium Indian silks, hand-aligned zari, and pristine sequin placements. Because our creations are bespoke, they accommodate the unique curves and posture of every individual.
              </p>
              <p className="italic text-gold-600 dark:text-gold-400 bg-gold-50/30 dark:bg-gold-950/5 p-4 border-l-2 border-gold-400">
                "Fashion is temporary; but the perfect drape of a masterfully stitched blouse is eternal." — Blousia Design Council
              </p>
            </div>
          </div>
        );

      case "our-mission":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">Pillars of Integrity</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">Our Mission & Craft Promise</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">COUTURE COMMITMENT</p>
            </div>

            <div className="font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300 space-y-6">
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">1. Sustainable Weaving Livelihoods</p>
                <p>We work directly with handloom weaver societies in Varanasi, Chanderi, and Kanchipuram, ensuring sustainable income loops and keeping alive the delicate heritage craft of silk jacquards and real gold zari work.</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">2. Absolute Tailoring Precision</p>
                <p>Every blouse goes through double-stitching alignments, pre-fitted premium pads, and standard 2-inch expandable margins to guarantee that your garment remains as flexible and enduring as it is beautiful.</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">3. Fair Wages to Karigars</p>
                <p>We employ certified master artisans in a safe, fully air-conditioned, high-standard atelier in Mumbai, paying far above industry standards to support elite craft culture.</p>
              </div>
            </div>
          </div>
        );

      case "why-choose-us":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">The Luxury Quotient</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">Why Select Blousia®?</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">WHAT SEPARATES OUR CRAFT</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold font-serif text-sm text-gray-900 dark:text-white">Atelier Fit Guarantee</p>
                <p>All drapes incorporate an expandable inner margin of 2 inches, pre-positioned shoulder grips, and luxury tailoring pads.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold font-serif text-sm text-gray-900 dark:text-white">Real Pure Indian Silks</p>
                <p>We source authentic handloom fabrics directly from verified regional weavers, avoiding synthetic poly-blends.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold font-serif text-sm text-gray-900 dark:text-white">Secure Luxury Casing</p>
                <p>Your order is dispatched inside luxury eco-garment suitcases to shield heavy sequin details, lace trim, and zari work.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold font-serif text-sm text-gray-900 dark:text-white">Active AI Stylist & Concierge</p>
                <p>Our intelligent design advisor guides neck deepness and pattern pairing according to your specific celebration context.</p>
              </div>
            </div>
          </div>
        );

      case "contact-us":
        const isApiKeyConfigured = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== "YOUR_API_KEY" && GOOGLE_MAPS_KEY.trim() !== "";
        return (
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-10">
            {/* Header Block */}
            <div className="border-b border-gray-100 dark:border-slate-900 pb-6">
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">
                Atelier Location & Showroom
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">
                Visit Our Experience Center
              </h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                SWAPNO ELECTRIC • NAMKHANA • WEST BENGAL
              </p>
            </div>

            {/* 3-Column Studio & Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              
              {/* Column 1: Contact Details & Info (span 4) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-serif text-base font-bold text-gray-950 dark:text-white pb-2 border-b border-gray-100 dark:border-slate-900">
                    Connect Instantly
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Our master artisans and boutique concierge are available to assist with custom fitting consultations, premium Banarasi fabric selection, or tracking your custom-tailored orders.
                  </p>
                </div>

                <div className="space-y-4 bg-gray-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-gray-100/50 dark:border-slate-900">
                  <div className="flex items-start gap-3">
                    <MessageSquare size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[9px]">WhatsApp Concierge</span>
                      <a href="https://wa.me/918509112927" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gold-500 font-mono font-medium block mt-0.5">
                        +91 85091 12927 (Live Chat)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[9px]">Atelier Email</span>
                      <a href="mailto:nilanjanahatuya@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-gold-500 font-mono font-medium block mt-0.5">
                        nilanjanahatuya@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[9px]">Consultation Hours</span>
                      <div className="text-gray-600 dark:text-gray-300 font-medium mt-0.5">
                        <span>Monday – Sunday</span>
                        <span className="block text-gray-450 dark:text-gray-400 font-mono text-[10px]">10:30 AM – 8:00 PM (IST)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Leave an Atelier Message Form (span 4) */}
              <div className="lg:col-span-4 p-6 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-4 shadow-xs">
                <h3 className="font-semibold font-serif text-sm text-gray-900 dark:text-white">
                  Leave an Atelier Message
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Your consultation query has been logged securely into our Atelier queue. A representative will contact you shortly."); }} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400">Full Name</label>
                    <input required type="text" className="w-full border border-gray-200 p-2 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs" placeholder="e.g. Priyal Sharma" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400">Email Address</label>
                    <input required type="email" className="w-full border border-gray-200 p-2 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs" placeholder="e.g. priyal@domain.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-400">Your Inquiry</label>
                    <textarea required rows={3} className="w-full border border-gray-200 p-2 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white text-xs leading-relaxed" placeholder="Mention size specifications or collection inquiries..." />
                  </div>
                  <button type="submit" className="w-full bg-gray-950 text-white font-bold py-2.5 uppercase tracking-widest text-[10px] hover:bg-gold-500 transition-colors cursor-pointer">
                    Send consultation request
                  </button>
                </form>
              </div>

              {/* Column 3: Showroom Location & Map (span 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900/20 border border-gray-100 dark:border-slate-900 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Compass size={15} className="text-gold-500" />
                    <h3 className="font-serif text-sm font-bold text-gray-900 dark:text-white">
                      Namkhana Showroom
                    </h3>
                  </div>

                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    Located inside <strong className="text-gray-800 dark:text-gray-200 font-semibold">SWAPNO ELECTRIC</strong>, Namkhana Rd, Nischinta Pur, West Bengal - 743374.
                  </p>

                  {/* MAP CONTAINER - explicit height set to prevent collapse (CF2) */}
                  <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-gray-150 dark:border-slate-800">
                    {isApiKeyConfigured ? (
                      <Map
                        defaultCenter={{ lat: 21.9872777, lng: 88.2143313 }}
                        defaultZoom={14}
                        mapId="DEMO_MAP_ID"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%' }}
                        gestureHandling="cooperative"
                      >
                        <AdvancedMarker position={{ lat: 21.9872777, lng: 88.2143313 }} title="Blousia® Experience Center">
                          <Pin background="#D4AF37" glyphColor="#fff" borderColor="#996515" />
                        </AdvancedMarker>
                      </Map>
                    ) : (
                      <div className="absolute inset-0 bg-[#F5F3EE] dark:bg-slate-900/60 flex flex-col items-center justify-center p-4 text-center">
                        {/* Pure CSS background grid lines */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none dark:opacity-[0.02]">
                          <div className="w-full h-full border-b border-r border-gray-900 grid grid-cols-6 grid-rows-6" />
                        </div>
                        
                        <div className="relative mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-gold-50 text-gold-600 dark:bg-gold-950/30 dark:text-gold-400">
                          <MapPin size={18} />
                        </div>
                        <span className="font-serif font-bold text-[11px] text-gray-900 dark:text-white">Interactive Live Map</span>
                        <p className="mt-1 text-[9px] text-gray-400 max-w-[200px] leading-tight">
                          Configure <code className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[8px]">GOOGLE_MAPS_PLATFORM_KEY</code> in Secrets to activate real-time routing.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <a
                      href="https://maps.app.goo.gl/xpeScaZd2C2M8NNR8"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-950 hover:bg-gold-600 text-white font-bold uppercase tracking-wider text-[9px] transition-all cursor-pointer"
                    >
                      Open in Google Maps <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );

      case "help-center":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">Atelier HelpDesk</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">Help Center & Support Desk</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">SECURE TAILORING ASSISTANCE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600 dark:text-gray-300">
              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">How do I order a custom design?</p>
                <p>Navigate to "Customize Your Blouse" on our menu or use the Style Advisor to select fabric types, sleeve specs, neck depths, and padding preferences. Our karigars will build to your exact specifications.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">What payment methods do you accept?</p>
                <p>We accept all credit and debit cards, secure net banking, major mobile wallets, and direct UPI transfers through verified secure processors.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">How do I track my active orders?</p>
                <p>Log into your secure account portal and select "My Orders" to inspect real-time double-stitching progress, atelier validation, or transit tracking numbers.</p>
              </div>

              <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:border-slate-900 dark:bg-slate-900/40 space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">Complimentary alteration program</p>
                <p>If your blouse requires adjustment, we offer one-time free resizing of the blouse margins through our Priority Reverse Courier network. Contact our support team for setup details.</p>
              </div>
            </div>
          </div>
        );

      case "faqs":
        return (
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn space-y-8">
            <div>
              <span className="rounded bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border border-gold-200/30">Atelier Concierge</span>
              <h2 className="mt-3 font-serif text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="mt-1.5 font-mono text-[10px] text-gray-400">tailoring support & fitting answers</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "How do I submit my measurement specifications?",
                  a: "You can configure your measurements directly on any product page, use our 'AI Fashion Stylist' style advisor, or submit custom design requests under your 'Saved Creations' portal."
                },
                {
                  q: "What is your typical tailoring and shipping timeline?",
                  a: "Since each blouse is double-stitched and padded by our senior master tailors, tailoring takes 1 to 2 business days. Transit takes 2 days for major metros and up to 5 days for remote cities."
                },
                {
                  q: "Is there an inner margin for future size adjustments?",
                  a: "Yes! All Blousia® blouses are tailormade with a standard 2-inch expandable inner stitch margin, enabling easy future adjustments."
                },
                {
                  q: "Can I request changes to neckline or sleeve styles?",
                  a: "Absolutely. When placing a 'Custom Design Request', you can define custom fabrics, sleeve styles, front/back neck depths, piping options, and embellishments (mirror, zari, or stone work)."
                }
              ].map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-slate-900 dark:bg-slate-900/40">
                  <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white flex items-start gap-2">
                    <span className="text-gold-500 font-mono">Q.</span> {faq.q}
                  </h4>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 pl-4 leading-relaxed border-l border-gold-200/40">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getSeoProps = () => {
    if (selectedProduct) {
      return { title: selectedProduct.name, description: selectedProduct.description, image: selectedProduct.images[0] };
    }
    switch(activeTab) {
      case 'catalog': return { title: 'Studio Catalog', description: 'Browse our exclusive collection of designer blouses.' };
      case 'customizer': return { title: 'Bespoke Customizer', description: 'Design your dream blouse with our interactive customizer.' };
      case 'advisor': return { title: 'AI Style Advisor', description: 'Get personalized styling recommendations powered by AI.' };
      case 'blog': return { title: 'Fashion Journal', description: 'Read the latest styling tips and trends in our Fashion Journal.' };
      default: return {};
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO {...getSeoProps()} />
      <Header />
      
      {/* Main viewport stage */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      <Footer />
      
      {/* Interactive float overlays */}
      <AIChatBot />
      <SpeedDialSupport />
      <CookieBanner />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Global Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAuthModal(false)}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
              <div className="max-h-[85vh] overflow-y-auto px-2 py-4">
                <Authentication onSuccess={onAuthSuccess} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [showOnboarding, setShowOnboarding] = React.useState(() => {
    return localStorage.getItem("blousia_onboarding_complete") !== "true";
  });

  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
      <AppProvider>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        {!showSplash && showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        <PWAInstallPrompt />
        <MainContent />
      </AppProvider>
    </APIProvider>
  );
}
