/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Loader2, 
  Compass, 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  Eye, 
  RotateCcw, 
  Palette, 
  Scissors, 
  Award, 
  Layers 
} from "lucide-react";
import { Product } from "../types";

export const StyleAdvisor: React.FC = () => {
  const { products, setSelectedProduct, addToCart, setActiveTab } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [bodyShape, setBodyShape] = useState("");
  const [preferredFit, setPreferredFit] = useState("");
  const [occasion, setOccasion] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [preferredFabric, setPreferredFabric] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const steps = [
    { id: 1, title: "Aesthetic Style" },
    { id: 2, title: "Fabric Type" },
    { id: 3, title: "Occasion" },
    { id: 4, title: "Preferred Fit" },
    { id: 5, title: "Your Silhouette" },
  ];

  const preferences = [
    { id: "minimalist", label: "Minimalist Elegance", desc: "Understated, crisp clean lines, subtle details & modern splits", tag: "Minimalist" },
    { id: "bohemian", label: "Bohemian Grace", desc: "Free-spirited drapes, organic hand-block textures & artisan trims", tag: "Bohemian" },
    { id: "classic", label: "Classic Royal", desc: "Timeless traditional heritage structures, heavy embroidery & zari border", tag: "Classic" },
    { id: "contemporary", label: "Contemporary Glamour", desc: "Daring plunge necks, glamorous backless dori & shimmering sequins", tag: "Contemporary" },
    { id: "vintage", label: "Vintage Whimsy", desc: "Retro puff sleeves, nostalgic sweetheart collars & romantic romance", tag: "Vintage" },
  ];

  const fabrics = [
    { id: "silk", label: "Pure Banarasi Katan Silk", desc: "Heavy silk sheen with authentic hand-woven zari", tag: "Silk" },
    { id: "cotton", label: "Organic Kalamkari Cotton", desc: "Eco-friendly, natural hand-block prints, sweat-absorbent & crisp", tag: "Cotton" },
    { id: "velvet", label: "Premium Royal Micro-Velvet", desc: "Rich heavy drape with liquid-gold finish & smooth satin lining", tag: "Velvet" },
    { id: "georgette", label: "Designer Georgette & Sequins", desc: "Elegantly flowing drapes covered with sparkling dense micro-sequins", tag: "Georgette" },
    { id: "linen", label: "Linen-Silk Blend", desc: "Understated matte luxury with wrinkle-resistant satin sheen", tag: "Linen" },
  ];

  const occasions = [
    { id: "wedding", label: "Bridal & Wedding Royal", desc: "Grand traditional family celebrations, sangeet, or ceremonies" },
    { id: "party", label: "Cocktail Party & Reception", desc: "Elite glamorous evening events and contemporary soirées" },
    { id: "festive", label: "Festive Pooja & Gatherings", desc: "Celebratory traditional family functions and holiday events" },
    { id: "office", label: "Formal Office Wear", desc: "Cultured, structured professional elegance with high poise" },
    { id: "brunch", label: "Casual Daytime Brunches", desc: "Refined, comfortable high-society daytime social meetups" },
  ];

  const fits = [
    { id: "tailored", label: "Tailored Snug", desc: "Body-sculpting bespoke fit ideal for heavy traditional look" },
    { id: "classic", label: "Classic Comfort", desc: "Standard breathing room with structural princess cuts" },
    { id: "relaxed", label: "Relaxed & Breathable", desc: "Lightweight, airy fit for comfortable, effortless wearing" },
  ];

  const bodyShapes = [
    { id: "hourglass", label: "Hourglass Frame", desc: "Balanced shoulders & hips with defined waist contouring" },
    { id: "pear", label: "Pear Frame", desc: "Slender shoulders with defined waist and fuller hiplines" },
    { id: "rectangle", label: "Rectangle Frame", desc: "Balanced athletic shoulders & hips with sleek straight lines" },
    { id: "apple", label: "Apple Frame", desc: "Elegant bust and limbs with highly comfortable waist drapes" },
    { id: "athletic", label: "Athletic/Inverted Triangle", desc: "Strong, broad shoulders tapering to slender hips" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !stylePreference) {
      setError("Please select a style preference to continue.");
      return;
    }
    if (currentStep === 2 && !preferredFabric) {
      setError("Please select your preferred fabric to continue.");
      return;
    }
    if (currentStep === 3 && !occasion) {
      setError("Please select an occasion to continue.");
      return;
    }
    if (currentStep === 4 && !preferredFit) {
      setError("Please select a fit comfort to continue.");
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGetRecommendations = async () => {
    if (!bodyShape) {
      setError("Please select your silhouette to complete the consultation.");
      return;
    }
    setError("");
    setLoading(true);
    setPortfolio(null);

    try {
      const res = await fetch("/api/gemini/style-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylePreference,
          preferredFabric,
          occasion,
          preferredFit,
          bodyShape,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to compile recommendations from AI Stylist.");
      }

      const data = await res.json();
      setPortfolio(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setBodyShape("");
    setPreferredFit("");
    setOccasion("");
    setStylePreference("");
    setPreferredFabric("");
    setPortfolio(null);
    setCurrentStep(1);
    setError("");
    setSuccessMessage("");
  };

  const handleAddCollectionToBag = (recs: any[]) => {
    let count = 0;
    recs.forEach((rec) => {
      const product = products.find(p => p.id === rec.productId || p.sku === rec.sku);
      if (product) {
        const defaultSize = product.specifications.sizes[0] || "38";
        const defaultColor = product.specifications.colorOptions[0] || "Crimson Red";
        addToCart(product, defaultSize, defaultColor, 1);
        count++;
      }
    });

    if (count > 0) {
      setSuccessMessage(`Splendid choice, darling! Added ${count} couture pieces from your custom "${portfolio?.collectionName || 'Tailored Collection'}" package to your Boutique Bag with an automatic virtual fit calibration.`);
      setTimeout(() => setSuccessMessage(""), 7000);
    }
  };

  return (
    <div id="style-advisor-root" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 block mb-2">Bespoke Couture Intelligence</span>
        <h1 className="font-serif text-3xl font-light text-gray-950 dark:text-white md:text-4xl leading-tight">
          AI Personal Style Quiz
        </h1>
        <p className="mt-3 font-sans text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Embark on a digital draping consultation. Let our neural fashion engine curates an exclusive couture collection tailored specifically to your design desires.
        </p>
      </div>

      {!portfolio && !loading ? (
        /* STYLE QUIZ WIZARD SCREEN */
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.05] shadow-xl overflow-hidden animate-slideUp">
          
          {/* Progress Banner */}
          <div className="bg-[#FBF9F6] dark:bg-slate-950 border-b border-black/[0.03] dark:border-white/[0.03] px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-gold-500" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-900 dark:text-white">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </span>
            </div>
            
            {/* Dots */}
            <div className="flex gap-1.5">
              {steps.map((s) => (
                <div 
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s.id === currentStep 
                      ? "w-6 bg-gold-500" 
                      : s.id < currentStep 
                        ? "w-2 bg-gold-400" 
                        : "w-2 bg-gray-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 min-h-[320px] flex flex-col justify-between">
            
            {/* Step Contents */}
            <div>
              {/* STEP 1: STYLE PREFERENCE */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white mb-1">
                    Select the style aesthetic that defines you:
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Choose the visual aura you wish to manifest in your blouse silhouette.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {preferences.map((p) => (
                      <button
                        key={p.id}
                        id={`pref-btn-${p.id}`}
                        onClick={() => { setStylePreference(p.label); setError(""); }}
                        className={`text-left p-4 border transition-all relative ${
                          stylePreference === p.label
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10"
                            : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{p.label}</span>
                          {stylePreference === p.label && <Check size={12} className="text-gold-500" />}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: FABRIC PREFERENCE */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white mb-1">
                    Your luxury fabric choice:
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Select the textile foundation that speaks to your skin and drape flow.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fabrics.map((f) => (
                      <button
                        key={f.id}
                        id={`fabric-btn-${f.id}`}
                        onClick={() => { setPreferredFabric(f.label); setError(""); }}
                        className={`text-left p-4 border transition-all relative ${
                          preferredFabric === f.label
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10"
                            : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{f.label}</span>
                          {preferredFabric === f.label && <Check size={12} className="text-gold-500" />}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: OCCASION */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white mb-1">
                    Where will you drape this masterpiece?
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Let us align the formal structure and embroidery weight to the venue.</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {occasions.map((o) => (
                      <button
                        key={o.id}
                        id={`occ-btn-${o.id}`}
                        onClick={() => { setOccasion(o.label); setError(""); }}
                        className={`text-left p-3.5 border transition-all flex justify-between items-center ${
                          occasion === o.label
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10"
                            : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{o.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{o.desc}</p>
                        </div>
                        {occasion === o.label && <Check size={14} className="text-gold-500 shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PREFERRED FIT */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white mb-1">
                    Your preferred comfort fit:
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Define how closely you want the princess line and inner lining to sculpt your posture.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {fits.map((f) => (
                      <button
                        key={f.id}
                        id={`fit-btn-${f.id}`}
                        onClick={() => { setPreferredFit(f.label); setError(""); }}
                        className={`text-left p-4 border transition-all flex justify-between items-center ${
                          preferredFit === f.label
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10"
                            : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{f.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{f.desc}</p>
                        </div>
                        {preferredFit === f.label && <Check size={14} className="text-gold-500 shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: SILHOUETTE */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white mb-1">
                    Identify your silhouette shape:
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">Understanding body structures helps us choose neckline offsets and sleeve weights perfectly.</p>
                  <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {bodyShapes.map((b) => (
                      <button
                        key={b.id}
                        id={`shape-btn-${b.id}`}
                        onClick={() => { setBodyShape(b.label); setError(""); }}
                        className={`text-left p-3 border transition-all flex justify-between items-center ${
                          bodyShape === b.label
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10"
                            : "border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-950 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{b.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{b.desc}</p>
                        </div>
                        {bodyShape === b.label && <Check size={14} className="text-gold-500 shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error messaging */}
            {error && (
              <p className="text-[11px] font-medium text-rose-500 mt-4 animate-fadeIn">{error}</p>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-6 mt-8 border-t border-black/[0.03] dark:border-white/[0.03]">
              {currentStep > 1 && (
                <button
                  id="quiz-back-btn"
                  onClick={handleBack}
                  className="px-6 py-3 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[10px] uppercase tracking-widest font-bold hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                >
                  Back
                </button>
              )}
              
              {currentStep < steps.length ? (
                <button
                  id="quiz-next-btn"
                  onClick={handleNext}
                  className="flex-1 bg-gray-950 dark:bg-white dark:text-gray-950 text-white py-3 px-6 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 dark:hover:text-white transition-all ml-auto"
                >
                  Continue <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  id="quiz-generate-btn"
                  onClick={handleGetRecommendations}
                  className="flex-1 bg-gold-500 text-white py-3 px-6 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-gold-600 transition-all ml-auto shadow-md"
                >
                  <Sparkles size={13} /> Complete Consultation
                </button>
              )}
            </div>

          </div>
        </div>
      ) : loading ? (
        /* LOADING SCREEN */
        <div id="advisor-loading-stage" className="max-w-xl mx-auto h-full min-h-[420px] flex flex-col justify-center items-center py-20 text-center bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.05] shadow-xl">
          <Loader2 size={44} className="animate-spin text-gold-500 mb-5" />
          <h3 className="font-serif text-xl italic font-light text-gray-950 dark:text-white">Analyzing Blousia® looms...</h3>
          <p className="text-xs text-gold-600 dark:text-gold-400 uppercase tracking-widest font-bold text-[9px] mt-1.5">Drafting tailored style profile</p>
          
          <div className="max-w-xs mt-6 space-y-2">
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Evaluating fabric parameters: <span className="text-gray-700 dark:text-gray-300 font-bold">{preferredFabric}</span>
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Matching aesthetic lines: <span className="text-gray-700 dark:text-gray-300 font-bold">{stylePreference}</span>
            </p>
            <div className="h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden w-40 mx-auto mt-4">
              <div className="h-full bg-gold-500 animate-loadingProgress" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      ) : (
        /* PORTFOLIO OUTPUT SCREEN */
        <div id="advisor-portfolio-output" className="space-y-8 animate-fadeIn">
          
          {/* Success toast notification */}
          {successMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-gray-950 border border-gold-500/30 text-white p-4 max-w-sm shadow-2xl animate-slideLeft flex items-start gap-3">
              <Check size={18} className="text-gold-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gold-400">Items Added</p>
                <p className="text-[10px] text-gray-300 mt-1 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Style Personality Summary Card */}
          <div className="bg-[#FBF9F6] dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04] p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 opacity-5 dark:opacity-10 pointer-events-none">
              <Compass size={240} className="text-gold-500" />
            </div>

            <div className="text-center md:text-left flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 rounded-full border border-gold-500/20">
                <Award size={12} />
                <span className="text-[9px] uppercase tracking-widest font-bold">Your Style Aura</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl italic font-light text-gray-900 dark:text-white leading-tight">
                  {portfolio.stylePersonality}
                </h2>
                <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-gold-500 mt-1">
                  Bespoke Collection: {portfolio.collectionName}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {portfolio.collectionDescription}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
              <button
                id="reset-quiz-btn"
                onClick={resetQuiz}
                className="px-6 py-3.5 border border-black/10 dark:border-white/10 text-[10px] uppercase tracking-widest font-bold text-gray-700 dark:text-gray-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw size={12} /> Retake Quiz
              </button>
              <button
                id="add-full-collection-btn"
                onClick={() => handleAddCollectionToBag(portfolio.recommendations)}
                className="px-6 py-3.5 bg-gold-500 hover:bg-gold-600 text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all shadow-md hover:scale-[1.01]"
              >
                <ShoppingBag size={12} /> Bag Collection Package
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Curated Recommendations List: 8 cols */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-black/[0.05] dark:border-white/[0.05] pb-3">
                <Palette size={16} className="text-gold-500" />
                <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white">
                  Hand-Drafted Garment Matches
                </h3>
              </div>

              <div className="space-y-6">
                {portfolio.recommendations.map((rec: any, idx: number) => {
                  const matchedProduct = products.find(p => p.id === rec.productId || p.sku === rec.sku);

                  return (
                    <div 
                      key={idx}
                      className="border border-black/[0.05] dark:border-white/[0.05] bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col md:flex-row gap-6 relative group"
                    >
                      {matchedProduct && (
                        <div className="w-full md:w-36 aspect-[4/5] overflow-hidden shrink-0 bg-[#FBF9F6] dark:bg-slate-950 relative border border-black/[0.03] dark:border-white/[0.03]">
                          <img 
                            src={matchedProduct.images[0]} 
                            alt={matchedProduct.name}
                            className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute top-2 left-2 bg-gold-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 shadow-md">
                            {rec.matchPercentage}% MATCH
                          </div>
                        </div>
                      )}

                      <div className="flex-1 space-y-3.5">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest font-bold text-gold-500 block">
                            {rec.category || (matchedProduct ? matchedProduct.category : "Boutique Cut")}
                          </span>
                          <h4 className="font-serif text-md font-semibold text-gray-900 dark:text-white mt-1 leading-tight">
                            {rec.productName || (matchedProduct ? matchedProduct.name : "Custom Fit Blouse")}
                          </h4>
                        </div>

                        <div className="bg-[#FBF9F6] dark:bg-slate-950 p-3.5 border border-black/[0.02] dark:border-white/[0.02]">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 block">Designer Rationale</span>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed italic">
                            "{rec.reasoning}"
                          </p>
                        </div>

                        <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                          <strong className="text-gray-800 dark:text-white">Professional Styling:</strong> {rec.stylingTips}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-black/[0.03] dark:border-white/[0.03]">
                          {matchedProduct ? (
                            <>
                              <button
                                onClick={() => setSelectedProduct(matchedProduct)}
                                className="px-4 py-2 border border-gray-200 dark:border-slate-800 text-[10px] uppercase tracking-wider font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all"
                              >
                                <Eye size={11} /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  const defSize = matchedProduct.specifications.sizes[0] || "38";
                                  const defColor = matchedProduct.specifications.colorOptions[0] || "Crimson Red";
                                  addToCart(matchedProduct, defSize, defColor, 1);
                                  setSuccessMessage(`Added "${matchedProduct.name}" (Size ${defSize}) to your bag.`);
                                  setTimeout(() => setSuccessMessage(""), 5000);
                                }}
                                className="px-4 py-2 bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all shadow-sm"
                              >
                                <ShoppingBag size={11} /> Add to Bag • ₹{matchedProduct.sellingPrice.toLocaleString()}
                              </button>
                            </>
                          ) : (
                            <p className="text-[10px] italic text-gray-400">Pre-ordered bespoke pattern. Consult with our direct design line for fabric allocation.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Styling Board & Details: 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Styling Board Checklist */}
              <div className="bg-[#FBF9F6] dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/[0.05] dark:border-white/[0.05] pb-3">
                  <Scissors size={15} className="text-gold-500" />
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-900 dark:text-white">
                    Styling Board Checklist
                  </h4>
                </div>

                <div className="space-y-4">
                  {portfolio.stylingBoard.map((tip: string, tIdx: number) => {
                    const titles = ["Drape & Pleating", "Accessory & Jewels", "Hair & Makeup Accent"];
                    return (
                      <div key={tIdx} className="flex gap-3 items-start p-3 bg-white dark:bg-slate-950 border border-black/[0.02] dark:border-white/[0.02]">
                        <div className="h-5 w-5 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 shrink-0 mt-0.5">
                          <Check size={11} />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                            {titles[tIdx] || `Couture Guideline ${tIdx + 1}`}
                          </p>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                            {tip}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Brand Promissory Box */}
              <div className="bg-white dark:bg-slate-950 border border-black/[0.04] dark:border-white/[0.04] p-5 text-center space-y-2.5">
                <Layers className="text-gold-500 mx-auto" size={20} />
                <h5 className="text-[10px] uppercase tracking-wider font-bold text-gray-900 dark:text-white">The Blousia® Promise</h5>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  All Blousia® blouses are padded with premium removable foam-molding and carry a generous <strong className="text-gray-700 dark:text-gray-300">2-inch internal seam margin</strong> for perfect, stress-free custom alterations.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
