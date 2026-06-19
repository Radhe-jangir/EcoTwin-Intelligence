import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
// Load environment variables
dotenv.config({
  path: ".env.local"
});
import OpenAI from "openai";

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
import { createServer as createViteServer } from "vite";
import * as archiver from "archiver";



// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());



// -----------------------------------------------------------------------------
// LOCAL DURABLE DB ENGINE
// -----------------------------------------------------------------------------
const DB_FILE_PATH = path.join(process.cwd(), "data", "carbon_twin_db.json");

// Import key schemas/utilities directly (we replicate seed code in JS to avoid tsx transpilation mismatches during import)
import { 
  generatePreseededHistory, 
  generatePreseededDailyInputs, 
  aggregateMonthlyFeatures, 
  generatePredictiveForecast, 
  rankRecommendations, 
  classifyUserPersona, 
  getModelMonitoringStats, 
  simulateScenarioImpact,
  calculateEmissionsFromDayInput
} from "./src/mlEngine";
import { DayInput, EngineeredFeatures, UserPersona } from "./src/types";

interface UserRecord {
  userId: string;
  email: string;
  passwordHash: string;
  displayName: string;
  dailyInputs: DayInput[];
  engineeredHistory: EngineeredFeatures[];
  userPersona: UserPersona;
  sustainabilityIndex: number;
}

interface DbSchema {
  users: UserRecord[];
}

// Loads or initializes DB supporting multi-user profiles cleanly
function loadDatabase(): DbSchema {
  let db: any = {};
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf8");
      db = JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load carbon twin database file, initializing fresh:", err);
  }

  // Ensure "users" exists
  if (!db.users || !Array.isArray(db.users)) {
    db.users = [];
  }

  // If database is empty or has old top-level fields, migrate them to a default user profile
  if (db.users.length === 0) {
    const oldInputs = db.dailyInputs || generatePreseededDailyInputs();
    const oldHistory = db.engineeredHistory || generatePreseededHistory();
    const oldPersona = db.userPersona || "Sustainability Enthusiast";
    const oldIndex = db.sustainabilityIndex || 88;

    db.users.push({
      userId: "user_digital_twin_1",
      email: "rdj45448@gmail.com",
      passwordHash: "password123",
      displayName: "Rdj",
      dailyInputs: oldInputs,
      engineeredHistory: oldHistory,
      userPersona: oldPersona,
      sustainabilityIndex: oldIndex
    });
    saveDatabase(db);
  }

  return db as DbSchema;
}

function saveDatabase(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to carbon twin database:", err);
  }
}

// Retrieves user currently active via customized request header
function getActiveUser(req: express.Request, db: DbSchema): UserRecord {
  const userId = (req.headers["x-user-id"] as string) || "user_digital_twin_1";
  const user = db.users.find(u => u.userId === userId);
  return user || db.users[0];
}

// -----------------------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------------------

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    aiEnabled: !!process.env.GROQ_API_KEY
  });
});

// Authentication: Sign-up API
app.post("/api/auth/signup", (req, res) => {
  const { email, password, displayName } = req.body;
  
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: "All signup fields are mandatory." });
  }

  const db = loadDatabase();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return res.status(400).json({ error: "Email address is already registered." });
  }

  const newUserId = `user_${Date.now()}`;
  const newUser: UserRecord = {
    userId: newUserId,
    email: email.trim(),
    passwordHash: password, // client-salted local storage
    displayName: displayName.trim(),
    dailyInputs: generatePreseededDailyInputs(), // Seed beautiful historical footprints immediately
    engineeredHistory: generatePreseededHistory(),
    userPersona: "Eco Beginner",
    sustainabilityIndex: 65
  };

  db.users.push(newUser);
  saveDatabase(db);

  res.json({
    success: true,
    user: {
      userId: newUser.userId,
      email: newUser.email,
      displayName: newUser.displayName,
      persona: newUser.userPersona,
      currentEcoScore: newUser.sustainabilityIndex
    }
  });
});

