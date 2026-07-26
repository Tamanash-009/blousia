/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  images?: string[];
  videos?: string[];
  likes?: number;
  helpful?: number;
  unhelpful?: number;
  reported?: boolean;
  status?: "approved" | "pending" | "hidden";
}

export interface ProductSpecification {
  fabric: string;
  neckStyle: string;
  sleeveStyle: string;
  backDesign: string;
  lining?: string;
  padding?: string;
  closureType?: string;
  colorOptions: string[];
  sizes: string[];
  washCare: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  mrp: number;
  sellingPrice: number;
  discount: number; // calculated as mrp - sellingPrice or percentage
  images: string[];
  ratings: number;
  reviews: Review[];
  specifications: ProductSpecification;
  deliveryEstimateDays: number;
  returnPolicy: string;
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  stock: number;
  faqs: FAQ[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  type: "Home" | "Work" | "Other";
  isDefault: boolean;
}

export interface TrackingMilestone {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderName?: string;
  date: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentMethod: "Razorpay" | "Stripe" | "UPI" | "COD" | "Wallet" | "WhatsApp";
  paymentId?: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
  status: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  trackingTimeline: TrackingMilestone[];
  isPaid: boolean;
}

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  phone: string;
  addresses: Address[];
  walletBalance: number;
  referralCode: string;
  couponsUsed: string[];
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  expiresAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface CustomDesignRequest {
  id: string;
  date: string;
  fabric: string;
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  sleeveStyle: string;
  sleeveLength: string;
  neckStyle: string;
  backNeckDesign: string;
  frontNeckDesign: string;
  paddingOption: string;
  liningOption: string;
  blouseLength: string;
  embroideryStyle: string;
  mirrorWork: boolean;
  zariWork: boolean;
  stoneWork: boolean;
  lace: string;
  tassels: string;
  buttons: string;
  hooks: string;
  piping: string;
  measurements: {
    bust: string;
    waist: string;
    underbust: string;
    shoulderToNeck: string;
    armhole: string;
    sleeveLength: string;
    sleeveRound: string;
  };
  occasion: string;
  notes: string;
  uploadedFiles: string[]; // inspiration images
  status: "Submitted" | "Under Review" | "Accepted" | "Quotation Sent" | "Payment Pending" | "In Production" | "Quality Check" | "Shipped" | "Delivered";
  quotationAmount?: number;
  productionTimelineDays?: number;
  internalNotes?: string;
  suggestedModifications?: string;
}

