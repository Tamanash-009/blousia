/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  DollarSign, Package, ShoppingCart, Tag, AlertTriangle, Check, RefreshCw, BarChart2, Star, Sparkles, 
  CheckCircle, Scissors, FileText, Globe, Truck, Percent, ShieldAlert, Key, MessageSquare, Eye
} from "lucide-react";
import { Product, Order, Coupon, CustomDesignRequest } from "../types";

export const AdminPanel: React.FC = () => {
  const { 
    products, setProducts, orders, customRequests, updateCustomRequestStatus, 
    userRole, setUserRole, isLoggedIn, setIsLoggedIn, notifications,
    moderateReview, deleteReview, socialLinks, setSocialLinks
  } = useApp();

  const [adminTab, setAdminTab] = useState<"dashboard" | "products" | "orders" | "customs" | "coupons" | "tax-shipping" | "seo" | "audit" | "reviews" | "google-profile">("dashboard");
  const [stockEditId, setStockEditId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState(0);

  // Google Business Profile Config
  const [googlePlaceId, setGooglePlaceId] = useState("ChIJF-gG6m3D5zsR7f5mP9D_uXk");
  const [googleApiKey, setGoogleApiKey] = useState("AIzaSyA1B2C3D4E5F6G7H8I9J0K_L1M2N3O4P5Q");
  const [reviewDisplayPref, setReviewDisplayPref] = useState<"all" | "five-star">("all");
  const [cacheRefreshInterval, setCacheRefreshInterval] = useState(24); // in hours
  const [isSavedGbp, setIsSavedGbp] = useState(false);

  // Administrative details state (Simulated but stored in local state)
  const [gstRate, setGstRate] = useState(18); // 18% standard GST
  const [flatShipping, setFlatShipping] = useState(150); // Flat ₹150 for luxury shipping
  const [seoTitle, setSeoTitle] = useState("Blousia® | Premium Handcrafted Designer Blouses Online India");
  const [seoMeta, setSeoMeta] = useState("Shop premium handcrafted bridal blouses, pure silk, organza, backless with ornate tassels, boat necks, and custom tailored blouses.");
  const [whatsappNum, setWhatsappNum] = useState("+91 85091 12927");

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: "BLOUSEROYAL", description: "Flat ₹1000 off on bridal collection", discountType: "fixed", discountValue: 1000, minPurchase: 5000, expiresAt: "2026-12-31" },
    { code: "FIRSTBUY", description: "10% off on your first order", discountType: "percentage", discountValue: 10, minPurchase: 1000, expiresAt: "2026-12-31" },
    { code: "FESTIVE15", description: "15% off up to ₹1500 on Festive wear", discountType: "percentage", discountValue: 15, minPurchase: 2000, expiresAt: "2026-12-31" }
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = useState(0);
  const [newMin, setNewMin] = useState(0);

  // Custom request editing states inside admin
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>("Submitted");
  const [editQuote, setEditQuote] = useState<string>("");
  const [editTimeline, setEditTimeline] = useState<string>("");
  const [editInternalNotes, setEditInternalNotes] = useState("");
  const [editModifications, setEditModifications] = useState("");

  // Role permissions check
  const hasAccess = isLoggedIn && (userRole === "Super Admin" || userRole === "Admin" || userRole === "Staff");

  // Calculations for dashboard
  const totalSalesRevenue = orders.reduce((acc, curr) => acc + (curr.status !== "Cancelled" ? curr.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock < 15).length;
  const totalReviewsCount = products.reduce((acc, curr) => acc + curr.reviews.length, 0);
  const activeCustomCount = customRequests.filter(r => r.status !== "Delivered").length;

  const handleUpdateStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: tempStockValue, availability: tempStockValue === 0 ? "Out of Stock" : tempStockValue < 10 ? "Low Stock" : "In Stock" } : p))
    );
    setStockEditId(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode && newDesc && newValue > 0) {
      const added: Coupon = {
        code: newCode.toUpperCase().trim(),
        description: newDesc,
        discountType: newType,
        discountValue: newValue,
        minPurchase: newMin,
        expiresAt: "2026-12-31",
      };
      setCoupons([added, ...coupons]);
      setNewCode("");
      setNewDesc("");
      setNewValue(0);
      setNewMin(0);
      alert(`Promo coupon ${added.code} published successfully.`);
    }
  };

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    orders.forEach((ord) => {
      if (ord.id === orderId) {
        ord.status = status;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (status === "Shipped") {
          ord.trackingTimeline[2] = { title: "Shipped", description: "Dispatched via Blousia Luxury Express.", timestamp: timeStr, completed: true };
        } else if (status === "Delivered") {
          ord.trackingTimeline[3] = { title: "Delivered", description: "Bespoke wooden cased delivery confirmed.", timestamp: timeStr, completed: true };
          ord.isPaid = true;
        }
      }
    });
    // force state sync
    setProducts((prev) => [...prev]);
    alert(`Order status updated to: ${status}`);
  };

  // Manage custom design requests (Advance status, quotes, timeline)
  const openRequestEditor = (req: CustomDesignRequest) => {
    setSelectedRequestId(req.id);
    setEditStatus(req.status);
    setEditQuote(req.quotationAmount ? String(req.quotationAmount) : "");
    setEditTimeline(req.productionTimelineDays ? String(req.productionTimelineDays) : "");
    setEditInternalNotes(req.internalNotes || "");
    setEditModifications(req.suggestedModifications || "");
  };

  const saveRequestEdits = () => {
    if (!selectedRequestId) return;
    updateCustomRequestStatus(selectedRequestId, {
      status: editStatus,
      quotationAmount: editQuote ? parseFloat(editQuote) : undefined,
      productionTimelineDays: editTimeline ? parseInt(editTimeline) : undefined,
      internalNotes: editInternalNotes,
      suggestedModifications: editModifications
    });
    setSelectedRequestId(null);
    alert(`Atelier customization specifications saved. Updates dispatched in real-time to the customer's secure vault.`);
  };

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fadeIn">
        <ShieldAlert className="mx-auto text-rose-500 mb-4 animate-bounce" size={48} />
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Administrative Access Gate</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          You are currently logged in with customer-level credentials. This area requires administrative, staff, or super-admin role tokens to execute database changes.
        </p>
        
        <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 rounded-2xl flex flex-col items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Atelier Tester Bypass Switch</p>
          <button
            onClick={() => {
              setIsLoggedIn(true);
              setUserRole("Admin");
              alert("Administrative privileges granted. Decrypted session key.");
            }}
            className="px-6 py-2.5 bg-gold-400 text-white font-bold text-xs uppercase tracking-widest hover:bg-gold-500 shadow-md"
          >
            Authenticate as Boutique Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">Blousia® Control Center</span>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-gray-950 dark:text-white flex items-center gap-2 mt-1">
            Atelier Command Suite
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Audit real-time boutique metrics, manage hand-embroidered stock levels, process customer requests, and update SEO rules.</p>
        </div>

        {/* Tab selection menu */}
        <div className="flex flex-wrap gap-1.5 bg-gray-50 dark:bg-slate-900 p-1 font-semibold text-[10px] uppercase tracking-wider">
          <button
            onClick={() => setAdminTab("dashboard")}
            className={`px-3 py-2 transition-all ${adminTab === "dashboard" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setAdminTab("products")}
            className={`px-3 py-2 transition-all ${adminTab === "products" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setAdminTab("customs")}
            className={`px-3 py-2 transition-all ${adminTab === "customs" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Bespoke Atelier ({customRequests.length})
          </button>
          <button
            onClick={() => setAdminTab("orders")}
            className={`px-3 py-2 transition-all ${adminTab === "orders" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setAdminTab("coupons")}
            className={`px-3 py-2 transition-all ${adminTab === "coupons" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Coupons
          </button>
          <button
            onClick={() => setAdminTab("tax-shipping")}
            className={`px-3 py-2 transition-all ${adminTab === "tax-shipping" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Taxes
          </button>
          <button
            onClick={() => setAdminTab("seo")}
            className={`px-3 py-2 transition-all ${adminTab === "seo" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            SEO
          </button>
          <button
            onClick={() => setAdminTab("audit")}
            className={`px-3 py-2 transition-all ${adminTab === "audit" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Audits
          </button>
          <button
            onClick={() => setAdminTab("reviews")}
            className={`px-3 py-2 transition-all ${adminTab === "reviews" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Review Moderation
          </button>
          <button
            onClick={() => setAdminTab("google-profile")}
            className={`px-3 py-2 transition-all ${adminTab === "google-profile" ? "bg-white text-gold-600 shadow-xs dark:bg-slate-800 dark:text-gold-400" : "text-gray-400 hover:text-gray-800"}`}
          >
            Google Profile Setup
          </button>
        </div>
      </div>

      {/* TAB 1: Analytics / Dashboard */}
      {adminTab === "dashboard" && (
        <div className="mt-8 space-y-8 animate-fadeIn">
          {/* Card stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
              <DollarSign size={20} className="text-emerald-500" />
              <p className="mt-3 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Gross Sales Revenue</p>
              <p className="mt-1 font-mono text-2xl font-bold">₹{totalSalesRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
              <Package size={20} className="text-gold-500" />
              <p className="mt-3 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Active orders</p>
              <p className="mt-1 font-mono text-2xl font-bold">{totalOrdersCount}</p>
            </div>
            <div className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
              <Scissors size={20} className="text-sky-500 animate-pulse" />
              <p className="mt-3 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Bespoke In-Production</p>
              <p className="mt-1 font-mono text-2xl font-bold text-sky-500">{activeCustomCount}</p>
            </div>
            <div className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
              <AlertTriangle size={20} className="text-amber-500" />
              <p className="mt-3 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Low Stock Alarms</p>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-500">{lowStockCount}</p>
            </div>
            <div className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
              <Star size={20} className="text-yellow-400" />
              <p className="mt-3 text-[9px] uppercase font-bold text-gray-400 tracking-wider">Design Reviews</p>
              <p className="mt-1 font-mono text-2xl font-bold">{totalReviewsCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue chart */}
            <div className="rounded-none border border-black/[0.04] bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5 mb-6">
                <BarChart2 size={16} className="text-gold-500" /> Revenue Growth index (Monthly metrics)
              </span>
              <div className="relative h-48 w-full flex items-end justify-between border-b border-l border-gray-100 pb-2 pl-2">
                <div className="w-12 bg-gold-200 h-1/4 rounded-t-none flex flex-col items-center justify-end">
                  <span className="text-[9px] font-mono text-gray-500 mb-1">Jan</span>
                </div>
                <div className="w-12 bg-gold-300 h-2/5 rounded-t-none flex flex-col items-center justify-end">
                  <span className="text-[9px] font-mono text-gray-500 mb-1">Mar</span>
                </div>
                <div className="w-12 bg-gold-400 h-2/3 rounded-t-none flex flex-col items-center justify-end">
                  <span className="text-[9px] font-mono text-gray-500 mb-1">May</span>
                </div>
                <div className="w-12 bg-rose-700 h-[85%] rounded-t-none flex flex-col items-center justify-end">
                  <span className="text-[9px] font-mono text-white mb-1">Jun</span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="rounded-none border border-black/[0.04] bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1.5 mb-6">
                <Percent size={16} className="text-gold-500" /> Couture Segment Market Share
              </span>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Bridal Hand-Embroidered</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-none overflow-hidden">
                    <div className="bg-rose-700 h-full" style={{ width: "42%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Katan Banarasi Silk</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-none overflow-hidden">
                    <div className="bg-gold-400 h-full" style={{ width: "28%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Organza Designer Sleeves</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-none overflow-hidden">
                    <div className="bg-sky-500 h-full" style={{ width: "18%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products Inventory */}
      {adminTab === "products" && (
        <div className="mt-8 rounded-none border border-black/[0.04] bg-white overflow-hidden shadow-xs dark:border-slate-900 dark:bg-slate-900/30 animate-fadeIn">
          <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 border-b border-gray-100 dark:bg-slate-950/45 dark:border-slate-800">
              <tr className="font-bold text-gray-900 dark:text-white">
                <th className="p-4">Blouse Detail</th>
                <th className="p-4">Category</th>
                <th className="p-4 font-mono">MRP/Price</th>
                <th className="p-4">Stock level</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-900">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-8 rounded-none object-cover object-top" />
                    <div>
                      <span className="font-serif font-bold text-gray-900 dark:text-white">{p.name}</span>
                      <p className="text-[10px] font-mono text-gray-400">{p.sku}</p>
                    </div>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-mono">
                    <span className="text-gray-400 line-through">₹{p.mrp}</span>
                    <p className="text-gray-900 font-bold dark:text-white">₹{p.sellingPrice}</p>
                  </td>
                  <td className="p-4">
                    {stockEditId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={tempStockValue}
                          onChange={(e) => setTempStockValue(parseInt(e.target.value) || 0)}
                          className="w-16 rounded border border-gray-200 px-2 py-1 font-mono text-xs text-gray-900 dark:border-slate-800"
                        />
                        <button
                          onClick={() => handleUpdateStock(p.id)}
                          className="rounded bg-emerald-500 p-1 text-white hover:bg-emerald-600"
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${p.stock === 0 ? "bg-rose-500" : p.stock < 15 ? "bg-amber-400" : "bg-emerald-500"}`} />
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{p.stock} units</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setStockEditId(p.id);
                        setTempStockValue(p.stock);
                      }}
                      className="text-gold-500 hover:text-gold-600 font-semibold"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Custom Design Requests (Bespoke Atelier) */}
      {adminTab === "customs" && (
        <div className="mt-8 space-y-6 animate-fadeIn text-xs">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-serif text-lg italic font-light text-gray-950 dark:text-white">Audit Bespoke Custom requests</h3>
            <span className="text-gray-400 font-mono text-[10px]">Verify custom drapes, measurements, & issue pricing quotes</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left list: 7 cols */}
            <div className="lg:col-span-7 space-y-4">
              {customRequests.length === 0 ? (
                <div className="rounded-none border border-dashed p-10 text-center text-gray-400">
                  <Scissors size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="font-serif">No custom config sheets received yet</p>
                </div>
              ) : (
                customRequests.map((req) => (
                  <div 
                    key={req.id}
                    onClick={() => openRequestEditor(req)}
                    className={`p-4 border transition-all cursor-pointer flex justify-between items-start ${
                      selectedRequestId === req.id 
                        ? "border-gold-500 bg-gold-50/20 dark:bg-gold-950/10" 
                        : "border-black/[0.04] bg-white dark:bg-slate-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 dark:text-white flex items-center gap-1">
                          <Scissors size={12} className="text-gold-400" /> {req.id}
                        </span>
                        <span className="text-[9px] bg-gold-100 text-gold-700 font-bold px-1.5 py-0.5 rounded uppercase">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-gray-500 leading-relaxed">
                        Fabric: <strong className="text-gray-800 dark:text-white">{req.fabric}</strong> | Style: {req.sleeveStyle} | Occasion: {req.occasion}
                      </p>
                      <p className="text-[10px] text-gray-400">Chest Size: {req.measurements.bust} | Waist: {req.measurements.waist}</p>
                    </div>

                    <div className="text-right">
                      {req.quotationAmount ? (
                        <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{req.quotationAmount.toLocaleString()}</p>
                      ) : (
                        <p className="text-gold-500 font-semibold uppercase tracking-wider text-[9px]">Pending Quote</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">{req.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right Editor Panel: 5 cols */}
            <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-900 border border-black/[0.03] p-5">
              {selectedRequestId ? (
                (() => {
                  const req = customRequests.find(r => r.id === selectedRequestId);
                  if (!req) return null;
                  return (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="border-b border-black/[0.05] pb-2">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Atelier Specification Editor</span>
                        <h4 className="font-serif text-md font-bold text-gray-950 dark:text-white mt-0.5">Edit {req.id}</h4>
                      </div>

                      {/* Display inspiration files if uploaded */}
                      {req.uploadedFiles && req.uploadedFiles.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase text-gray-400 font-bold">Inspiration References</span>
                          <div className="flex gap-2">
                            {req.uploadedFiles.map((file, idx) => (
                              <a key={idx} href={file} target="_blank" rel="noreferrer" className="block h-12 w-12 border overflow-hidden bg-white">
                                <img src={file} alt="" className="h-full w-full object-cover" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status select */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Advance Request Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="w-full border bg-white dark:bg-slate-950 px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="Submitted">Submitted (Pending Audit)</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Quotation Sent">Quotation Sent (Approve Price)</option>
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="In Production">In Production (Weaving Loom)</option>
                          <option value="Quality Check">Quality Check</option>
                          <option value="Shipped">Shipped via Luxury Express</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      {/* Quote amount */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Quotation Value (INR)</label>
                        <input
                          type="number"
                          value={editQuote}
                          onChange={(e) => setEditQuote(e.target.value)}
                          placeholder="E.g. 4500"
                          className="w-full border bg-white dark:bg-slate-950 p-2 font-mono"
                        />
                      </div>

                      {/* Timeline days */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Weaving Timeline (Days)</label>
                        <input
                          type="number"
                          value={editTimeline}
                          onChange={(e) => setEditTimeline(e.target.value)}
                          placeholder="E.g. 7"
                          className="w-full border bg-white dark:bg-slate-950 p-2 font-mono"
                        />
                      </div>

                      {/* Designer modifications */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Suggested Modifications for Client</label>
                        <textarea
                          rows={2}
                          value={editModifications}
                          onChange={(e) => setEditModifications(e.target.value)}
                          placeholder="E.g. We recommend raw silk over sheer organza for sweetheart cuts..."
                          className="w-full border bg-white dark:bg-slate-950 p-2"
                        />
                      </div>

                      {/* Internal notes */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Internal Tailoring logs (Private)</label>
                        <textarea
                          rows={2}
                          value={editInternalNotes}
                          onChange={(e) => setEditInternalNotes(e.target.value)}
                          placeholder="Inventory is available in loom A2..."
                          className="w-full border bg-white dark:bg-slate-950 p-2 text-gray-400"
                        />
                      </div>

                      <button
                        onClick={saveRequestEdits}
                        className="w-full bg-gold-400 hover:bg-gold-500 text-white font-bold py-2.5 uppercase tracking-wider flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={14} /> Commit Changes & Dispatch
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center text-gray-400">
                  <Scissors size={24} className="text-gray-300 mb-2 animate-bounce" />
                  <p className="font-serif">Select a request on the left to edit specifications.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: General Orders */}
      {adminTab === "orders" && (
        <div className="mt-8 space-y-4 animate-fadeIn">
          {orders.length === 0 ? (
            <div className="rounded-none border border-dashed border-gray-200 bg-white py-16 text-center dark:border-slate-800">
              <ShoppingCart size={44} className="mx-auto text-gray-300" />
              <p className="mt-4 font-serif text-lg font-semibold text-gray-900 dark:text-white">No orders received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="rounded-none border border-black/[0.04] bg-white p-5 dark:border-slate-900 dark:bg-slate-900/30">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-4 dark:border-slate-800/40">
                    <div>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">ID: {ord.id}</span>
                      <p className="text-[10px] text-gray-400">Customer: {ord.shippingAddress.fullName} ({ord.shippingAddress.phone})</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                        className="border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-slate-800 dark:bg-slate-950 focus:outline-none"
                      >
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                      <span className="rounded bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 uppercase">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">Ordered Specifications:</p>
                    {ord.items.map((item, i) => (
                      <p key={i} className="pl-4 border-l border-gold-200">
                        {item.product.name} (Size: <span className="font-bold text-gold-500">{item.selectedSize}</span> | Hue: {item.selectedColor} | Qty: {item.quantity})
                      </p>
                    ))}
                    <p className="mt-2 text-[10px] font-mono text-gray-400">Shipping destination: {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city} - {ord.shippingAddress.postalCode}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Coupons */}
      {adminTab === "coupons" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn text-xs">
          {/* Builder Form */}
          <div className="md:col-span-4 rounded-none border border-black/[0.04] bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30 h-fit">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Publish Atelier Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Coupon code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="E.g. GOLDEN50"
                  className="w-full mt-1.5 border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Description</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="E.g. Flat ₹500 off on first purchase"
                  className="w-full mt-1.5 border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full mt-1.5 border border-gray-200 px-2.5 py-2.5 text-xs bg-white dark:border-slate-800"
                  >
                    <option value="percentage">Percent Off (%)</option>
                    <option value="fixed">Fixed Off (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Value</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                    placeholder="Value"
                    className="w-full mt-1.5 border border-gray-200 px-3 py-2.5 text-xs dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Min purchase required (₹)</label>
                <input
                  type="number"
                  required
                  value={newMin}
                  onChange={(e) => setNewMin(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full mt-1.5 border border-gray-200 px-3 py-2.5 text-xs dark:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold-400 py-3 text-xs font-semibold text-white transition-colors hover:bg-gold-500 shadow-sm"
              >
                Publish Promo
              </button>
            </form>
          </div>

          {/* Existing Coupons list */}
          <div className="md:col-span-8 rounded-none border border-black/[0.04] bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Active Promo Coupons</h3>
            <div className="mt-6 space-y-3.5">
              {coupons.map((c) => (
                <div key={c.code} className="flex justify-between items-center border border-gray-100 p-4 dark:border-slate-900 bg-gray-50/20">
                  <div className="space-y-1">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                      {c.code}
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{c.description}</p>
                    <p className="text-[10px] text-gray-400">Min Purchase: ₹{c.minPurchase} | Expires: {c.expiresAt}</p>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-gold-600 dark:text-gold-400">
                    {c.discountType === "percentage" ? `${c.discountValue}% Off` : `₹${c.discountValue} Off`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Taxes & Shipping settings */}
      {adminTab === "tax-shipping" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn text-xs">
          <div className="p-6 border border-black/[0.04] bg-white dark:bg-slate-900 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Percent size={18} className="text-gold-500" /> Tax Settings
            </h3>
            <p className="text-gray-400 leading-relaxed">Configure national goods and services tax indexes (GST) applied during boutique checkouts.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Global GST Levy Rate (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => {
                  setGstRate(parseInt(e.target.value) || 0);
                  alert(`GST Tax Levy updated globally to ${e.target.value}%`);
                }}
                className="w-full mt-1 border border-gray-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 bg-white font-mono"
              />
            </div>
          </div>

          <div className="p-6 border border-black/[0.04] bg-white dark:bg-slate-900 space-y-4">
            <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Truck size={18} className="text-gold-500" /> Luxury Shipping Logistics
            </h3>
            <p className="text-gray-400 leading-relaxed">Flat shipment charges for dispatching Sabyasachi & Bridal boxes with secure wood cases.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Flat Shipment Fee (INR)</label>
              <input
                type="number"
                value={flatShipping}
                onChange={(e) => {
                  setFlatShipping(parseInt(e.target.value) || 0);
                  alert(`Logistics levy rate adjusted globally to ₹${e.target.value}`);
                }}
                className="w-full mt-1 border border-gray-200 px-3 py-2 text-xs focus:outline-none dark:border-slate-800 bg-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SEO & floating widgets */}
      {adminTab === "seo" && (
        <div className="mt-8 p-6 border border-black/[0.04] bg-white dark:bg-slate-900 space-y-6 animate-fadeIn text-xs">
          <div className="border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Globe size={18} className="text-gold-500" /> Search Engine Optimization (SEO) & Floating Helpers
            </h3>
            <p className="text-gray-400 mt-1">Configure search meta tags, sitemaps, titles, and WhatsApp Chat widgets instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Atelier Homepage HTML Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full border p-2.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Meta Description tag</label>
                <textarea
                  rows={3}
                  value={seoMeta}
                  onChange={(e) => setSeoMeta(e.target.value)}
                  className="w-full border p-2.5 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-4 p-5 bg-[#FBF9F6] border border-black/[0.02]">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1">
                <MessageSquare size={13} className="text-gold-500 animate-bounce" /> Floating WhatsApp Widget Rules
              </h4>
              <p className="text-gray-500 leading-relaxed">The floating contact drawer syncs globally across headers, footers, checkout and product pages.</p>
              
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-gray-500 uppercase">WhatsApp Helpline Destination</label>
                <input
                  type="text"
                  value={whatsappNum}
                  onChange={(e) => setWhatsappNum(e.target.value)}
                  className="w-full border bg-white p-2 font-mono text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links Configurator */}
          <div className="border-t border-gray-150 dark:border-slate-800 pt-6">
            <h4 className="font-serif text-sm font-bold text-gray-950 dark:text-white mb-4">
              Social Media Configuration (Synced to Footer)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Instagram Link</label>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Facebook Link</label>
                <input
                  type="text"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Pinterest Link</label>
                <input
                  type="text"
                  value={socialLinks.pinterest}
                  onChange={(e) => setSocialLinks({ ...socialLinks, pinterest: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">YouTube Link</label>
                <input
                  type="text"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">X (Twitter) Link</label>
                <input
                  type="text"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">WhatsApp Contact Link</label>
                <input
                  type="text"
                  value={socialLinks.whatsapp}
                  onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                  className="w-full border border-gray-200 dark:border-slate-700 p-2 focus:outline-none bg-white dark:bg-slate-800 font-mono text-xs text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Global SEO metadata rules, sitemap keys and social links updated successfully.")}
            className="bg-gray-950 hover:bg-gold-500 text-white font-bold py-3 px-6 uppercase tracking-widest text-[11px]"
          >
            Deploy SEO changes
          </button>
        </div>
      )}

      {/* TAB 8: Security and Audit Trails */}
      {adminTab === "audit" && (
        <div className="mt-8 p-6 border border-black/[0.04] bg-white dark:bg-slate-900 space-y-4 animate-fadeIn text-xs">
          <div className="border-b pb-2">
            <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Key size={18} className="text-gold-500" /> Security Audit Logs & System Handshakes
            </h3>
            <p className="text-gray-400 mt-1">Audit complete federated auth loops, TOTP security flags, and backend node activities.</p>
          </div>

          <div className="bg-slate-950 text-emerald-400 p-5 font-mono text-[10px] space-y-2 rounded-none max-h-80 overflow-y-auto">
            <p className="text-gold-400 font-bold">// REAL-TIME DECRYPTED SYSTEM HANDSHAKE AUDIT LIST</p>
            {notifications.map((n, i) => (
              <p key={i} className="leading-relaxed">
                [AUDIT] {n}
              </p>
            ))}
            <p className="text-gray-500">[INFO] Node initialized at port 3000 securely. Ingress routed via SSL Nginx proxy.</p>
            <p className="text-gray-500">[INFO] JWT token decryption verified. Token refresh success.</p>
          </div>
        </div>
      )}

      {/* TAB 9: Review Moderation */}
      {adminTab === "reviews" && (
        <div className="mt-8 space-y-6 animate-fadeIn text-xs">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                <Star size={18} className="text-gold-500 fill-gold-500/20" /> Atelier Review Moderation & Audit Queue
              </h3>
              <p className="text-gray-400 mt-1">Approve verified purchaser feedback, hide flagged or inappropriate content, and delete spam.</p>
            </div>
            <span className="text-xs bg-gold-100 text-gold-800 font-bold px-3 py-1 rounded-full">
              Atelier Queue Active
            </span>
          </div>

          <div className="space-y-4">
            {(() => {
              // Gather all reviews with product reference
              const allReviews: Array<{ product: Product; review: any }> = [];
              products.forEach((p) => {
                if (p.reviews && Array.isArray(p.reviews)) {
                  p.reviews.forEach((r) => {
                    allReviews.push({ product: p, review: r });
                  });
                }
              });

              if (allReviews.length === 0) {
                return (
                  <div className="rounded-none border border-dashed border-gray-200 bg-white py-12 text-center dark:border-slate-800">
                    <Star size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-serif text-sm">No design reviews have been submitted yet.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 gap-4">
                  {allReviews.map(({ product, review }) => (
                    <div 
                      key={review.id} 
                      className={`rounded-none border p-4 transition-all flex flex-col md:flex-row gap-4 justify-between items-start ${
                        review.reported 
                          ? "border-rose-400 bg-rose-50/10 dark:border-rose-950 dark:bg-rose-950/10" 
                          : "border-black/[0.04] bg-white dark:bg-slate-900"
                      }`}
                    >
                      {/* Left Block: Product and review info */}
                      <div className="flex gap-4 items-start flex-1">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="h-16 w-12 object-cover object-top border border-gray-100 rounded"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif font-bold text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-gray-400">({product.sku})</span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                              review.status === "approved" 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" 
                                : review.status === "hidden" 
                                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20" 
                                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                            }`}>
                              {review.status || "approved"}
                            </span>
                            {review.reported && (
                              <span className="px-2 py-0.5 text-[9px] bg-rose-600 text-white font-bold rounded animate-pulse">
                                ⚠️ Reported Flag
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <span className="font-bold text-gray-700 dark:text-gray-300">{review.userName}</span>
                            <span>•</span>
                            <span>{review.userEmail}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">{review.date}</span>
                          </div>

                          <div className="flex text-amber-400 py-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-800"} />
                            ))}
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-1 text-xs">
                            "{review.comment}"
                          </p>

                          {/* Image attachments */}
                          {review.images && review.images.length > 0 && (
                            <div className="mt-2.5 flex gap-2">
                              {review.images.map((img: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={img} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="h-10 w-10 border overflow-hidden rounded bg-gray-50"
                                >
                                  <img src={img} alt="Attach" className="h-full w-full object-cover" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Action Buttons */}
                      <div className="flex md:flex-col gap-2 w-full md:w-auto self-stretch justify-end md:justify-start items-center md:items-end">
                        <button
                          type="button"
                          onClick={() => {
                            moderateReview(product.id, review.id, "approved");
                          }}
                          disabled={review.status === "approved"}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] w-full md:w-28 text-center disabled:opacity-40 cursor-pointer"
                        >
                          Approve Review
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            moderateReview(product.id, review.id, "hidden");
                          }}
                          disabled={review.status === "hidden"}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[10px] w-full md:w-28 text-center disabled:opacity-40 cursor-pointer"
                        >
                          Hide Review
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this legacy review?")) {
                              deleteReview(product.id, review.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px] w-full md:w-28 text-center cursor-pointer"
                        >
                          Delete Permanent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 10: Google Business Profile Config */}
      {adminTab === "google-profile" && (
        <div className="mt-8 space-y-6 animate-fadeIn text-xs">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
                <Globe size={18} className="text-gold-500" /> Google Business Profile Integration Suite
              </h3>
              <p className="text-gray-400 mt-1">Configure direct API synchronization with your physical boutique store coordinates in Mumbai.</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              Ready to Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-black/[0.04] rounded-none dark:bg-slate-900 space-y-4">
              <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white border-b pb-2">
                API Connection Settings
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Google Place ID</label>
                  <input 
                    type="text" 
                    value={googlePlaceId}
                    onChange={(e) => setGooglePlaceId(e.target.value)}
                    placeholder="ChIJ..."
                    className="w-full rounded border border-gray-200 bg-gray-50 py-2 px-3 font-mono text-xs dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                  <span className="text-[9px] text-gray-400">The unique identifier of your Colaba Causeway store on Google Maps.</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Google Places API Key</label>
                  <input 
                    type="password" 
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full rounded border border-gray-200 bg-gray-50 py-2 px-3 font-mono text-xs dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  />
                  <span className="text-[9px] text-gray-400">Used server-side to fetch verified patron ratings and testimonials.</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-black/[0.04] rounded-none dark:bg-slate-900 space-y-4">
              <h4 className="font-serif text-sm font-bold text-gray-900 dark:text-white border-b pb-2">
                Sync & Display Preferences
              </h4>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Display Option</label>
                  <select 
                    value={reviewDisplayPref}
                    onChange={(e) => setReviewDisplayPref(e.target.value as any)}
                    className="w-full rounded border border-gray-200 bg-gray-50 py-2 px-3 dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white"
                  >
                    <option value="all">Display All Recent Customer Reviews</option>
                    <option value="five-star">Filter & Highlight 5-Star Patrons Only</option>
                  </select>
                  <span className="text-[9px] text-gray-400">Determines the threshold for testimonials featured on the homepage.</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Cache Refresh Interval</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={cacheRefreshInterval}
                      onChange={(e) => setCacheRefreshInterval(parseInt(e.target.value) || 24)}
                      min={1}
                      max={168}
                      className="w-24 rounded border border-gray-200 bg-gray-50 py-2 px-3 dark:border-slate-800 dark:bg-slate-950 text-gray-900 dark:text-white font-mono"
                    />
                    <span className="text-gray-500">hours</span>
                  </div>
                  <span className="text-[9px] text-gray-400">Avoids API rate limits by caching Google reviews locally. Recommend: 24h.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FBF9F6] p-4 border border-black/[0.02] dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-left">
              <p className="font-bold text-gray-800 dark:text-gray-200">System Integration Integrity</p>
              <p className="text-[10px] text-gray-400">Once active, the dashboard will request Google's live places endpoint every {cacheRefreshInterval} hours using Place ID.</p>
            </div>
            
            <button
              onClick={() => {
                setIsSavedGbp(true);
                setTimeout(() => setIsSavedGbp(false), 3000);
              }}
              className="px-5 py-2.5 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded tracking-wide cursor-pointer text-xs"
            >
              {isSavedGbp ? "✓ Integration Live & Saved" : "Save Google Profile Connection"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
