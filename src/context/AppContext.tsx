/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order, Address, UserProfile, Coupon, Review, CustomDesignRequest } from "../types";
import { PRODUCTS, STATIC_COUPONS } from "../data/products";

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  profile: UserProfile;
  isDarkMode: boolean;
  activeTab: string;
  selectedCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  quickViewProduct: Product | null;
  showAIChat: boolean;
  appliedCoupon: Coupon | null;
  customRequests: CustomDesignRequest[];
  userRole: "Super Admin" | "Admin" | "Staff" | "Customer";
  isLoggedIn: boolean;
  notifications: string[];
  accountSubTab: "orders" | "addresses" | "custom-requests" | "security" | "reviews";
  setAccountSubTab: (subTab: "orders" | "addresses" | "custom-requests" | "security" | "reviews") => void;
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setShowAIChat: (show: boolean) => void;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  placeOrder: (address: Address, paymentMethod: Order["paymentMethod"]) => Order;
  cancelOrder: (orderId: string) => void;
  requestReturnOrder: (orderId: string) => void;
  applyCouponCode: (code: string, cartTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  addReviewToProduct: (productId: string, review: Omit<Review, "id" | "date" | "isVerified"> & { images?: string[] }) => void;
  likeReview: (productId: string, reviewId: string) => void;
  voteReviewHelpful: (productId: string, reviewId: string, type: "helpful" | "unhelpful") => void;
  reportReview: (productId: string, reviewId: string) => void;
  moderateReview: (productId: string, reviewId: string, status: "approved" | "pending" | "hidden") => void;
  deleteReview: (productId: string, reviewId: string) => void;
  toggleDarkMode: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addCustomRequest: (request: Omit<CustomDesignRequest, "id" | "date" | "status">) => void;
  updateCustomRequestStatus: (id: string, updates: Partial<CustomDesignRequest>) => void;
  setUserRole: (role: "Super Admin" | "Admin" | "Staff" | "Customer") => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  addNotification: (msg: string) => void;
  socialLinks: {
    instagram: string;
    facebook: string;
    pinterest: string;
    youtube: string;
    twitter: string;
    whatsapp: string;
  };
  setSocialLinks: React.Dispatch<React.SetStateAction<{
    instagram: string;
    facebook: string;
    pinterest: string;
    youtube: string;
    twitter: string;
    whatsapp: string;
  }>>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  requireAuth: (action: () => void) => void;
  onAuthSuccess: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  name: "",
  email: "",
  avatar: "",
  phone: "",
  addresses: [],
  walletBalance: 0,
  referralCode: "",
  couponsUsed: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem("blousia_products_v2") || localStorage.getItem("blousia_products");
    if (!cached) {
      localStorage.setItem("blousia_products_v2", JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    try {
      const parsed: Product[] = JSON.parse(cached);
      // Ensure all static catalog products (including new AI Fashion Agent items) are present and synced
      const merged = PRODUCTS.map((staticProd) => {
        const cachedProd = parsed.find((cp) => cp.id === staticProd.id);
        if (cachedProd) {
          return {
            ...staticProd,
            reviews: cachedProd.reviews?.length ? cachedProd.reviews : staticProd.reviews,
            ratings: cachedProd.reviews?.length ? cachedProd.ratings : staticProd.ratings,
          };
        }
        return staticProd;
      });
      // Preserve any custom products added by admin/staff during runtime
      const customAdded = parsed.filter((cp) => !PRODUCTS.some((sp) => sp.id === cp.id));
      const finalProducts = [...merged, ...customAdded];
      localStorage.setItem("blousia_products_v2", JSON.stringify(finalProducts));
      return finalProducts;
    } catch (e) {
      return PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem("blousia_cart");
    return cached ? JSON.parse(cached) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const cached = localStorage.getItem("blousia_wishlist");
    return cached ? JSON.parse(cached) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem("blousia_orders");
    return cached ? JSON.parse(cached) : [];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem("blousia_profile");
    return cached ? JSON.parse(cached) : initialProfile;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem("blousia_dark");
    if (cached) return JSON.parse(cached);
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showAIChat, setShowAIChat] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [accountSubTab, setAccountSubTab] = useState<"orders" | "addresses" | "custom-requests" | "security" | "reviews">("orders");

  const [socialLinks, setSocialLinks] = useState(() => {
    const cached = localStorage.getItem("blousia_social_links");
    return cached ? JSON.parse(cached) : {
      instagram: "https://instagram.com/blousia_couture",
      facebook: "https://facebook.com/blousia",
      pinterest: "https://pinterest.com/blousia",
      youtube: "https://youtube.com/c/blousia",
      twitter: "https://twitter.com/blousia",
      whatsapp: "https://wa.me/918509112927?text=Hello%20Blousia%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20your%20designer%20blouses.",
    };
  });

  useEffect(() => {
    localStorage.setItem("blousia_social_links", JSON.stringify(socialLinks));
  }, [socialLinks]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = (action: () => void) => {
    if (isLoggedIn) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAuthModal(true);
    }
  };

  const onAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Custom requests, Roles, Authentication, and Notifications State
  const [customRequests, setCustomRequests] = useState<CustomDesignRequest[]>(() => {
    const cached = localStorage.getItem("blousia_custom_requests");
    return cached ? JSON.parse(cached) : [
      {
        id: "CR-90412",
        date: "2026-06-25",
        fabric: "Pure Banarasi Katan Silk",
        primaryColor: "#E11D48", // Crimson
        secondaryColor: "#F59E0B", // Gold
        borderColor: "#D97706",
        sleeveStyle: "Elbow Length",
        sleeveLength: "11 inches",
        neckStyle: "Sweetheart",
        backNeckDesign: "Teardrop Deep Cutout",
        frontNeckDesign: "Classic Sweetheart",
        paddingOption: "Premium Removable Pads Included",
        liningOption: "Pure Mulmul Cotton",
        blouseLength: "14.5 inches",
        embroideryStyle: "Zardozi Royal",
        mirrorWork: true,
        zariWork: true,
        stoneWork: false,
        lace: "Fine Zari Lace",
        tassels: "Bespoke Silk Latkans with Beads",
        buttons: "Fabric Covered Buttons",
        hooks: "Back Hooks",
        piping: "Golden Silk Piping",
        measurements: {
          bust: "36 inches",
          waist: "29 inches",
          underbust: "31 inches",
          shoulderToNeck: "5.5 inches",
          armhole: "15 inches",
          sleeveLength: "11 inches",
          sleeveRound: "11.5 inches"
        },
        occasion: "Sister's Wedding Reception",
        notes: "Please make the back dori tassels slightly longer and highly ornate as requested.",
        uploadedFiles: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200"],
        status: "Under Review",
        internalNotes: "Verified pure Katan Silk inventory. Ready for master weaver assignment once approved.",
        suggestedModifications: ""
      }
    ];
  });

  const [userRole, setUserRole] = useState<"Super Admin" | "Admin" | "Staff" | "Customer">(() => {
    const cached = localStorage.getItem("blousia_role");
    return cached ? JSON.parse(cached) : "Customer";
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const cached = localStorage.getItem("blousia_logged_in");
    return cached ? JSON.parse(cached) : true;
  });

  const [notifications, setNotifications] = useState<string[]>(() => {
    const cached = localStorage.getItem("blousia_notifications");
    return cached ? JSON.parse(cached) : [
      "Welcome to Blousia® Couture Studio.",
      "Security Notification: Google Two-Factor Authentication (2FA) is currently ready for activation.",
      "Custom Design Request CR-90412 status updated to 'Under Review'."
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("blousia_custom_requests", JSON.stringify(customRequests));
  }, [customRequests]);

  useEffect(() => {
    localStorage.setItem("blousia_role", JSON.stringify(userRole));
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem("blousia_logged_in", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("blousia_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (msg: string) => {
    setNotifications((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 49) // Keep last 50
    ]);
  };

  const addCustomRequest = (request: Omit<CustomDesignRequest, "id" | "date" | "status">) => {
    const newRequest: CustomDesignRequest = {
      ...request,
      id: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted"
    };
    setCustomRequests((prev) => [newRequest, ...prev]);
    addNotification(`Successfully submitted custom design request: ${newRequest.id}`);
  };

  const updateCustomRequestStatus = (id: string, updates: Partial<CustomDesignRequest>) => {
    setCustomRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const updated = { ...req, ...updates };
          if (updates.status && updates.status !== req.status) {
            addNotification(`Custom Request ${id} advanced to ${updates.status}`);
          }
          return updated;
        }
        return req;
      })
    );
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("blousia_products_v2", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("blousia_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("blousia_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("blousia_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("blousia_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("blousia_dark", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, qty: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      }
      return [...prev, { product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity = quantity;
        return next;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Address operations
  const addAddress = (address: Address) => {
    setProfile((prev) => {
      const addresses = prev.addresses.map((addr) =>
        address.isDefault ? { ...addr, isDefault: false } : addr
      );
      return { ...prev, addresses: [...addresses, address] };
    });
  };

  const updateAddress = (address: Address) => {
    setProfile((prev) => {
      const addresses = prev.addresses.map((addr) => {
        if (addr.id === address.id) return address;
        return address.isDefault ? { ...addr, isDefault: false } : addr;
      });
      return { ...prev, addresses };
    });
  };

  const deleteAddress = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== id),
    }));
  };

  // Coupon Engine
  const applyCouponCode = (code: string, cartTotal: number) => {
    const match = STATIC_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!match) {
      return { success: false, message: "Invalid promo coupon code." };
    }
    if (cartTotal < match.minPurchase) {
      return {
        success: false,
        message: `Min purchase of ₹${match.minPurchase} required for this coupon.`,
      };
    }
    setAppliedCoupon({
      code: match.code,
      description: match.description,
      discountType: match.discountType as "percentage" | "fixed",
      discountValue: match.discountValue,
      minPurchase: match.minPurchase,
      expiresAt: match.expiresAt,
    });
    return { success: true, message: "Coupon applied successfully!" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order (With simulation)
  const placeOrder = (address: Address, paymentMethod: Order["paymentMethod"]) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
    const tax = Math.round(subtotal * 0.12); // 12% IGST for luxury apparel
    const deliveryFee = subtotal > 2000 ? 0 : 150; // Free delivery above 2000
    let couponDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
    }

    // Wallet option
    if (paymentMethod === "Wallet") {
      setProfile((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - (subtotal + tax + deliveryFee - couponDiscount)),
      }));
    }

    const finalTotal = Math.max(0, subtotal + tax + deliveryFee - couponDiscount);
    const orderId = `BLS-${Math.floor(100000 + Math.random() * 900000)}`;

    const elegantAdjectives = ["Royal", "Imperial", "Bespoke", "Celestial", "Vintage", "Atelier", "Golden", "Midnight", "Ivory"];
    const elegantNouns = ["Banarasi Grace", "Sabyasachi Tribute", "Silk Brocade", "Chanderi Whisper", "Zardozi Splendor", "Georgette Bloom", "Velvet Draping"];
    const randomAdj = elegantAdjectives[Math.floor(Math.random() * elegantAdjectives.length)];
    const randomNoun = elegantNouns[Math.floor(Math.random() * elegantNouns.length)];
    const orderName = `${randomAdj} ${randomNoun}`;

    const newOrder: Order = {
      id: orderId,
      orderName,
      date: new Date().toISOString().split("T")[0],
      items: [...cart],
      shippingAddress: address,
      paymentMethod,
      paymentId: (paymentMethod !== "COD" && paymentMethod !== "WhatsApp") ? `pay_${Math.random().toString(36).substring(2, 11)}` : undefined,
      subtotal,
      tax,
      deliveryFee,
      couponDiscount,
      total: finalTotal,
      status: "Processing",
      isPaid: paymentMethod !== "COD" && paymentMethod !== "WhatsApp",
      trackingTimeline: [
        { title: "Order Placed", description: "Your order has been recorded successfully.", timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: true },
        { title: "Seller Processing", description: "Boutique designers are reviewing fitments.", timestamp: "Pending", completed: false },
        { title: "Shipped", description: "Dispatched via Blousia Luxury Express.", timestamp: "Pending", completed: false },
        { title: "Delivered", description: "Item securely delivered with wooden boutique casing.", timestamp: "Pending", completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: "Cancelled",
            trackingTimeline: ord.trackingTimeline.map((item, index) =>
              index === 0
                ? { ...item, description: "Order cancelled by customer." }
                : item
            ),
          };
        }
        return ord;
      })
    );
  };

  const requestReturnOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: "Processing", // Return request triggers processing
            trackingTimeline: [
              ...ord.trackingTimeline,
              { title: "Return Requested", description: "Blousia pick-up agent will verify tag integrity.", timestamp: new Date().toLocaleTimeString(), completed: true },
            ],
          };
        }
        return ord;
      })
    );
  };

  // Add Product review
  const addReviewToProduct = (productId: string, review: Omit<Review, "id" | "date" | "isVerified"> & { images?: string[] }) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      isVerified: true,
      sentiment: review.rating >= 4 ? "positive" : review.rating === 3 ? "neutral" : "negative",
      likes: 0,
      helpful: 0,
      unhelpful: 0,
      reported: false,
      status: "approved", // default to approved
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = [newReview, ...prod.reviews];
          const approvedReviews = reviews.filter(r => r.status !== "hidden");
          const averageRating = approvedReviews.length > 0 
            ? parseFloat((approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1))
            : 0;
          return { ...prod, reviews, ratings: averageRating };
        }
        return prod;
      })
    );
  };

  const likeReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = prod.reviews.map((r) =>
            r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r
          );
          return { ...prod, reviews };
        }
        return prod;
      })
    );
  };

  const voteReviewHelpful = (productId: string, reviewId: string, type: "helpful" | "unhelpful") => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = prod.reviews.map((r) => {
            if (r.id === reviewId) {
              if (type === "helpful") {
                return { ...r, helpful: (r.helpful || 0) + 1 };
              } else {
                return { ...r, unhelpful: (r.unhelpful || 0) + 1 };
              }
            }
            return r;
          });
          return { ...prod, reviews };
        }
        return prod;
      })
    );
  };

  const reportReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = prod.reviews.map((r) =>
            r.id === reviewId ? { ...r, reported: true } : r
          );
          addNotification(`Couture Audit: Product review ${reviewId} has been reported and placed under staff queue.`);
          return { ...prod, reviews };
        }
        return prod;
      })
    );
  };

  const moderateReview = (productId: string, reviewId: string, status: "approved" | "pending" | "hidden") => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = prod.reviews.map((r) =>
            r.id === reviewId ? { ...r, status } : r
          );
          const approvedReviews = reviews.filter(r => r.status !== "hidden");
          const averageRating = approvedReviews.length > 0 
            ? parseFloat((approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1))
            : 0;
          addNotification(`Atelier Moderation: Review ${reviewId} marked as ${status}.`);
          return { ...prod, reviews, ratings: averageRating };
        }
        return prod;
      })
    );
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const reviews = prod.reviews.filter((r) => r.id !== reviewId);
          const approvedReviews = reviews.filter(r => r.status !== "hidden");
          const averageRating = approvedReviews.length > 0 
            ? parseFloat((approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length).toFixed(1))
            : 0;
          addNotification(`Atelier Moderation: Review deleted from Saree product ${productId}.`);
          return { ...prod, reviews, ratings: averageRating };
        }
        return prod;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        profile,
        isDarkMode,
        activeTab,
        selectedCategory,
        searchQuery,
        selectedProduct,
        quickViewProduct,
        showAIChat,
        appliedCoupon,
        customRequests,
        userRole,
        isLoggedIn,
        notifications,
        accountSubTab,
        setAccountSubTab,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setActiveTab,
        setSelectedCategory,
        setSearchQuery,
        setSelectedProduct,
        setQuickViewProduct,
        setShowAIChat,
        setProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        placeOrder,
        cancelOrder,
        requestReturnOrder,
        applyCouponCode,
        removeCoupon,
        addReviewToProduct,
        likeReview,
        voteReviewHelpful,
        reportReview,
        moderateReview,
        deleteReview,
        toggleDarkMode,
        setProducts,
        addCustomRequest,
        updateCustomRequestStatus,
        setUserRole,
        setIsLoggedIn,
        addNotification,
        socialLinks,
        setSocialLinks,
        showAuthModal,
        setShowAuthModal,
        requireAuth,
        onAuthSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