// Authentication: Sign-in API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password arguments." });
  }

  const db = loadDatabase();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email credentials or incorrect password." });
  }

  res.json({
    success: true,
    user: {
      userId: user.userId,
      email: user.email,
      displayName: user.displayName,
      persona: user.userPersona,
      currentEcoScore: user.sustainabilityIndex
    }
  });
});

// Main Dashboard State Endpoint with multi-user isolation
app.get("/api/carbon/state", (req, res) => {
  const db = loadDatabase();
  const user = getActiveUser(req, db);
  
  // Sort engineered history chronological
  const history = [...user.engineeredHistory].sort((a, b) => a.period.localeCompare(b.period));
  
  let latestFeature: EngineeredFeatures | undefined = history[history.length - 1];
  if (!latestFeature) {
    // Graceful initializer for brand new users
    latestFeature = {
      id: "period_init",
      userId: user.userId,
      period: new Date().toISOString().slice(0, 7),
      totalCO2e_kg: 0,
      transportCO2e_kg: 0,
      foodCO2e_kg: 0,
      electricityCO2e_kg: 0,
      shoppingCO2e_kg: 0,
      wasteCO2e_kg: 0,
      travelCO2e_kg: 0,
      monthlyTransportDistance_km: 0,
      avgFoodImpactScore_normalized: 0,
      avgElectricityUsage_kWh: 0,
      wasteDiversionRate: 0,
      sustainabilityIndex: 50,
      dataCompletenessScore: 0
    };
  }

  // Recalculate dynamic models to guarantee analytical consistency
  const activePersona = classifyUserPersona(latestFeature);
  const activeForecast = generatePredictiveForecast(history.length > 0 ? history : [latestFeature], 'exponential_smoothing');
  const activeRecs = rankRecommendations(latestFeature, activePersona);
  const monitoringMetrics = getModelMonitoringStats(history.length > 0 ? history : [latestFeature]);

  user.userPersona = activePersona;
  user.sustainabilityIndex = latestFeature.sustainabilityIndex;
  saveDatabase(db);

  res.json({
    profile: {
      userId: user.userId,
      displayName: user.displayName,
      email: user.email,
      persona: activePersona,
      currentEcoScore: latestFeature.sustainabilityIndex,
      lastUpdated: new Date().toISOString()
    },
    latestFeature,
    history,
    dailyInputs: user.dailyInputs,
    forecast: activeForecast,
    recommendations: activeRecs,
    monitoringMetrics
  });
});

// Add Daily Lifestyle Log with user-specific isolation
app.post("/api/carbon/add-input", (req, res) => {
  const { date, transport, food, electricity, shopping, waste, travel } = req.body;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is mandatory." });
  }

  const db = loadDatabase();
  const user = getActiveUser(req, db);

  const formattedDate = date.slice(0, 10); // YYYY-MM-DD
  const period = formattedDate.slice(0, 7);   // YYYY-MM

  const newInput: DayInput = {
    id: `input_${formattedDate}`,
    date: formattedDate,
    transport: transport || { distance_km: 0, mode: "walk", fuelType: "none" },
    food: food || { meal_type: "vegetarian" },
    electricity: electricity || { kwh_usage: 0, bill_amount_usd: 0 },
    shopping: shopping || { category: "none", amount_usd: 0 },
    waste: waste || { weight_kg: 0, type: "recyclable" },
    travel: travel || { distance_km: 0, mode: "none", cabinClass: "none" }
  };

  // Replace if exists, or append
  const idx = user.dailyInputs.findIndex(i => i.date === formattedDate);
  if (idx >= 0) {
    user.dailyInputs[idx] = newInput;
  } else {
    user.dailyInputs.push(newInput);
  }

  // Recalculate engineered features for target month period
  const monthlyInps = user.dailyInputs.filter(inp => inp.date.startsWith(period));
  const aggregated = aggregateMonthlyFeatures(monthlyInps, period);

  // Update or append period history
  const periodIdx = user.engineeredHistory.findIndex(h => h.period === period);
  if (periodIdx >= 0) {
    user.engineeredHistory[periodIdx] = aggregated;
  } else {
    user.engineeredHistory.push(aggregated);
  }

  // Recalculate persona after saving history
  const sorted = [...user.engineeredHistory].sort((a, b) => a.period.localeCompare(b.period));
  const latestFeature = sorted[sorted.length - 1];
  user.userPersona = classifyUserPersona(latestFeature);
  user.sustainabilityIndex = latestFeature.sustainabilityIndex;

  saveDatabase(db);

  res.json({
    success: true,
    message: `Logged entries for ${formattedDate} and compiled monthly features.`,
    latestFeature: aggregated,
    persona: user.userPersona
  });
});

