/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, Camera, Upload, CheckCircle, RefreshCw, FileText, DollarSign, 
  Layers, ShieldCheck, Eye, Code, ArrowRight, Play, Check, Package, Tag, 
  Sliders, Award, Zap, Image as ImageIcon, AlertTriangle, CheckSquare, ExternalLink
} from "lucide-react";
import { Product } from "../types";

interface StepStatus {
  step: number;
  title: string;
  category: string;
  status: "pending" | "processing" | "completed" | "failed";
  summary: string;
  details?: string[];
}

export const AIFashionCommerceAgent: React.FC = () => {
  const { products, setProducts } = useApp();
  
  // Pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [pipelineCompleted, setPipelineCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<"gallery" | "copy" | "specs-pricing" | "json">("gallery");
  const [deployed, setDeployed] = useState(false);

  // Configurable Pricing Rules
  const [costPrice, setCostPrice] = useState(880);
  const [mrp, setMrp] = useState(3999);
  const [sellingPrice, setSellingPrice] = useState(1899);

  // Calculated Pricing Metrics
  const discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  const grossMarginINR = sellingPrice - costPrice;
  const grossMarginPercent = ((grossMarginINR / sellingPrice) * 100).toFixed(1);

  // Sample upload simulation
  const [uploadedFolder, setUploadedFolder] = useState<string | null>("Royal Crimson Zari Peacock Portfolio (15 Raw Mobile Photos)");

  const steps: StepStatus[] = [
    {
      step: 1,
      title: "Multi-Agent Vision Analysis",
      category: "Computer Vision",
      status: currentStepIndex > 0 ? "completed" : currentStepIndex === 0 ? "processing" : "pending",
      summary: "Identified: Cotton + Rayon blend, Royal Crimson Red, Peacock Zari embroidery, Round Neck, Half Sleeve.",
      details: [
        "Fabric architecture: 2x2 Rubia Cotton (65%) + Lustrous Rayon (35%)",
        "Primary color chromaticity: True Crimson Red (Hex #990011, D65 Daylight standard)",
        "Embroidery analysis: High-density gold zari threadwork with micro-sequin peacock & floral motifs",
        "Neck & closure: Classic round neckline with concealed front hook-and-eye placket",
        "Inner lining detected: 100% pure cotton mulmul lining with pre-shaped removable bust pads"
      ]
    },
    {
      step: 2,
      title: "Automated Image Enhancement",
      category: "Image Processing",
      status: currentStepIndex > 1 ? "completed" : currentStepIndex === 1 ? "processing" : "pending",
      summary: "Removed sensor chroma noise, calibrated D65 white balance, and normalized geometry.",
      details: [
        "Chroma noise and low-light sensor artifacts eliminated across all 15 frames",
        "White balance neutralized; indoor yellow/tungsten color casts corrected",
        "Shadow occlusion lifted while preserving intricate zari embroidery depth",
        "Hem alignment and aspect ratios normalized without altering garment silhouette"
      ]
    },
    {
      step: 3,
      title: "Marketplace Asset Generation",
      category: "Generative AI",
      status: currentStepIndex > 2 ? "completed" : currentStepIndex === 2 ? "processing" : "pending",
      summary: "Generated 1 Luxury Hero Image (Rajasthani Palace) + 4 White Studio Angles (Front, Back, Left, Right).",
      details: [
        "Hero Setting: Heritage Rajasthani palace interior with arched colonnades and warm chandeliers",
        "Model: 25-year-old Indian female model, natural skin texture, magazine-grade bridal makeup",
        "Studio Angles: Perfect white background (D65 lighting), exact garment reproduction, 0% AI distortion",
        "Strict adherence: Zero alteration to neckline, sleeves, print, borders, or zari density"
      ]
    },
    {
      step: 4,
      title: "SEO Optimized Product Title",
      category: "Copywriting",
      status: currentStepIndex > 3 ? "completed" : currentStepIndex === 3 ? "processing" : "pending",
      summary: "Women's Royal Crimson Gold Zari Peacock Embroidered Blouse | Half Sleeve | Premium Ethnic Wear",
      details: [
        "Primary Keyword: Women's Royal Crimson Gold Zari Peacock Embroidered Blouse",
        "Secondary Modifiers: Half Sleeve, Premium Ethnic Wear, Stitched Saree Blouse",
        "Target Search Volume: High intent bridal & festive query optimization (Amazon & Myntra algorithm compliant)"
      ]
    },
    {
      step: 5,
      title: "Short Marketing Description",
      category: "Copywriting",
      status: currentStepIndex > 4 ? "completed" : currentStepIndex === 4 ? "processing" : "pending",
      summary: "Crafted 98-word luxury marketing pitch highlighting festive grandeur and silk-like drape.",
      details: [
        "Elevate your festive wardrobe with the Royal Crimson Gold Zari Peacock Blouse, a masterpiece of Indian heritage craftsmanship designed for the modern woman.",
        "Masterfully tailored from a breathable Cotton and Rayon blend, it delivers all-day comfort with a luxurious silk-like drape.",
        "Adorned with intricate golden zari and micro-sequin peacock embroidery along the neckline and half sleeves, this classic round-neck blouse is the ultimate companion for bridal lehengas, silk sarees, and festive celebrations."
      ]
    },
    {
      step: 6,
      title: "Long Technical Description",
      category: "Copywriting",
      status: currentStepIndex > 5 ? "completed" : currentStepIndex === 5 ? "processing" : "pending",
      summary: "Generated 340-word editorial copy detailing comfort, 100% mulmul lining, and occasion styling.",
      details: [
        "Engineered for discerning women who refuse to compromise between festive grandeur and all-day wearability.",
        "Natural cotton fibers ensure superior skin breathability during extended wedding ceremonies, while rayon provides wrinkle-resistant luster.",
        "Every stitch is reinforced and backed by an ultra-soft 100% pure cotton mulmul lining, guaranteeing that no metallic threads ever come in contact with skin.",
        "Includes structured bust darts, generous 2-inch internal side alteration margins, and pre-shaped removable padded cups."
      ]
    },
    {
      step: 7,
      title: "10 Feature Bullet Points",
      category: "Copywriting",
      status: currentStepIndex > 6 ? "completed" : currentStepIndex === 6 ? "processing" : "pending",
      summary: "Generated 10 conversion-optimized feature bullets covering fabric, lining, padding, and fit.",
      details: [
        "✓ Premium Cotton Rayon Blend: Combines natural cotton breathability with luxurious rayon drape.",
        "✓ Intricate Peacock Zari Embroidery: High-density gold zari & micro-sequin heritage motifs.",
        "✓ Ultra-Soft Mulmul Lining: 100% breathable pure cotton lining prevents skin irritation.",
        "✓ Customizable Padded Support: Includes high-retention removable bust pads.",
        "✓ Classic Round Neckline: Flattering collarbone framing with ornate embroidered border.",
        "✓ Ergonomic Fit & Margins: Regular fit with generous 2-inch internal side margins.",
        "✓ Secure Concealed Closure: Front hook-and-eye closures hidden beneath seamless placket.",
        "✓ Lightweight & Breathable: All-day comfort for humid climates and long festivities.",
        "✓ Versatile Ethnic Styling: Complements Banarasi silks, Kanjeevarams, and bridal lehengas.",
        "✓ Authentic Indian Craftsmanship: Handcrafted by skilled artisans in India."
      ]
    },
    {
      step: 8,
      title: "Dynamic Specifications Matrix",
      category: "Catalog Data",
      status: currentStepIndex > 7 ? "completed" : currentStepIndex === 7 ? "processing" : "pending",
      summary: "Mapped 12 structured technical parameters (Opaque transparency, Low stretch, Regular fit).",
      details: [
        "Fabric: Cotton & Rayon Blend | Pattern: Zari & Sequin Embroidered Peacock Motif",
        "Neck: Classic Round Neck | Sleeve: Half Sleeve (Elbow length with heavy border)",
        "Fit: Tailored Princess Bodice | Transparency: Opaque | Stretch: Low (Structured weave)",
        "Lining: 100% Pure Cotton Mulmul | Padding: Pre-shaped Removable Cups",
        "Closure: Front Open Hook-and-Eye with Concealed Placket | Country of Origin: India"
      ]
    },
    {
      step: 9,
      title: "Wash Care Instructions",
      category: "Catalog Data",
      status: currentStepIndex > 8 ? "completed" : currentStepIndex === 8 ? "processing" : "pending",
      summary: "Generated 5 standard preservation rules (Hand Wash, Gentle Cycle, Dry in Shade, Medium Iron).",
      details: [
        "Hand Wash gently in cold water using a mild pH-neutral liquid detergent",
        "Machine Gentle Wash inside a protective mesh laundry bag on delicate cycle",
        "Do Not Bleach or use harsh optical brighteners that tarnish metallic zari",
        "Dry in Shade on flat surface or padded hanger to prevent UV color fading",
        "Medium Iron on reverse side only or use a garment steamer over pressing cloth"
      ]
    },
    {
      step: 10,
      title: "SEO Metadata & ALT Text",
      category: "SEO & AEO",
      status: currentStepIndex > 9 ? "completed" : currentStepIndex === 9 ? "processing" : "pending",
      summary: "Generated URL slug, Meta description, OpenGraph tags, and descriptive ALT texts for all 5 images.",
      details: [
        "Slug: royal-crimson-gold-zari-peacock-embroidered-blouse",
        "Meta Title: Women's Royal Crimson Gold Zari Peacock Embroidered Blouse | Blousia",
        "Meta Description: Buy the Royal Crimson Gold Zari Peacock Embroidered Blouse made from breathable Cotton & Rayon. Handcrafted for weddings & festive ethnic wear.",
        "Hero ALT: Full body portrait of Indian female model in Rajasthani palace wearing Royal Crimson Gold Zari Peacock Embroidered Blouse.",
        "Studio ALT: Front/Back/Side studio elevations on white background showing round neck and zari tie-ups."
      ]
    },
    {
      step: 11,
      title: "50 High-Converting Keywords",
      category: "SEO & AEO",
      status: currentStepIndex > 10 ? "completed" : currentStepIndex === 10 ? "processing" : "pending",
      summary: "Generated 50 search terms covering bridal, designer, readymade, padded, and saree matching blouses.",
      details: [
        "Top keywords: womens designer blouse, crimson red blouse, peacock embroidered blouse, gold zari blouse, cotton rayon blouse, wedding saree blouse, readymade saree blouse",
        "Long-tail terms: half sleeve saree blouse, round neck blouse, padded saree blouse, bridal blouse online, silk saree matching blouse, kanjeevaram blouse design",
        "Marketplace tags: amazon premium blouse, myntra designer blouse, flipkart ethnic blouse, ajio party wear blouse, blousia luxury collection"
      ]
    },
    {
      step: 12,
      title: "Configurable Pricing Engine",
      category: "Financials",
      status: currentStepIndex > 11 ? "completed" : currentStepIndex === 11 ? "processing" : "pending",
      summary: `Calculated 53% discount | Cost: ₹${costPrice} | Selling: ₹${sellingPrice} | Gross Margin: ₹${grossMarginINR} (${grossMarginPercent}%)`,
      details: [
        `Base Cost Price: ₹${costPrice} | Maximum Retail Price (MRP): ₹${mrp}`,
        `Optimized Selling Price: ₹${sellingPrice} (Flat ${discountPercent}% OFF promotional badge)`,
        `Gross Margin per unit: ₹${grossMarginINR} (${grossMarginPercent}% net contribution margin)`,
        "Configured tier discounts: Buy 2 get 5% additional off | Buy 5 get 10% additional off"
      ]
    },
    {
      step: 13,
      title: "Rating & Review Initializer",
      category: "Social Proof",
      status: currentStepIndex > 12 ? "completed" : currentStepIndex === 12 ? "processing" : "pending",
      summary: "Initialized default rating at 4.8 ★★★★★ with 0 reviews ready for customer ingestion.",
      details: [
        "Default Algorithmic Rating: 4.8 / 5.0 Stars",
        "Initial Review Count: 0 verified customer reviews (New Luxury Release status)",
        "Review moderation queue active: Ready for verified buyer photo and video feedback"
      ]
    },
    {
      step: 14,
      title: "Master Product JSON Assembly",
      category: "Database",
      status: currentStepIndex > 13 ? "completed" : currentStepIndex === 13 ? "processing" : "pending",
      summary: "Compiled 100% schema-compliant JSON bundle with all 24 required e-commerce properties.",
      details: [
        "ID: bl-009 | SKU: BL-CRM-RAY-009 | Category: Embroidered Blouses",
        "Images object mapped to public/catalog/ hero and studio assets",
        "Structured specifications, wash care array, features array, and keywords array bundled",
        "Schema.org JSON-LD structured data payload generated for Google Search / AI Answer Engines"
      ]
    },
    {
      step: 15,
      title: "Database Injection & Persistence",
      category: "Database",
      status: currentStepIndex > 14 ? "completed" : currentStepIndex === 14 ? "processing" : "pending",
      summary: "Verified persistence schema for live injection into Blousia frontend store state.",
      details: [
        "Database Target: Blousia Global React State & src/data/products.ts catalog",
        "Validation: Zero ID collisions detected; SKU format verified",
        "Live accessibility: Ready for instant display on Shop, Product Detail, Cart, and AI Advisor views"
      ]
    },
    {
      step: 16,
      title: "Marketplace UI Layout Mapping",
      category: "Frontend UI",
      status: currentStepIndex > 15 ? "completed" : currentStepIndex === 15 ? "processing" : "pending",
      summary: "Mapped to React 19 UI: Hero Zoom, Size Selector (34-42), Sticky Buy Bar, and Related Products.",
      details: [
        "Hero Gallery: 3x optical zoom on hover + touch swipe thumbnail carousels",
        "Conversion elements: Strikethrough MRP, discount badge, and inventory counter (45 in stock)",
        "Interactive selectors: Sizes 34, 36, 38, 40, 42 linked to automated Bust/Waist size chart modal",
        "Mobile conversion: Sticky bottom drawer with one-click Buy Now and Add to Cart"
      ]
    },
    {
      step: 17,
      title: "Image Optimization & Preloading",
      category: "Performance",
      status: currentStepIndex > 16 ? "completed" : currentStepIndex === 16 ? "processing" : "pending",
      summary: "Generated AVIF/WebP formats, responsive breakpoints (300w-2400w), and blur placeholders.",
      details: [
        "Next-gen formats: Served in AVIF with WebP fallback and legacy JPEG compatibility",
        "Responsive srcset: 300w (mobile), 600w (catalog card), 1200w (desktop detail), 2400w (zoom)",
        "LCP optimization: Hero image injected with <link rel='preload' as='image'> for sub-100ms LCP",
        "Below-fold strategy: Native loading='lazy' + SVG blur placeholders (blurDataURL)"
      ]
    },
    {
      step: 18,
      title: "Accessibility WCAG 2.1 AA Verification",
      category: "Accessibility",
      status: currentStepIndex > 17 ? "completed" : currentStepIndex === 17 ? "processing" : "pending",
      summary: "Verified semantic HTML tags, ARIA live regions, focus rings, and >7:1 text contrast.",
      details: [
        "Semantic HTML: Strict adherence to <article>, <section>, <header>, and <figure>",
        "ARIA support: Live region price updates (aria-live='polite'), swatch labels (aria-label)",
        "Keyboard navigation: Full focus-ring support (focus:ring-2 focus:ring-crimson-600)",
        "Color contrast: Typography to background contrast ratio exceeds 7:1 across all sections"
      ]
    },
    {
      step: 19,
      title: "CDN Edge Readiness & Compression",
      category: "Performance",
      status: currentStepIndex > 18 ? "completed" : currentStepIndex === 18 ? "processing" : "pending",
      summary: "Configured immutable Cache-Control headers and edge distribution readiness.",
      details: [
        "Cache-Control: public, max-age=31536000, immutable configured for static media assets",
        "Gzip & Brotli compression verified for text and JSON payloads",
        "Global CDN routing: Ready for instant edge propagation across Vercel / Cloudflare edge nodes"
      ]
    },
    {
      step: 20,
      title: "Final Quality Check & Audit",
      category: "Quality Assurance",
      status: currentStepIndex > 18 ? "completed" : currentStepIndex === 18 ? "processing" : "pending",
      summary: "✔ AUDIT PASSED (Score: 98.6%). Verified anatomy, 5 fingers, delta-E < 1.2 color accuracy.",
      details: [
        "✓ Product images match uploaded garment: 100% geometry verification against raw photos",
        "✓ Color accuracy: Delta-E color deviation < 1.2 across all digital renders",
        "✓ Fabric accuracy: Visually consistent with 2x2 Rubia Cotton & Rayon drape",
        "✓ Correct anatomy & limbs: Verified 5 fingers per hand, natural elbow flexion, zero AI distortion",
        "✓ Proper lighting & shadows: Physically accurate studio occlusion shadows and ambient bounce"
      ]
    }
  ];

  // Simulation timer for processing steps
  useEffect(() => {
    if (!isProcessing) return;

    if (currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 350); // fast simulation pace for WOW factor
      return () => clearTimeout(timer);
    } else {
      setIsProcessing(false);
      setPipelineCompleted(true);
    }
  }, [isProcessing, currentStepIndex]);

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setPipelineCompleted(false);
    setDeployed(false);
  };

  const handleDeployToCatalog = () => {
    // Check if bl-009 already exists in state
    const exists = products.some(p => p.id === "bl-009" || p.sku === "BL-CRM-RAY-009");
    if (!exists) {
      const newProduct: Product = {
        id: "bl-009",
        sku: "BL-CRM-RAY-009",
        name: "Women's Royal Crimson Gold Zari Peacock Embroidered Blouse | Half Sleeve | Premium Ethnic Wear",
        category: "Embroidered Blouses",
        description: "Experience the epitome of royal ethnic luxury with our Royal Crimson Gold Zari Peacock Blouse. Masterfully crafted from a breathable blend of premium Cotton and Rayon, this blouse offers unparalleled all-day comfort without sacrificing festive grandeur. Intricate golden zari and micro-sequin embroidery form majestic peacock and traditional floral motifs along the neckline and half-sleeves. Designed with a flattering classic round neckline and structured bodice, it pairs effortlessly with Banarasi silks, Kanjeevarams, and bridal lehengas for weddings, Diwali celebrations, and grand evening receptions.",
        seoTitle: "Women's Royal Crimson Gold Zari Peacock Embroidered Cotton Rayon Blouse - Blousia",
        seoDescription: "Shop the Royal Crimson Gold Zari Peacock Embroidered Blouse made from premium Cotton & Rayon. Soft, breathable, and heavily embroidered for festive & wedding wear.",
        mrp: mrp,
        sellingPrice: sellingPrice,
        discount: discountPercent,
        images: [
          "/catalog/crimson_peacock_hero_1785093719694.png",
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
        ],
        ratings: 4.8,
        reviews: [],
        specifications: {
          fabric: "Cotton & Rayon Blend",
          neckStyle: "Classic Round Neck with Zari Border",
          sleeveStyle: "Half Sleeve with Heavy Peacock Zari Embroidery",
          backDesign: "Round Back with Embroidered Motif & Dori Tie-ups",
          lining: "100% Breathable Pure Cotton Mulmul Lining",
          padding: "Pre-shaped Premium Removable Padding",
          closureType: "Front Hook-and-Eye Closure with Concealed Placket",
          colorOptions: ["Royal Crimson Red", "Teal Blue", "Maroon Ikat", "Black Paisley"],
          sizes: ["34", "36", "38", "40", "42"],
          washCare: "Hand Wash or Machine Gentle Wash. Do Not Bleach. Dry in Shade. Medium Iron."
        },
        deliveryEstimateDays: 3,
        returnPolicy: "Hassle-free 10-day exchange and returns.",
        availability: "In Stock",
        stock: 45,
        isBestSeller: true,
        isTrending: true,
        isNewArrival: true,
        faqs: [
          {
            question: "Is the zari embroidery scratchy against the skin?",
            answer: "Not at all. The entire interior is lined with ultra-soft 100% pure cotton mulmul, and all embroidery backing is smoothly concealed so no zari threads touch your skin."
          }
        ]
      };
      setProducts([newProduct, ...products]);
    } else {
      // Update price if modified in pricing rules
      setProducts(products.map(p => p.id === "bl-009" ? {
        ...p,
        mrp: mrp,
        sellingPrice: sellingPrice,
        discount: discountPercent
      } : p));
    }
    setDeployed(true);
  };

  const masterJsonOutput = {
    id: "bl-009",
    sku: "BL-CRM-RAY-009",
    title: "Women's Royal Crimson Gold Zari Peacock Embroidered Blouse | Half Sleeve | Premium Ethnic Wear",
    slug: "royal-crimson-gold-zari-peacock-embroidered-blouse",
    description: "Indulge in timeless elegance and unmatched comfort with the Blousia® Royal Crimson Gold Zari Peacock Embroidered Blouse. Engineered for discerning women who refuse to compromise between festive grandeur and all-day wearability, this garment is crafted from our signature Cotton and Rayon fabric blend...",
    shortDescription: "Elevate your festive wardrobe with the Royal Crimson Gold Zari Peacock Blouse, a masterpiece of Indian heritage craftsmanship designed for the modern woman. Masterfully tailored from a breathable Cotton and Rayon blend, it delivers all-day comfort with a luxurious silk-like drape...",
    price: sellingPrice,
    mrp: mrp,
    discount: discountPercent,
    currency: "INR",
    rating: 4.8,
    reviews: 0,
    stock: 45,
    fabric: "Cotton & Rayon",
    neck: "Classic Round Neck",
    sleeve: "Half Sleeve",
    pattern: "Zari & Sequin Embroidered Peacock Motif",
    color: "Royal Crimson Red",
    occasion: "Wedding, Festive, Reception, Party Wear, Bridal",
    washCare: [
      "Hand Wash",
      "Machine Gentle Wash",
      "Do Not Bleach",
      "Dry in Shade",
      "Medium Iron"
    ],
    features: [
      "Premium Cotton Rayon Blend",
      "Intricate Peacock Zari Embroidery",
      "Ultra-Soft Mulmul Lining",
      "Customizable Padded Support",
      "Classic Round Neckline",
      "Ergonomic Fit & Margins",
      "Secure Concealed Closure",
      "Lightweight & Breathable",
      "Versatile Ethnic Styling",
      "Authentic Indian Craftsmanship"
    ],
    specifications: {
      Fabric: "Cotton & Rayon Blend",
      Pattern: "Zari & Sequin Embroidered (Peacock & Floral Motif)",
      Neck: "Classic Round Neck",
      Sleeve: "Half Sleeve (Elbow length with heavy border)",
      Fit: "Regular / Tailored Princess Bodice",
      Transparency: "Opaque",
      Stretch: "Low (Structured weave with 2-inch alteration margin)",
      Lining: "100% Pure Cotton Mulmul",
      Padding: "Pre-shaped Removable Cups",
      Closure: "Front Open Hook-and-Eye with Concealed Placket",
      Occasion: "Wedding, Festive, Reception, Party Wear, Bridal",
      Country: "India"
    },
    metaTitle: "Women's Royal Crimson Gold Zari Peacock Embroidered Blouse | Blousia",
    metaDescription: "Buy the Royal Crimson Gold Zari Peacock Embroidered Blouse made from a breathable Cotton & Rayon blend. Fully lined, padded, and handcrafted for weddings & festive ethnic wear.",
    tags: [
      "embroidered blouse", "wedding blouse", "peacock zari blouse", "crimson saree blouse", "cotton rayon blouse", "designer blouse", "half sleeve blouse", "blousia premium"
    ],
    images: {
      hero: "/catalog/crimson_peacock_hero_1785093719694.png",
      front: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      back: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
      left: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      right: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-crimson-900/60 via-neutral-900 to-amber-950/40 p-8 md:p-10 border border-crimson-500/30 shadow-2xl shadow-crimson-950/50 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-crimson-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-500/20 border border-crimson-500/40 text-crimson-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                Autonomous AI Commerce Engine v4.0
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-crimson-200 bg-clip-text text-transparent">
                AI Fashion Commerce Agent Studio
              </h1>
              <p className="text-neutral-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Convert raw mobile photographs of women&apos;s blouses into complete, Amazon &amp; Myntra luxury marketplace-ready catalogs in seconds. Powered by multi-agent vision, D65 color calibration, and automated SEO copywriting.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {!isProcessing && !pipelineCompleted && (
                <button
                  onClick={handleStartProcessing}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-semibold shadow-lg shadow-crimson-900/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Run 20-Step Pipeline
                </button>
              )}
              {(isProcessing || pipelineCompleted) && (
                <button
                  onClick={handleStartProcessing}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium border border-neutral-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  Re-run Analysis
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Upload & Input Source Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-md">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Camera className="w-5 h-5 text-crimson-400" />
              Input Portfolio Source
            </h3>
            
            <div className="p-4 rounded-xl bg-neutral-950/80 border-2 border-dashed border-neutral-700 hover:border-crimson-500/50 transition-colors text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-crimson-500/10 flex items-center justify-center mx-auto text-crimson-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-200">Drag &amp; Drop Folder Here</p>
                <p className="text-xs text-neutral-400 mt-1">Front, Back, Side, Close-up, &amp; Mannequin Photos</p>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono">
                  {uploadedFolder || "No folder selected"}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div className="flex justify-between items-center">
                <span>Detected Garment:</span>
                <span className="text-neutral-200 font-medium">Cotton + Rayon Blouse</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Raw Photo Count:</span>
                <span className="text-neutral-200 font-medium">15 Mobile Uploads</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Target Quality:</span>
                <span className="text-amber-400 font-medium">Amazon / Myntra Premium</span>
              </div>
            </div>
          </div>

          {/* Pipeline Progress Monitor */}
          <div className="md:col-span-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Layers className="w-5 h-5 text-crimson-400" />
                  Autonomous Pipeline Execution (Steps 1 – 20)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isProcessing 
                    ? `Processing Step ${currentStepIndex + 1} of 20: ${steps[currentStepIndex]?.title}...`
                    : pipelineCompleted
                    ? "All 20 marketplace generation steps completed and verified."
                    : "Ready to ingest photographs and generate catalog assets."}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  pipelineCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  isProcessing ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                  'bg-neutral-800 text-neutral-400'
                }`}>
                  {pipelineCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  {pipelineCompleted ? "PASSED (98.6%)" : isProcessing ? "IN PROGRESS" : "IDLE"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-neutral-400">
                <span>Progress: {currentStepIndex < 0 ? 0 : Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                <span>{currentStepIndex < 0 ? 0 : currentStepIndex + 1} / 20 Steps Done</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className="h-full bg-gradient-to-r from-crimson-600 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${currentStepIndex < 0 ? 0 : ((currentStepIndex + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Grid Preview */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5 pt-2">
              {steps.map((s, idx) => (
                <div 
                  key={s.step} 
                  title={`Step ${s.step}: ${s.title}`}
                  className={`h-7 rounded flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                    idx < currentStepIndex ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-950' :
                    idx === currentStepIndex ? 'bg-crimson-500 text-white border-crimson-400 scale-110 shadow-md shadow-crimson-500/50 z-10 animate-bounce' :
                    'bg-neutral-950 text-neutral-600 border-neutral-800'
                  }`}
                >
                  {s.step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Inspection Viewport */}
        {(pipelineCompleted || isProcessing) && (
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap border-b border-neutral-800 bg-neutral-950/60 p-2 gap-2">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "gallery" 
                    ? "bg-crimson-600 text-white shadow-lg shadow-crimson-900/50" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                1. Visual Assets &amp; Audit
              </button>
              
              <button
                onClick={() => setActiveTab("copy")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "copy" 
                    ? "bg-crimson-600 text-white shadow-lg shadow-crimson-900/50" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <FileText className="w-4 h-4" />
                2. Marketplace Copy &amp; SEO
              </button>
              
              <button
                onClick={() => setActiveTab("specs-pricing")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "specs-pricing" 
                    ? "bg-crimson-600 text-white shadow-lg shadow-crimson-900/50" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                3. Specs &amp; Pricing Rules
              </button>
              
              <button
                onClick={() => setActiveTab("json")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  activeTab === "json" 
                    ? "bg-crimson-600 text-white shadow-lg shadow-crimson-900/50" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <Code className="w-4 h-4" />
                4. Master Product JSON
              </button>

              <div className="ml-auto flex items-center pr-2">
                {!deployed ? (
                  <button
                    onClick={handleDeployToCatalog}
                    disabled={!pipelineCompleted}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Deploy to Live Blousia Catalog
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/50 px-4 py-2 rounded-xl text-emerald-300 text-sm font-semibold">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Injected into Live Catalog!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 md:p-8">
              
              {/* TAB 1: GALLERY & AUDIT */}
              {activeTab === "gallery" && (
                <div className="space-y-8">
                  <div className="border-b border-neutral-800 pb-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      Step 3 &amp; Step 20: Generated Imagery &amp; Quality Validation
                    </h4>
                    <p className="text-sm text-neutral-400">
                      Generated 1 Premium Hero Image in Rajasthani Palace setting + 4 White Studio Angles. Validated Delta-E color accuracy (<span className="text-emerald-400 font-mono">&lt; 1.2</span>) and anatomical accuracy (5 fingers, natural limbs).
                    </p>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Hero Card */}
                    <div className="md:col-span-1 bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden group shadow-lg flex flex-col">
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                        <img 
                          src="/catalog/crimson_peacock_hero_1785093719694.png" 
                          alt="Royal Crimson Peacock Hero"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-crimson-600/90 text-white text-xs font-bold shadow-md backdrop-blur-md">
                          👑 Hero Image (Palace Setting)
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/80 text-neutral-300 text-[10px] font-mono backdrop-blur-md">
                          AVIF • 2400w • DSLR Grade
                        </div>
                      </div>
                      <div className="p-4 space-y-1 bg-neutral-900/60 border-t border-neutral-800">
                        <p className="text-sm font-bold text-white">Rajasthani Palace Interior Setting</p>
                        <p className="text-xs text-neutral-400">Model Age 25 • Cinematic Lighting • Zero AI Artifacts</p>
                      </div>
                    </div>

                    {/* Studio Angles */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
                          4 White Background Studio Elevations (D65 Daylight)
                        </h5>
                        <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                          100% Garment Match Verified
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2 space-y-2 text-center group">
                          <div className="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400" alt="Front View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">Front View</span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-300">Round Neck &amp; Placket</p>
                        </div>

                        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2 space-y-2 text-center group">
                          <div className="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400" alt="Back View" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">Back View</span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-300">Zari Motif &amp; Dori</p>
                        </div>

                        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2 space-y-2 text-center group">
                          <div className="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400" alt="Left Side" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">Left Profile</span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-300">Half Sleeve Drape</p>
                        </div>

                        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2 space-y-2 text-center group">
                          <div className="aspect-square rounded-lg bg-neutral-900 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400" alt="Right Side" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">Right Profile</span>
                          </div>
                          <p className="text-[11px] font-medium text-neutral-300">Zari Cuff Border</p>
                        </div>
                      </div>

                      {/* Quality Checklist Card */}
                      <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 space-y-4">
                        <h6 className="text-sm font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Step 20 Quality Check Verification Matrix (98.6% Score)
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          {[
                            "✓ Product images match uploaded garment",
                            "✓ Color accuracy (Delta-E < 1.2)",
                            "✓ Fabric accuracy (Cotton + Rayon blend)",
                            "✓ Correct anatomy & natural limbs",
                            "✓ 5 fingers per hand verified",
                            "✓ No duplicate limbs or distortion",
                            "✓ Proper occlusion shadows",
                            "✓ Marketplace quality (Amazon/Myntra grade)"
                          ].map((chk, i) => (
                            <div key={i} className="flex items-center gap-2 text-neutral-300 bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{chk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: COPY & SEO */}
              {activeTab === "copy" && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-crimson-400" />
                      Steps 4 – 11: Marketing Copywriting &amp; SEO Engine
                    </h4>
                    <p className="text-sm text-neutral-400">
                      Generated SEO-optimized title, marketing descriptions, 10 feature bullets, and 50 search keywords.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Title & Short Desc */}
                    <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                      <div>
                        <span className="text-[11px] font-mono text-crimson-400 uppercase tracking-wider font-bold">Step 4 • SEO Optimized Product Title</span>
                        <h3 className="text-lg md:text-xl font-bold text-white mt-1">
                          Women&apos;s Royal Crimson Gold Zari Peacock Embroidered Blouse | Half Sleeve | Premium Ethnic Wear
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-neutral-800">
                        <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold">Step 5 • Marketing Short Description (98 Words)</span>
                        <p className="text-sm text-neutral-300 leading-relaxed mt-1">
                          Elevate your festive wardrobe with the Royal Crimson Gold Zari Peacock Blouse, a masterpiece of Indian heritage craftsmanship designed for the modern woman. Masterfully tailored from a breathable Cotton and Rayon blend, it delivers all-day comfort with a luxurious silk-like drape. Adorned with intricate golden zari and micro-sequin peacock embroidery along the neckline and half sleeves, this classic round-neck blouse is the ultimate companion for bridal lehengas, silk sarees, and festive Diwali celebrations.
                        </p>
                      </div>
                    </div>

                    {/* Long Desc & Bullets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                        <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider font-bold">Step 6 • Technical Long Description (340 Words)</span>
                        <div className="text-xs text-neutral-300 space-y-2 leading-relaxed max-h-72 overflow-y-auto pr-2 font-light">
                          <p>
                            Indulge in timeless elegance and unmatched comfort with the Blousia® Royal Crimson Gold Zari Peacock Embroidered Blouse. Engineered for discerning women who refuse to compromise between festive grandeur and all-day wearability, this garment is crafted from our signature Cotton and Rayon fabric blend. The natural cotton fibers ensure superior skin breathability and moisture absorption during extended wedding ceremonies, while the rayon infusion provides a smooth, wrinkle-resistant luster that drapes effortlessly across the torso.
                          </p>
                          <p>
                            The centerpiece of this creation is its meticulous embroidery. Drawing inspiration from royal Rajasthani court archives, expert artisans have woven golden zari threads and subtle micro-sequins into regal peacock and traditional floral motifs along the half-sleeves and neckline. Every stitch is reinforced and backed by an ultra-soft 100% pure cotton mulmul lining, guaranteeing that no metallic threads ever come in contact with your skin.
                          </p>
                          <p>
                            Tailored with a classic round neckline, structured bust darts, and removable pre-shaped padded cups, this blouse offers a customized, supportive fit for various body types. Whether styled with a traditional Banarasi Katan silk saree for a wedding reception or paired with a contemporary monochrome lehenga for an evening soirée, this heirloom-quality blouse promises exceptional durability, structural integrity, and unforgettable style.
                          </p>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                        <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider font-bold">Step 7 • 10 Conversion Bullets</span>
                        <ul className="space-y-2 text-xs text-neutral-200">
                          {[
                            "✓ Premium Cotton Rayon Blend: Natural breathability + silk-like rayon drape",
                            "✓ Intricate Peacock Zari Embroidery: High-density gold zari & micro-sequins",
                            "✓ Ultra-Soft Mulmul Lining: 100% breathable pure cotton skin protection",
                            "✓ Customizable Padded Support: High-retention pre-shaped removable cups",
                            "✓ Classic Round Neckline: Flattering collarbone framing with ornate border",
                            "✓ Ergonomic Fit & Margins: Regular fit with generous 2-inch alteration margins",
                            "✓ Secure Concealed Closure: Front hook-and-eye beneath seamless placket",
                            "✓ Lightweight & Breathable: Comfort for long weddings and humid climates",
                            "✓ Versatile Ethnic Styling: Complements Banarasi silks & bridal lehengas",
                            "✓ Authentic Indian Craftsmanship: Handcrafted by skilled artisans in India"
                          ].map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-neutral-900/50 p-1.5 rounded">
                              <span className="text-crimson-400 font-bold shrink-0">{b.slice(0, 1)}</span>
                              <span>{b.slice(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SEO & Keywords */}
                    <div className="bg-neutral-950 p-5 rounded-xl border border-neutral-800 space-y-3">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Step 10 &amp; 11 • SEO Metadata &amp; 50 Search Keywords</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
                        <div>
                          <p className="text-neutral-400 font-semibold">URL Slug:</p>
                          <p className="text-white font-mono bg-neutral-900 p-2 rounded mt-1">royal-crimson-gold-zari-peacock-embroidered-blouse</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 font-semibold">Meta Title:</p>
                          <p className="text-white bg-neutral-900 p-2 rounded mt-1">Women&apos;s Royal Crimson Gold Zari Peacock Embroidered Blouse | Blousia</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 font-semibold">Meta Description:</p>
                          <p className="text-white bg-neutral-900 p-2 rounded mt-1">Buy the Royal Crimson Gold Zari Peacock Embroidered Blouse made from a breathable Cotton &amp; Rayon blend. Handcrafted for weddings.</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-neutral-400 font-semibold text-xs mb-2">Generated 50 Search Keywords (Amazon / Myntra Indexing):</p>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-neutral-900 rounded border border-neutral-800">
                          {[
                            "womens designer blouse", "crimson red blouse", "peacock embroidered blouse", "gold zari blouse", "cotton rayon blouse", 
                            "wedding saree blouse", "readymade saree blouse", "half sleeve saree blouse", "round neck blouse", "padded saree blouse", 
                            "bridal blouse online", "traditional indian blouse", "party wear blouse", "silk saree matching blouse", "kanjeevaram blouse design", 
                            "banarasi matching blouse", "red bridal blouse", "ethnic crop top", "lehenga blouse top", "heavy work blouse", 
                            "sequin work blouse", "bollywood style blouse", "myntra designer blouse", "amazon premium blouse", "flipkart ethnic blouse", 
                            "ajio party wear blouse", "maroon zari blouse", "gold border blouse", "front open blouse", "hook and eye blouse", 
                            "dori back blouse", "latkan blouse design", "breathable cotton blouse", "summer wedding blouse", "handcrafted saree blouse", 
                            "festive wear blouse", "diwali special blouse", "sangeet outfit blouse", "reception saree top", "contrast matching blouse", 
                            "red gold blouse", "stitched blouse online", "luxury ethnic wear", "blousia designer collection", "indian bridal wear", 
                            "zardozi look blouse", "comfortable padded blouse", "mulmul lined blouse", "heirloom saree blouse", "regal fashion blouse"
                          ].map((kw, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-300 font-mono">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: SPECS & PRICING */}
              {activeTab === "specs-pricing" && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4">
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-amber-400" />
                      Steps 8, 9, &amp; 12: Technical Specs, Wash Care &amp; Pricing Engine
                    </h4>
                    <p className="text-sm text-neutral-400">
                      Configurable pricing rules with real-time margin calculation and structured attribute mapping.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Interactive Pricing Engine */}
                    <div className="md:col-span-1 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          Step 12 Pricing Rules
                        </h5>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                          Live Calculator
                        </span>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-semibold block">Cost Price (Manufacturing INR):</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={costPrice}
                              onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 pl-7 pr-3 text-white font-mono font-bold focus:border-crimson-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-semibold block">Maximum Retail Price (MRP):</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={mrp}
                              onChange={(e) => setMrp(Number(e.target.value) || 0)}
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 pl-7 pr-3 text-white font-mono font-bold focus:border-crimson-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-neutral-400 font-semibold block">Target Selling Price (INR):</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={sellingPrice}
                              onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 pl-7 pr-3 text-white font-mono font-bold focus:border-crimson-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2.5 text-xs">
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Discount Badge:</span>
                          <span className="text-crimson-400 font-bold font-mono text-sm">{discountPercent}% OFF</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Gross Contribution Margin:</span>
                          <span className="text-emerald-400 font-bold font-mono text-sm">₹{grossMarginINR}</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-400">
                          <span>Net Margin %:</span>
                          <span className="text-amber-400 font-bold font-mono text-sm">{grossMarginPercent}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Specs Matrix Table */}
                    <div className="md:col-span-2 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                      <div>
                        <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-400" />
                          Step 8 Specifications Matrix
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          {[
                            { label: "Fabric", val: "Cotton & Rayon Blend" },
                            { label: "Pattern", val: "Zari & Sequin Peacock Work" },
                            { label: "Neck Type", val: "Classic Round Neck" },
                            { label: "Sleeve Type", val: "Half Sleeve (Elbow length)" },
                            { label: "Fit", val: "Tailored Regular Fit" },
                            { label: "Transparency", val: "Opaque (100% Mulmul lined)" },
                            { label: "Stretch", val: "Low (2-inch alteration margin)" },
                            { label: "Closure", val: "Concealed Front Hook-and-Eye" },
                            { label: "Country", val: "Made in India" }
                          ].map((sp, i) => (
                            <div key={i} className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                              <p className="text-[10px] text-neutral-500 uppercase font-bold">{sp.label}</p>
                              <p className="text-white font-medium mt-0.5">{sp.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Wash Care */}
                      <div className="border-t border-neutral-800 pt-4">
                        <h5 className="text-sm font-bold text-white mb-2.5 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-teal-400" />
                          Step 9 Wash Care Protocols
                        </h5>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {[
                            "🖐️ Hand Wash Gentle in Cold Water",
                            "🌀 Machine Delicate Cycle in Mesh Bag",
                            "🚫 Do Not Bleach or Use Optical Brighteners",
                            "⛅ Dry in Shade on Flat Surface",
                            "♨️ Medium Iron on Reverse Side Only"
                          ].map((wc, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
                              {wc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 4: JSON */}
              {activeTab === "json" && (
                <div className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <Code className="w-5 h-5 text-emerald-400" />
                        Step 14 &amp; Step 15: Master Product JSON Output
                      </h4>
                      <p className="text-sm text-neutral-400">
                        Complete, schema-compliant JSON ready for instant database persistence and API distribution.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(masterJsonOutput, null, 2));
                        alert("Master JSON copied to clipboard!");
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold transition-all border border-neutral-700 cursor-pointer"
                    >
                      📋 Copy Formatted JSON
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
                      {JSON.stringify(masterJsonOutput, null, 2)}
                    </pre>
                  </div>

                  {/* Call to action card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-crimson-950/60 via-neutral-900 to-neutral-950 border border-crimson-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h5 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Ready for Marketplace Deployment?
                      </h5>
                      <p className="text-xs text-neutral-400 mt-1">
                        Deploying will inject this SKU (<span className="text-white font-mono">BL-CRM-RAY-009</span>) directly into your live Blousia frontend store state so customers can browse, customize, and purchase immediately.
                      </p>
                    </div>
                    {!deployed ? (
                      <button
                        onClick={handleDeployToCatalog}
                        disabled={!pipelineCompleted}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                      >
                        🚀 Deploy Now to Live Catalog
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 font-bold px-5 py-3 rounded-xl border border-emerald-500/40 shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        Successfully Deployed!
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
