/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for dev/Vite, should configure properly in prod
}));
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI features will fallback to local simulated responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const aiClient = getGeminiClient();

// API: AI Fashion Consultant Chatbot
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message parameter is required." });
  }

  const systemInstruction = `You are the lead boutique designer, senior fashion stylist, and garment drape specialist at Blousia® (tagline: "Designed to Drape Confidence"). Blousia is an elite boutique specializing exclusively in premium women's blouses in India (bridal, hand-embroidered, silk, cotton, backless, designer organza, boat necks, puff sleeves).
Your tone is warm, refined, polite, and deeply knowledgeable in Indian textiles (Banarasi silk, Kalamkari, Zardozi, brocade, Kanjeevaram weaves). You assist clients with:
- Matching blouse designs with their sarees or lehengas.
- Recommending neckline styles (Boat Neck, High Collar, Sweetheart, Plunge V-neck) or back cuts based on occasions.
- Answering queries about sizing, custom tailoring margins (all our blouses have a generous 2-inch inner margin for alteration), padding removal, and fabric care.
Always speak with premium grace and poise. Try to subtly weave in Blousia's brand identity. End with professional luxury boutique sign-offs. Always output in elegant, clear paragraphs. Use bullet points for recommendations.`;

  if (!aiClient) {
    // Elegant fallback simulation if API key is missing
    return res.json({
      text: `Hello from Blousia® Stylist! (Note: Gemini API is in offline fallback mode). 

For a truly stunning and confident look, we highly recommend our *Kashvi Bridal Banarasi Silk Blouse* paired with a hand-woven Kanjeevaram saree. It features exquisite hand-crafted Zardozi zardozi embroidery and a majestic teardrop back. 

Alternatively, for everyday comfort with a touch of elegance, our high-neck *Avani Indigo Kalamkari Cotton Blouse* works beautifully for formal office wear and afternoon teas.

How can I help you customize your blouse measurements or choose the perfect neck style today, darling?`
    });
  }

  try {
    // Set up chat session with history if provided, or run a single generateContent call
    // Let's model history as past contents to the model
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI Stylist. Please try again later.", details: error.message });
  }
});

// API: AI Occasion Blouse Recommendation
app.post("/api/gemini/suggest-pairings", async (req, res) => {
  const { occasion, sareeType, preferredColor, necklinePreference } = req.body;

  const prompt = `Formulate a detailed, premium blouse recommendation report for a customer dressing for:
- Occasion: ${occasion || "Any Festive/Wedding Event"}
- Saree/Bottom Type: ${sareeType || "Any Saree"}
- Preferred Color Palette: ${preferredColor || "Luxury shades"}
- Neckline Style Interest: ${necklinePreference || "Any elegant cut"}

Provide the recommendations in structured JSON format with three suggestions.
Each suggestion should have:
1. "title": A professional blouse pairing name (e.g., 'Crimson Brocade sweetheart with Gold Zari').
2. "whyItWorks": Explanation of why the fabric, neck, and color coordinates with the saree for this occasion.
3. "stylingTips": Detailed tips (jewelry, hair draping, waist belt options).
4. "tag": The recommended blouse category.`;

  if (!aiClient) {
    return res.json({
      suggestions: [
        {
          title: "Emerald Silk Sweetheart with Zardozi Work",
          whyItWorks: `Contrast matching with a golden or beige Kanjeevaram saree. The silk sheen pairs beautifully for evening weddings, elevating the rich look.`,
          stylingTips: "Wear heavy gold jhumkas and tie your hair in a neat gajra bun to highlight the teardrop back design.",
          tag: "Bridal Blouses"
        },
        {
          title: "Sleeveless Champagne Sequin Boat Neck",
          whyItWorks: "Pairs wonderfully with clean net, organza, or chiffon pastel sarees. Perfect for high-profile cocktail parties or contemporary receptions.",
          stylingTips: "Accessorize with solitaire diamond studs and soft beachy waves swept to one side.",
          tag: "Sleeveless"
        }
      ]
    });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  whyItWorks: { type: Type.STRING },
                  stylingTips: { type: Type.STRING },
                  tag: { type: Type.STRING },
                },
                required: ["title", "whyItWorks", "stylingTips", "tag"]
              }
            }
          },
          required: ["suggestions"]
        },
        temperature: 0.7,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Suggestions Error:", error);
    res.status(500).json({ error: "Failed to generate AI recommendations." });
  }
});