// Run What-If Simulation Calculus under isolated accounts
app.post("/api/carbon/recalculate", (req, res) => {
  const db = loadDatabase();

  saveDatabase(db);

  res.json({
    success: true,
    message: "Refresh completed"
  });
});

// -----------------------------------------------------------------------------
// GEMINI INTELLIGENT ROUTING
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// GEMINI INTELLIGENT ROUTING & RESILIENT FALLBACKS
// -----------------------------------------------------------------------------

/**
 * Compiles a rich, hyper-targeted Net-Zero Action report locally using the
 * user's historical footprints if Gemini API limits are hit on free tier.
 */
function generateLocalFallbackPlan(latestFeature: any, persona: string): string {
  // Identify user's highest driver category
  const catEmissions = [
    { name: "Transport", value: latestFeature.transportCO2e_kg || 0 },
    { name: "Food", value: latestFeature.foodCO2e_kg || 0 },
    { name: "Electricity", value: latestFeature.electricityCO2e_kg || 0 },
    { name: "Shopping", value: latestFeature.shoppingCO2e_kg || 0 },
    { name: "Waste", value: latestFeature.wasteCO2e_kg || 0 },
    { name: "Travel", value: latestFeature.travelCO2e_kg || 0 }
  ];
  
  // Sort descending
  catEmissions.sort((a, b) => b.value - a.value);
  const highestDriver = catEmissions[0];
  const driverRatio = ((highestDriver.value / (latestFeature.totalCO2e_kg || 1)) * 100).toFixed(0);

  let driverActions = "";
  if (highestDriver.name === "Transport") {
    driverActions = `
1. **Optimize Commuting Ratios**: Currently, transport accounts for **${latestFeature.transportCO2e_kg.toFixed(1)} kg CO2e** of your monthly footprint. Shifting 3 days/week to active transit, cycling, or public transport will save up to **180 kg CO2e** per month.
2. **Transition to Electric or Micro-mobility**: Swapping standard combustion transit to electric micro-mobility reduces per-km emissions by up to **85%**.
3. **Eco-Driving Techniques**: Maintain optimal tire pressure and moderate highway speeds to improve fuel economy by **10-15%**.`;
  } else if (highestDriver.name === "Food") {
    driverActions = `
1. **Incorporate Plant-Based Frameworks**: Food represents your peak driver at **${latestFeature.foodCO2e_kg.toFixed(1)} kg CO2e**. Shifting to a vegetarian or vegan profile for 4 days a week can drop your food-related emissions by up to **60%** (saving roughly **${(latestFeature.foodCO2e_kg * 0.4).toFixed(1)} kg CO2e/month**).
2. **Reduce Animal-Protein Density**: Prioritize poultry, pork, or sustainable fish over high-intensity beef or lamb.
3. **Minimize Household Food Waste**: Food waste in landfills produces high-potency methane. Plan meals carefully to save up to **20 kg CO2e** monthly.`;
  } else if (highestDriver.name === "Electricity") {
    driverActions = `
1. **Transition to Green Energy Providers**: Electricity represents **${latestFeature.electricityCO2e_kg.toFixed(1)} kg CO2e** of your footprint. Enrolling in a community solar program or purchasing 100% green e-tariffs can instantly cut this category to **0 kg CO2e**.
2. **HVAC Optimization & Smart Thermostats**: Adjusting your home thermostat by just 1.5°C can reduce daily electricity consumption by **8-12%**.
3. **Upgrade to High-Efficiency LED Bulbs and Appliances**: Swapping standard halogen lights to LEDs reduces lighting energy draw by up to **80%**.`;
  } else if (highestDriver.name === "Shopping") {
    driverActions = `
1. **Adopt a Circular Economy Blueprint**: Your shopping footprint is **${latestFeature.shoppingCO2e_kg.toFixed(1)} kg CO2e**. Opting for secondhand, refurbished, or high-durability items can reduce your purchasing emissions by **55%**.
2. **Invest in High-Lifespan Goods**: Choose quality goods over cheap, disposable alternatives to minimize manufacturing cycles.
3. **Repair and Lifecycle Extensions**: Avail of local repair workshops for broken electronics or clothing before considering replacements.`;
  } else if (highestDriver.name === "Waste") {
    driverActions = `
1. **Establish Zero-Waste Protocols**: Waste management accounts for **${latestFeature.wasteCO2e_kg.toFixed(1)} kg CO2e**. Diligent composting of organic matter keeps high-emissions organic waste out of oxygen-poor landfills, reducing methane release by **90%**.
2. **Eliminate Single-Use Plastics**: Switch to reusable grocery bags, water bottles, and containers to reduce upstream packaging emissions.
3. **Rigorous Material Separations**: Properly clean and sort recyclable metals, glass, and paper to facilitate industrial recovery streams.`;
  } else {
    driverActions = `
1. **Evaluate Flight Triggers**: Avoid long-distance air travel which counts for **${latestFeature.travelCO2e_kg.toFixed(1)} kg CO2e**. Consolidating flights or utilizing direct rail corridors cuts transit intensity per passenger-km by **80%+**.
2. **Select Economy Cabin Classes**: Flying economy reduces your individual seating area share, dropping your allocated flight carbon cost by **2x to 3x** compared to business class.
3. **Utilize Local Carbon Offsets**: Connect with certified, gold-standard regenerative forestry or carbon-capture programs to offset unavoidable aviation footprints.`;
  }

  return `### ⚠️ [Free-Tier Quota Guard: Fallback Activated]
To preserve your **Gemini Free-Tier Rate Limits**, CarbonTwin's analytical fallback engine has compiled this Net-Zero mitigation report locally:

---

### 🌐 Digital Twin Environmental Diagnosis
* **Composite Sustainability Index**: \`${latestFeature.sustainabilityIndex}/100\` — *Classified as a **${persona}***
* **Est. Monthly Footprint**: \`${latestFeature.totalCO2e_kg.toFixed(1)} kg CO2e\`
* **Primary Carbon Driver**: \`${highestDriver.name}\` (**${highestDriver.value.toFixed(1)} kg CO2e**, or **${driverRatio}%** of total footprint)

---

### 🎯 Hyper-Targeted Mitigation Matrix (Focus: ${highestDriver.name})
${driverActions}

---

*Tip: You can change or check your **GEMINI_API_KEY** under the **Settings > Secrets** panel in the upper-right corner of AI Studio to re-enable live server-side generation.*`;
}

