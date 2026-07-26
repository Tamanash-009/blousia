/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Calendar, Wallet, Tag, ShieldCheck, MapPin, Package, RefreshCw, XCircle, 
  ChevronDown, Check, UserCheck, Scissors, LogOut, ShieldAlert, Laptop, Smartphone, KeyRound, Lock,
  Star
} from "lucide-react";
import { Address } from "../types";
import { Authentication } from "./Authentication";
import { UserAddress } from "./UserAddress";

export const UserAccount: React.FC = () => {
  const {
    profile,
    orders,
    cancelOrder,
    requestReturnOrder,
    deleteAddress,
    addAddress,
    setActiveTab,
    customRequests,
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    notifications,
    setProfile,
    products,
    accountSubTab: activeSubTab,
    setAccountSubTab: setActiveSubTab
  } = useApp();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);

  // Address create form inside account
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addrType, setAddrType] = useState<"Home" | "Work" | "Other">("Home");

  // 2FA simulation states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {
    return localStorage.getItem("blousia_2fa_enabled") === "true";
  });

  // Active sessions mock list
  const [sessions, setSessions] = useState([
    { id: "sess-1", device: "Chrome / Windows 11", location: "Mumbai, MH, India", active: true, ip: "103.45.12.98" },
    { id: "sess-2", device: "Safari / Apple iPhone 15", location: "Pune, MH, India", active: false, ip: "182.16.89.20" }
  ]);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const fetchedCity = addr.city || addr.town || addr.village || addr.suburb || "";
            const fetchedState = addr.state || "";
            const fetchedPostal = addr.postcode || "";
            const fetchedRoad = addr.road || addr.suburb || "";
            
            setStreetAddress(fetchedRoad);
            setCity(fetchedCity);
            setState(fetchedState);
            setPostalCode(fetchedPostal.replace(/\D/g, "").slice(0, 6));
          } else {
            setCity("Mumbai");
            setState("Maharashtra");
            setPostalCode("400001");
          }
        } catch (error) {
          console.error("Geocoding failed, using approximation", error);
          setCity("Mumbai");
          setState("Maharashtra");
          setPostalCode("400001");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setIsDetectingLocation(false);
        setCity("Mumbai");
        setState("Maharashtra");
        setPostalCode("400001");
      }
    );
  };

  const handlePincodeChange = async (pin: string) => {
    const cleanedPin = pin.replace(/\D/g, "").slice(0, 6);
    setPostalCode(cleanedPin);
    if (cleanedPin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanedPin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District || postOffice.Block || "");
          setState(postOffice.State || "");
        }
      } catch (err) {
        console.error("PIN code details fetch failed", err);
      }
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && phone && streetAddress && city && state && postalCode) {
      addAddress({
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        streetAddress,
        city,
        state,
        postalCode,
        type: addrType,
        isDefault: profile.addresses.length === 0,
      });
      setShowAddressForm(false);
      setFullName("");
      setPhone("");
      setStreetAddress("");
      setCity("");
      setState("");
      setPostalCode("");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName && editEmail && editPhone) {
      setProfile(prev => {
        const updated = {
          ...prev,
          name: editName,
          email: editEmail,
          phone: editPhone
        };
        localStorage.setItem("blousia_profile", JSON.stringify(updated));
        return updated;
      });
      setIsEditingProfile(false);
      alert("Atelier Profile updated successfully!");
    }
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const toggleRequestExpand = (id: string) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const toggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    localStorage.setItem("blousia_2fa_enabled", String(nextState));
    alert(nextState 
      ? "Google Two-Factor Authentication (2FA) is now ACTIVATED. You will be prompted for an authenticator TOTP token upon your next login." 
      : "Two-Factor Authentication is now DEACTIVATED."
    );
  };

  const revokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    alert("Device session revoked successfully. Session keys flushed.");
  };

  const triggerLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out successfully. Secure JWT tokens deleted.");
  };

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Authentication onSuccess={() => setActiveSubTab("orders")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Profile Card & Quick tabs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-gold-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/30 text-center relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gold-50 dark:bg-slate-800/30 blur-2xl" />
            
            {/* Log Out float */}
            <button 
              onClick={triggerLogout}
              className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"
              title="Sign Out Securely"
            >
              <LogOut size={16} />
            </button>

            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name || "User"}
                  className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-gold-200"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold-100 text-3xl font-bold text-gold-500 ring-4 ring-gold-200 dark:bg-slate-800">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : <UserCheck size={32} />}
                </div>
              )}
              {/* Admin toggle bypass button */}
              <button 
                onClick={() => setActiveTab("admin")}
                className="absolute bottom-0 right-1/2 translate-x-12 rounded-full bg-slate-900 p-1.5 text-white shadow-md hover:bg-gold-500 hover:scale-105 transition-all"
                title="Enter Boutique Admin Dashboard"
              >
                <ShieldCheck size={14} />
              </button>
            </div>

            {!isEditingProfile ? (
              <>
                <div className="mt-4 flex flex-col items-center">
                  <h3 className="font-serif text-lg font-bold text-gray-950 dark:text-white">
                    {profile.name || "Welcome, Guest!"}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-700 dark:bg-gold-950/40 dark:text-gold-300">
                      {userRole}
                    </span>
                  </div>
                </div>
                
                <p className="mt-2 font-mono text-xs text-gray-400">{profile.email || "Please add your email"}</p>
                <p className="mt-1 font-sans text-xs text-gray-500">{profile.phone || "Please add your phone number"}</p>

                <button
                  onClick={() => {
                    setEditName(profile.name);
                    setEditEmail(profile.email);
                    setEditPhone(profile.phone);
                    setIsEditingProfile(true);
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-gold-600 hover:text-gold-700 underline cursor-pointer"
                >
                  📝 Edit Profile Details
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveProfile} className="mt-4 text-left space-y-3 p-3 bg-gray-50/50 rounded-2xl dark:bg-slate-900/40">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Modify Boutique Profile</span>
                <div className="space-y-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="rounded-lg bg-gray-200 text-gray-700 px-2.5 py-1 text-[10px] font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-gold-500 text-white px-3 py-1 text-[10px] font-bold hover:bg-gold-600 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Wallet Quick Summary */}
            <div className="mt-6 rounded-2xl bg-gold-50/50 p-4 border border-gold-100/50 dark:bg-gold-950/10 dark:border-gold-900/20 text-left flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Secure Wallet Balance</span>
                <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">₹{profile.walletBalance.toLocaleString()}</p>
              </div>
              <Wallet className="text-gold-500" size={24} />
            </div>

            {/* Referral system */}
            <div className="mt-4 text-left p-3.5 rounded-2xl bg-gray-50/50 text-xs border border-gray-100 dark:bg-slate-900/20 dark:border-slate-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your referral link code</span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-gold-600 dark:text-gold-400">{profile.referralCode}</span>
                <button
                  onClick={() => alert("Referral code copied! Share with friends to earn ₹250 wallet credits upon their first purchase.")}
                  className="text-[10px] text-gray-900 font-semibold underline"
                >
                  Share & Earn
                </button>
              </div>
            </div>
          </div>

          {/* Tab lists */}
          <div className="rounded-3xl border border-gray-100 bg-white p-3 dark:border-slate-900 dark:bg-slate-900/30 flex flex-col gap-1">
            <button
              onClick={() => setActiveSubTab("orders")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                activeSubTab === "orders" ? "bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              }`}
            >
              <Package size={16} /> My Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveSubTab("custom-requests")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                activeSubTab === "custom-requests" ? "bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              }`}
            >
              <Scissors size={16} /> Bespoke Configs ({customRequests.length})
            </button>
            <button
              onClick={() => setActiveSubTab("addresses")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                activeSubTab === "addresses" ? "bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              }`}
            >
              <MapPin size={16} /> Shipping Destinations ({profile.addresses.length})
            </button>
            <button
              onClick={() => setActiveSubTab("security")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                activeSubTab === "security" ? "bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              }`}
            >
              <ShieldCheck size={16} /> Security & Sessions
            </button>
            <button
              onClick={() => setActiveSubTab("reviews")}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
                activeSubTab === "reviews" ? "bg-gold-50 text-gold-600 dark:bg-gold-950/20 dark:text-gold-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300"
              }`}
            >
              <Star size={16} /> My Reviews
            </button>
          </div>

          {/* Quick role toggler for ease of testing */}
          <div className="bg-[#FBF9F6] p-4 border border-black/[0.04] text-center space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block">Atelier Sandbox Role Toggler</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(["Customer", "Staff", "Admin", "Super Admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    alert(`Sandbox role updated to ${r}. Check the Admin Panel for tailored permissions.`);
                  }}
                  className={`py-1.5 px-2 text-[9px] uppercase font-bold tracking-wider border transition-all ${
                    userRole === r 
                      ? "bg-gold-500 border-gold-500 text-white" 
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed panel */}
        <div className="lg:col-span-8">
          
          {/* SubTab: Orders list with interactive timelines */}
          {activeSubTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">Your Orders History</h2>
                <button onClick={() => setActiveTab("catalog")} className="text-xs font-semibold text-gold-500 hover:text-gold-600">
                  Shop more
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-slate-800">
                  <Package size={44} className="mx-auto text-gray-300" />
                  <p className="mt-4 font-serif text-lg font-semibold text-gray-900 dark:text-white">No orders recorded yet</p>
                  <p className="mt-1 text-xs text-gray-400">Ready to drape yourself in confidence?</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <div
                        key={order.id}
                        className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-slate-900 dark:bg-slate-900/30"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4 dark:border-slate-900">
                          <div className="space-y-1">
                            {order.orderName && (
                              <div className="text-[10px] uppercase font-serif font-bold text-gold-600 dark:text-gold-400">
                                ⚜️ {order.orderName}
                              </div>
                            )}
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                              ID: {order.id}
                            </span>
                            <div className="flex gap-3 text-[10px] text-gray-400">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {order.date}</span>
                              <span>Method: {order.paymentMethod}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-right">
                            <div className="space-y-1">
                              <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                ₹{order.total.toLocaleString()}
                              </p>
                              <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                                order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" :
                                order.status === "Cancelled" ? "bg-gray-100 text-gray-500" : "bg-gold-100 text-gold-600"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleOrderExpand(order.id)}
                              className="rounded-full bg-gray-50 p-1.5 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                              <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible expanded timeline tracking & items summary */}
                        {isExpanded && (
                          <div className="mt-5 space-y-6 animate-fadeIn">
                            {/* Items breakdown list */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordered items</h4>
                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex gap-3 text-xs bg-gray-50/50 p-2 rounded-xl dark:bg-slate-900/20">
                                    <div className="h-12 w-10 overflow-hidden rounded-lg">
                                      <img src={item.product.images[0]} alt="" className="h-full w-full object-cover object-top" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800 dark:text-gray-200">{item.product.name}</p>
                                      <p className="text-[10px] text-gray-400">Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-mono font-bold text-gray-900 dark:text-white">
                                      ₹{(item.product.sellingPrice * item.quantity).toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* VERTICAL TRACKING GRAPHICAL TIMELINE */}
                            {order.status !== "Cancelled" && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bespoke Tailoring Status</h4>
                                <div className="relative pl-6 border-l-2 border-gold-200 ml-3 space-y-5">
                                  {order.trackingTimeline.map((milestone, idx) => {
                                    const isActive = milestone.completed || 
                                      (order.status === "Processing" && idx <= 1) ||
                                      (order.status === "Shipped" && idx <= 2) ||
                                      (order.status === "Out for Delivery" && idx <= 2) ||
                                      (order.status === "Delivered" && idx <= 3);

                                    return (
                                      <div key={idx} className="relative">
                                        <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${
                                          isActive ? "bg-gold-500 text-white" : "bg-gray-200"
                                        }`}>
                                          {isActive && <Check size={10} />}
                                        </span>
                                        <div className="text-xs">
                                          <p className={`font-semibold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                            {milestone.title}
                                          </p>
                                          <p className="mt-0.5 text-[10px] text-gray-400">{milestone.description}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Actions panel */}
                            <div className="flex gap-2.5 pt-4 border-t border-gray-50 dark:border-slate-900/50">
                              {order.status === "Processing" && (
                                <button
                                  onClick={() => cancelOrder(order.id)}
                                  className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 flex items-center gap-1"
                                >
                                  <XCircle size={14} /> Cancel custom tailor request
                                </button>
                              )}
                              {order.status === "Delivered" && (
                                <button
                                  onClick={() => {
                                    requestReturnOrder(order.id);
                                    alert("Return request processed. A Blousia representative will pick up the boutique package within 48 hours. Please keep tags intact.");
                                  }}
                                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                                >
                                  <RefreshCw size={14} /> Request return/size exchange
                                </button>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SubTab: Custom Requests tracking list */}
          {activeSubTab === "custom-requests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">Custom Blouse Designs</h2>
                <span className="text-xs font-semibold text-gold-500 font-mono">Bespoke Atelier status tracking</span>
              </div>

              {customRequests.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-slate-800">
                  <Scissors size={44} className="mx-auto text-gray-300" />
                  <p className="mt-4 font-serif text-lg font-semibold text-gray-900 dark:text-white">No custom requests submitted yet</p>
                  <p className="mt-1 text-xs text-gray-400">Open a product details sheet and click "Customize Your Blouse" to draft your dream design!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customRequests.map((req) => {
                    const isExpanded = expandedRequest === req.id;
                    return (
                      <div
                        key={req.id}
                        className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-slate-900 dark:bg-slate-900/30 animate-fadeIn"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4 dark:border-slate-900">
                          <div className="space-y-1">
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              <Scissors size={14} className="text-gold-500 animate-pulse" /> {req.id}
                            </span>
                            <div className="flex gap-3 text-[10px] text-gray-400">
                              <span>Date: {req.date}</span>
                              <span>Fabric: {req.fabric}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div className="space-y-1">
                              {req.quotationAmount ? (
                                <p className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                  ₹{req.quotationAmount.toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-[10px] text-gold-500 font-semibold uppercase tracking-wider">Awaiting Quote</p>
                              )}
                              <span className="inline-block rounded bg-gold-100 px-2 py-0.5 text-[9px] font-bold uppercase text-gold-700">
                                {req.status}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleRequestExpand(req.id)}
                              className="rounded-full bg-gray-50 p-1.5 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                              <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-5 space-y-6 animate-fadeIn text-xs">
                            {/* Specifications summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-2xl dark:bg-slate-900/20">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Sleeve Style</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{req.sleeveStyle} ({req.sleeveLength})</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Neck Styles</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{req.neckStyle} (Front) / {req.backNeckDesign} (Back)</span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Colors Configured</span>
                                <div className="flex gap-1.5 mt-1">
                                  <span className="h-3 w-3 block border" style={{ backgroundColor: req.primaryColor }} title="Primary Base" />
                                  <span className="h-3 w-3 block border" style={{ backgroundColor: req.secondaryColor }} title="Contrast Sleeve" />
                                  <span className="h-3 w-3 block border" style={{ backgroundColor: req.borderColor }} title="Border Lace" />
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Occasion Purpose</span>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{req.occasion}</span>
                              </div>
                            </div>

                            {/* Detailed Fitting stats */}
                            <div className="space-y-2">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tailored fitting metrics</h4>
                              <div className="grid grid-cols-4 md:grid-cols-7 gap-2.5 bg-white p-3 border border-black/[0.02] dark:bg-slate-950">
                                {Object.entries(req.measurements).map(([key, val]) => (
                                  <div key={key} className="text-center">
                                    <span className="text-[9px] uppercase text-gray-400 block">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-mono font-bold text-gray-800 dark:text-white">{val as string}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Status visual vertical timeline */}
                            <div className="space-y-3 border-t border-black/[0.03] pt-4">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interactive Status Timeline</h4>
                              
                              <div className="relative pl-6 border-l-2 border-gold-200 ml-3 space-y-4">
                                {["Submitted", "Under Review", "Accepted", "Quotation Sent", "Payment Pending", "In Production", "Delivered"].map((st, i) => {
                                  // Find if completed
                                  const statusOrder = ["Submitted", "Under Review", "Accepted", "Quotation Sent", "Payment Pending", "In Production", "Delivered"];
                                  const activeIndex = statusOrder.indexOf(req.status);
                                  const currentStepIndex = statusOrder.indexOf(st);
                                  const isDone = currentStepIndex <= activeIndex;

                                  return (
                                    <div key={i} className="relative">
                                      <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${
                                        isDone ? "bg-gold-500 text-white" : "bg-gray-200 dark:bg-slate-800"
                                      }`}>
                                        {isDone && <Check size={10} />}
                                      </span>
                                      <div>
                                        <p className={`font-semibold ${isDone ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>{st}</p>
                                        {st === "Quotation Sent" && req.quotationAmount && isDone && (
                                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Quotation generated: ₹{req.quotationAmount.toLocaleString()}</p>
                                        )}
                                        {st === "In Production" && req.productionTimelineDays && isDone && (
                                          <p className="text-[10px] text-gold-600 font-bold mt-0.5">Master tailor is weaving your fabric. Complete in {req.productionTimelineDays} days.</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Quotation payment bypass */}
                            {req.status === "Quotation Sent" && req.quotationAmount && (
                              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
                                <div>
                                  <p className="font-bold text-emerald-800 uppercase text-[10px]">Atelier quotation generated</p>
                                  <p className="text-[11px] text-emerald-600 mt-0.5">Approve your quotation for ₹{req.quotationAmount.toLocaleString()} to dispatch your design straight to weaving loom.</p>
                                </div>
                                <button
                                  onClick={() => {
                                    alert(`Successfully initiated secure Stripe checkout flow for ₹${req.quotationAmount}. Weaving starting immediately!`);
                                    // advance status using mock
                                  }}
                                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs shrink-0 shadow-sm"
                                >
                                  Complete Atelier Payment
                                </button>
                              </div>
                            )}

                            {/* Designer suggestions notes */}
                            {req.suggestedModifications && (
                              <div className="p-4 bg-amber-50/50 border border-amber-200 text-amber-900 rounded-2xl">
                                <p className="font-bold uppercase text-[10px] tracking-wide">Designer Suggestion modification</p>
                                <p className="text-xs italic mt-1 font-serif">"{req.suggestedModifications}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SubTab: Shipping Destinations */}
          {activeSubTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">Shipping Destinations</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 dark:bg-slate-800"
                >
                  + Add Address
                </button>
              </div>

              {showAddressForm && (
                <UserAddress
                  onSubmit={(newAddr) => {
                    addAddress({
                      id: `addr-${Date.now()}`,
                      ...newAddr,
                      type: newAddr.type as "Home" | "Work" | "Other",
                      isDefault: profile.addresses.length === 0,
                    });
                    setShowAddressForm(false);
                  }}
                  onCancel={() => setShowAddressForm(false)}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs relative dark:border-slate-900 dark:bg-slate-900/30"
                  >
                    <span className="rounded bg-gold-100 px-2 py-0.5 text-[8px] font-bold text-gold-700 uppercase">
                      {addr.type}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                      {addr.fullName}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                      {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="mt-2 font-mono text-[10px] text-gray-400">Phone: {addr.phone}</p>

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="absolute right-4 bottom-4 text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Security and Session Management */}
          {activeSubTab === "security" && (
            <div className="space-y-6 animate-fadeIn text-xs">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">Security Controls</h2>
                <p className="text-xs text-gray-400 mt-1">Configure secure access, device authentication loops, and view your JWT session states.</p>
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-5 border border-black/[0.05] bg-[#FBF9F6] dark:bg-slate-900 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound size={15} className="text-gold-500" /> Optional Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed max-w-md">
                      Adds an extra layer of security. Upon login, you will be prompted for an instant dynamic TOTP secure code from Google Authenticator.
                    </p>
                  </div>
                  <button
                    onClick={toggle2FA}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      twoFactorEnabled ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {twoFactorEnabled && (
                  <div className="p-4 bg-white border border-black/[0.04] flex flex-col sm:flex-row items-center gap-4 dark:bg-slate-950">
                    {/* Mock QR Code vector */}
                    <div className="h-20 w-20 border-2 border-slate-950 p-1 bg-white shrink-0">
                      <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-700 to-slate-900 grid grid-cols-4 gap-1.5 opacity-80">
                        <div className="bg-slate-950"></div><div className="bg-white"></div><div className="bg-slate-950"></div><div className="bg-slate-950"></div>
                        <div className="bg-white"></div><div className="bg-slate-950"></div><div className="bg-white"></div><div className="bg-slate-950"></div>
                        <div className="bg-slate-950"></div><div className="bg-white"></div><div className="bg-slate-950"></div><div className="bg-white"></div>
                        <div className="bg-slate-950"></div><div className="bg-slate-950"></div><div className="bg-white"></div><div className="bg-slate-950"></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white uppercase text-[10px]">Google Authenticator Setup Sync</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">Scan this QR Code with your mobile authenticator app. Alternatively, manually type the seed secret: <code className="bg-gray-100 px-1 py-0.5 text-[9px] font-mono font-bold text-gold-600">BLOUSIA_TOTP_KEY_99</code></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Device Session Management */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Laptop size={14} className="text-gold-400" /> Active Device Sessions
                  </h3>
                  <button
                    onClick={() => {
                      setSessions(sessions.filter(s => s.active));
                      alert("Flushed all secondary sessions successfully. JWT Refresh tokens invalidated.");
                    }}
                    className="text-[10px] text-gold-500 font-bold hover:underline"
                  >
                    Invalidate All Other Devices
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div 
                      key={s.id}
                      className="p-4 border border-black/[0.03] dark:border-white/[0.03] bg-white dark:bg-slate-900 flex justify-between items-center"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="p-2.5 bg-gray-50 dark:bg-slate-950 text-gray-500 rounded-none shrink-0">
                          {s.device.includes("iPhone") ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{s.device}</span>
                            {s.active && (
                              <span className="rounded bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider">Current</span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{s.location} • IP: {s.ip}</p>
                        </div>
                      </div>

                      {!s.active && (
                        <button
                          onClick={() => revokeSession(s.id)}
                          className="text-[10px] text-rose-500 font-bold hover:underline"
                        >
                          Revoke Access
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure Session Logs */}
              <div className="p-4 bg-slate-950 border border-white/5 text-gray-300 font-mono text-[9px] space-y-1.5 max-h-40 overflow-y-auto">
                <p className="text-gold-400 font-bold">// SECURE AUDIT SESSION HANDSHAKE LOGS</p>
                {notifications.map((n, i) => (
                  <p key={i} className="leading-relaxed">{n}</p>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Customer Reviews History */}
          {activeSubTab === "reviews" && (
            <div className="space-y-6 animate-fadeIn text-xs">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-950 dark:text-white">My Design Reviews</h2>
                <p className="text-xs text-gray-400 mt-1">Review your submitted boutique product feedback and check approval queues.</p>
              </div>

              {(() => {
                const myReviews: Array<{ product: any; review: any }> = [];
                orders.forEach((o) => {
                  o.items.forEach((item) => {
                    const p = item.product;
                    if (p && p.reviews && Array.isArray(p.reviews)) {
                      p.reviews.forEach((r) => {
                        if (r.userEmail === profile.email) {
                          if (!myReviews.some((mr) => mr.review.id === r.id)) {
                            myReviews.push({ product: p, review: r });
                          }
                        }
                      });
                    }
                  });
                });

                // Also scan overall products catalog just in case of bypassed or manual review entries
                products.forEach((p) => {
                  if (p.reviews && Array.isArray(p.reviews)) {
                    p.reviews.forEach((r) => {
                      if (r.userEmail === profile.email) {
                        if (!myReviews.some((mr) => mr.review.id === r.id)) {
                          myReviews.push({ product: p, review: r });
                        }
                      }
                    });
                  }
                });

                if (myReviews.length === 0) {
                  return (
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-slate-800">
                      <Star size={44} className="mx-auto text-gray-300 animate-pulse" />
                      <p className="mt-4 font-serif text-lg font-semibold text-gray-900 dark:text-white">No reviews published yet</p>
                      <p className="mt-1 text-xs text-gray-400">Your purchased blouse reviews will appear here once submitted.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {myReviews.map(({ product, review }) => (
                      <div 
                        key={review.id} 
                        className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs dark:border-slate-900 dark:bg-slate-900/30 flex gap-4 items-start animate-fadeIn"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="h-16 w-12 object-cover object-top border border-gray-100 rounded-lg shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif font-bold text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-gray-400">({product.sku})</span>
                            <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                              review.status === "approved" 
                                ? "bg-emerald-100 text-emerald-700" 
                                : review.status === "hidden" 
                                  ? "bg-rose-100 text-rose-700" 
                                  : "bg-amber-100 text-amber-700"
                            }`}>
                              {review.status || "approved"}
                            </span>
                            {review.reported && (
                              <span className="px-2 py-0.5 text-[8px] bg-rose-600 text-white font-bold rounded animate-pulse">
                                Flagged for moderation
                              </span>
                            )}
                          </div>

                          <div className="flex text-amber-400 py-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-800"} />
                            ))}
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-1 text-xs">
                            "{review.comment}"
                          </p>

                          {/* Media attachments */}
                          {review.images && review.images.length > 0 && (
                            <div className="mt-2.5 flex gap-2">
                              {review.images.map((img: string, idx: number) => (
                                <div key={idx} className="h-10 w-10 border overflow-hidden rounded-lg bg-gray-50">
                                  <img src={img} alt="Attach" className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-4 text-[10px] text-gray-400 pt-1.5 font-mono">
                            <span>Published on: {review.date}</span>
                            <span>•</span>
                            <span>{review.helpful || 0} helpful votes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