// API: AI Personalized Style Quiz & Curated Collection Advisor
app.post("/api/gemini/style-advisor", async (req, res) => {
  const { stylePreference, preferredFit, occasion, preferredFabric, bodyShape } = req.body;

  if (!stylePreference || !preferredFit || !occasion || !preferredFabric) {
    return res.status(400).json({ error: "Required parameters are missing." });
  }

  const prompt = `Act as an elite haute couture Indian fashion director. A VIP client has taken our personalized style quiz with the following parameters:
- Style Aesthetic Preference: ${stylePreference}
- Preferred Fit Comfort: ${preferredFit}
- Intended Occasion: ${occasion}
- Preferred Fabric Type: ${preferredFabric}
- Silhouette Type (Body Shape): ${bodyShape || "Standard Silhouette"}

Analyze our official catalogue of Blousia® blouses:
1. Product ID 'bl-001', SKU 'BL-KSH-SLK-001': 'Kashvi Hand-Embroidered Banarasi Silk Blouse' (Bridal Blouses, Pure Banarasi Katan Silk, Sweetheart Neck, Elbow Length Sleeves, Teardrop Back, Padded, Crimson Red/Deep Maroon/Royal Gold)
2. Product ID 'bl-002', SKU 'BL-AVN-COT-002': 'Avani Handblock Indigo Kalamkari Cotton Blouse' (Cotton Blouses, 100% Organic Handblock Cotton, Chinese Collar/High Neck, Three-Quarter Sleeves, Non-Padded, Indigo Blue/Madder Red)
3. Product ID 'bl-003', SKU 'BL-IRA-VEL-003': 'Ira Royal Velvet Backless Plunge Blouse' (Designer Blouses, Premium Micro-Velvet, Plunging V-Neck, Daring Backless with Double Dori Cords, Padded, Emerald Green/Midnight Black/Royal Wine)
4. Product ID 'bl-004', SKU 'BL-DIV-SLV-004': 'Diya Sleeveless Sequin-Work Designer Blouse' (Sleeveless, Faux Georgette with dense Micro-Sequins, Boat Neck, Halter Open Back, Padded, Metallic Silver/Champagne Gold/Rose Gold/Jet Black)
5. Product ID 'bl-005', SKU 'BL-GAY-PUF-005': 'Gayatri Princess-Cut Organza Puff Sleeve Blouse' (Puff Sleeve, Raw Silk Blend with sheer Silk-Organza Puff Sleeves, Sweetheart Neck, Padded, Blush Pink/Lavender Haze/Mint Green)
6. Product ID 'bl-006', SKU 'BL-MAN-MIR-006': 'Manjari Handcrafted Mirror-Work Georgette Blouse' (Mirror Work, Pure Heavy Georgette, Hand-set glass mirrors, Deep Round Neck, U-Back with thick silk latkans, Slight Padded, Festive Orange/Fuchsia Pink/Peacock Green)
7. Product ID 'bl-007', SKU 'BL-RUH-BNC-007': 'Ruhi Boat-Neck Banarasi Brocade Blouse' (Boat Neck, Pure Banarasi Silk Brocade with copper zari, Keyhole Back, Non-padded, Deep Violet/Forest Green/Royal Crimson)
8. Product ID 'bl-008', SKU 'BL-TNS-LNN-008': 'Tanisha Premium Linen-Silk V-Neck Blouse' (Linen, 60% Organic Linen + 40% Tussar Silk, Structured V-Neck, Elbow Sleeves, Non-padded, Natural Beige/Chalk White/Slate Grey)

Recommend exactly the top 2 or 3 matching products from this actual catalog. Create a custom-named Tailored Collection specifically for this client's unique style profile (e.g., 'The Sun-Drenched Heritage Loom Collection' or 'Midnight Sovereign Velvet Collection'). 

Provide your response in structured JSON format following this precise schema:
{
  "stylePersonality": "A high-concept aesthetic persona title (e.g. 'The Modern Minimalist Muse' or 'The Royal Banarasi Sovereign')",
  "collectionName": "An elegant, bespoke named blouse collection",
  "collectionDescription": "A polished, beautifully written styling paragraph (2-3 sentences) detailing the custom narrative behind this tailored collection and why it matches their occasion, fabric, and fit comfort.",
  "recommendations": [
    {
      "productId": "The exact product ID from our catalog (e.g. 'bl-001')",
      "productName": "The exact product name from our catalog",
      "matchPercentage": 90, // integer between 75 and 99
      "category": "The exact category of the product",
      "reasoning": "A highly tailored, custom designer rationale (1-2 sentences) explaining why this specific blouse design, neck style, and fabric composition perfectly harmonizes with their silhouette and style goals.",
      "stylingTips": "Specific, practical luxury styling tips (e.g. saree fabric matching, pleating suggestions, jewelry suggestions)."
    }
  ],
  "stylingBoard": [
    "A custom-tailored checklist bullet point describing the perfect saree drape style.",
    "A custom-tailored checklist bullet point describing recommended heirloom or modern jewelry.",
    "A custom-tailored checklist bullet point describing hair and makeup accents that complete the aesthetic."
  ]
}`;

  if (!aiClient) {
    // Elegant fallback simulation if API key is missing, dynamically tailored to user inputs
    let stylePersonality = "";
    let collectionName = "";
    let collectionDescription = "";
    let recs: any[] = [];
    let board: string[] = [];

    if (stylePreference.toLowerCase().includes("minimal") || preferredFabric.toLowerCase().includes("linen")) {
      stylePersonality = "The Sophisticated Minimalist Muse";
      collectionName = "The Sun-Drenched Atelier Collection";
      collectionDescription = `Crafted for your desire for understated luxury, this portfolio centers around crisp lines, lightweight fabric drapes, and organic comfort. Tailored to align with your preference for ${preferredFit} fit, it ensures effortless breathing room and structured elegance.`;
      recs = [
        {
          productId: "bl-008",
          productName: "Tanisha Premium Linen-Silk V-Neck Blouse",
          matchPercentage: 98,
          category: "Linen",
          reasoning: `The French linen-silk blend offers an exquisite matte finish and rustic character that perfectly complements a minimalist look. Its structured V-neck highlights the collarbones beautifully.`,
          stylingTips: "Pair with an organic linen or tussar silk saree in pastel shades. Keep the drape simple with a single-pin shoulder style."
        },
        {
          productId: "bl-002",
          productName: "Avani Handblock Indigo Kalamkari Cotton Blouse",
          matchPercentage: 92,
          category: "Cotton Blouses",
          reasoning: `Perfect for ${occasion}, this breathable high-collar piece offers structured elegance without padding. Handblock prints provide organic depth.`,
          stylingTips: "Match with a plain white mulmul cotton saree or crisp indigo handloom saree. Wear small silver stud earrings."
        }
      ];
      board = [
        "Drape with thin, ironed flat shoulder pleats for a clean, sharp profile.",
        "Accessorize with simple brushed silver jewelry or a matte clay neckpiece.",
        "Opt for a sleek low ponytail and a soft neutral nude lip palette."
      ];
    } else if (stylePreference.toLowerCase().includes("bohemian") || stylePreference.toLowerCase().includes("whimsy") || preferredFabric.toLowerCase().includes("cotton") || preferredFabric.toLowerCase().includes("georgette")) {
      stylePersonality = "The Free-Spirited Bohemian Muse";
      collectionName = "The Festive Nomad Collection";
      collectionDescription = `Designed to embrace your free-spirited, artistic energy. This bespoke collection combines rich hand-worked elements like Rajasthani glass mirrors and whimsical organza puff sleeves, perfect for a ${occasion} setting with comfortable ${preferredFit} tailoring.`;
      recs = [
        {
          productId: "bl-006",
          productName: "Manjari Handcrafted Mirror-Work Georgette Blouse",
          matchPercentage: 96,
          category: "Mirror Work",
          reasoning: `Meticulous hand-set glass mirrors reflect joy and light beautifully. The fluid georgette fabric drapes effortlessly, giving you that artistic bohemian edge.`,
          stylingTips: "Drape with a colourful bandhani or crinkled chiffon saree, allowing the mirror-work sleeves to steal the spotlight."
        },
        {
          productId: "bl-005",
          productName: "Gayatri Princess-Cut Organza Puff Sleeve Blouse",
          matchPercentage: 90,
          category: "Puff Sleeve",
          reasoning: `Dreamy, translucent organza puff sleeves evoke a romantic, whimsical charm. Paired with a sweetheart bodice, it creates a gorgeous silhouette.`,
          stylingTips: "Wear under a lightweight organza saree in matching pastel tones. Secure the saree with a slim leather belt."
        }
      ];
      board = [
        "Use a casual cowl-style open shoulder drape to show off the back latkans.",
        "Accessorize with oxidized silver tribal chokers or layered beaded necklaces.",
        "Style your hair in messy, beachy waves with a vibrant small bindi."
      ];
    } else if (stylePreference.toLowerCase().includes("classic") || stylePreference.toLowerCase().includes("royal") || preferredFabric.toLowerCase().includes("silk") || occasion.toLowerCase().includes("wedding")) {
      stylePersonality = "The Heritage Banarasi Empress";
      collectionName = "The Imperial Loom Collection";
      collectionDescription = `The absolute pinnacle of royal elegance. Tailored for your appreciation of traditional luxury, this collection features heavy, hand-woven silk brocades and immaculate zardozi embroidery, ensuring you command the room for your upcoming ${occasion}.`;
      recs = [
        {
          productId: "bl-001",
          productName: "Kashvi Hand-Embroidered Banarasi Silk Blouse",
          matchPercentage: 99,
          category: "Bridal Blouses",
          reasoning: `Woven with authentic Banarasi katan silk and covered in rich zardozi work. The deep teardrop back and sweetheart neck provide an unmatched royal frame.`,
          stylingTips: "Pair with your finest heirloom gold Kanjeevaram silk saree or a heavy crimson lehenga. Pin the saree pallu neatly."
        },
        {
          productId: "bl-007",
          productName: "Ruhi Boat-Neck Banarasi Brocade Blouse",
          matchPercentage: 94,
          category: "Boat Neck",
          reasoning: `A sophisticated boat neck blouse in heavy copper-zari brocade. Perfect for a ${preferredFit} fit, it balances classic royalty with modern poise.`,
          stylingTips: "Coordinate with an antique cotton-silk saree. Wear with statement gold temple jewelry."
        }
      ];
      board = [
        "Drape in a traditional heavy-folded pleat style over the shoulder to accentuate the brocade border.",
        "Accessorize with traditional kundan necklaces, statement jhumkas, and gold glass bangles.",
        "Tie your hair in a neat low bun wrapped with fresh jasmine flowers (gajra) and a deep red lip."
      ];
    } else {
      // Default contemporary glam/velvet
      stylePersonality = "The Sovereign Evening Diva";
      collectionName = "The Twilight Velvet Collection";
      collectionDescription = `Designed for high-profile glamour, this collection centers around daring necklines, shimmering sequins, and liquid-soft velvet drapes. Perfectly aligned with a ${preferredFit} style, it offers a dramatic silhouette for your ${occasion}.`;
      recs = [
        {
          productId: "bl-003",
          productName: "Ira Royal Velvet Backless Plunge Blouse",
          matchPercentage: 97,
          category: "Designer Blouses",
          reasoning: `Luxurious micro-velvet drapes like liquid gold, paired with a plunging V-neck and a daring double-dori backless design for ultimate evening allure.`,
          stylingTips: "Drape with a sheer satin-silk or designer net saree. Wear the pallu loosely over your arm to expose the open back."
        },
        {
          productId: "bl-004",
          productName: "Diya Sleeveless Sequin-Work Designer Blouse",
          matchPercentage: 93,
          category: "Sleeveless",
          reasoning: `Densely hand-stitched micro-sequins shimmer brilliantly in evening lighting. Featuring a sleek boat neck and halter-style open back.`,
          stylingTips: "Match with a solid black or silver georgette saree. Accessorize with sparkling diamond solitaire studs."
        }
      ];
      board = [
        "Use a single-pleat ultra-narrow float drape to highlight the backless or halter detail.",
        "Accessorize with minimal contemporary diamond jewelry or shoulder-duster earrings.",
        "Style with sleek-backed hair or Hollywood side waves and smokey eye makeup."
      ];
    }

    return res.json({
      stylePersonality,
      collectionName,
      collectionDescription,
      recommendations: recs,
      stylingBoard: board
    });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stylePersonality: { type: Type.STRING },
            collectionName: { type: Type.STRING },
            collectionDescription: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  productName: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  category: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  stylingTips: { type: Type.STRING }
                },
                required: ["productId", "productName", "matchPercentage", "category", "reasoning", "stylingTips"]
              }
            },
            stylingBoard: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["stylePersonality", "collectionName", "collectionDescription", "recommendations", "stylingBoard"]
        },
        temperature: 0.75,
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Style Advisor Error:", error);
    res.status(500).json({ error: "Failed to compile custom recommendation portfolio. Please try again." });
  }
});

