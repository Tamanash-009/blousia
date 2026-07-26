/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Check, ArrowRight, ArrowLeft, Upload, Scissors, ShieldCheck, Heart, Info, HelpCircle } from "lucide-react";

interface BespokeCustomizerProps {
  onClose: () => void;
  productName?: string;
}

export const BespokeCustomizer: React.FC<BespokeCustomizerProps> = ({ onClose, productName = "Imperial Silk" }) => {
  const { addCustomRequest, requireAuth } = useApp();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customizer state variables
  const [fabric, setFabric] = useState("Pure Banarasi Katan Silk");
  const [primaryColor, setPrimaryColor] = useState("#E11D48"); // default rose crimson
  const [secondaryColor, setSecondaryColor] = useState("#F59E0B"); // gold
  const [borderColor, setBorderColor] = useState("#D97706"); // darker gold
  const [sleeveStyle, setSleeveStyle] = useState("Classic Hemmed");
  const [sleeveLength, setSleeveLength] = useState("Elbow Length (11 inches)");
  const [neckStyle, setNeckStyle] = useState("Sweetheart");
  const [backNeckDesign, setBackNeckDesign] = useState("Teardrop Deep Cutout");
  const [frontNeckDesign, setFrontNeckDesign] = useState("Classic Sweetheart");
  const [paddingOption, setPaddingOption] = useState("Premium Built-in Cups");
  const [liningOption, setLiningOption] = useState("Pure Mulmul Cotton (Breathable)");
  const [blouseLength, setBlouseLength] = useState("14 inches");
  const [embroideryStyle, setEmbroideryStyle] = useState("Zardozi Heavy Bridal");
  const [mirrorWork, setMirrorWork] = useState(false);
  const [zariWork, setZariWork] = useState(true);
  const [stoneWork, setStoneWork] = useState(false);
  const [lace, setLace] = useState("Fine Gota Patti Lace");
  const [tassels, setTassels] = useState("Ornate Beads & Silk Latkans");
  const [buttons, setButtons] = useState("None (Hooks only)");
  const [hooks, setHooks] = useState("Back Closure (Secure)");
  const [piping, setPiping] = useState("Contrasting Silk Piping");
  
  // Custom measurements
  const [bust, setBust] = useState("36 inches");
  const [waist, setWaist] = useState("30 inches");
  const [underbust, setUnderbust] = useState("31 inches");
  const [shoulderToNeck, setShoulderToNeck] = useState("5.5 inches");
  const [armhole, setArmhole] = useState("15.5 inches");
  const [measSleeveLength, setMeasSleeveLength] = useState("11 inches");
  const [measSleeveRound, setMeasSleeveRound] = useState("12 inches");

  const [occasion, setOccasion] = useState("Traditional Wedding / Bridal");
  const [notes, setNotes] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState("");

  const steps = [
    { num: 1, label: "Fabrics & Hues" },
    { num: 2, label: "Neck & Sleeve Pattern" },
    { num: 3, label: "Zari & Embroidery" },
    { num: 4, label: "Fittings & Tailor Notes" }
  ];

  const fabrics = [
    { label: "Pure Banarasi Katan Silk", desc: "Heavy texture, best for traditional weddings", premium: true },
    { label: "Raw Silk Premium", desc: "Crisp architectural drape, textured elegant look", premium: true },
    { label: "Pure Organza Sheer", desc: "Ultra light, airy, and contemporary", premium: false },
    { label: "Organic Handloom Cotton", desc: "Eco-friendly, sweat-absorbent, everyday boutique", premium: false },
    { label: "Royal Velvet Splendor", desc: "Deep regal depth, winter festive reception special", premium: true }
  ];

  const sleeveStyles = ["Classic Hemmed", "Puff Pleated Sleeve", "Cold Shoulder cut", "Sheer Net Organza", "Sleeveless Minimalist"];
  const sleeveLengths = ["Cap Sleeve (4-5 inches)", "Short Sleeve (7-8 inches)", "Elbow Length (10-11 inches)", "Bracelet Sleeve (18-19 inches)", "Full Length (22-23 inches)"];
  
  const neckstyles = ["Sweetheart", "Sophisticated Boat Neck", "High Collar Chinese Neck", "Deep Round Scoop", "Asymmetrical Modern"];
  const backNeckDesigns = ["Teardrop Deep Cutout", "Elegant Square Open Back", "V-Cut with double Dori", "Keyhole buttoned", "Full Sheer Back"];

  const fabricColors = [
    { hex: "#E11D48", label: "Crimson Ruby" },
    { hex: "#BE123C", label: "Bridal Red" },
    { hex: "#4C1D95", label: "Royal Indigo" },
    { hex: "#065F46", label: "Emerald Sabyasachi" },
    { hex: "#B45309", label: "Burnt Ochre" },
    { hex: "#1E293B", label: "Midnight Slate" },
    { hex: "#F59E0B", label: "Muted Gold" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadError("");
      const fileList: File[] = Array.from(files);
      const invalidFile = fileList.find((f: File) => f.size > 10 * 1024 * 1024);
      if (invalidFile) {
        setUploadError("Inspiration file size exceeds the 10MB limit configured by administrator.");
        return;
      }

      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedFiles(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeUploadedFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      addCustomRequest({
        fabric,
        primaryColor,
        secondaryColor,
        borderColor,
        sleeveStyle,
        sleeveLength,
        neckStyle,
        backNeckDesign,
        frontNeckDesign,
        paddingOption,
        liningOption,
        blouseLength,
        embroideryStyle,
        mirrorWork,
        zariWork,
        stoneWork,
        lace,
        tassels,
        buttons,
        hooks,
        piping,
        measurements: {
          bust,
          waist,
          underbust,
          shoulderToNeck,
          armhole,
          sleeveLength: measSleeveLength,
          sleeveRound: measSleeveRound
        },
        occasion,
        notes,
        uploadedFiles
      });
      alert(`Bespoke customization successfully recorded! Blousia® designers will audit your measurements and draft a quotation within 2 hours.`);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-none border border-gold-200 bg-white shadow-2xl dark:bg-slate-950 p-6 sm:p-8 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Header line */}
        <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.05] pb-4 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold-500">Bespoke Atelier</span>
            <h2 className="font-serif text-xl italic font-light text-gray-950 dark:text-white">
              Couture Configuration Suite • {productName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel [X]
          </button>
        </div>

        {/* Stepper Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-50 dark:bg-slate-900 p-3 overflow-x-auto">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className={`flex items-center gap-2 px-3 py-1.5 shrink-0 text-[11px] font-sans transition-all ${
                step === s.num 
                  ? "text-gold-500 font-bold border-b border-gold-400" 
                  : step > s.num 
                    ? "text-emerald-500 font-medium" 
                    : "text-gray-400"
              }`}
            >
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s.num 
                  ? "bg-gold-500 text-white" 
                  : step > s.num 
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20" 
                    : "bg-gray-200 text-gray-500 dark:bg-slate-800"
              }`}>
                {s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Grid with Live Vector Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Config parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: Fabric and colors */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Premium Loom Base</h3>
                  <div className="space-y-2">
                    {fabrics.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setFabric(f.label)}
                        className={`w-full text-left p-3.5 border transition-all flex justify-between items-center ${
                          fabric === f.label 
                            ? "border-gold-500 bg-gold-50/50 dark:bg-gold-950/10" 
                            : "border-black/[0.05] dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{f.label}</span>
                            {f.premium && (
                              <span className="text-[8px] bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 font-bold px-1 py-0.5 rounded uppercase">Heritage Class</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{f.desc}</p>
                        </div>
                        {fabric === f.label && <span className="h-4 w-4 bg-gold-500 rounded-full flex items-center justify-center text-white"><Check size={10} /></span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Fabric color */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Atelier Primary Base Hue</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {fabricColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setPrimaryColor(color.hex)}
                        className={`p-2 border transition-all flex flex-col items-center gap-1.5 ${
                          primaryColor === color.hex ? "border-gold-500 ring-2 ring-gold-100" : "border-black/[0.05] dark:border-white/[0.05]"
                        }`}
                      >
                        <span className="h-6 w-full block rounded-none" style={{ backgroundColor: color.hex }} />
                        <span className="text-[9px] text-gray-500 text-center truncate w-full font-medium">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast Sleeves / Secondary color */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contrast Sleeves / Piping Hue</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {fabricColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSecondaryColor(color.hex)}
                        className={`p-2 border transition-all flex flex-col items-center gap-1.5 ${
                          secondaryColor === color.hex ? "border-gold-500 ring-2 ring-gold-100" : "border-black/[0.05] dark:border-white/[0.05]"
                        }`}
                      >
                        <span className="h-6 w-full block rounded-none" style={{ backgroundColor: color.hex }} />
                        <span className="text-[9px] text-gray-500 text-center truncate w-full font-medium">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gota border hue */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Border & Gota Border Hue</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {fabricColors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setBorderColor(color.hex)}
                        className={`p-2 border transition-all flex flex-col items-center gap-1.5 ${
                          borderColor === color.hex ? "border-gold-500 ring-2 ring-gold-100" : "border-black/[0.05] dark:border-white/[0.05]"
                        }`}
                      >
                        <span className="h-6 w-full block rounded-none" style={{ backgroundColor: color.hex }} />
                        <span className="text-[9px] text-gray-500 text-center truncate w-full font-medium">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Neck & sleeve patterns */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Front Neck Silhouette</label>
                    <select
                      value={neckStyle}
                      onChange={(e) => setNeckStyle(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      {neckstyles.map((n, i) => <option key={i} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Back Neck Royal Curve</label>
                    <select
                      value={backNeckDesign}
                      onChange={(e) => setBackNeckDesign(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      {backNeckDesigns.map((b, i) => <option key={i} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Sleeve Cuff Styling</label>
                    <select
                      value={sleeveStyle}
                      onChange={(e) => setSleeveStyle(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      {sleeveStyles.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Sleeve Vertical Length</label>
                    <select
                      value={sleeveLength}
                      onChange={(e) => setSleeveLength(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      {sleeveLengths.map((sl, i) => <option key={i} value={sl}>{sl}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Boutique Lining Option</label>
                    <select
                      value={liningOption}
                      onChange={(e) => setLiningOption(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="Pure Mulmul Cotton (Breathable)">Pure Mulmul Cotton (Breathable)</option>
                      <option value="Heavy Satin (Lustrous Silhouette)">Heavy Satin (Lustrous Silhouette)</option>
                      <option value="Semi-Crepe (Anti-sweat soft weave)">Semi-Crepe (Anti-sweat soft weave)</option>
                      <option value="No Lining (Sheer Transparent fabric)">No Lining (Sheer Transparent fabric)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Padding Selection</label>
                    <select
                      value={paddingOption}
                      onChange={(e) => setPaddingOption(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="Premium Built-in Cups">Premium Built-in Cups (Invisible comfort)</option>
                      <option value="No padding - Standard bodice Stitch">No padding - Standard bodice Stitch</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Embroidery and accessories */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Embroidery Style & Handwork</label>
                  <select
                    value={embroideryStyle}
                    onChange={(e) => setEmbroideryStyle(e.target.value)}
                    className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                  >
                    <option value="Zardozi Heavy Bridal">Zardozi Heavy Bridal (Dull golden wire work)</option>
                    <option value="Aari Thread embroidery">Aari Thread embroidery (Intricate silk multi-hues)</option>
                    <option value="Gota Patti Traditional Rajasthani">Gota Patti Traditional Rajasthani (Flat gold applique)</option>
                    <option value="Chikankari Handwork">Chikankari Handwork (Delicate shadows & knots)</option>
                    <option value="Minimalist Border Threading Only">Minimalist Border Threading Only</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50/50 dark:bg-slate-900/30 border border-black/[0.03] space-y-3">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Accent Accoutrements</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={zariWork}
                        onChange={(e) => setZariWork(e.target.checked)}
                        className="rounded border-gray-300 accent-gold-500"
                      />
                      <span>Royal Zari Work</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={mirrorWork}
                        onChange={(e) => setMirrorWork(e.target.checked)}
                        className="rounded border-gray-300 accent-gold-500"
                      />
                      <span>Bespoke Mirror Work</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={stoneWork}
                        onChange={(e) => setStoneWork(e.target.checked)}
                        className="rounded border-gray-300 accent-gold-500"
                      />
                      <span>Swarovski Stone Studs</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Back Tassels (Latkans)</label>
                    <select
                      value={tassels}
                      onChange={(e) => setTassels(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="Ornate Beads & Silk Latkans">Ornate Beads & Silk Latkans (Hand-tufted)</option>
                      <option value="Heavy Golden Metal Gungroo">Heavy Golden Metal Gungroo (Chimes beautifully)</option>
                      <option value="Minimal thread knot tassels">Minimal thread knot tassels</option>
                      <option value="No Tassels / Flat Dori">No Tassels / Flat Dori</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Fine Border Lace</label>
                    <select
                      value={lace}
                      onChange={(e) => setLace(e.target.value)}
                      className="w-full rounded-none border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="Fine Gota Patti Lace">Fine Gota Patti Lace</option>
                      <option value="Scalloped Pearl Lace">Scalloped Pearl Lace (Lustrous white pearls)</option>
                      <option value="Broad Velvet Zardozi Border">Broad Velvet Zardozi Border</option>
                      <option value="None (Clean raw borders)">None (Clean raw borders)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Measurements & files */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <Scissors size={14} className="text-gold-500" /> Custom Tailoring Metrics (Inches)
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 dark:bg-slate-900/30 p-4 border border-black/[0.02]">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Chest / Bust</label>
                      <input
                        type="text"
                        value={bust}
                        onChange={(e) => setBust(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Waist round</label>
                      <input
                        type="text"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Underbust</label>
                      <input
                        type="text"
                        value={underbust}
                        onChange={(e) => setUnderbust(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Blouse Height</label>
                      <input
                        type="text"
                        value={blouseLength}
                        onChange={(e) => setBlouseLength(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Shoulder Neck</label>
                      <input
                        type="text"
                        value={shoulderToNeck}
                        onChange={(e) => setShoulderToNeck(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Armhole</label>
                      <input
                        type="text"
                        value={armhole}
                        onChange={(e) => setArmhole(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Sleeve Vertical</label>
                      <input
                        type="text"
                        value={measSleeveLength}
                        onChange={(e) => setMeasSleeveLength(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Sleeve Round</label>
                      <input
                        type="text"
                        value={measSleeveRound}
                        onChange={(e) => setMeasSleeveRound(e.target.value)}
                        className="w-full border border-black/[0.08] dark:border-white/[0.08] px-2 py-1.5 text-xs focus:outline-none bg-white dark:bg-slate-950 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Dropzone */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Upload Reference design / Inspiration sketch</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-gray-300 dark:border-slate-800 p-6 text-center cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition-all"
                  >
                    <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Drag & drop or Click to browse files</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supported formats: JPG, PNG, WEBP, PDF (Max 10MB per file)</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                  </div>
                  {uploadError && <p className="text-[10px] text-rose-500 font-bold">{uploadError}</p>}

                  {/* Uploaded File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-3">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="relative h-14 w-14 border border-gray-100 overflow-hidden bg-gray-50">
                          <img src={file} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional notes */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Atelier Tailor notes & special instructions</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Please make back neck 1 inch higher than standard..."
                    className="w-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-3 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Live Vector Blouse Preview (5 cols) */}
          <div className="lg:col-span-5 bg-[#FBF9F6] dark:bg-slate-900 border border-black/[0.02] dark:border-white/[0.02] p-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.05] pb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Interactive Canvas</span>
              <span className="text-[9px] font-mono font-bold text-gold-500 uppercase flex items-center gap-1">
                <Sparkles size={11} /> Live rendering
              </span>
            </div>

            {/* VECTOR GRAPHICAL BLOUSE SVG - DYNAMIC COLORS BASED ON USER CHOICES */}
            <div className="aspect-square w-full max-w-[260px] mx-auto flex items-center justify-center bg-white dark:bg-slate-950 shadow-inner relative p-4 border border-black/[0.03]">
              
              <svg viewBox="0 0 200 200" className="w-full h-full max-h-[220px]" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Sleeves (Dynamic color) */}
                {sleeveStyle !== "Sleeveless Minimalist" && (
                  <>
                    {/* Left Sleeve */}
                    <path
                      d="M20,60 C25,45 45,45 50,60 C50,60 35,110 30,110 C25,110 15,75 20,60 Z"
                      fill={secondaryColor}
                      stroke={borderColor}
                      strokeWidth="1.5"
                    />
                    {/* Right Sleeve */}
                    <path
                      d="M180,60 C175,45 155,45 150,60 C150,60 165,110 170,110 C175,110 185,75 180,60 Z"
                      fill={secondaryColor}
                      stroke={borderColor}
                      strokeWidth="1.5"
                    />
                    {/* Sleeve Gota borders */}
                    <path d="M23,90 C28,91 38,91 43,90" stroke="#D97706" strokeWidth="2.5" fill="none" />
                    <path d="M177,90 C172,91 162,91 157,90" stroke="#D97706" strokeWidth="2.5" fill="none" />
                  </>
                )}

                {/* 2. Main Bodice / Torso (Primary fabric color) */}
                <path
                  d="M50,60 C70,55 130,55 150,60 C155,90 145,150 140,165 C135,165 65,165 60,165 C55,150 45,90 50,60 Z"
                  fill={primaryColor}
                  stroke={borderColor}
                  strokeWidth="1.5"
                />

                {/* 3. Neck Outline Silhouette (Boatneck vs Sweetheart vs Scoop) */}
                {neckStyle === "Sophisticated Boat Neck" ? (
                  <path d="M50,60 C80,75 120,75 150,60 C130,58 70,58 50,60 Z" fill="#ffffff" className="dark:fill-slate-950" stroke={borderColor} strokeWidth="1" />
                ) : neckStyle === "High Collar Chinese Neck" ? (
                  <path d="M75,55 L125,55 L120,67 L80,67 Z" fill={borderColor} stroke="#ffffff" strokeWidth="1" />
                ) : (
                  /* Sweetheart / Default */
                  <path d="M50,60 C70,95 100,100 100,100 C100,100 130,95 150,60 C125,55 75,55 50,60 Z" fill="#ffffff" className="dark:fill-slate-950" stroke={borderColor} strokeWidth="1" />
                )}

                {/* 4. Golden Gota laces & borders (Dynamic based on accent lace selection) */}
                <path d="M60,160 L140,160" stroke="#D97706" strokeWidth="4" />
                {mirrorWork && (
                  <>
                    {/* Simulated tiny mirror dots */}
                    <circle cx="75" cy="120" r="2.5" fill="#e2e8f0" stroke="#b45309" strokeWidth="1" />
                    <circle cx="100" cy="130" r="2.5" fill="#e2e8f0" stroke="#b45309" strokeWidth="1" />
                    <circle cx="125" cy="120" r="2.5" fill="#e2e8f0" stroke="#b45309" strokeWidth="1" />
                  </>
                )}

                {/* Embroidered thread pattern if heavy zari or zardozi selected */}
                {zariWork && (
                  <path
                    d="M80,140 Q100,120 120,140 M70,110 Q100,90 130,110"
                    stroke="#D97706"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    fill="none"
                  />
                )}
              </svg>
            </div>

            {/* Quick Summary list */}
            <div className="bg-white dark:bg-slate-950 p-4 border border-black/[0.03] space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[9px] border-b border-black/[0.05] pb-1.5">Design Specification Summary</p>
              <div className="flex justify-between">
                <span>Atelier Fabric:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{fabric}</span>
              </div>
              <div className="flex justify-between">
                <span>Neckline Silhouette:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{neckStyle}</span>
              </div>
              <div className="flex justify-between">
                <span>Sleeve Length:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{sleeveLength}</span>
              </div>
              <div className="flex justify-between">
                <span>Embroidery Craft:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">{embroideryStyle}</span>
              </div>
              <div className="flex justify-between">
                <span>Body Bust / Chest:</span>
                <span className="font-mono font-bold text-gold-600 dark:text-gold-400">{bust}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer with step triggers */}
        <div className="flex justify-between items-center border-t border-black/[0.05] dark:border-white/[0.05] pt-4 mt-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            <ArrowLeft size={13} /> Return
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-gray-950 hover:bg-gold-500 text-white dark:bg-white dark:text-gray-950 dark:hover:bg-gold-500 dark:hover:text-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all"
            >
              Continue <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCustomSubmit}
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md"
            >
              <Scissors size={13} /> Dispatch to Atelier <Check size={13} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
