/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";
import { Star, Eye, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

import { Skeleton } from "./Skeleton";

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, setSelectedProduct, setQuickViewProduct, addToCart, setActiveTab, requireAuth } = useApp();
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      // Default to first available size and color
      const defaultSize = product.specifications.sizes[0] || "38";
      const defaultColor = product.specifications.colorOptions[0] || "Crimson Red";
      addToCart(product, defaultSize, defaultColor, 1);
    });
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col overflow-hidden rounded-none border border-black/5 bg-white shadow-xs transition-all duration-300 hover:border-gold-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-gold-500/60 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 dark:bg-slate-950">
        {!imgLoaded && <Skeleton className="absolute inset-0 w-full h-full z-20" />}
        <img
          src={product.images[0]}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Second Image on Hover (if available) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"
          />
        )}

        {/* Badge Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="rounded-none bg-gold-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-none bg-gray-950 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
              New Arrival
            </span>
          )}
          {product.isTrending && (
            <span className="rounded-none bg-sky-800 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            requireAuth(() => toggleWishlist(product));
          }}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-xs transition-colors duration-300 ${
            isLiked
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-white/95 text-gray-600 hover:bg-white hover:text-rose-600 dark:bg-slate-850/95 dark:text-gray-200 dark:hover:bg-slate-800"
          }`}
        >
          <motion.div
            animate={{ scale: isLiked ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Heart size={15} className={isLiked ? "fill-white stroke-white" : "stroke-current"} />
          </motion.div>
        </motion.button>

        {/* Action Button Strip */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-none bg-white py-2.5 text-[10px] uppercase tracking-widest font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gold-50"
          >
            <Eye size={12} /> Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex h-9 w-9 items-center justify-center rounded-none bg-gray-950 text-white shadow-sm transition-colors hover:bg-gold-500"
            title="Add to bag instantly"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400">
          {product.category}
        </p>
        <h3 className="mt-1 flex-1 font-serif text-sm font-semibold text-gray-800 line-clamp-2 dark:text-gray-100 group-hover:text-gold-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.ratings) ? "fill-amber-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono font-medium text-gray-500 dark:text-gray-400">
            {product.ratings} ({product.reviews.length})
          </span>
        </div>

        {/* Pricing Matrix */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-base font-bold text-gray-900 dark:text-gray-100">
            ₹{product.sellingPrice.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-gray-400 line-through">
            ₹{product.mrp.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded-sm">
            {product.discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};
