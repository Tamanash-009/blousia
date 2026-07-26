/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Product } from "../types";
import { 
  Camera, 
  X, 
  Loader2, 
  Upload, 
  Move, 
  RotateCw, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Smartphone, 
  Eye, 
  Sliders, 
  Maximize2, 
  ShoppingBag,
  Grid
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface VirtualTryOnProps {
  product: Product;
  onClose: () => void;
}

// Gorgeous high-fidelity clipping masks representing real blouses
const CLIPPING_MASKS: Record<string, { name: string; clipPath: string; outlineUrl?: string }> = {
  sweetheart: {
    name: "Royal Sweetheart Cut",
    clipPath: "polygon(18% 32%, 34% 24%, 44% 42%, 50% 33%, 56% 42%, 66% 24%, 82% 32%, 86% 62%, 78% 64%, 74% 100%, 26% 100%, 22% 64%, 14% 62%)"
  },
  highneck: {
    name: "Chinese High Collar",
    clipPath: "polygon(22% 16%, 42% 10%, 50% 18%, 58% 10%, 78% 16%, 84% 55%, 75% 58%, 70% 100%, 30% 100%, 25% 58%, 16% 55%)"
  },
  vneck: {
    name: "Plunging V-Neckline",
    clipPath: "polygon(18% 30%, 34% 24%, 50% 68%, 66% 24%, 82% 30%, 86% 60%, 78% 62%, 74% 100%, 26% 100%, 22% 62%, 14% 60%)"
  },
  boatneck: {
    name: "Sophisticated Boat Neck",
    clipPath: "polygon(18% 28%, 38% 18%, 50% 21%, 62% 18%, 82% 28%, 86% 58%, 78% 60%, 74% 100%, 26% 100%, 22% 60%, 14% 58%)"
  },
  sleeveless: {
    name: "Modern Sleeveless Halter",
    clipPath: "polygon(28% 28%, 38% 16%, 50% 32%, 62% 16%, 72% 28%, 76% 56%, 68% 100%, 32% 100%, 24% 56%)"
  }
};

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  const [mode, setMode] = useState<"camera" | "upload" | "model">("model");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // AR calibration adjustments
  const [scale, setScale] = useState(1.1);
  const [yOffset, setYOffset] = useState(48); // Percentage from top of canvas
  const [xOffset, setXOffset] = useState(50); // Percentage from left
  const [opacity, setOpacity] = useState(0.92);
  const [rotation, setRotation] = useState(0);

  // Lighting & rendering adjustments
  const [brightness, setBrightness] = useState(105); // percentage
  const [contrast, setContrast] = useState(105); // percentage
  const [blendMode, setBlendMode] = useState<"normal" | "multiply" | "overlay" | "screen">("normal");

  // Mask Silhouette based on product specification or default
  const getProductMaskDefault = (): string => {
    const neck = (product.specifications.neckStyle || "").toLowerCase();
    const cat = (product.category || "").toLowerCase();

    if (neck.includes("sweetheart")) return "sweetheart";
    if (neck.includes("collar") || neck.includes("high neck") || neck.includes("chinese")) return "highneck";
    if (neck.includes("v-neck") || neck.includes("plunging")) return "vneck";
    if (neck.includes("boat neck") || neck.includes("boat-neck")) return "boatneck";
    if (cat.includes("sleeveless") || neck.includes("halter")) return "sleeveless";
    return "sweetheart"; // fallback
  };

  const [selectedSilhouette, setSelectedSilhouette] = useState<string>(getProductMaskDefault());
  const [showFaceGuide, setShowFaceGuide] = useState(true);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Background portraits
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Model portraits
  const modelPortraits = [
    { id: "model-1", label: "Model A (Classic Frame)", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=500" },
    { id: "model-2", label: "Model B (Contemporary)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500" },
    { id: "model-3", label: "Model C (Traditional Frame)", url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=500" },
  ];
  const [selectedModelUrl, setSelectedModelUrl] = useState(modelPortraits[0].url);

  // Start Camera
  const startCamera = async () => {
    setError("");
    setLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 800 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
      setMode("camera");
    } catch (err: any) {
      console.error(err);
      setError("Unable to access front camera. Please allow camera permissions or upload a portrait photo.");
    } finally {
      setLoading(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleModeSwitch = (newMode: "camera" | "upload" | "model") => {
    if (newMode !== "camera") {
      stopCamera();
    }
    setMode(newMode);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError("Maximum photo size is 8MB for optimal performance.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserUploadedPhoto(event.target.result as string);
          setMode("upload");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  // Handle Drag Start
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  // Handle Drag Move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    // Translate pixels to relative percentages based on canvas boundaries
    const newXOffset = xOffset + (dx / rect.width) * 100;
    const newYOffset = yOffset + (dy / rect.height) * 100;

    setXOffset(Math.min(100, Math.max(0, newXOffset)));
    setYOffset(Math.min(100, Math.max(0, newYOffset)));
    setDragStart({ x: clientX, y: clientY });
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX, e.clientY);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle Mouse Wheel Zoom inside Canvas
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale((prev) => Math.min(2.5, Math.max(0.4, prev + delta)));
  };

  // Reset Calibrations
  const handleResetCalibration = () => {
    setScale(1.1);
    setXOffset(50);
    setYOffset(48);
    setRotation(0);
    setOpacity(0.92);
    setBrightness(105);
    setContrast(105);
    setBlendMode("normal");
  };

  const handleAddToCart = () => {
    const defaultSize = product.specifications.sizes[0] || "38";
    const defaultColor = product.specifications.colorOptions[0] || "Crimson Red";
    addToCart(product, defaultSize, defaultColor, 1);
    setSuccessMsg(`Added ${product.name} (Size ${defaultSize}) to your Bag!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const currentMask = CLIPPING_MASKS[selectedSilhouette] || CLIPPING_MASKS.sweetheart;
  const blouseTextureUrl = product.images[0];

  return (
    <div id="virtual-try-on-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-none border border-white/10 bg-slate-950 p-5 sm:p-7 max-h-[95vh] overflow-y-auto flex flex-col md:flex-row gap-6 sm:gap-8 text-white animate-fadeIn">
        
        {/* Close Button */}
        <button
          id="close-tryon-modal"
          onClick={() => { stopCamera(); onClose(); }}
          className="absolute right-4 top-4 z-30 rounded-full bg-white/10 p-2 text-gray-300 hover:bg-white hover:text-gray-900 transition-all cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Left Column: Try-On Stage (Drag & Drop Canvas) */}
        <div className="flex-1 max-w-md mx-auto w-full flex flex-col items-center">
          
          {/* Main Stage Canvas */}
          <div 
            ref={stageRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onWheel={handleWheel}
            className="relative w-full aspect-[4/5] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing select-none"
          >
            {/* 1. Camera mode stream */}
            {mode === "camera" && cameraActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
              />
            )}

            {/* 2. Model portrait mode */}
            {mode === "model" && (
              <img
                src={selectedModelUrl}
                alt="Model Portrait"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              />
            )}

            {/* 3. User photo upload mode */}
            {mode === "upload" && userUploadedPhoto && (
              <img
                src={userUploadedPhoto}
                alt="Uploaded Portrait"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              />
            )}

            {/* Loading Cover */}
            {loading && (
              <div className="absolute inset-0 bg-black/75 flex flex-col justify-center items-center z-20">
                <Loader2 size={36} className="animate-spin text-gold-500 mb-2.5" />
                <p className="text-[10px] tracking-widest text-gold-400 font-bold">TUNING AR GRAPHICS...</p>
              </div>
            )}

            {/* High-Fidelity Draped Blouse Texture Layer */}
            <div
              className="absolute pointer-events-none select-none transition-all duration-75 origin-center"
              style={{
                top: `${yOffset}%`,
                left: `${xOffset}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                opacity: opacity,
                width: "74%", // calibrated width for standard torso positioning
                zIndex: 10
              }}
            >
              <div
                className="w-full aspect-[4/4] shadow-xl overflow-hidden transition-all duration-75"
                style={{
                  clipPath: currentMask.clipPath,
                  backgroundImage: `url(${blouseTextureUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  mixBlendMode: blendMode as any
                }}
              />
              
              {/* Highlight Overlay representing realistic stitching structure & lace borders */}
              <div 
                className="absolute inset-0 pointer-events-none border border-gold-500/10"
                style={{ clipPath: currentMask.clipPath }}
              />
            </div>

            {/* Face Alignment dotted guide */}
            {showFaceGuide && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="w-[180px] h-[230px] border-2 border-dashed border-gold-500/50 rounded-[50%] mt-[-40px] opacity-60 flex items-center justify-center">
                  <span className="text-[9px] uppercase tracking-wider text-gold-400 bg-black/60 px-2 py-0.5 rounded font-bold">Align Face Here</span>
                </div>
                <div className="w-[200px] h-1 border-t border-dashed border-gold-500/40 opacity-40 mt-3" />
                <span className="text-[8px] text-gray-400 uppercase tracking-widest bg-black/50 px-2 mt-1">Drape Shoulder Guideline</span>
              </div>
            )}

            {/* Live Status Overlay */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2.5 border border-white/10 flex justify-between items-center z-20">
              <div className="text-left">
                <p className="text-[9px] tracking-wider uppercase text-gold-400 font-bold flex items-center gap-1">
                  <Sparkles size={11} className="animate-pulse" /> Blousia Mirror® AR
                </p>
                <p className="text-[8px] text-gray-400 mt-0.5">Drag to drape. Scroll to stretch & zoom.</p>
              </div>
              <button
                onClick={() => setShowFaceGuide(!showFaceGuide)}
                className={`text-[8px] uppercase font-bold tracking-wider px-2 py-1 border transition-all cursor-pointer ${
                  showFaceGuide ? "border-gold-500/40 text-gold-400 bg-gold-500/10" : "border-white/10 text-gray-400 hover:bg-white/5"
                }`}
              >
                Guide: {showFaceGuide ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Source Input Buttons */}
          <div className="flex gap-2 mt-3.5 w-full">
            <button
              onClick={() => handleModeSwitch("model")}
              className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                mode === "model" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-white/10 hover:bg-white/5 text-gray-300"
              }`}
            >
              Models
            </button>
            <button
              onClick={startCamera}
              className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "camera" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-white/10 hover:bg-white/5 text-gray-300"
              }`}
            >
              <Camera size={11} /> Camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === "upload" ? "border-gold-500 bg-gold-500/10 text-gold-400" : "border-white/10 hover:bg-white/5 text-gray-300"
              }`}
            >
              <Upload size={11} /> Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          {error && <p className="text-[10px] text-rose-500 mt-2 text-center leading-normal max-w-xs">{error}</p>}
        </div>

        {/* Right Column: Controls & Configuration Panel */}
        <div className="w-full md:w-80 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <span className="text-[9px] tracking-[0.3em] uppercase text-gold-500 font-bold block mb-0.5">Designed to Drape</span>
              <h2 className="font-serif text-xl italic font-light text-white leading-tight">Virtual Try-On Lens</h2>
              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                Visualize the authentic texture and print of <span className="text-white font-semibold">{product.name}</span> instantly.
              </p>
            </div>

            {/* Custom neck outline / clipping select */}
            <div className="space-y-2 bg-white/[0.02] border border-white/5 p-3">
              <h4 className="text-[9px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                <Grid size={11} className="text-gold-500" /> Couture Silhouette Cut
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(CLIPPING_MASKS).map(([key, mask]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSilhouette(key)}
                    className={`p-1.5 text-left text-[9px] border transition-all uppercase tracking-wider font-semibold cursor-pointer ${
                      selectedSilhouette === key 
                        ? "border-gold-500 bg-gold-500/10 text-gold-400" 
                        : "border-white/5 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    {mask.name.split(" ")[1] || mask.name}
                  </button>
                ))}
              </div>
            </div>

            {/* AR Alignment Controls */}
            <div className="bg-white/[0.02] border border-white/5 p-3.5 space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1">
                <h3 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                  <Move size={11} className="text-gold-500" /> AR Lens Calibrator
                </h3>
                <button 
                  onClick={handleResetCalibration}
                  className="text-[9px] text-gold-500 uppercase font-bold tracking-wider hover:text-gold-400 cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Scale Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Stretch & Zoom</span>
                  <span className="font-mono text-gold-400">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>

              {/* Vertical Position */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Vertical Positioning</span>
                  <span className="font-mono text-gold-400">{Math.round(yOffset)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="0.5"
                  value={yOffset}
                  onChange={(e) => setYOffset(parseFloat(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Rotate Alignment</span>
                  <span className="font-mono text-gold-400">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>

              {/* Opacity Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Drape Translucency</span>
                  <span className="font-mono text-gold-400">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>
            </div>

            {/* Real-time Rendering Filters */}
            <div className="bg-white/[0.02] border border-white/5 p-3.5 space-y-3">
              <h3 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1 border-b border-white/5 pb-1.5 mb-1">
                <Sliders size={11} className="text-gold-500" /> Lighting Adjustments
              </h3>

              {/* Brightness */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Exposure / Brightness</span>
                  <span className="font-mono text-gold-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="1"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Contrast & Sheen</span>
                  <span className="font-mono text-gold-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="1"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-gold-500 bg-slate-800"
                />
              </div>

              {/* Blend Mode Selection */}
              <div className="space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Shadow Blend Mode</span>
                <div className="flex gap-1">
                  {(["normal", "multiply", "overlay", "screen"] as const).map((modeOption) => (
                    <button
                      key={modeOption}
                      onClick={() => setBlendMode(modeOption)}
                      className={`flex-1 py-1 text-[8px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        blendMode === modeOption 
                          ? "border-gold-500 bg-gold-500/10 text-gold-400" 
                          : "border-white/5 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {modeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Model switch selection (only visible if mode === model) */}
            {mode === "model" && (
              <div className="space-y-1.5 bg-white/[0.02] border border-white/5 p-3">
                <h4 className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Switch Model Portrait</h4>
                <div className="flex flex-col gap-1">
                  {modelPortraits.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModelUrl(m.url)}
                      className={`w-full text-left px-2 py-1.5 border text-[9px] flex justify-between items-center transition-all cursor-pointer ${
                        selectedModelUrl === m.url ? "border-gold-500 bg-white/5 text-white" : "border-white/5 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      <span>{m.label}</span>
                      {selectedModelUrl === m.url && <div className="h-1.5 w-1.5 rounded-full bg-gold-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3.5 border-t border-white/5 space-y-2.5">
            {successMsg && (
              <p className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 p-2 text-center animate-fadeIn">
                {successMsg}
              </p>
            )}

            <div className="flex gap-2">
              <button
                id="tryon-add-to-bag"
                onClick={handleAddToCart}
                className="flex-1 bg-gold-500 hover:bg-gold-600 text-white text-[10px] uppercase tracking-widest font-bold py-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingBag size={12} /> Add Blouse to Bag
              </button>
              
              <button
                id="tryon-conclude"
                onClick={() => { stopCamera(); onClose(); }}
                className="px-4 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-widest font-bold py-3 transition-all cursor-pointer"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
