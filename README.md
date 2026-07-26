<div align="center">
  <img src="public/pwa-512x512.png" alt="Blousia Logo" width="150" />
  <h1>Blousia® Designer Blouses</h1>
  <p><strong>A production-ready premium women's designer blouse e-commerce platform.</strong></p>
  
  [![React](https://img.shields.io/badge/React-19.0.1-blue.svg?style=flat-square&logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.2.3-purple.svg?style=flat-square&logo=vite)](https://vitejs.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-success.svg?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
</div>

---

## 📖 Overview

Blousia® is a highly optimized, enterprise-grade e-commerce application tailored specifically for premium women's designer blouses. Designed with a mobile-first philosophy and a seamless Single-Page Application (SPA) architecture, Blousia® delivers a luxurious shopping experience mimicking high-end fashion boutiques.

It seamlessly blends traditional e-commerce paradigms with advanced Artificial Intelligence, offering personalized styling advice, dynamic bespoke customizations, and an immersive user interface.

## 🏗️ Architecture & Design Logic

Blousia® utilizes a modern, decoupled architecture focusing on performance, scalability, and exceptional User Experience (UX).

### 1. Frontend Architecture (Client-Side)
- **Framework**: React 19 combined with Vite for lightning-fast HMR and optimized production builds.
- **State Management**: Centralized React Context API (`AppContext.tsx`) managing global state (Cart, Wishlist, User Profile, active views) without the overhead of Redux.
- **Styling**: Tailwind CSS 4.x utilized for utility-first, responsive, and highly maintainable styling. Dark mode is fully supported via Tailwind's `dark:` variants.
- **Animations**: Framer Motion (`motion/react`) handles complex micro-interactions, page transitions, and the `Skeleton` loading states, creating a fluid, app-like feel.
- **PWA (Progressive Web App)**: `vite-plugin-pwa` empowers the app to be installed locally on mobile devices, offering offline caching, background sync, and an immersive standalone display mode.

### 2. Backend Architecture (Server-Side)
- **Server**: Node.js with Express (`server.ts`) acts as an API Gateway and Backend-for-Frontend (BFF).
- **AI Integration**: Integrates directly with the `@google/genai` SDK to power the "Style Advisor" and "Fashion Chatbot", leveraging Gemini models to provide intelligent, context-aware styling recommendations based on user inputs (occasion, saree type, color).
- **Security Middleware**: 
  - `helmet`: Secures HTTP headers against XSS and clickjacking.
  - `cors`: Restricts API access to authorized domains.
  - `express-rate-limit`: Prevents DDoS and brute-force attacks on AI endpoints.

### 3. SEO & AEO (Answer Engine Optimization)
- **Dynamic Metadata**: `react-helmet-async` dynamically alters `<title>`, `<meta>`, and OpenGraph tags based on the active route or selected product.
- **Structured Data**: JSON-LD Schema (Product, Organization, Website) is injected into the DOM, making the platform easily crawlable and understandable by AI Search Engines (GEO) and traditional crawlers (Googlebot).

## 💡 Core Use Cases

1. **The Premium Shopper**: Users browse high-resolution imagery of bespoke blouses. They utilize advanced filtering (fabric, embroidery style, price) to find the perfect match for their saree.
2. **The Custom Designer**: Users interact with the `BespokeCustomizer` to design a blouse from scratch—choosing necklines, back designs, sleeve lengths, and padding options, then submitting the request for a custom quotation.
3. **The Uncertain Stylist (AI Advisor)**: A user has a specific occasion (e.g., "Wedding Reception") and a specific saree ("Banarasi Silk"). They consult the AI Style Advisor, which generates expert recommendations on contrasting blouse colors, optimal necklines, and matching embroidery.
4. **The Mobile User (PWA)**: A user discovers the site via mobile browser, is prompted to "Install App", and subsequently accesses Blousia® directly from their home screen for a fast, native-like experience.

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Core UI** | React 19, TypeScript 5.8, DOM |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS 4.1, Lucide React (Icons) |
| **Animation** | Framer Motion |
| **Backend** | Node.js, Express, tsx, esbuild |
| **AI / ML** | Google Gemini API (`@google/genai`) |
| **Mapping** | `@vis.gl/react-google-maps` |
| **Security** | Helmet, CORS, Express-Rate-Limit, Cookie-Parser |
| **SEO & PWA**| React Helmet Async, Vite PWA Plugin |

## 📁 Repository Structure

```text
blousia/
├── public/                 # PWA icons, favicons, manifests
├── src/
│   ├── components/         # Modular React Components (Header, ProductCard, etc.)
│   ├── context/            # Global AppContext & State hooks
│   ├── data/               # Static/Mock data (Products, Reviews)
│   ├── types.ts            # Global TypeScript Interfaces
│   ├── index.css           # Tailwind entry & global styles
│   ├── App.tsx             # Main layout, Routing (Tabs), Modal overlays
│   └── main.tsx            # React entry point & HelmetProvider
├── server.ts               # Express Backend (API Routes & Gemini integration)
├── vite.config.ts          # Vite configs, Rollup chunking, PWA generation
├── vercel.json             # Vercel deployment & rewrite rules
├── SECURITY.md             # Vulnerability disclosure policies
└── package.json            # Project dependencies & scripts
```

## 🚀 Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/blousia.git
   cd blousia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your API keys to `.env`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   GOOGLE_MAPS_PLATFORM_KEY="your_google_maps_platform_key_here"
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The application will launch concurrently with the Express server at `http://localhost:3000`.*

## 📦 Build & Deployment

To build the optimized static assets and server bundle:
```bash
npm run build
```

### Vercel Deployment

This project includes a `vercel.json` optimized for Vercel's Edge Network.
1. Push your code to GitHub.
2. Import the repository in your Vercel Dashboard.
3. Configure the **Environment Variables** (`GEMINI_API_KEY`, `GOOGLE_MAPS_PLATFORM_KEY`).
4. Click **Deploy**. Vercel will automatically detect Vite, build the static files, and serve the API routes if configured correctly.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](file:///a:/blousia/LICENSE) file for details.
Copyright (c) 2026 Blousia® (Tamanash-009). All rights reserved.
