/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "bl-001",
    sku: "BL-KSH-SLK-001",
    name: "Kashvi Hand-Embroidered Banarasi Silk Blouse",
    category: "Bridal Blouses",
    description: "A masterclass in traditional craftsmanship. This bridal blouse is hand-woven with premium Banarasi katan silk and features intricate zardozi embroidery and delicate pearl work. Cut in a classic princess style with a deep teardrop back, it is designed to pair flawlessly with heavy bridal lehengas and heirloom silk sarees. Inside cotton lining ensures soft touch and maximum comfort during long wedding festivities.",
    seoTitle: "Kashvi Bridal Banarasi Silk Blouse with Zardozi Embroidery - Blousia",
    seoDescription: "Buy the premium Kashvi hand-embroidered bridal Banarasi silk blouse with intricate zardozi work and elegant teardrop back design. Fully lined with pure cotton.",
    mrp: 8499,
    sellingPrice: 5999,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.9,
    reviews: [
      {
        id: "r-001-1",
        userName: "Priya Sharma",
        userEmail: "priya.s@gmail.com",
        rating: 5,
        comment: "Absolutely stunning craftsmanship! The zardozi work is neat and extremely premium. It fit me like a glove. Best wedding purchase!",
        date: "2026-05-12",
        isVerified: true,
        sentiment: "positive"
      },
      {
        id: "r-001-2",
        userName: "Ananya Iyer",
        userEmail: "ananya.iyer@yahoo.com",
        rating: 5,
        comment: "The crimson color is extremely vibrant, and the teardrop back looks so elegant. The lining is pure soft cotton, which made it super comfortable for my sister's wedding.",
        date: "2026-06-02",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Pure Banarasi Katan Silk",
      neckStyle: "Sweetheart Neck",
      sleeveStyle: "Elbow Length Sleeves with Zari Border",
      backDesign: "Teardrop Back with Dori and Hand-Crafted Latkans",
      lining: "Pure Mulmul Cotton Lining",
      padding: "Premium Removable Padding Included",
      closureType: "Back Hook-and-Eye Closure",
      colorOptions: ["Crimson Red", "Royal Gold", "Deep Maroon"],
      sizes: ["34", "36", "38", "40", "42"],
      washCare: "Dry Clean Only. Iron on reverse low setting."
    },
    deliveryEstimateDays: 3,
    returnPolicy: "Easy 10-day exchange and returns. Item must be unworn with tags intact.",
    availability: "In Stock",
    stock: 24,
    isBestSeller: true,
    isTrending: true,
    faqs: [
      {
        question: "Can this blouse be altered for size?",
        answer: "Yes, all Blousia blouses come with a generous 2-inch inner margin on both sides, allowing you to easily alter it up or down by one full size."
      },
      {
        question: "Are the pads removable?",
        answer: "Yes, this blouse contains premium pre-shaped padding that can be easily removed through a hidden slot in the inner lining."
      }
    ]
  },
  {
    id: "bl-002",
    sku: "BL-AVN-COT-002",
    name: "Avani Handblock Indigo Kalamkari Cotton Blouse",
    category: "Cotton Blouses",
    description: "Bring earthy sophistication to your wardrobe with our Avani blouse. Made of 100% natural-dyed organic cotton hand-block printed in Machilipatnam using authentic Kalamkari techniques. Featuring a classic high neck collar with structural princess cutting and hand-stitched potli button details down the front. Breathable and sweat-absorbent, making it excellent for daily office wear and daytime events.",
    seoTitle: "Avani Indigo Kalamkari High Neck Cotton Blouse - Blousia",
    seoDescription: "Shop Avani handblock printed Indigo Kalamkari cotton blouse. Made with 100% organic cotton, high neck design, ideal for formal & office wear.",
    mrp: 2499,
    sellingPrice: 1499,
    discount: 40,
    images: [
      "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.7,
    reviews: [
      {
        id: "r-002-1",
        userName: "Meera Nair",
        userEmail: "meera.nair@outlook.com",
        rating: 5,
        comment: "Beautiful fabric. It smells like natural indigo dye and has that organic texture. Extremely elegant for office wear paired with a linen saree.",
        date: "2026-05-24",
        isVerified: true,
        sentiment: "positive"
      },
      {
        id: "r-002-2",
        userName: "Shweta Patel",
        userEmail: "shwetap@gmail.com",
        rating: 4,
        comment: "Excellent print and tailoring. The high neck is very formal and elegant. Hand wash carefully as natural dye bleeds slightly in the first wash.",
        date: "2026-06-15",
        isVerified: true,
        sentiment: "neutral"
      }
    ],
    specifications: {
      fabric: "100% Organic Handblock Cotton",
      neckStyle: "Chinese Collar / High Neck",
      sleeveStyle: "Three-Quarter Length Sleeves",
      backDesign: "Full Coverage Closed Back",
      lining: "Self-fabric Inner Lining",
      padding: "Non-Padded for Natural Silhouette",
      closureType: "Front Open with Fabric Potli Buttons",
      colorOptions: ["Indigo Blue", "Madder Red", "Mustard Ochre"],
      sizes: ["32", "34", "36", "38", "40", "42", "44"],
      washCare: "Hand wash separately in cold water with mild detergent. Dry in shade."
    },
    deliveryEstimateDays: 4,
    returnPolicy: "Hassle-free 15-day return policy.",
    availability: "In Stock",
    stock: 50,
    isNewArrival: true,
    faqs: [
      {
        question: "Does the color bleed?",
        answer: "Authentic Kalamkari uses organic vegetable dyes which might release slight excess color in the first wash. We recommend dry cleaning first or washing separately in cold water."
      }
    ]
  },
  {
    id: "bl-003",
    sku: "BL-IRA-VEL-003",
    name: "Ira Royal Velvet Backless Plunge Blouse",
    category: "Designer Blouses",
    description: "Command attention in the room. This designer blouse is tailored in luxurious royal micro-velvet, featuring a daring plunging V-neckline and a striking open back with double criss-cross tie cords. The sleeves are adorned with subtle hand-stitched cutdana borders. It drapes like liquid gold, offering a highly sensuous yet sophisticated silhouette for cocktail parties and elite receptions.",
    seoTitle: "Ira Premium Royal Velvet Backless V-Neck Blouse - Blousia",
    seoDescription: "Exquisite Ira velvet backless blouse featuring double dori ties, plunge V neck, and beautiful hand-cutdana detailing. Perfect for receptions and parties.",
    mrp: 4999,
    sellingPrice: 3299,
    discount: 34,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.8,
    reviews: [
      {
        id: "r-003-1",
        userName: "Kareena Kapoor",
        userEmail: "kareena.fan@gmail.com",
        rating: 5,
        comment: "So hot and elegant! The back is fully open except for the gorgeous thick latkan ties. The velvet quality is heavy and very high-end.",
        date: "2026-06-11",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Premium Micro-Velvet (Non-crushable)",
      neckStyle: "Plunging V-Neck",
      sleeveStyle: "Short Sleeves with Cutdana Trim",
      backDesign: "Daring Backless with Double Dori Cords",
      lining: "Satin Silk Lining for Ultra-Smooth feel",
      padding: "Heavy pre-shaped cup padding built-in",
      closureType: "Back tie-ups and lower back hook hook",
      colorOptions: ["Emerald Green", "Midnight Black", "Royal Wine"],
      sizes: ["34", "36", "38", "40"],
      washCare: "Dry Clean Only. Do not iron directly on velvet, use steam on reverse."
    },
    deliveryEstimateDays: 3,
    returnPolicy: "10-day returns accepted.",
    availability: "Low Stock",
    stock: 8,
    isBestSeller: false,
    isTrending: true,
    faqs: [
      {
        question: "Is the plunge neckline too deep?",
        answer: "The neck drop is approx 9.5 inches with invisible skin-toned mesh reinforcement to prevent gaping and ensure it stays secured against the skin."
      }
    ]
  },
  {
    id: "bl-004",
    sku: "BL-DIV-SLV-004",
    name: "Diya Sleeveless Sequin-Work Designer Blouse",
    category: "Sleeveless",
    description: "Sparkle through festive nights with the Diya blouse. Adorned with premium micro-sequins densely hand-stitched onto a robust georgette base. Features a flattering boat neck and a deep halter-style open back. Its modern minimal cut makes it incredibly versatile—pair it with a simple plain georgette saree to create an instant designer outfit or under an open shrug.",
    seoTitle: "Diya Sleeveless Sequin Blouse - Premium Blousia Collection",
    seoDescription: "Shop Diya sleeveless georgette blouse covered in premium sparkling micro-sequins. Sleek boat neck with a modern halter-cut back.",
    mrp: 3499,
    sellingPrice: 1999,
    discount: 43,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.6,
    reviews: [
      {
        id: "r-004-1",
        userName: "Ritu Verma",
        userEmail: "rituv@gmail.com",
        rating: 5,
        comment: "This blouse is a showstopper. The sequins catch the light beautifully and don't scratch at all because of the premium satin edge-piping.",
        date: "2026-06-19",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Faux Georgette with dense Micro-Sequins",
      neckStyle: "Boat Neck",
      sleeveStyle: "Sleeveless with Soft Satin Piping",
      backDesign: "Halter Open Back with Hook-and-Loop closures",
      lining: "Premium Butter Crepe Lining",
      padding: "Standard padding included",
      closureType: "Left Side Invisible Zipper",
      colorOptions: ["Metallic Silver", "Champagne Gold", "Rose Gold", "Jet Black"],
      sizes: ["34", "36", "38", "40", "42"],
      washCare: "Dry Clean Only. Handle with care."
    },
    deliveryEstimateDays: 2,
    returnPolicy: "Easy 10-day returns.",
    availability: "In Stock",
    stock: 35,
    isBestSeller: true,
    isTrending: false,
    faqs: [
      {
        question: "Do the sequins prick or cause itching?",
        answer: "No. All seam borders are protected with soft satin piping, and the interior is fully lined with ultra-soft Butter Crepe to prevent any contact between the sequins and your skin."
      }
    ]
  },
  {
    id: "bl-005",
    sku: "BL-GAY-PUF-005",
    name: "Gayatri Princess-Cut Organza Puff Sleeve Blouse",
    category: "Puff Sleeve",
    description: "An elegant blend of modern whimsy and classic structure. The Gayatri blouse is tailored with structural princess cutting in raw silk-blend and features dreamy, voluminous sheer organza puff sleeves ending in neat embroidered wrist-cuffs. Designed with a clean sweetheart neck, it gives an extremely youthful and chic look to traditional handlooms.",
    seoTitle: "Gayatri Raw Silk Blouse with Organza Puff Sleeves - Blousia",
    seoDescription: "Order Gayatri princess-cut silk blouse featuring beautiful translucent organza puff sleeves. Classic sweetheart neck and modern appeal.",
    mrp: 3999,
    sellingPrice: 2499,
    discount: 37,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.5,
    reviews: [
      {
        id: "r-005-1",
        userName: "Sonali Bendre",
        userEmail: "sonali.b@gmail.com",
        rating: 4,
        comment: "The puff sleeves look very vintage and regal! Perfect for modern aesthetic matching. Fabric has a nice stiff shine.",
        date: "2026-06-21",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Raw Silk Blend with Premium Silk-Organza Sleeves",
      neckStyle: "Sweetheart Neck",
      sleeveStyle: "Dramatic Balloon/Puff Sleeves with Embroidered Cuff",
      backDesign: "Classic Round Back",
      lining: "100% Breathable Cotton Lining",
      padding: "Removable soft cups",
      closureType: "Back Hook Closure",
      colorOptions: ["Blush Pink", "Lavender Haze", "Mint Green"],
      sizes: ["34", "36", "38", "40", "42"],
      washCare: "Dry Clean recommended. Iron sleeves under a protective cloth with low temperature."
    },
    deliveryEstimateDays: 4,
    returnPolicy: "10-day returns accepted.",
    availability: "In Stock",
    stock: 18,
    isNewArrival: true,
    faqs: [
      {
        question: "Does the puff sleeve look too bulky?",
        answer: "The organza is double-pressed and gathers are structured around the shoulder joints to ensure an elegant drape rather than stiff flare."
      }
    ]
  },
  {
    id: "bl-006",
    sku: "BL-MAN-MIR-006",
    name: "Manjari Handcrafted Mirror-Work Georgette Blouse",
    category: "Mirror Work",
    description: "Celebrate Indian heritage with the Manjari blouse. Handcrafted by rural artisans, this stunning piece is decorated with actual hand-set mirrors secured with meticulous multi-colored silk threads on a premium georgette fabric. Ideal for Garba nights, festive Diwali family gatherings, and mehendi functions, this bright, celebratory piece elevates any traditional attire.",
    seoTitle: "Manjari Rajasthani Hand Mirror-Work Blouse - Blousia Premium",
    seoDescription: "Exquisite Manjari blouse featuring authentic Rajasthani hand glass mirror-work in silk embroidery. Perfect for Diwali and mehendi celebrations.",
    mrp: 5999,
    sellingPrice: 3899,
    discount: 35,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.9,
    reviews: [
      {
        id: "r-006-1",
        userName: "Jyoti Mehta",
        userEmail: "jyoti.m@yahoo.com",
        rating: 5,
        comment: "Stunning real mirrors! The reflection in daylight is mesmerizing. The stitching is flawless, and it has extra hooks inside.",
        date: "2026-06-05",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Pure Heavy Georgette",
      neckStyle: "Deep Round Neck with Gota Patti Lace",
      sleeveStyle: "Short Sleeves with Dense Mirror Clusters",
      backDesign: "U-Back with thick woven silk latkans",
      lining: "Pure cotton mulmul lining",
      padding: "Slight padded cups",
      closureType: "Back Hook Closure",
      colorOptions: ["Festive Orange", "Fuchsia Pink", "Peacock Green"],
      sizes: ["34", "36", "38", "40", "42", "44"],
      washCare: "Dry Clean Only. Handcrafted mirrors are delicate."
    },
    deliveryEstimateDays: 5,
    returnPolicy: "Return within 10 days for size adjustments.",
    availability: "In Stock",
    stock: 12,
    isBestSeller: false,
    isTrending: true,
    faqs: [
      {
        question: "Are these real mirrors or plastic foil?",
        answer: "We use 100% genuine glass mirrors carefully handcrafted and secured with dense embroidery—not cheap foil stickers. This gives that premium, authentic traditional luster."
      }
    ]
  },
  {
    id: "bl-007",
    sku: "BL-RUH-BNC-007",
    name: "Ruhi Boat-Neck Banarasi Brocade Blouse",
    category: "Boat Neck",
    description: "Timeless luxury at its best. The Ruhi blouse is crafted in heavy Banarasi brocade featuring classic floral patterns intricately woven in pure copper zari. Styled with an elegant boat neck that flatters the collarbone, and a keyhole button back. Pair it with an antique cotton-silk saree for an elegant, scholarly appearance at cultural soirées and high teas.",
    seoTitle: "Ruhi Banarasi Brocade Boat-Neck Blouse with Copper Zari - Blousia",
    seoDescription: "Shop Ruhi premium Banarasi brocade blouse with elegant boat neck and modern keyhole back. Exquisite copper zari weaves.",
    mrp: 3299,
    sellingPrice: 1799,
    discount: 45,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.7,
    reviews: [
      {
        id: "r-007-1",
        userName: "Vaidehi Deshmukh",
        userEmail: "vaidehi.d@outlook.com",
        rating: 5,
        comment: "Excellent weave! The copper zari is subtle and not too flashy like gold. Boat neck cut is extremely classy.",
        date: "2026-05-18",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "Pure Banarasi Silk Brocade",
      neckStyle: "Boat Neck",
      sleeveStyle: "Short Sleeves with Zari piping",
      backDesign: "Elegant back keyhole with gold loop-button",
      lining: "Ultra Soft Cotton Lining",
      padding: "Non-padded for natural profile",
      closureType: "Back opening with hidden hook and loop",
      colorOptions: ["Deep Violet", "Forest Green", "Royal Crimson"],
      sizes: ["34", "36", "38", "40", "42", "44"],
      washCare: "Dry Clean Only."
    },
    deliveryEstimateDays: 3,
    returnPolicy: "15-day exchange policy.",
    availability: "In Stock",
    stock: 40,
    isBestSeller: true,
    isTrending: false,
    faqs: [
      {
        question: "Is the zari weave itchy?",
        answer: "No. The zari is premium quality woven directly into the fabric, and the entire bodice is lined with high-count soft cotton mulmul so the zari never touches your skin."
      }
    ]
  },
  {
    id: "bl-008",
    sku: "BL-TNS-LNN-008",
    name: "Tanisha Premium Linen-Silk V-Neck Blouse",
    category: "Linen",
    description: "For the lover of understated luxury and minimalist chic. Tanisha is woven from premium French flax blended with soft tussar silk, giving it a beautiful organic texture with a luxurious satin luster. Cut in a contemporary deep V-neck with crisp panel stitching, it is exceptionally lightweight and breathable, ideal for humid summer weddings, formal business conferences, and brunch dates.",
    seoTitle: "Tanisha Minimalist French Linen-Silk V-Neck Blouse - Blousia",
    seoDescription: "Shop Tanisha premium linen-silk blend blouse with deep V-neck. Organic rustic elegance with a subtle luxurious satin shine.",
    mrp: 2999,
    sellingPrice: 1699,
    discount: 43,
    images: [
      "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600"
    ],
    ratings: 4.8,
    reviews: [
      {
        id: "r-008-1",
        userName: "Kavitha Raj",
        userEmail: "kavitha.raj@gmail.com",
        rating: 5,
        comment: "Excellent summer blouse! The mix of linen and silk is brilliant—breathable like linen but drapes beautifully without hard wrinkles because of the silk.",
        date: "2026-06-10",
        isVerified: true,
        sentiment: "positive"
      }
    ],
    specifications: {
      fabric: "60% Organic Linen, 40% Tussar Silk",
      neckStyle: "Structured V-Neck",
      sleeveStyle: "Elbow sleeves with minimal slit detail",
      backDesign: "Classic Mid-drop Square back",
      lining: "Lined with fine organic cotton cambric",
      padding: "Non-padded, features double-layered chest panels",
      closureType: "Front hook-and-eye closure",
      colorOptions: ["Natural Beige", "Chalk White", "Slate Grey"],
      sizes: ["34", "36", "38", "40", "42"],
      washCare: "Dry clean or gentle hand wash. Iron on damp linen setting."
    },
    deliveryEstimateDays: 3,
    returnPolicy: "Hassle-free 10-day returns.",
    availability: "In Stock",
    stock: 22,
    isNewArrival: false,
    faqs: [
      {
        question: "Does linen crease easily?",
        answer: "Pure linen creases, but our proprietary Tussar-Silk blend significantly increases wrinkle-resistance, allowing the blouse to retain a neat, crisp look all day long."
      }
    ]
  }
];

export const ALL_CATEGORIES = [
  "Bridal Blouses",
  "Silk Blouses",
  "Cotton Blouses",
  "Designer Blouses",
  "Embroidered Blouses",
  "Handwork Blouses",
  "Sleeveless",
  "Boat Neck",
  "High Neck",
  "V Neck",
  "Puff Sleeve",
  "Princess Cut",
  "Backless",
  "Mirror Work",
  "Linen"
];

export const STATIC_COUPONS = [
  { code: "BLOUSEROYAL", description: "Flat ₹1000 off on bridal collection", discountType: "fixed", discountValue: 1000, minPurchase: 5000, expiresAt: "2026-12-31" },
  { code: "FIRSTBUY", description: "10% off on your first order", discountType: "percentage", discountValue: 10, minPurchase: 1000, expiresAt: "2026-12-31" },
  { code: "FESTIVE15", description: "15% off up to ₹1500 on Festive wear", discountType: "percentage", discountValue: 15, minPurchase: 2000, expiresAt: "2026-12-31" }
];

export const SAMPLE_BLOGS = [
  {
    id: "b-001",
    title: "The Ultimate Guide to Selecting the Perfect Neckline for Your Body Type",
    excerpt: "From deep sweethearts to modern boat necks, here is how you can match blouse cuts with your collarbones and shoulders to drape ultimate confidence.",
    content: "Selecting a blouse neckline is a science of proportions. For broad-shouldered silhouettes, deep V-necks and sweetheart cuts offer vertical emphasis, softening the chest frame. For slender collarbones, Boat Necks and High Collars present an extremely regal, majestic structure that extends elegance to the neck. Always pair heavy Banarasi or wedding silk sarees with structural sweetheart or round necks, while contemporary organza can go beautifully with sleeveless plunges.",
    category: "Style Guide",
    author: "Malini Sen (Fashion Editor)",
    date: "2026-06-15",
    readTime: "4 mins read",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "b-002",
    title: "Caring for Zardozi & Handloom: Preservation Secrets of Heirloom Blouses",
    excerpt: "Don't let humidity ruin your wedding wear. Discover expert techniques on how to wrap, wash, and preserve heavy metal-embroidered blouses.",
    content: "Zardozi and handloom weaves are delicate works of art. Never spray perfume directly on heavy gold or copper zari blouses, as alcohol accelerates metal oxidation causing dark patches. Wrap each blouse individually in pure unbleached cotton mulmul sheets before storing them in cedar closets. Avoid standard plastic hangers which might snap delicate shoulder seams; instead, fold them flat to protect the inner structural cup pads.",
    category: "Garment Care",
    author: "Prasoon Dev (Fabric Specialist)",
    date: "2026-06-22",
    readTime: "6 mins read",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600"
  }
];