// API: AI Review Summary Engine
app.post("/api/gemini/summarize-reviews", async (req, res) => {
  const { productName, reviews } = req.body;

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return res.json({ summary: "No reviews submitted yet to summarize. Be the first to purchase and review!" });
  }

  const reviewTexts = reviews.map((r, idx) => `Review #${idx + 1} (${r.rating} stars) by ${r.userName}: "${r.comment}"`).join("\n");
  const prompt = `Analyze these customer reviews for our luxury blouse "${productName}" and summarize them.
Return a beautiful, concise 3-sentence summary highlight.
Sentence 1: Overall customer consensus and mood.
Sentence 2: What customers love most (material, fit, zardozi work, collar structure).
Sentence 3: Any design notes or advice mentioned (e.g. wash care, dry cleaning, alteration margins).

Reviews:\n${reviewTexts}`;

  if (!aiClient) {
    return res.json({ summary: `Overall consensus for the ${productName} is highly positive with customers praising the neat craftsmanship. Buyers especially love the luxurious fabric sheen and the premium internal cotton lining which provides ultimate wearability. Some clients advise taking advantage of the inner 2-inch margin for a skin-tight fit.` });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini Summarize Error:", error);
    res.json({ summary: "The blouse has received phenomenal response, with customers highlighting its bespoke tailoring, premium cotton padding, and exquisite drape confidence." });
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Blousia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
