/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Product, Review } from "../types";
import { useApp } from "../context/AppContext";
import { 
  Star, X, ShoppingBag, Heart, ShieldAlert, Sparkles, Send, Loader2, Calendar, 
  Check, Truck, Scissors, ThumbsUp, ThumbsDown, Flag, Image as ImageIcon, Video, 
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, Ruler 
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { BespokeCustomizer } from "./BespokeCustomizer";
import { VirtualTryOn } from "./VirtualTryOn";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    addReviewToProduct,
    likeReview,
    voteReviewHelpful,
    reportReview,
    isLoggedIn,
    orders,
    userRole,
    addNotification,
    requireAuth,
  } = useApp();

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.specifications.sizes[0] || "38");
  const [selectedColor, setSelectedColor] = useState(product.specifications.colorOptions[0] || "Crimson Red");
  const [quantity, setQuantity] = useState(1);
  const [isPadded, setIsPadded] = useState(true);

  // Customizer and Try-On overlay states
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review states
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [reviewVideo, setReviewVideo] = useState<string>("");
  const [bypassVerified, setBypassVerified] = useState<boolean>(false);

  // Sorting, filtering, pagination
  const [sortReviews, setSortReviews] = useState<"newest" | "highest" | "lowest" | "helpful">("newest");
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState<boolean>(false);
  const [filterPhotos, setFilterPhotos] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  // AI Style Suggestion States
  const [selectedOccasion, setSelectedOccasion] = useState("Wedding / Reception");
  const [aiPairing, setAiPairing] = useState<any>(null);
  const [loadingPairing, setLoadingPairing] = useState(false);

  // PIN Code State
  const [pinCode, setPinCode] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [deliveryDays, setDeliveryDays] = useState(product.deliveryEstimateDays);

  const isLiked = isInWishlist(product.id);

  // Fetch AI Review Summary on load
  useEffect(() => {
    fetchAiSummary();
    setActiveImage(product.images[0]);
  }, [product]);

  const fetchAiSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/gemini/summarize-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product.name, reviews: product.reviews }),
      });
      const data = await res.json();
      setAiSummary(data.summary || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFetchPairing = async () => {
    setLoadingPairing(true);
    setAiPairing(null);
    try {
      const res = await fetch("/api/gemini/suggest-pairings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: selectedOccasion,
          sareeType: product.specifications.fabric,
          preferredColor: selectedColor,
          necklinePreference: product.specifications.neckStyle,
        }),
      });
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setAiPairing(data.suggestions[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPairing(false);
    }
  };

  const checkPinCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinCode)) {
      setPinStatus("invalid");
      return;
    }
    setPinStatus("checking");
    setTimeout(() => {
      // Simulate validation. Metro PIN codes get faster delivery.
      const isMetro = ["400", "110", "700", "560", "600"].some((prefix) => pinCode.startsWith(prefix));
      setPinStatus("valid");
      setDeliveryDays(isMetro ? 2 : Math.max(3, product.deliveryEstimateDays));
    }, 1200);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      const hasBought = orders.some((o) =>
        o.items.some((item) => item.product.id === product.id)
      );
      const canReview = hasBought || bypassVerified || userRole === "Admin" || userRole === "Super Admin";

      if (!canReview) {
        return;
      }

      if (reviewName.trim() && reviewComment.trim()) {
        addReviewToProduct(product.id, {
          userName: reviewName,
          userEmail: reviewEmail,
          rating: reviewRating,
          comment: reviewComment,
          images: reviewImages.length > 0 ? reviewImages : undefined,
        });
        setReviewSuccess(true);
        setReviewName("");
        setReviewEmail("");
        setReviewComment("");
        setReviewRating(5);
        setReviewImages([]);
        setReviewVideo("");
        setTimeout(() => {
          setReviewSuccess(false);
          fetchAiSummary(); // Recalculate AI summary
        }, 4000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl dark:bg-slate-950 max-h-[90vh] overflow-y-auto border border-gold-100 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 sm:p-8">
          
          {/* Left Column: Visual Media Stage */}
          <div className="space-y-4">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-slate-900">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-top transition-all duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img ? "border-gold-400 scale-95" : "border-transparent opacity-80"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>

            {/* Custom Specs Table */}
            <div className="rounded-2xl border border-gold-100/60 bg-gold-50/20 p-4 dark:border-slate-800 dark:bg-slate-900/30">
              <h4 className="font-serif text-sm font-bold tracking-wide text-gray-900 dark:text-white">
                Bespoke Specifications
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                <div className="text-gray-500">Fabric/Weave:</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{product.specifications.fabric}</div>
                
                <div className="text-gray-500">Neck Style:</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{product.specifications.neckStyle}</div>
                
                <div className="text-gray-500">Sleeve Detail:</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{product.specifications.sleeveStyle}</div>
                
                <div className="text-gray-500">Back Design:</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{product.specifications.backDesign}</div>

                <div className="text-gray-500">Alteration Margin:</div>
                <div className="font-medium text-emerald-600 dark:text-emerald-400">Generous 2-inch inner margin included</div>
                
                <div className="text-gray-500">Wash Care:</div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{product.specifications.washCare}</div>
              </div>
            </div>
          </div>

          {/* Right Column: E-commerce Configuration & AI Features */}
          <div className="space-y-6">
            <div>
              <span className="rounded bg-gold-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700 dark:bg-gold-950 dark:text-gold-300">
                {product.category}
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
                {product.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-gray-400">SKU: {product.sku}</p>
            </div>

            {/* Pricing Box */}
            <div className="flex items-baseline gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-slate-900">
              <span className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                ₹{product.sellingPrice.toLocaleString()}
              </span>
              <span className="font-mono text-sm text-gray-400 line-through">
                ₹{product.mrp.toLocaleString()}
              </span>
              <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {product.discount}% OFF
              </span>
            </div>

            {/* AI Review Summary Box */}
            {loadingSummary ? (
              <div className="flex items-center gap-2 rounded-xl bg-gold-50/30 p-4 border border-gold-100 dark:bg-slate-900 dark:border-slate-800">
                <Loader2 size={16} className="animate-spin text-gold-500" />
                <span className="text-xs text-gray-500">Generating AI consensus summary...</span>
              </div>
            ) : aiSummary ? (
              <div className="rounded-xl bg-gold-50/50 p-4 border border-gold-100/50 dark:bg-gold-950/10 dark:border-gold-900/30">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gold-600 uppercase dark:text-gold-400">
                  <Sparkles size={13} /> AI Customer Summary Consensus
                </p>
                <p className="mt-1.5 font-sans text-xs italic leading-relaxed text-gray-600 dark:text-gray-300">
                  "{aiSummary}"
                </p>
              </div>
            ) : null}

            {/* Color Selector */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Select Hue</span>
              <div className="mt-2 flex gap-2">
                {product.specifications.colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all border ${
                      selectedColor === color
                        ? "border-gold-500 bg-gold-500 text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Chart */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Select Chest Size (inches)</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gold-500 underline cursor-help hidden sm:inline" title="Alteration margins are included!">
                    Alteration built-in
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs font-bold text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300 underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    <Ruler size={13} className="text-gold-500" /> Size Guide
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.specifications.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 w-12 items-center justify-center rounded-xl text-xs font-mono font-bold transition-all border ${
                      selectedSize === size
                        ? "border-gold-500 bg-gold-500 text-white shadow-md scale-95"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Padding Switch */}
            <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3.5 dark:border-slate-900 bg-gray-50/40 dark:bg-slate-900/10">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Include Premium Padding Cups</span>
                <span className="text-[10px] text-gray-400">Can be easily removed through custom inner lining slot</span>
              </div>
              <button
                onClick={() => setIsPadded(!isPadded)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPadded ? "bg-gold-500" : "bg-gray-200 dark:bg-slate-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isPadded ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Quantity Selector + Add / Wish buttons */}
            <div className="flex gap-4">
              <div className="flex items-center rounded-xl border border-gray-200 dark:border-slate-800 px-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-lg font-bold text-gray-500 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-lg font-bold text-gray-500 hover:text-gray-800"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  requireAuth(() => {
                    addToCart(product, selectedSize, selectedColor, quantity);
                    onClose();
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gold-400 py-3.5 text-sm font-semibold text-white transition-all shadow-md hover:bg-gold-500"
              >
                <ShoppingBag size={18} /> Add to Boutique Bag
              </button>

              <button
                onClick={() => requireAuth(() => toggleWishlist(product))}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all hover:scale-95 ${
                  isLiked
                    ? "border-rose-luxury bg-rose-50 text-rose-luxury"
                    : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-rose-luxury" : ""} />
              </button>
            </div>

            {/* Customization & Camera AR Try On */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCustomizer(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-gold-300 bg-gold-50/20 py-3 text-xs font-semibold text-gold-700 transition-all hover:bg-gold-50 dark:border-gold-500/30 dark:bg-gold-950/20 dark:text-gold-400 cursor-pointer"
              >
                <Scissors size={14} /> Customize Blouse
              </button>

              <button
                onClick={() => setShowTryOn(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-300 bg-sky-50/20 py-3 text-xs font-semibold text-sky-700 transition-all hover:bg-sky-50 dark:border-sky-500/30 dark:bg-sky-950/20 dark:text-sky-400 cursor-pointer"
              >
                <Sparkles size={14} /> Virtual Try-On (AR)
              </button>
            </div>

            {/* Pincode checker */}
            <div className="rounded-2xl border border-gray-100 p-4 dark:border-slate-900 bg-gray-50/20">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1">
                <Truck size={14} className="text-gold-400" /> Estimate Shipping Delivery
              </span>
              <form onSubmit={checkPinCode} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN code (e.g. 400050)"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-sans text-gray-900 placeholder:text-gray-400 focus:border-gold-300 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-gray-200"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-slate-800"
                >
                  Verify
                </button>
              </form>
              {pinStatus === "checking" && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400">
                  <Loader2 size={11} className="animate-spin text-gold-400" /> Validating delivery routes...
                </p>
              )}
              {pinStatus === "valid" && (
                <p className="mt-1.5 text-[11px] text-emerald-600 font-medium">
                  ✓ Delivery available! Guaranteed courier arrival within {deliveryDays} days.
                </p>
              )}
              {pinStatus === "invalid" && (
                <p className="mt-1.5 text-[11px] text-rose-500">
                  ❌ Invalid PIN code format. Please enter exactly 6 digits.
                </p>
              )}
            </div>

            {/* AI OUTFIT PAIRING ASSISTANT */}
            <div className="rounded-2xl bg-slate-900 p-4 text-white dark:bg-slate-950 border border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-gold-300 uppercase">
                <Sparkles size={14} /> AI Stylist Outfit Pairings
              </span>
              <p className="mt-1 text-[11px] text-gray-300">
                Get custom saree matching and drape guidance from our head boutique stylist.
              </p>
              
              <div className="mt-3.5 flex items-center gap-2">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-400"
                >
                  <option>Wedding / Reception</option>
                  <option>Diwali Festive Gathering</option>
                  <option>Cocktail Evening</option>
                  <option>Mehendi / Sangeet Soirée</option>
                  <option>Formal Boardroom Wear</option>
                </select>

                <button
                  onClick={handleFetchPairing}
                  disabled={loadingPairing}
                  className="rounded-lg bg-gold-400 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gold-500 flex items-center gap-1"
                >
                  {loadingPairing ? <Loader2 size={12} className="animate-spin" /> : "Style Me"}
                </button>
              </div>

              {aiPairing && (
                <div className="mt-4 rounded-lg bg-slate-800 p-3 text-xs border border-slate-700 animate-fadeIn">
                  <p className="font-semibold text-gold-300">{aiPairing.title}</p>
                  <p className="mt-1.5 text-gray-300 leading-relaxed text-[11px]">
                    <span className="font-medium text-white">Why it works:</span> {aiPairing.whyItWorks}
                  </p>
                  <p className="mt-1.5 text-gray-300 leading-relaxed text-[11px]">
                    <span className="font-medium text-white">Styling tips:</span> {aiPairing.stylingTips}
                  </p>
                  <span className="mt-2 inline-block rounded bg-gold-500/20 px-2 py-0.5 text-[9px] font-semibold text-gold-300 uppercase">
                    Collection: {aiPairing.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Description Block */}
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Description</span>
              <p className="font-sans text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            {/* FAQs Block */}
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Product FAQs</span>
              <div className="space-y-2">
                {product.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-gray-100 p-3.5 dark:border-slate-900 bg-white dark:bg-slate-950">
                    <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-200 list-none">
                      <span>{faq.question}</span>
                      <span className="text-xs text-gold-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Reviews list & Writing review */}
            <div id="product-review-system" className="space-y-6 pt-6 border-t border-gray-100 dark:border-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white">
                  Patron Reviews & Drapery Feedback
                </h3>
                <span className="rounded-full bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-600 dark:text-gold-400">
                  ★ {product.ratings} / 5.0 ({product.reviews.length} reviews)
                </span>
              </div>

              {/* RATING BREAKDOWN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-2xl bg-gray-50/50 p-5 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-900">
                <div className="md:col-span-4 text-center space-y-2 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
                  <p className="text-4xl font-serif font-bold text-gray-900 dark:text-white">{product.ratings}</p>
                  <div className="flex justify-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.round(product.ratings) ? "fill-amber-400" : "text-gray-200 dark:text-slate-800"} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Based on {product.reviews.length} verified ratings</p>
                </div>

                <div className="md:col-span-8 space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = product.reviews.filter(r => r.rating === star).length;
                    const pct = product.reviews.length > 0 ? Math.round((count / product.reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-6 font-semibold text-gray-600 dark:text-gray-400 text-right">{star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gold-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-gray-400 text-right font-mono">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI REVIEWS SYNTHESIS BANNER */}
              {loadingSummary ? (
                <div className="rounded-2xl bg-gold-50/30 p-4 border border-gold-200/50 animate-pulse dark:bg-slate-900/30 dark:border-slate-800">
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                </div>
              ) : aiSummary ? (
                <div className="rounded-2xl bg-gold-50/30 p-4 border border-gold-200/50 dark:bg-gold-950/10 dark:border-gold-500/20">
                  <span className="flex items-center gap-1.5 text-xs font-serif font-bold tracking-wide text-gold-600 dark:text-gold-400 uppercase">
                    ✨ Atelier AI Drape Synthesis
                  </span>
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{aiSummary}"
                  </p>
                  <span className="mt-2 block text-[9px] text-gray-400 uppercase tracking-widest font-mono">
                    Aggregated insight from {product.reviews.length} product reviews
                  </span>
                </div>
              ) : null}

              {/* WRITING REVIEW SECTION */}
              <div className="space-y-4">
                {(() => {
                  const hasBought = orders.some(o => o.items.some(item => item.product.id === product.id));
                  const canSubmit = hasBought || bypassVerified || userRole === "Admin" || userRole === "Super Admin";

                  if (!canSubmit) {
                    return (
                      <div className="rounded-2xl border border-dashed border-gold-300 bg-gold-50/10 p-5 text-center dark:border-slate-800 dark:bg-slate-950/20">
                        <ShieldAlert className="mx-auto text-gold-500 mb-2" size={24} />
                        <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white">Verified Purchase Required</h4>
                        <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                          To protect our legacy weaving integrity, only registered patrons who have successfully purchased and taken delivery of this specific saree can submit feedback.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              requireAuth(() => {
                                addToCart(product, selectedSize, selectedColor, 1);
                                addNotification(`Bespoke Bag: Added ${product.name} to checkout bag.`);
                              });
                            }}
                            className="rounded-xl bg-gold-600 px-4 py-2 text-[10px] font-bold text-white hover:bg-gold-700"
                          >
                            Acquire Saree Now
                          </button>
                          <button
                            type="button"
                            onClick={() => setBypassVerified(true)}
                            className="rounded-xl border border-gray-200 dark:border-slate-800 px-3 py-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900"
                          >
                            Bypass for Testing (Demo Mode)
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <form onSubmit={handleAddReview} className="space-y-3.5 rounded-2xl border border-dashed border-gold-300 p-5 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          Submit Your Weaving Feedback
                        </span>
                        <span className="rounded bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Verified Purchaser Access
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Patron Name (e.g. Shreya Sharma)"
                          className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800 dark:bg-slate-900 text-gray-800 dark:text-white"
                        />
                        <input
                          type="email"
                          required
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          placeholder="Couture Account Email"
                          className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800 dark:bg-slate-900 text-gray-800 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500">Your Fitting Rating:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              aria-label={`Rate ${star} stars`}
                              className="text-amber-400 focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star size={20} className={star <= reviewRating ? "fill-amber-400" : "text-gray-300 dark:text-slate-800"} />
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-gold-500 font-bold">
                          {reviewRating === 5 ? "Exceptional" : reviewRating === 4 ? "Very Fine" : reviewRating === 3 ? "Standard" : reviewRating === 2 ? "Needs Alteration" : "Dissatisfied"}
                        </span>
                      </div>

                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Detail your experience about the silk's weight, neck comfort, back dori support, and inner satin lining alteration margins..."
                        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800 dark:bg-slate-900 text-gray-800 dark:text-white"
                      />

                      {/* PHOTO AND VIDEO UPLOADS */}
                      <div className="space-y-2 rounded-xl bg-gray-50 p-3.5 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <ImageIcon size={14} className="text-gold-500" /> Upload Fitting Photos
                          </span>
                          <span className="text-[10px] text-gray-400">Select simulated saree photos:</span>
                        </div>

                        {/* Presets */}
                        <div className="flex gap-3">
                          {[
                            { name: "Silk Gold Weave", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" },
                            { name: "Embroidery Sabyasachi", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200" },
                            { name: "Pleats Perfect", url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200" }
                          ].map((preset) => {
                            const selected = reviewImages.includes(preset.url);
                            return (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  if (selected) {
                                    setReviewImages(prev => prev.filter(x => x !== preset.url));
                                  } else {
                                    setReviewImages(prev => [...prev, preset.url]);
                                  }
                                }}
                                className={`relative h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${
                                  selected ? "border-gold-500 scale-95" : "border-gray-200 opacity-60"
                                }`}
                              >
                                <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                                {selected && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Check size={12} className="text-white font-bold" />
                                  </div>
                                )}
                              </button>
                            );
                          })}

                          {/* Video Upload trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              if (reviewVideo) {
                                setReviewVideo("");
                              } else {
                                setReviewVideo("drape_fluidity_hevc_4k.mp4");
                                addNotification("Review Video: Simulated high-definition draping video file attached successfully.");
                              }
                            }}
                            className={`flex flex-col items-center justify-center h-12 px-3 border border-dashed rounded-lg transition-all text-[9px] font-bold ${
                              reviewVideo 
                                ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                : "border-gray-300 text-gray-400 hover:border-gold-400 hover:text-gold-500"
                            }`}
                          >
                            <Video size={14} />
                            {reviewVideo ? "Video Attached" : "Attach Video"}
                          </button>
                        </div>

                        {reviewImages.length > 0 && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                            ✓ {reviewImages.length} photo(s) queued for secure CDN encryption and upload.
                          </p>
                        )}
                        {reviewVideo && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                            ✓ Transcoding: "{reviewVideo}" registered as future-ready video attachment.
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gold-600 py-3 text-xs font-semibold text-white transition-all hover:bg-gold-700 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Send size={12} /> Submit Authentic Heritage Review
                      </button>

                      {reviewSuccess && (
                        <div className="rounded-xl bg-emerald-50 p-2.5 dark:bg-emerald-950/20 text-center animate-fadeIn">
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Thank you! Saree feedback recorded securely in the atelier blockchain list. Recalculating average rating...
                          </p>
                        </div>
                      )}
                    </form>
                  );
                })()}
              </div>

              {/* CONTROLS: SORTING & FILTERING BAR */}
              <div className="flex flex-col gap-3 rounded-2xl bg-gray-50 dark:bg-slate-900/60 p-4 border border-gray-100 dark:border-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <Filter size={13} className="text-gold-500" /> Filter Ratings
                  </div>
                  
                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-400 flex items-center gap-1"><ArrowUpDown size={11} /> Sort:</span>
                    <select
                      value={sortReviews}
                      onChange={(e) => {
                        setSortReviews(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-gold-400"
                    >
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {/* Star Filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => { setFilterStars(null); setCurrentPage(1); }}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                      filterStars === null 
                        ? "bg-gold-500 text-white" 
                        : "bg-white dark:bg-slate-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => { setFilterStars(star); setCurrentPage(1); }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 transition-all ${
                        filterStars === star 
                          ? "bg-gold-500 text-white" 
                          : "bg-white dark:bg-slate-950 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>

                {/* Toggles for Verified & Photos */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px]">
                  <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterVerified}
                      onChange={(e) => { setFilterVerified(e.target.checked); setCurrentPage(1); }}
                      className="rounded border-gray-300 text-gold-500 focus:ring-gold-500 dark:bg-slate-950 dark:border-slate-800"
                    />
                    Only Verified Patrons
                  </label>

                  <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterPhotos}
                      onChange={(e) => { setFilterPhotos(e.target.checked); setCurrentPage(1); }}
                      className="rounded border-gray-300 text-gold-500 focus:ring-gold-500 dark:bg-slate-950 dark:border-slate-800"
                    />
                    With Patrons Media (Photos)
                  </label>
                </div>
              </div>

              {/* REVIEWS LIST */}
              {(() => {
                // Filter
                let reviews = [...product.reviews].filter(r => r.status !== "hidden"); // Only approved ones

                if (filterStars !== null) {
                  reviews = reviews.filter(r => r.rating === filterStars);
                }
                if (filterVerified) {
                  reviews = reviews.filter(r => r.isVerified);
                }
                if (filterPhotos) {
                  reviews = reviews.filter(r => r.images && r.images.length > 0);
                }

                // Sort
                if (sortReviews === "newest") {
                  reviews.sort((a, b) => b.date.localeCompare(a.date));
                } else if (sortReviews === "highest") {
                  reviews.sort((a, b) => b.rating - a.rating);
                } else if (sortReviews === "lowest") {
                  reviews.sort((a, b) => a.rating - b.rating);
                } else if (sortReviews === "helpful") {
                  reviews.sort((a, b) => ((b.helpful || 0) + (b.likes || 0)) - ((a.helpful || 0) + (a.likes || 0)));
                }

                if (reviews.length === 0) {
                  return (
                    <div className="text-center py-8 bg-gray-50 dark:bg-slate-900/20 rounded-2xl">
                      <p className="text-xs text-gray-400">No patron reviews match the selected filter criteria.</p>
                    </div>
                  );
                }

                // Paginate
                const itemsPerPage = 4;
                const totalPages = Math.ceil(reviews.length / itemsPerPage);
                const currentReviews = reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                return (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {currentReviews.map((rev) => (
                        <div key={rev.id} className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-slate-900 dark:bg-slate-950 shadow-xs animate-slideUp">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <span className="text-xs font-serif font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                {rev.userName}
                                {rev.isVerified && (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600 dark:bg-emerald-950/20">
                                    Verified Patron
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{rev.date}</span>
                            </div>

                            {/* Rating and Sentiment */}
                            <div className="flex flex-col items-end">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, idx) => (
                                  <Star key={idx} size={11} className={idx < rev.rating ? "fill-amber-400" : "text-gray-200 dark:text-slate-800"} />
                                ))}
                              </div>
                              {rev.sentiment && (
                                <span className={`text-[8px] uppercase font-mono tracking-wider font-bold mt-1 ${
                                  rev.sentiment === "positive" ? "text-emerald-500" : rev.sentiment === "neutral" ? "text-gray-400" : "text-rose-500"
                                }`}>
                                  {rev.sentiment} Fitting
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                            {rev.comment}
                          </p>

                          {/* Render uploaded photos */}
                          {rev.images && rev.images.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {rev.images.map((imgUrl, idx) => (
                                <a
                                  key={idx}
                                  href={imgUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative h-14 w-14 rounded-lg overflow-hidden border border-gray-100 hover:scale-105 transition-all block"
                                >
                                  <img src={imgUrl} alt="Customer attachment" className="h-full w-full object-cover" />
                                </a>
                              ))}
                            </div>
                          )}

                          {/* REACTION BUTTONS: LIKES, HELPFUL, REPORT */}
                          <div className="mt-4 pt-3.5 border-t border-gray-50 dark:border-slate-900 flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400">
                            <div className="flex items-center gap-4">
                              {/* Helpful Vote */}
                              <button
                                type="button"
                                onClick={() => {
                                  voteReviewHelpful(product.id, rev.id, "helpful");
                                  addNotification(`Helpfulness: Thank you for your vote on review from ${rev.userName}.`);
                                }}
                                className="flex items-center gap-1 hover:text-gold-500 transition-colors cursor-pointer"
                              >
                                <ThumbsUp size={11} /> Helpful ({rev.helpful || 0})
                              </button>

                              {/* Unhelpful Vote */}
                              <button
                                type="button"
                                onClick={() => {
                                  voteReviewHelpful(product.id, rev.id, "unhelpful");
                                }}
                                className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                <ThumbsDown size={11} /> Not Helpful ({rev.unhelpful || 0})
                              </button>

                              {/* Likes */}
                              <button
                                type="button"
                                onClick={() => {
                                  likeReview(product.id, rev.id);
                                  addNotification(`Engagement: You liked ${rev.userName}'s saree review.`);
                                }}
                                className="flex items-center gap-1 text-rose-500/80 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Heart size={11} className="fill-rose-500/10" /> Like ({rev.likes || 0})
                              </button>
                            </div>

                            {/* Report / Flag Review */}
                            <button
                              type="button"
                              onClick={() => {
                                reportReview(product.id, rev.id);
                              }}
                              className={`flex items-center gap-1 transition-colors ${
                                rev.reported 
                                  ? "text-rose-500 font-bold" 
                                  : "hover:text-amber-500 cursor-pointer"
                              }`}
                            >
                              <Flag size={10} />
                              {rev.reported ? "Reported to Atelier Moderation" : "Report"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between gap-2 pt-2 text-xs">
                        <span className="text-gray-400">
                          Page <strong>{currentPage}</strong> of {totalPages} ({reviews.length} total reviews)
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-900 dark:bg-slate-950"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="rounded-lg border border-gray-100 bg-white p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-900 dark:bg-slate-950"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      </div>

      {/* Bespoke Customizer Modal overlay */}
      {showCustomizer && (
        <BespokeCustomizer 
          productName={product.name} 
          onClose={() => setShowCustomizer(false)} 
        />
      )}

      {/* Virtual Try On AR Modal overlay */}
      {showTryOn && (
        <VirtualTryOn 
          product={product} 
          onClose={() => setShowTryOn(false)} 
        />
      )}

      {/* Size Guide Modal Overlay */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuideModal 
            initialSize={selectedSize}
            onClose={() => setShowSizeGuide(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
