<div align="center">

<img src="https://img.shields.io/badge/EcoTwin-Intelligence-22c55e?style=for-the-badge&logo=leaf&logoColor=white" alt="EcoTwin Intelligence" />

# 🌿 EcoTwin Intelligence

### AI-Powered Digital Carbon Twin Platform

**Analyze · Track · Forecast · Act**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-carbontwinai.onrender.com-22c55e?style=for-the-badge)](https://carbontwinai.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-99.8%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

---

*EcoTwin Intelligence is a full-stack AI platform that builds a living digital twin of your carbon footprint — analyzing lifestyle habits, estimating emissions, forecasting future impact, and delivering personalized recommendations for a greener life.*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Assumptions & Scope](#-assumptions--scope)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🌍 Overview

EcoTwin Intelligence creates a **Digital Carbon Twin** — a personalized, data-driven model of your environmental footprint. By logging daily lifestyle activities across six key domains, the platform generates a comprehensive sustainability profile and uses AI to explain patterns, predict trends, and suggest high-impact changes.

This project lives at the intersection of **climate tech**, **explainable AI**, and **full-stack engineering** — making sustainability insights accessible, transparent, and actionable.

> **Vertical:** Sustainability & Climate Intelligence

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧮 **Carbon Emission Modeling** | Category-wise and total emission estimation from lifestyle inputs |
| 📊 **Sustainability Scoring** | A composite score reflecting your environmental performance |
| 🔮 **Forecasting Engine** | Predictive models projecting your future environmental impact |
| 🧠 **Explainable AI (XAI)** | Transparent reasoning behind every score and recommendation |
| 💡 **Personalized Recommendations** | Actionable suggestions ranked by carbon reduction potential |
| 📈 **Interactive Dashboards** | Rich visual analytics powered by Recharts |
| 🗂️ **Multi-Domain Input** | Tracks transport, food, energy, shopping, waste, and travel |
| 🌐 **Full-Stack Architecture** | React frontend + Express backend, deployable on Render |

---

## ⚙️ How It Works

```
User Input → Feature Engineering → Emission Modeling → Scoring → Forecasting → XAI → Recommendations → Dashboard
```

1. **Log Activities** — Users input daily lifestyle data across six domains: transportation, food, electricity, shopping, waste, and travel.
2. **Feature Engineering** — Raw inputs are transformed into structured carbon-impact features.
3. **Emission Calculation** — The modeling engine computes category-wise and aggregate CO₂ emissions using established emission factors.
4. **Sustainability Score** — A composite score is derived from emission levels, behavioral trends, and benchmark comparisons.
5. **Forecasting** — Predictive modules project future emissions based on current patterns.
6. **Explainable AI** — Every insight is accompanied by a transparent, human-readable explanation.
7. **Recommendations** — An intelligent recommendation engine surfaces the highest-impact actions.
8. **Visualization** — All insights are rendered in real-time, interactive dashboards.

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI framework
- **TypeScript** — Type-safe codebase (99.8% of repo)
- **Tailwind CSS v4** — Utility-first styling
- **Recharts** — Data visualization & charting
- **Motion (Framer)** — Animations & transitions
- **Lucide React** — Icon system
- **React CountUp** — Animated number displays

### Backend
- **Node.js + Express** — REST API server
- **TypeScript (tsx)** — Server-side TypeScript execution
- **Vite** — Build tooling & dev server

### AI & Intelligence
- **Google Generative AI (`@google/genai`)** — AI-powered insights and recommendations
- **OpenAI SDK** — LLM integration for explainability layer

### DevOps & Build
- **Vite 6** — Frontend bundler
- **esbuild** — Server bundling for production
- **Render** — Cloud deployment platform

---

## 📁 Project Structure

```
EcoTwin-Intelligence/
├── src/                    # React frontend source
│   ├── components/         # UI components (dashboards, charts, forms)
│   ├── pages/              # Route-level pages
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Emission calculators, scoring logic
│   └── types/              # Shared TypeScript types
├── data/                   # Emission factor datasets
├── assets/                 # Static assets
├── server.ts               # Express API server
├── index.html              # App entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── metadata.json           # App metadata
├── .env.example            # Environment variable template
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- npm or yarn
- An API key from Google AI Studio (Gemini) or OpenAI

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Radhe-jangir/EcoTwin-Intelligence.git
cd EcoTwin-Intelligence

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) and the Express API at `http://localhost:3000`.

### Production Build

```bash
# Build frontend + server
npm run build

# Start production server
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Google Generative AI (Gemini)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# OpenAI (optional, for fallback LLM)
OPENAI_API_KEY=your_openai_api_key_here

# Server
PORT=3000
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📌 Assumptions & Scope

- Emission factors are derived from generalized sustainability datasets and publicly available estimates (IPCC, EPA, and similar sources).
- User-provided lifestyle inputs are assumed to be accurate.
- Forecasting outputs are **indicative** — intended for awareness and behavioral nudging, not regulatory or compliance reporting.
- The platform is designed for **educational and decision-support purposes**.

---

## 🤝 Contributing

Contributions are welcome! To get started:

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please keep PRs focused and include a clear description of changes.

---

## 👤 Author

**Radheshyam Jangir**
B.Tech Computer Science · IGNTU Amarkantak
Sustainability Intern · SustainAI Solutions Pvt. Ltd.

[![GitHub](https://img.shields.io/badge/GitHub-Radhe--jangir-181717?style=flat-square&logo=github)](https://github.com/Radhe-jangir)

---

<div align="center">

**🌱 Small actions. Big impact. Start tracking yours today.**

[![Live Demo](https://img.shields.io/badge/Try%20EcoTwin%20Now-carbontwinai.onrender.com-22c55e?style=for-the-badge)](https://carbontwinai.onrender.com)

</div>
