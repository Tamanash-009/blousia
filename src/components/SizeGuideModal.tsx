/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Ruler, HelpCircle, ChevronRight, Check, Compass } from "lucide-react";

interface SizeGuideModalProps {
  onClose: () => void;
  initialSize?: string;
}

interface SizeData {
  size: string; // e.g. "32", "34", "36", etc.
  usSize: string;
  ukSize: string;
  bustInches: number;
  underbustInches: number;
  waistInches: number;
  shoulderInches: number;
  armHoleInches: number;
}

const SIZE_CHART_DATA: SizeData[] = [
  { size: "32", usSize: "2", ukSize: "6", bustInches: 32, underbustInches: 26, waistInches: 25, shoulderInches: 13.5, armHoleInches: 14 },
  { size: "34", usSize: "4", ukSize: "8", bustInches: 34, underbustInches: 28, waistInches: 27, shoulderInches: 14, armHoleInches: 14.5 },
  { size: "36", usSize: "6", ukSize: "10", bustInches: 36, underbustInches: 30, waistInches: 29, shoulderInches: 14.5, armHoleInches: 15 },
  { size: "38", usSize: "8", ukSize: "12", bustInches: 38, underbustInches: 32, waistInches: 31, shoulderInches: 15, armHoleInches: 15.5 },
  { size: "40", usSize: "10", ukSize: "14", bustInches: 40, underbustInches: 34, waistInches: 33, shoulderInches: 15.5, armHoleInches: 16 },
  { size: "42", usSize: "12", ukSize: "16", bustInches: 42, underbustInches: 36, waistInches: 35, shoulderInches: 16, armHoleInches: 16.5 },
  { size: "44", usSize: "14", ukSize: "18", bustInches: 44, underbustInches: 38, waistInches: 37, shoulderInches: 16.5, armHoleInches: 17 },
  { size: "46", usSize: "16", ukSize: "20", bustInches: 46, underbustInches: 40, waistInches: 39, shoulderInches: 17, armHoleInches: 17.5 },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ onClose, initialSize }) => {
  const [unit, setUnit] = useState<"inches" | "cm">("inches");
  const [activeTab, setActiveTab] = useState<"chart" | "how-to-measure" | "calculator">("chart");
  const [selectedRowSize, setSelectedRowSize] = useState<string>(initialSize || "38");
  
  // Size Finder Calculator state
  const [userBust, setUserBust] = useState<string>("");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [recommendationDetail, setRecommendationDetail] = useState<string>("");

  const formatValue = (inches: number) => {
    if (unit === "inches") {
      return `${inches}"`;
    }
    // Convert to cm (1 inch = 2.54 cm)
    const cmValue = Math.round(inches * 2.54 * 10) / 10;
    return `${cmValue} cm`;
  };

  const handleFindSize = (e: React.FormEvent) => {
    e.preventDefault();
    const bustNum = parseFloat(userBust);
    if (isNaN(bustNum) || bustNum <= 0) {
      setRecommendedSize(null);
      setRecommendationDetail("Please enter a valid measurement.");
      return;
    }

    // Standardize input to inches if user is entering in CM
    let bustInInches = bustNum;
    if (unit === "cm") {
      bustInInches = bustNum / 2.54;
    }

    // Blouse sizes usually match the chest/bust measurement closely.
    // If a user's bust is exactly 35.5", they would typically fit a size 36 blouse.
    // Since blouses have built-in margins, we find the closest match or next size up.
    let bestMatch = SIZE_CHART_DATA[0];
    let minDiff = Math.abs(bustInInches - SIZE_CHART_DATA[0].bustInches);

    for (let i = 1; i < SIZE_CHART_DATA.length; i++) {
      const diff = Math.abs(bustInInches - SIZE_CHART_DATA[i].bustInches);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = SIZE_CHART_DATA[i];
      }
    }

    // Custom tailored logic:
    // If user's bust is slightly over a size (e.g., 38.5"), we recommend size 40 or size 38 with alterations.
    const matchingSize = parseInt(bestMatch.size);
    if (bustInInches > matchingSize + 0.5) {
      const nextSizeIndex = SIZE_CHART_DATA.findIndex(s => s.size === bestMatch.size) + 1;
      if (nextSizeIndex < SIZE_CHART_DATA.length) {
        bestMatch = SIZE_CHART_DATA[nextSizeIndex];
      }
    }

    setRecommendedSize(bestMatch.size);
    
    // Detailed fitting advice
    const marginNote = "Our blouses include a generous 2-inch inner seam margin on both sides. This allows you to easily expand or alter the blouse up to 1-2 sizes if needed.";
    if (Math.abs(bustInInches - parseInt(bestMatch.size)) < 0.5) {
      setRecommendationDetail(`Perfect Fit! Size ${bestMatch.size} will fit beautifully. ${marginNote}`);
    } else if (bustInInches < parseInt(bestMatch.size)) {
      setRecommendationDetail(`Size ${bestMatch.size} is recommended for comfort. You can easily tighten the blouse via the pre-stitched side alterations if a snugger fit is desired.`);
    } else {
      setRecommendationDetail(`Size ${bestMatch.size} is recommended. It may fit snug, but the 2-inch built-in adjustment seams will give you custom comfort.`);
    }
  };

  const selectedSizeDetails = SIZE_CHART_DATA.find((s) => s.size === selectedRowSize) || SIZE_CHART_DATA[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-xs"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 flex h-full max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-150 px-5 py-4 dark:border-slate-800 shrink-0 bg-[#FCFBF8] dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Ruler className="text-gold-500" size={20} />
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Blouse Fitting & Size Guide</h2>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Crafted for Royal Silhouettes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs and Unit Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-slate-800/60 gap-3 shrink-0">
          <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-lg gap-1">
            <button
              onClick={() => setActiveTab("chart")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "chart"
                  ? "bg-white dark:bg-slate-900 text-gold-600 dark:text-gold-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab("how-to-measure")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "how-to-measure"
                  ? "bg-white dark:bg-slate-900 text-gold-600 dark:text-gold-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              How to Measure
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "calculator"
                  ? "bg-white dark:bg-slate-900 text-gold-600 dark:text-gold-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              }`}
            >
              Fit Finder
            </button>
          </div>

          {/* Inches vs Centimeters Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gray-400">Unit:</span>
            <div className="flex bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setUnit("inches")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  unit === "inches"
                    ? "bg-gold-500 text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Inches (")
              </button>
              <button
                onClick={() => setUnit("cm")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  unit === "cm"
                    ? "bg-gold-500 text-white shadow-xs"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Metric (cm)
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {/* TAB 1: Size Chart & Converters */}
          {activeTab === "chart" && (
            <div className="space-y-6">
              {/* Dynamic Size highlight info box */}
              <div className="rounded-xl bg-gold-50/50 border border-gold-200/40 p-4 dark:bg-slate-900/40 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Atelier Standard Fit</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Selected Size: <span className="text-gold-600 dark:text-gold-400 font-mono text-base">{selectedRowSize}</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Click any row in the chart below to visualize exact specifications for that size.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-950 p-3 rounded-lg border border-gold-100 dark:border-slate-850">
                  <div className="text-center px-2">
                    <span className="text-[10px] text-gray-400 block font-medium">Bust Fit</span>
                    <span className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200">{formatValue(selectedSizeDetails.bustInches)}</span>
                  </div>
                  <div className="text-center px-2 border-l border-gray-100 dark:border-slate-850">
                    <span className="text-[10px] text-gray-400 block font-medium">Underbust</span>
                    <span className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200">{formatValue(selectedSizeDetails.underbustInches)}</span>
                  </div>
                  <div className="text-center px-2 border-l border-gray-100 dark:border-slate-850">
                    <span className="text-[10px] text-gray-400 block font-medium">Shoulder</span>
                    <span className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200">{formatValue(selectedSizeDetails.shoulderInches)}</span>
                  </div>
                  <div className="text-center px-2 border-l border-gray-100 dark:border-slate-850">
                    <span className="text-[10px] text-gray-400 block font-medium">Arm Hole</span>
                    <span className="text-xs font-bold font-mono text-gray-800 dark:text-gray-200">{formatValue(selectedSizeDetails.armHoleInches)}</span>
                  </div>
                </div>
              </div>

              {/* Chart Table */}
              <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-slate-800">
                        <th className="px-4 py-3">Blouse Size</th>
                        <th className="px-3 py-3 text-center">US</th>
                        <th className="px-3 py-3 text-center">UK / India</th>
                        <th className="px-3 py-3">Bust / Chest</th>
                        <th className="px-3 py-3">Underbust</th>
                        <th className="px-3 py-3">Shoulder Span</th>
                        <th className="px-3 py-3">Arm Hole</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                      {SIZE_CHART_DATA.map((row) => {
                        const isSelected = row.size === selectedRowSize;
                        return (
                          <tr
                            key={row.size}
                            onClick={() => setSelectedRowSize(row.size)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-gold-50/40 dark:bg-gold-950/10 font-bold text-gold-600 dark:text-gold-400"
                                : "hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <td className="px-4 py-3 font-mono font-bold flex items-center gap-1.5">
                              {isSelected && <Check size={12} className="text-gold-500 shrink-0" />}
                              <span>{row.size}</span>
                            </td>
                            <td className="px-3 py-3 text-center font-mono">{row.usSize}</td>
                            <td className="px-3 py-3 text-center font-mono">{row.ukSize}</td>
                            <td className="px-3 py-3 font-mono">{formatValue(row.bustInches)}</td>
                            <td className="px-3 py-3 font-mono">{formatValue(row.underbustInches)}</td>
                            <td className="px-3 py-3 font-mono">{formatValue(row.shoulderInches)}</td>
                            <td className="px-3 py-3 font-mono">{formatValue(row.armHoleInches)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Note about built-in margin */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-950/30 border border-gray-100 dark:border-slate-850 flex items-start gap-2.5">
                <HelpCircle className="text-gold-500 mt-0.5 shrink-0" size={16} />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200">The Atelier Custom Fit Margin</h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    All our luxury ready-to-wear blouses are hand-stitched with a <strong>built-in 2-inch alteration seam</strong> on both sides. This means a Size 38 blouse can easily be expanded to a Size 40 or 42 by loosening the side seam, or easily tucked in for a custom, glove-like fit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: How to Measure */}
          {activeTab === "how-to-measure" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Measurement Tips List */}
                <div className="space-y-5">
                  <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 pb-2 dark:border-slate-800">
                    Step-by-Step Measurement Guide
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        num: "1",
                        title: "Bust / Chest Measurement",
                        desc: "Wrap a flexible measuring tape around the fullest part of your bust, keeping it straight across your back and parallel to the floor. Do not pull too tight."
                      },
                      {
                        num: "2",
                        title: "Underbust (Ribcage)",
                        desc: "Measure around your ribcage, directly under your bust where the lower band of the blouse will rest. This dictates the comfort of the bottom hem."
                      },
                      {
                        num: "3",
                        title: "Shoulder Span",
                        desc: "Measure from the outer edge of one shoulder joint, straight across your upper back to the outer edge of the other shoulder. Crucial for secure necklines."
                      },
                      {
                        num: "4",
                        title: "Arm Hole & Sleeve Length",
                        desc: "Measure around your shoulder joint vertically for armhole. For sleeve length, measure from the shoulder tip down to your desired sleeve sleeve end (e.g., puff, short, or elbow length)."
                      }
                    ].map((step) => (
                      <div key={step.num} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700 text-xs font-bold font-mono dark:bg-gold-950/40 dark:text-gold-400">
                          {step.num}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{step.title}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Golden Rules / Pro Tips Panel */}
                <div className="space-y-5 bg-[#FCFBF8] dark:bg-slate-950/20 p-5 rounded-xl border border-gold-200/20">
                  <h3 className="font-serif text-base font-bold text-gold-700 dark:text-gold-400 flex items-center gap-1.5">
                    <Compass size={16} />
                    Golden Rules for Flawless Blouse Draping
                  </h3>

                  <ul className="space-y-3.5 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                      <span><strong>Wear the right bra:</strong> Measure yourself while wearing the exact style of bra (padded, non-padded, underwired) you plan to wear underneath your blouse.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                      <span><strong>Stand Natural:</strong> Stand straight and breathe naturally. Do not puff out your chest or suck in your stomach, as blouses require comfort during movement.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                      <span><strong>Two-Finger Comfort Rule:</strong> Keep a finger or two flat under the tape while measuring the bust or underbust to ensure there is enough breathing room.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
                      <span><strong>Deep Back Necks:</strong> If choosing a deep back-neck design (greater than 8 inches), consider choosing one size smaller or opting for ties (dori/tassels) to prevent shoulder slippage.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Fit Finder Calculator */}
          {activeTab === "calculator" && (
            <div className="space-y-6 max-w-lg mx-auto py-2">
              <div className="text-center space-y-1.5">
                <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white">Smart Size Recommendation</h3>
                <p className="text-xs text-gray-500">
                  Enter your exact bust measurement, and our system will calculate your ideal ready-to-wear blouse size.
                </p>
              </div>

              <form onSubmit={handleFindSize} className="bg-gray-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-850 p-5 rounded-xl space-y-4">
                <div>
                  <label htmlFor="bustInput" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Bust / Chest Circumference ({unit === "inches" ? 'Inches' : 'Centimeters'}):
                  </label>
                  <div className="relative">
                    <input
                      id="bustInput"
                      type="number"
                      step="0.1"
                      placeholder={unit === "inches" ? "e.g. 37.5" : "e.g. 95.2"}
                      value={userBust}
                      onChange={(e) => setUserBust(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 font-mono text-sm font-semibold outline-none focus:border-gold-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-gray-400">
                      {unit === "inches" ? 'inches' : 'cm'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-950 text-white font-bold text-xs uppercase tracking-widest py-3 hover:bg-gold-600 transition-colors cursor-pointer"
                >
                  Find My Perfect Fit
                </button>
              </form>

              {/* Recommendation Results Stage */}
              <AnimatePresence mode="wait">
                {recommendedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-gold-200/50 bg-gold-50/20 dark:bg-slate-900/40 rounded-xl p-5 text-center space-y-3"
                  >
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-gold-600 dark:text-gold-400">
                      Our Recommendation
                    </span>
                    
                    <div className="space-y-0.5">
                      <div className="inline-flex items-baseline justify-center gap-1 bg-white dark:bg-slate-950 px-4 py-2 rounded-full border border-gold-200/30 shadow-xs">
                        <span className="text-gray-400 text-xs font-bold font-mono">SIZE</span>
                        <span className="text-2xl font-serif font-black text-gold-600 dark:text-gold-400 leading-none">
                          {recommendedSize}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                      {recommendationDetail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-gray-150 p-4 dark:border-slate-800 text-center text-[10px] text-gray-400 font-mono bg-[#FCFBF8] dark:bg-slate-900 shrink-0">
          Need a completely bespoke size? Go to the customizer or tap "Bespoke Draping" in the active tab to chat with our stylist.
        </div>
      </motion.div>
    </div>
  );
};