/**
 * Handles conversational fallbacks for the Eco Coach chat window
 * when Gemini free-tier rates are saturated or offline.
 */
function generateLocalFallbackChat(message: string): string {
  const msgLower = message.toLowerCase();
  
  if (msgLower.includes("hello") || msgLower.includes("hi ") || msgLower.includes("hey")) {
    return `Hello! I am CarbonTwin's Eco Coach. Tell me any item, travel habit, or everyday choice (like **'avocado'**, **'beef burger'**, **'EV vs Gas Car'**, or **'plastic bottle'**) and I will help audit its carbon lifecycle! 

*(Notice: Active rate-limiting mitigation fallback resolves queries locally when Gemini quotas are full).*`;
  }
  
  if (msgLower.includes("avocado") || msgLower.includes("fruit")) {
    return `🥑 **Avocado Carbon Audit**: An average avocado has a footprint of about **0.2 - 0.3 kg CO2e**. While low compared to animal products, its offset comes from heavy water irrigation and deep temperature-controlled trans-oceanic shipping lines. Sourcing locally drastically drops transport emissions!`;
  }
  
  if (msgLower.includes("beef") || msgLower.includes("burger") || msgLower.includes("meat") || msgLower.includes("lamb")) {
    return `🥩 **Beef & Red Meat Carbon Audit**: Generating **1 kg of beef** results in up to **60 - 99 kg CO2e**. It is the single highest-emissions protein source. Methane from cattle digestion, combined with feed production deforestation, are the chief drivers. Swapping beef for plant-based grains results in a **90%+ footprint reduction**!`;
  }
  
  if (msgLower.includes("car") || msgLower.includes("ev") || msgLower.includes("gas") || msgLower.includes("petrol") || msgLower.includes("transit") || msgLower.includes("bus")) {
    return `🚗 **Transit Lifecycle Comparison**:
- **Gasoline Car**: Emits roughly **180 - 250g CO2** per km.
- **Electric Vehicle (EV)**: Has **0g** tailpipe emissions. Its lifecycle varies from **25g/km** (hydroelectric gridded) to **90g/km** (coal gridded).
- **Public Transit (Bus/Train)**: Drops average individual commuter footprint by **75% to 85%** due to shared vehicle efficiency.`;
  }
  
  if (msgLower.includes("bottle") || msgLower.includes("plastic") || msgLower.includes("recycl")) {
    return `♻️ **Plastic Lifecycle Audit**: A standard **500ml PET water bottle** generates about **0.08 kg to 0.12 kg CO2e** across manufacturing and incineration processing. Switching to reusables (stainless steel/glass) prevents tons of landfill toxic-offgassing and marine microplastic degradation.`;
  }
  
  if (msgLower.includes("solar") || msgLower.includes("electricity") || msgLower.includes("coal") || msgLower.includes("energy") || msgLower.includes("power")) {
    return `⚡ **Power Generation Intensities**:
- **Coal Power**: Emits **1,000g CO2e per kWh**.
- **Natural Gas**: Emits **450g CO2e per kWh**.
- **Wind & Solar**: Emit only **12 - 40g CO2e per kWh** (primarily during factory panel assembly).
- Powering with distributed home solar or green energy tariffs is the most immediate domestic game-changer.`;
  }

  return `🌱 **Eco Coach Conversation Assistant**: That is a great environmental inquiry! 

Almost all products and daily services contribute directly to carbon loading through raw material extraction, physical fabrication, transport corridors, and eventual waste decomposition.

To keep your free-tier Gemini API active and secure, I've served this response locally. Here are three universal carbon reduction guidelines:
1. **Reduce**: Buy durable, localized products.
2. **Electrify**: Move off natural gas heating and combustion travel.
3. **Advocate**: Switch home energy loadouts to certified green energy tariffs.

*Tip: You can re-verify your API key in the **Settings > Secrets** panel of AI Studio!*`;
}

