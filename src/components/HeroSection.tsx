/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ArrowRight, Award, ShieldCheck, RefreshCw, Zap } from "lucide-react";
import { ALL_CATEGORIES } from "../data/products";

export const HeroSection: React.FC = () => {
  const { setActiveTab, setSelectedCategory, selectedCategory } = useApp();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setActiveTab("catalog");
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold-200/10 blur-3xl dark:bg-gold-500/5" />
      <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-rose-luxury/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Brand Story & Statement */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold-500 font-bold block mb-2">
              The 2026 Silk & Heritage Edit
            </span>
            
            <h1 className="font-serif text-5xl font-light tracking-tight text-gray-900 sm:text-6xl md:text-7xl dark:text-white leading-[0.95]">
              Designed to <br />
              <span className="italic font-serif font-normal">Drape</span> <br />
              Confidence.
            </h1>
            
            <p className="mx-auto lg:mx-0 max-w-lg font-sans text-sm text-gray-600 leading-relaxed dark:text-gray-300">
              Welcome to Blousia®, India's premier boutique specializing exclusively in high-end women's blouses. Each piece is meticulously hand-crafted by senior couturiers in Banarasi Silk, French Flax, and Organic Kalamkari, customized with comfortable cotton padding and double-stitched 2-inch alteration margins.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-2">
              <button
                onClick={() => { setSelectedCategory("All"); setActiveTab("catalog"); }}
                className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium rounded-none shadow-sm"
              >
                Explore Boutique Catalog
              </button>
              <button
                onClick={() => setActiveTab("blog")}
                className="text-[11px] uppercase tracking-widest border-b border-gray-900 dark:border-white pb-1 text-gray-900 dark:text-white hover:opacity-50 transition-opacity font-medium"
              >
                Style Diaries
              </button>
            </div>
          </div>

          {/* Luxury Promotional Grid Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm aspect-[4/5] rounded-none overflow-hidden border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
                alt="Blousia Bridal Collection Model Saree"
                className="h-full w-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 block mb-1">
                    Bridal Campaign
                  </span>
                  <p className="font-serif text-2xl italic text-white font-light">
                    The 'Noor' Heritage Edit
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Category Slider Chips */}
        <div className="mt-16 border-t border-gray-100 pt-10 dark:border-slate-900">
          <span className="block text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Browse Bespoke Collections
          </span>
          
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center scrollbar-none px-4">
            <button
              onClick={() => handleCategorySelect("All")}
              className={`px-6 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all shrink-0 border ${
                selectedCategory === "All"
                  ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gold-400 hover:text-gold-600 dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              All Designs
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-6 py-2.5 text-[10px] uppercase tracking-widest font-semibold transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gold-400 hover:text-gold-600 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Enterprise Quality Badges */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-gray-100 pt-10 dark:border-slate-900">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100/40 text-gold-500 shrink-0">
              <Award size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Senior Couturiers</p>
              <p className="text-[10px] text-gray-400">100% handcrafted tailoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100/40 text-gold-500 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Secure Padding Cups</p>
              <p className="text-[10px] text-gray-400">Removable premium structure</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100/40 text-gold-500 shrink-0">
              <RefreshCw size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Alteration Margin</p>
              <p className="text-[10px] text-gray-400">2-inch inner margins on sides</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100/40 text-gold-500 shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Bespoke Fitment</p>
              <p className="text-[10px] text-gray-400">Perfect drape confidence</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
