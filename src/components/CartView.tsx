/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Trash2, ShoppingBag, ShieldCheck, Tag, CreditCard, ChevronRight, CheckCircle, Printer, Download, MessageSquare } from "lucide-react";
import { Address } from "../types";
import { UserAddress } from "./UserAddress";

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    profile,
    applyCouponCode,
    removeCoupon,
    appliedCoupon,
    placeOrder,
    setActiveTab,
    requireAuth,
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<"bag" | "address" | "payment" | "success">("bag");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    profile.addresses.find((a) => a.isDefault) || profile.addresses[0] || null
  );

  // Address creation state inside checkout
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostal, setNewPostal] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "UPI" | "COD" | "Wallet" | "WhatsApp">("Razorpay");
  const [whatsappNumber, setWhatsappNumber] = useState(profile.phone || "");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Totals calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.12); // 12% luxury IGST apparel tax
  const deliveryFee = subtotal > 2000 ? 0 : 150;
  
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const finalTotal = Math.max(0, subtotal + tax + deliveryFee - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    if (!couponInput.trim()) return;

    const result = applyCouponCode(couponInput, subtotal);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponInput("");
    } else {
      setCouponError(result.message);
    }
  };

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectMyLocationCart = () => {
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
            
            setNewStreet(fetchedRoad);
            setNewCity(fetchedCity);
            setNewState(fetchedState);
            setNewPostal(fetchedPostal.replace(/\D/g, "").slice(0, 6));
          } else {
            setNewCity("Mumbai");
            setNewState("Maharashtra");
            setNewPostal("400001");
          }
        } catch (error) {
          console.error("Geocoding failed, using approximation", error);
          setNewCity("Mumbai");
          setNewState("Maharashtra");
          setNewPostal("400001");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setIsDetectingLocation(false);
        setNewCity("Mumbai");
        setNewState("Maharashtra");
        setNewPostal("400001");
      }
    );
  };

  const handlePincodeChangeCart = async (pin: string) => {
    const cleanedPin = pin.replace(/\D/g, "").slice(0, 6);
    setNewPostal(cleanedPin);
    if (cleanedPin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanedPin}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
          const postOffice = data[0].PostOffice[0];
          setNewCity(postOffice.District || postOffice.Block || "");
          setNewState(postOffice.State || "");
        }
      } catch (err) {
        console.error("PIN code details fetch failed", err);
      }
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFullName && newPhone && newStreet && newCity && newState && newPostal) {
      const added: Address = {
        id: `addr-${Date.now()}`,
        fullName: newFullName,
        phone: newPhone,
        streetAddress: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostal,
        type: "Home",
        isDefault: profile.addresses.length === 0,
      };
      profile.addresses.push(added); // append directly to user profile array
      setSelectedAddress(added);
      setShowNewAddressForm(false);
      setNewFullName("");
      setNewPhone("");
      setNewStreet("");
      setNewCity("");
      setNewState("");
      setNewPostal("");
    }
  };

  const formatWhatsAppMessage = (ord: any) => {
    const itemsText = ord.items.map((item: any) => {
      return `- *${item.product.name}* (Code: *${item.product.id}*)\n  Qty: ${item.quantity} · Size: ${item.selectedSize} · Hue: ${item.selectedColor}\n  Price: ₹${item.product.sellingPrice}`;
    }).join("\n\n");

    const messageText = `Hello Blousia® Haute Couture! 🌸\n\nI would like to place an order from your Boutique:\n\n` +
      `*Order Code*: ${ord.id}\n` +
      `*Order Date*: ${ord.date}\n\n` +
      `*CUSTOMER DETAILS*\n` +
      `*Name*: ${ord.shippingAddress.fullName}\n` +
      `*Phone*: ${ord.shippingAddress.phone}\n` +
      `*WhatsApp No*: ${whatsappNumber || ord.shippingAddress.phone}\n\n` +
      `*SHIPPING ADDRESS*\n` +
      `${ord.shippingAddress.streetAddress}, ${ord.shippingAddress.city}, ${ord.shippingAddress.state} - ${ord.shippingAddress.postalCode}\n\n` +
      `*ORDERED SELECTIONS*\n` +
      `${itemsText}\n\n` +
      `*BILL DETAILS*\n` +
      `- Subtotal: ₹${ord.subtotal.toLocaleString()}\n` +
      `- IGST Luxury Tax (12%): ₹${ord.tax.toLocaleString()}\n` +
      `- Delivery Courier: ${ord.deliveryFee === 0 ? "FREE" : `₹${ord.deliveryFee}`}\n` +
      `*Total Payable Amount*: *₹${ord.total.toLocaleString()}*\n\n` +
      `*Selected Method*: WhatsApp Order Checkout\n\n` +
      `Please confirm my custom designer order! Thank you.`;

    return messageText;
  };

  const handlePaymentSubmit = () => {
    if (!selectedAddress) return;
    setIsPaying(true);

    // Simulate high-fidelity payment gate (Razorpay/Stripe) loading
    setTimeout(() => {
      const ord = placeOrder(selectedAddress, paymentMethod);
      setPlacedOrder(ord);
      setIsPaying(false);
      setCheckoutStep("success");

      if (paymentMethod === "WhatsApp") {
        const text = formatWhatsAppMessage(ord);
        const encoded = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/918509112927?text=${encoded}`;
        try {
          window.open(whatsappUrl, "_blank");
        } catch (e) {
          console.warn("Popup blocked, fallback available on UI screen.", e);
        }
      }
    }, 1500);
  };

  if (checkoutStep === "success" && placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center animate-fadeIn">
        <div className="flex justify-center text-gold-500">
          <CheckCircle size={64} className="animate-bounce" />
        </div>
        <h2 className="mt-6 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          Order Dispatched for Tailoring!
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your order ID <span className="font-mono font-bold text-gray-900 dark:text-white">{placedOrder.id}</span> has been securely placed. Our master designers are reviewing details.
        </p>

        {placedOrder.paymentMethod === "WhatsApp" && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50/20 p-5 dark:border-green-500/30 dark:bg-green-950/10 text-center">
            <h4 className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              📲 Fast-track WhatsApp Dispatch
            </h4>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              We have generated your custom order! Please click the button below to send the details (Unique code, items, and shipping address) directly to our WhatsApp Boutique desk to verify your custom stitching requirements.
            </p>
            <a
              href={`https://wa.me/918509112927?text=${encodeURIComponent(formatWhatsAppMessage(placedOrder))}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-green-700 transition-colors"
            >
              Send WhatsApp Confirmation
            </a>
          </div>
        )}

        {/* Invoice Generator Panel */}
        <div className="mt-8 rounded-3xl border border-gold-100 bg-gold-50/10 p-6 text-left dark:border-slate-800 dark:bg-slate-900/20">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 dark:border-slate-900">
            <div>
              <h3 className="font-serif text-lg font-bold text-gold-600 uppercase">Blousia Boutique</h3>
              <p className="text-[10px] text-gray-400">GSTIN: 27AABCB8876F1Z2</p>
            </div>
            <div className="text-right">
              <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold text-emerald-600 uppercase dark:bg-emerald-950/40">
                {placedOrder.isPaid ? "Payment Secured" : "COD Pending"}
              </span>
              <p className="mt-1 font-mono text-[10px] text-gray-500">Date: {placedOrder.date}</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">Shipping Destination:</p>
            <p>{placedOrder.shippingAddress.fullName} ({placedOrder.shippingAddress.phone})</p>
            <p>{placedOrder.shippingAddress.streetAddress}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} - {placedOrder.shippingAddress.postalCode}</p>
          </div>

          <div className="mt-6">
            <table className="w-full text-left text-xs text-gray-500 dark:text-gray-400">
              <thead>
                <tr className="border-b border-gray-100 font-bold dark:border-slate-900">
                  <th className="pb-2">Bespoke Item</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {placedOrder.items.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-slate-900/50">
                    <td className="py-2.5 text-gray-900 dark:text-gray-100">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                    </td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{(item.product.sellingPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-slate-900 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-gray-500">
              <span>Boutique Subtotal:</span>
              <span>₹{placedOrder.subtotal.toLocaleString()}</span>
            </div>
            {placedOrder.couponDiscount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Coupon Off:</span>
                <span>-₹{placedOrder.couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>IGST apparel Tax (12%):</span>
              <span>₹{placedOrder.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Courier fee:</span>
              <span>{placedOrder.deliveryFee === 0 ? "FREE" : `₹${placedOrder.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200">
              <span>Total Paid:</span>
              <span>₹{placedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Invoice Actions */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 flex items-center gap-2"
          >
            <Printer size={15} /> Print Shipping Invoice
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className="rounded-xl bg-gold-400 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-gold-500"
          >
            Track Tailoring Timeline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Checkout Progress Tracker */}
      <div className="mb-8 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
        <button
          onClick={() => setCheckoutStep("bag")}
          className={`font-semibold transition-all ${checkoutStep === "bag" ? "text-gold-500 underline" : "text-gray-400"}`}
        >
          01. Boutique Bag
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button
          onClick={() => cart.length > 0 && setCheckoutStep("address")}
          disabled={cart.length === 0}
          className={`font-semibold transition-all ${checkoutStep === "address" ? "text-gold-500 underline" : "text-gray-400"}`}
        >
          02. Fitment Address
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className={`font-semibold ${checkoutStep === "payment" ? "text-gold-500 underline" : "text-gray-400"}`}>
          03. Secured Payment
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center">
          <div className="flex justify-center text-gray-300">
            <ShoppingBag size={54} />
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-gray-900 dark:text-white">Your Shopping Bag is Empty</h3>
          <p className="mt-1.5 text-xs text-gray-500">Discover premium blouses handcrafted to drape confidence.</p>
          <button
            onClick={() => setActiveTab("catalog")}
            className="mt-6 rounded-xl bg-gold-400 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-gold-500"
          >
            Explore collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Main Left Stage */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: Bag Listing */}
            {checkoutStep === "bag" && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Your Selections</h3>
                <div className="mt-6 divide-y divide-gray-100 dark:divide-slate-900">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-950">
                        <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-top" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-semibold text-gray-900 dark:text-white">{item.product.name}</h4>
                        <div className="mt-1 flex gap-3 text-[11px] text-gray-400">
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                          <span>Hue: <strong>{item.selectedColor}</strong></span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center rounded-lg border border-gray-200 px-2 py-0.5 dark:border-slate-800">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, Math.max(1, item.quantity - 1))}
                              className="text-gray-400 hover:text-gray-800 disabled:opacity-40"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-2.5 font-mono text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, Math.min(10, item.quantity + 1))}
                              className="text-gray-400 hover:text-gray-800 disabled:opacity-40"
                              disabled={item.quantity >= 10}
                            >
                              +
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)} className="text-rose-500 hover:text-rose-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                          ₹{(item.product.sellingPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Address Selection */}
            {checkoutStep === "address" && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Select Shipping Address</h3>
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs font-semibold text-gold-500 hover:text-gold-600"
                  >
                    + Add New Address
                  </button>
                </div>

                {showNewAddressForm && (
                  <UserAddress
                    onSubmit={(newAddr) => {
                      const added: Address = {
                        id: `addr-${Date.now()}`,
                        ...newAddr,
                        type: newAddr.type as "Home" | "Work" | "Other",
                        isDefault: profile.addresses.length === 0,
                      };
                      profile.addresses.push(added); // append directly to user profile array
                      setSelectedAddress(added);
                      setShowNewAddressForm(false);
                    }}
                    onCancel={() => setShowNewAddressForm(false)}
                  />
                )}

                <div className="mt-6 space-y-3">
                  {profile.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                        selectedAddress?.id === addr.id
                          ? "border-gold-400 bg-gold-50/10 dark:border-gold-500"
                          : "border-gray-100 bg-white hover:border-gray-200 dark:border-slate-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkout_address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1 text-gold-500 focus:ring-gold-400"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {addr.fullName} <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-500 uppercase">{addr.type}</span>
                        </p>
                        <p className="mt-1 text-gray-500">{addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="mt-1 font-mono text-[10px] text-gray-400">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setCheckoutStep("bag")} className="rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">
                    Back to bag
                  </button>
                  <button
                    onClick={() => selectedAddress && setCheckoutStep("payment")}
                    disabled={!selectedAddress}
                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Secure Payment Gate */}
            {checkoutStep === "payment" && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Secure checkout</h3>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === "Razorpay"
                        ? "border-gold-400 bg-gold-50/10 dark:border-gold-500"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <CreditCard size={20} className="text-gold-500" />
                    <span className="mt-1.5 text-xs font-semibold">Razorpay / Card</span>
                    <span className="text-[9px] text-gray-400">Card validation</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("WhatsApp")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === "WhatsApp"
                        ? "border-green-400 bg-green-50/10 dark:border-green-500"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <MessageSquare size={20} className="text-green-500" />
                    <span className="mt-1.5 text-xs font-semibold text-green-700 dark:text-green-400">WhatsApp Dispatch</span>
                    <span className="text-[9px] text-gray-400">Direct fast checkout</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("Wallet")}
                    disabled={profile.walletBalance < finalTotal}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === "Wallet"
                        ? "border-gold-400 bg-gold-50/10 dark:border-gold-500"
                        : "border-gray-100 hover:border-gray-200 disabled:opacity-50"
                    }`}
                  >
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <span className="mt-1.5 text-xs font-semibold">Blousia Wallet</span>
                    <span className="text-[9px] text-gray-400">Bal: ₹{profile.walletBalance.toLocaleString()}</span>
                  </button>
                </div>

                {paymentMethod === "WhatsApp" && (
                  <div className="mt-5 rounded-2xl border border-dashed border-green-200 bg-green-50/10 p-4 space-y-3">
                    <span className="block text-xs font-bold text-green-700 dark:text-green-400">WhatsApp Fast Checkout</span>
                    <div className="space-y-2 text-xs">
                      <p className="text-gray-500">Provide your active WhatsApp contact number. We will use this to synchronize custom size modifications directly with our tailors.</p>
                      <input
                        type="text"
                        required
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="E.g. 9876543210"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-green-300 dark:border-slate-850 dark:bg-slate-950 dark:text-gray-100"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 rounded-2xl bg-gray-50 p-4 dark:bg-slate-950 text-xs text-gray-500 leading-relaxed border border-gray-100">
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" /> Secure Encryption Standards (OWASP)
                  </p>
                  <p className="mt-1">
                    Your transactions are routed through 256-bit SSL encrypted channels. No credit card or CVV details are persisted on our servers.
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setCheckoutStep("address")} className="rounded-xl border border-gray-200 px-4 py-2 text-xs text-gray-500 hover:bg-gray-50">
                    Back to Address
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={isPaying}
                    className={`rounded-xl px-5 py-3 text-xs font-semibold text-white shadow-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      paymentMethod === "WhatsApp"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gold-500 hover:bg-gold-600"
                    }`}
                  >
                    {isPaying
                      ? "Securing transaction..."
                      : paymentMethod === "WhatsApp"
                      ? `Dispatch via WhatsApp · ₹${finalTotal.toLocaleString()}`
                      : `Pay ₹${finalTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Promo codes */}
            {checkoutStep === "bag" && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase flex items-center gap-1">
                  <Tag size={14} className="text-gold-400" /> Have a Boutique Coupon?
                </span>
                <form onSubmit={handleApplyCoupon} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="E.g. FIRSTBUY"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-gold-300 dark:border-slate-800 dark:bg-slate-950"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-slate-800"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="mt-1.5 text-[10px] text-rose-500">{couponError}</p>}
                {couponSuccess && <p className="mt-1.5 text-[10px] text-emerald-600 font-medium">✓ {couponSuccess}</p>}

                {appliedCoupon && (
                  <div className="mt-3.5 flex justify-between items-center rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/20">
                    <div className="text-[10px]">
                      <span className="font-bold text-emerald-700">{appliedCoupon.code}</span>
                      <p className="text-gray-400">{appliedCoupon.description}</p>
                    </div>
                    <button onClick={removeCoupon} className="text-xs font-semibold text-rose-500 hover:text-rose-600">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bill breakdown summary */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 dark:border-slate-900 dark:bg-slate-900/30">
              <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white">Order Summary</h3>
              
              <div className="mt-4 divide-y divide-gray-100 text-xs space-y-3 font-mono dark:divide-slate-900">
                <div className="flex justify-between text-gray-500 pt-3 first:pt-0">
                  <span>Bag Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 pt-3">
                    <span>Promo Coupon:</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 pt-3">
                  <span>IGST Luxury Tax (12%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-500 pt-3">
                  <span>Delivery courier fee:</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-3 text-sm border-t border-dashed border-gray-200">
                  <span>Payable Total:</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {checkoutStep === "bag" && (
                <button
                  onClick={() => requireAuth(() => setCheckoutStep("address"))}
                  className="w-full mt-6 rounded-xl bg-gold-400 py-3 text-xs font-semibold text-white transition-colors hover:bg-gold-500 text-center block shadow-sm"
                >
                  Configure Fitment Address
                </button>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