// const response = await ai.chat.completions.create({
//   model: "llama-3.3-70b-versatile",
//   messages: [
//     {
//       role: "system",
//       content:
//         "You are a professional sustainability consultant."
//     },
//     {
//       role: "user",
//       content: prompt
//     }
//   ],
//   temperature: 0.5,
//   max_tokens: 1200
// });

// res.json({
//   plan: response.choices[0].message.content
// });

app.post("/api/gemini/generate-plan", async (req, res) => {
  try {
    const { latestFeature, persona } = req.body;

    const prompt = `
User Persona: ${persona}
Sustainability Score: ${latestFeature?.sustainabilityIndex}
Monthly Footprint: ${latestFeature?.totalCO2e_kg}

Generate a sustainability improvement plan.
`;

    const response = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional sustainability consultant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1200
    });

    res.json({
      plan: response.choices[0].message.content
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});



// Endpoint to export the entire project folder as a ZIP file dynamically
app.get("/api/project/export-zip", async (req, res) => {
  try {
    // Set response headers to direct the browser to trigger a download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=carbontwin-workspace.zip");

    const archive = (archiver as any)("zip", {
      zlib: { level: 9 } // maximum compression level
    });

    archive.on("error", (err) => {
      console.error("Zipping error:", err);
      if (!res.headersSent) {
        res.status(500).send({ error: "Failed to compile archive" });
      }
    });

    // Pipe archive data directly to the server HTTP response stream
    archive.pipe(res);

    // Add files relative to workspace root, ignoring heavy / private folders
    const workspaceRoot = process.cwd();

    archive.glob("**/*", {
      cwd: workspaceRoot,
      ignore: [
        "node_modules/**",
        "dist/**",
        "carbon_twin_db.json",
        ".git/**",
        "**/.DS_Store",
        ".env"
      ],
      dot: true
    });

    await archive.finalize();
  } catch (error: any) {
    console.error("Archive route exception:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to finalize archive" });
    }
  }
});

