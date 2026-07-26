/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";
import { X, ShoppingBag, Heart, Star, Check, Scissors, Eye, AlertCircle, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SizeGuideModal } from "./SizeGuideModal";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct 
  } = useApp();

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.specifications.sizes[0] || "38");
  const [selectedColor, setSelectedColor] = useState(product.specifications.colorOptions[0] || "Crimson Red");
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const isLiked = isInWishlist(product.id);

  // Sync active image when product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedSize(product.specifications.sizes[0] || "38");
    setSelectedColor(product.specifications.colorOptions[0] || "Crimson Red");
    setQuantity(1);
    setAddedMessage(false);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  const handleOpenFullDetails = () => {
    onClose();
    // Use a tiny timeout to let the quick view close animation finish before opening full details
    setTimeout(() => {
      setSelectedProduct(product);
    }, 100);
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 md:h-auto md:max-h-[80vh] md:rounded-xl md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-gray-500 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-gray-900 dark:bg-slate-800/80 dark:text-gray-300 dark:hover:bg-slate-700"
        >
          <X size={18} />
        </button>

        {/* Left Side: Images Section */}
        <div className="flex flex-col bg-gray-50 p-4 dark:bg-slate-950 md:w-1/2 md:p-6 justify-between overflow-y-auto">
          {/* Large Main Image Stage */}
          <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-white dark:bg-slate-900 shadow-xs md:rounded-lg">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-top"
            />

            {/* Badge Overlay */}
            <div className="absolute left-3 top-3 flex flex-col gap-1">
              {product.isBestSeller && (
                <span className="bg-gold-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white">
                  Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-gray-950 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-14 w-11 flex-shrink-0 overflow-hidden border bg-white dark:bg-slate-900 transition-all ${
                  activeImage === img
                    ? "border-gold-500 ring-1 ring-gold-400"
                    : "border-gray-200 hover:border-gold-300 dark:border-slate-800"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details & Options */}
        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-6 md:p-8">
          {/* Category & Title */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
            {product.category}
          </span>
          <h2 className="mt-1 font-serif text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.ratings) ? "fill-amber-400" : "text-gray-200 dark:text-gray-800"}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">
              {product.ratings} ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex items-baseline gap-3 border-b border-gray-100 pb-4 dark:border-slate-800">
            <span className="font-mono text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              ₹{product.sellingPrice.toLocaleString()}
            </span>
            <span className="font-mono text-sm text-gray-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-sm">
              {product.discount}% OFF
            </span>
          </div>

          {/* Key Specifications (The "Key Specs" core requirement) */}
          <div className="mt-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Scissors size={13} className="text-gold-500" />
              Key Specifications
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-gray-50/50 p-3 text-xs dark:bg-slate-950/30 border border-gray-100 dark:border-slate-850">
              <div className="flex justify-between border-b border-gray-100/50 pb-1.5 dark:border-slate-850">
                <span className="text-gray-500">Fabric</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.fabric}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1.5 dark:border-slate-850">
                <span className="text-gray-500">Neck Style</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.neckStyle}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1.5 dark:border-slate-850">
                <span className="text-gray-500">Sleeve Style</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.sleeveStyle}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100/50 pb-1.5 dark:border-slate-850">
                <span className="text-gray-500">Back Design</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.backDesign}</span>
              </div>
              {product.specifications.lining && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Lining</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.lining}</span>
                </div>
              )}
              {product.specifications.padding && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Padding</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{product.specifications.padding}</span>
                </div>
              )}
            </div>
          </div>

          {/* Color Selector */}
          {product.specifications.colorOptions.length > 0 && (
            <div className="mt-4">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Color Options: <span className="font-medium text-gray-500">{selectedColor}</span>
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {product.specifications.colorOptions.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-gold-500 text-white shadow-xs"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.specifications.sizes.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Size (Bust): <span className="font-medium text-gray-500">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[11px] font-bold text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300 underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  <Ruler size={11} className="text-gold-500" /> Size Guide
                </button>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {product.specifications.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-9 w-9 items-center justify-center border font-mono text-xs font-bold transition-all ${
                        isSelected
                          ? "border-gold-500 bg-gold-500 text-white shadow-xs"
                          : "border-gray-200 text-gray-700 hover:border-gold-400 hover:text-gold-500 dark:border-slate-800 dark:text-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Quantity Selector */}
            <div className="flex items-center self-start border border-gray-200 dark:border-slate-800">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                className="flex h-9 w-9 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="relative flex-1 flex h-9 items-center justify-center gap-2 bg-gray-950 font-semibold text-xs uppercase tracking-widest text-white transition-all hover:bg-gold-600 cursor-pointer"
            >
              <ShoppingBag size={14} />
              {addedMessage ? "Added to Cart!" : "Add to Cart"}
              {addedMessage && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-300 animate-ping">
                  <Check size={12} />
                </span>
              )}
            </button>

            {/* Wishlist Icon Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`flex h-9 w-9 items-center justify-center border transition-all hover:scale-105 cursor-pointer ${
                isLiked
                  ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                  : "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800"
              }`}
              title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={14} className={isLiked ? "fill-current" : ""} />
            </button>
          </div>

          {/* Full Details link */}
          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-slate-800 text-center sm:text-left">
            <button
              onClick={handleOpenFullDetails}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 hover:text-gold-700 dark:text-gold-400 transition-colors cursor-pointer"
            >
              <Eye size={13} />
              View Full Details, Virtual Try-On & AI Styling
            </button>
          </div>
        </div>
      </motion.div>

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