// Helper to determine redirect URI dynamically
const getGoogleRedirectUri = (req: express.Request) => {
  const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const appUrl = process.env.APP_URL || `${protocol}://${req.headers.host}`;
  return `${appUrl.replace(/\/$/, "")}/auth/google/callback`;
};

// Helper: zip buffer generator
const generateZipBuffer = (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const archive = (archiver as any)("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", (err: any) => reject(err));

    const workspaceRoot = process.cwd();
    archive.glob("**/*", {
      cwd: workspaceRoot,
      ignore: [
        "node_modules/**",
        "dist/**",
        "carbon_twin_db.json",
        ".git/**",
        "**/.DS_Store",
        ".env"
      ],
      dot: true
    });

    archive.finalize();
  });
};

// Endpoint to construct Google Drive Auth URL
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(400).json({ 
      error: "Missing GOOGLE_CLIENT_ID.",
      details: "Please configure your environment variables in AI Studio Settings first." 
    });
  }

  const redirectUri = getGoogleRedirectUri(req);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/drive.file",
    access_type: "offline",
    prompt: "consent"
  });

  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

// Endpoint: Callback handler to complete code exchange and upload ZIP
app.get("/auth/google/callback", async (req, res) => {
  const { code, error: authError } = req.query;

  // Simple HTML templates to render beautiful feedback in the popup matching CarbonTwin style
  const renderStatusPage = (status: "success" | "error", title: string, message: string, details?: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            background-color: #09090b;
            color: #f4f4f5;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1.5rem;
          }
          .card {
            background-color: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 2.5rem;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1.25rem;
          }
          .icon.success { color: #10b981; }
          .icon.error { color: #ef4444; }
          h1 {
            font-size: 1.25rem;
            margin-top: 0;
            margin-bottom: 0.75rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            text-transform: uppercase;
            color: #ffffff;
          }
          p {
            font-size: 0.875rem;
            color: #a1a1aa;
            line-height: 1.5;
            margin-top: 0;
            margin-bottom: 1.5rem;
          }
          .details {
            background-color: #09090b;
            border: 1px solid #18181b;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.75rem;
            color: #71717a;
            margin-bottom: 1.5rem;
            text-align: left;
            word-break: break-all;
          }
          .btn {
            background-color: ${status === "success" ? "#10b981" : "#ef4444"};
            color: #09090b;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            transition: opacity 0.2s;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          .btn:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon ${status}">${status === "success" ? "✓" : "⚡"}</div>
          <h1>${title}</h1>
          <p>${message}</p>
          ${details ? `<div class="details">${details}</div>` : ""}
          <button class="btn" onclick="window.close()">Close Window</button>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({ 
              type: "DRIVE_EXPORT_STATUS", 
              status: "${status}", 
              message: ${JSON.stringify(message)} 
            }, "*");
          }
        </script>
      </body>
      </html>
    `;
  };

  if (authError) {
    return res.send(renderStatusPage(
      "error", 
      "Google Authorization Failed", 
      "The connection was refused or cancelled.", 
      authError.toString()
    ));
  }

  if (!code) {
    return res.send(renderStatusPage(
      "error", 
      "Missing Google Authorization Code", 
      "Did not receive authentication grant code."
    ));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.send(renderStatusPage(
      "error", 
      "OAuth Credentials Missing", 
      "Please set up GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the settings of your AI Studio environment.",
      "Required variables not defined on container startup."
    ));
  }

  try {
    // 1. Exchange Auth Code for Access Token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getGoogleRedirectUri(req),
        grant_type: "authorization_code"
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      return res.send(renderStatusPage(
        "error",
        "Token Exchange Failed",
        "Could not retrieve token from Google Accounts.",
        `Response code ${tokenResponse.status}: ${errBody}`
      ));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return res.send(renderStatusPage(
        "error",
        "Token Empty",
        "Response token payload did not contain access token."
      ));
    }

    // 2. Generate the ZIP Archive in-memory
    const zipBuffer = await generateZipBuffer();

    // 3. Perform a Multipart Upload to Google Drive file.create REST API
    const filename = `carbontwin-workspace-${new Date().toISOString().slice(0, 10)}.zip`;
    const boundary = "carbontwin_boundary_" + Date.now();

    const metadata = {
      name: filename,
      mimeType: "application/zip",
      description: "Auto-exported Source ZIP of CarbonTwin workspace."
    };

    const metadataPart = `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n`;

    const filePartHeader = `--${boundary}\r\n` +
      `Content-Type: application/zip\r\n\r\n`;

    const footer = `\r\n--${boundary}--`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(metadataPart, "utf-8"),
      Buffer.from(filePartHeader, "utf-8"),
      zipBuffer,
      Buffer.from(footer, "utf-8")
    ]);

    const driveResponse = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": bodyBuffer.length.toString()
      },
      body: bodyBuffer
    });

    if (!driveResponse.ok) {
      const driveErrText = await driveResponse.text();
      return res.send(renderStatusPage(
        "error",
        "Drive Upload Failed",
        `Google Drive API rejected file upload.`,
        `Response code ${driveResponse.status}: ${driveErrText}`
      ));
    }

    const driveData = await driveResponse.json();

    return res.send(renderStatusPage(
      "success",
      "Drive Upload Complete",
      `Successfully uploaded ${filename} to your Google Drive!`,
      `File ID in Google Drive: ${driveData.id}`
    ));

  } catch (err: any) {
    console.error("Google Drive Upload Exception:", err);
    return res.send(renderStatusPage(
      "error",
      "System Error Happened",
      "An unexpected server exception interrupted the Google Drive upload flow.",
      err.message || err.toString()
    ));
  }
});

// ==========================================
// VITE DEV SERVER / PROD STATIC SERVING
// ==========================================
async function runServer() {
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
    console.log(`[CarbonTwin AI] Server running dynamically on http://localhost:${PORT}`);
    console.log("Environment keys:", Object.keys(process.env).filter(k => !k.includes("KEY") && !k.includes("SECRET")));
  });
}
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const response = await ai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are CarbonTwin AI. Answer any user question accurately and helpfully."
        },

        ...history.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        })),

        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    res.json({
      text: response.choices[0].message.content
    });

  } catch (error: any) {
    console.error("Chat error:", error);

    res.status(500).json({
      text: error.message
    });
  }
});
runServer();
