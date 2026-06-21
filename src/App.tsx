import React, { useState, useEffect } from 'react';
import { lazy, Suspense } from "react";
import logo from "/assets/logo.svg";
import { motion, AnimatePresence } from 'motion/react';
import {
  AppWindow, LayoutDashboard, Sliders, FlaskConical, Target, Award, ShieldCheck,
  Linkedin, Gauge, GraduationCap, Plus, Compass, ChevronRight, Menu, X, Cpu, Info
} from 'lucide-react';

// Import sub components
const Dashboard = lazy(() => import("./components/Dashboard"));
const FeatureLab = lazy(() => import("./components/FeatureLab"));
const Forecasting = lazy(() => import("./components/Forecasting"));
const Recommendations = lazy(() => import("./components/Recommendations"));
const ExplainableAI = lazy(() => import("./components/ExplainableAI"));
const SimulationLab = lazy(() => import("./components/SimulationLab"));
const ModelMonitoring = lazy(() => import("./components/ModelMonitoring"));
const LinkedInReport = lazy(() => import("./components/LinkedInReport"));
const RecruiterMode = lazy(() => import("./components/RecruiterMode"));
import AddInputModal from './components/AddInputModal';
import EcoCoach from './components/EcoCoach';
import AuthPage from './components/AuthPage';

import {
  DayInput, EngineeredFeatures, Forecast, Recommendation, UserPersona, SimulationResult, ModelMetric
} from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ userId: string; email: string; displayName: string; } | null>(() => {
    const saved = localStorage.getItem('carbontwin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard'); // default to carbon dashboard
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);



  // Consolidated global state
  const [profile, setProfile] = useState({
    userId: "user_digital_twin_1",
    displayName: "Radheshyam Suthar",
    email: "jangirradhe175@gmail.com",
    persona: "Sustainability Enthusiast" as UserPersona,
    currentEcoScore: 88,
    lastUpdated: new Date().toISOString()
  });

  const [latestFeature, setLatestFeature] = useState<EngineeredFeatures | null>(null);
  const [history, setHistory] = useState<EngineeredFeatures[]>([]);
  const [dailyInputs, setDailyInputs] = useState<DayInput[]>([]);
  const [currentForecast, setCurrentForecast] = useState<Forecast | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [monitoringMetrics, setMonitoringMetrics] = useState<ModelMetric[]>([]);

  // Fetch complete state from our full-stack Express server
  const fetchState = async () => {
    try {
      const headers: HeadersInit = {};
      if (currentUser) {
        headers['x-user-id'] = currentUser.userId;
      }
      const response = await fetch('/api/carbon/state', { headers });
      if (!response.ok) throw new Error("Could not sync with local database server.");
      const data = await response.json();

      setProfile(data.profile);
      setLatestFeature(data.latestFeature);
      setHistory(data.history);
      setDailyInputs(data.dailyInputs);
      setCurrentForecast(data.forecast);
      setRecommendations(data.recommendations);
      setMonitoringMetrics(data.monitoringMetrics);
    } catch (err) {
      console.error("Express state load failed. Running client seeds fallback:", err);
    }
  };

  const handleRecalculate = async () => {
    try {
      const headers: HeadersInit = {};

      if (currentUser) {
        headers["x-user-id"] =
          currentUser.userId;
      }

      await fetch(
        "/api/carbon/recalculate",
        {
          method: "POST",
          headers
        }
      );

      await fetchState();

      alert(
        "Models recalculated successfully"
      );

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchState();
    }
  }, [currentUser]);

  // API Call: Add Input
  const handleSaveInput = async (input: Omit<DayInput, 'id'>) => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (currentUser) {
        headers['x-user-id'] = currentUser.userId;
      }
      const response = await fetch('/api/carbon/add-input', {
        method: 'POST',
        headers,
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error("Saving entry to database server failed.");
      await fetchState(); // Reload updated features
    } catch (err) {
      console.error(err);
    }
  };

  // API Call: Delete Input
  const handleDeleteInput = async (id: string) => {
    if (!confirm("Are you sure you want to remove this logged entry from the history?")) return;
    try {
      const headers: HeadersInit = {};
      if (currentUser) {
        headers['x-user-id'] = currentUser.userId;
      }
      const response = await fetch(`/api/carbon/delete-input/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error("Deletion from server data failed.");
      await fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  // API Call: Execute custom time series forecasting algorithm
  const handleForecastingAlgChange = async (alg: 'moving_average' | 'exponential_smoothing' | 'linear_trend') => {
    try {
      await fetchState();
    } catch (err) {
      console.error(err);
    }
  };

  // API Call: Run What-If simulation calculus vector
  const handleRunSimulation = async (selections: any): Promise<SimulationResult> => {
    const defaultResponse = {
      scenarioName: 'Net Zero Strategy',
      originalCO2e_kg: latestFeature ? latestFeature.totalCO2e_kg : 850,
      simulatedCO2e_kg: latestFeature ? latestFeature.totalCO2e_kg : 850,
      reduction_kgCO2e: 0,
      reductionPercent: 0,
      costSavingsUSD: 0,
      impactSummary: 'Syncing with simulation pipeline...'
    };

    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (currentUser) {
        headers['x-user-id'] = currentUser.userId;
      }
      const response = await fetch('/api/carbon/simulate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ selections })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error(err);
    }
    return defaultResponse;
  };

  // API Call: Synthesize action plan via server side Gemini
  const handleGeneratePlan = async () => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (currentUser) {
        headers['x-user-id'] = currentUser.userId;
      }
      const response = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          latestFeature,
          persona: profile.persona
        })
      });
      if (response.ok) {
        const json = await response.json();
        return json.plan;
      }
    } catch (err) {
      console.error(err);
    }
    return "Failed to sync audit plan with Gemini. Add custom key to secrets panel.";
  };

  // API Call: Send Eco Coach chatbot conversation
  const handleSendCoachMessage = async (msg: string, conversationHistory: any[]) => {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: conversationHistory.map(h => ({
            role: h.role,
            content: h.content
          }))
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.text;
      }
    } catch (err) {
      console.error(err);
    }
    return "Express endpoint offline. Make sure server is initialized.";
  };

  // Enrollment actions update helpers
  const handleAcceptAction = (id: string) => {
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'accepted' } : rec));
  };

  const handleCompleteAction = (id: string) => {
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'completed' } : rec));

    // Simulate updating eco-score on live UI
    if (latestFeature) {
      const matched = recommendations.find(r => r.id === id);
      if (matched) {
        setLatestFeature({
          ...latestFeature,
          sustainabilityIndex: Math.min(100, latestFeature.sustainabilityIndex + 3),
          totalCO2e_kg: Math.max(0, latestFeature.totalCO2e_kg - matched.estimatedImpact_kgCO2e)
        });
      }
    }
  };

  // Side Navigation items
  const menuItems = [
    { id: 'dashboard', label: 'Carbon Dashboard', icon: LayoutDashboard },
    { id: 'features', label: 'Feature Ingestion Lab', icon: FlaskConical },
    { id: 'forecast', label: 'Model Forecasts', icon: Target },
    { id: 'recommendations', label: 'Prescriptive Actions', icon: ShieldCheck },
    { id: 'explainable', label: 'Explainable AI (XAI)', icon: Cpu },
    { id: 'simulation', label: 'Scenario Simulator', icon: Sliders },
    { id: 'monitoring', label: 'MLOps Monitors', icon: Gauge },
    { id: 'linkedin', label: 'Social Share Profile', icon: Linkedin },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return latestFeature ? (
          <Dashboard
            profile={profile}
            latestFeature={latestFeature}
            history={history}
            dailyInputs={dailyInputs}
            onAddInputClick={() => setIsOpenAddModal(true)}
            onRefresh={handleRecalculate}
            onDeleteInput={handleDeleteInput}
          />
        ) : (
          <div className="text-zinc-500 font-mono py-12 text-center text-xs">Awaiting carbon pipeline compilation...</div>
        );
      case 'features':
        return <FeatureLab />;
      case 'forecast':
        return (
          <Forecasting
            history={history}
            currentForecast={currentForecast!}
            onAlgorithmChange={handleForecastingAlgChange}
          />
        );
      case 'recommendations':
        return (
          <Recommendations
            recommendations={recommendations}
            onAcceptAction={handleAcceptAction}
            onCompleteAction={handleCompleteAction}
          />
        );
      case 'explainable':
        return latestFeature ? (
          <ExplainableAI
            latestFeature={latestFeature}
            userPersona={profile.persona}
            onGeneratePlan={handleGeneratePlan}
          />
        ) : (
          <div className="text-zinc-500 font-mono py-12 text-center text-xs">No active features compiled yet.</div>
        );
      case 'simulation':
        return latestFeature ? (
          <SimulationLab
            latestFeature={latestFeature}
            onRunSimulation={handleRunSimulation}
          />
        ) : (
          <div className="text-zinc-500 font-mono py-12 text-center text-xs">Establish database logs to simulate.</div>
        );
      case 'monitoring':
        return <ModelMonitoring metrics={monitoringMetrics} />;
      case 'linkedin':
        return latestFeature ? (
          <LinkedInReport
            latestFeature={latestFeature}
            userPersona={profile.persona}
          />
        ) : (
          <div className="text-zinc-500 font-mono py-12 text-center text-xs">Run computations to build report metrics.</div>
        );
      default:
        return latestFeature ? (
          <Dashboard
            profile={profile}
            latestFeature={latestFeature}
            history={history}
            dailyInputs={dailyInputs}
            onAddInputClick={() => setIsOpenAddModal(true)}
            onRefresh={fetchState}
            onDeleteInput={handleDeleteInput}
          />
        ) : (
          <div className="text-zinc-500 font-mono py-12 text-center text-xs">Awaiting carbon pipeline compilation...</div>
        );
    }
  };

  if (!currentUser) {
    return (
      <AuthPage
        onAuthSuccess={(user) => {
          localStorage.setItem('carbontwin_user', JSON.stringify(user));
          setCurrentUser(user);
        }}
      />
    );
  }
  {/* Overlay */ }
  {/* <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/35 to-black/60" /> */ }

  return (

    <div
  className="
    min-h-screen
    text-gray-100
    flex
    flex-col
    relative
    overflow-x-hidden
    bg-[#05070d]
  "
> <div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />

  <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-pink-500/10 blur-3xl" />
</div>
      <div className="absolute inset-0 bg-black/70"></div>




      {/* Main Grid Wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen w-full">

        {/* Left hand Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] bg-zinc-950/90 backdrop-blur-xl border-r border-emerald-500/10 p-4 flex-col justify-between z-40">

          <div className="space-y-6">
            {/* Logo area */}
            <div className="flex items-center gap-2 px-2 py-1.5">
              <img
                src={logo}
                width={40}
                height={40}
                alt="EcoTwin Intelligence"
                className="
w-14 h-14
object-contain
drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]
"
              />
              <div>
                <h2 className="text-base font-extrabold text-white tracking-wider">EcoTwin AI</h2>
                <span className="text-[9px] text-zinc-500 font-mono tracking-widest block uppercase">INTELLIGENCE PLATFORM</span>
              </div>
            </div>

            {/* Nav Row links */}
            <nav className="space-y-1 font-mono text-xs">
              <span className="px-2 text-[10px] text-zinc-650 uppercase font-bold tracking-widest block mb-1">COMPONENTS</span>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition font-semibold ${isSelected ? 'bg-emerald-500/10 border border-emerald-500/30 text-white shadow-sm shadow-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      {item.label}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition opacity-0 ${isSelected ? 'opacity-100' : ''}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile footer info */}
          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500
text-black flex items-center justify-center text-emerald-400 font-bold uppercase shrink-0">
                  {profile.displayName ? profile.displayName.slice(0, 2) : 'AC'}
                </div>
                <div className="truncate">
                  <span className="text-white font-bold block truncate">{profile.displayName}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">{profile.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('carbontwin_user');
                setCurrentUser(null);
                setLatestFeature(null);
              }}
              className="w-full text-center py-2 rounded-lg bg-zinc-900/50 border border-zinc-700 hover:border-red-500/40 hover:bg-red-500/5 hover:border-red-500/30 text-zinc-500 hover:text-red-400 font-semibold transition uppercase tracking-wider text-[10px]"
              id="logout-btn"
            >
              Sign Out
            </button>
            <div className="mt-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-white font-bold text-sm mb-2">
                Founder & Developer
                Radheshyam Suthar
              </h3>


              <p className="text-zinc-400 text-[11px] mb-3">
                AI/ML Engineer • Data Analytics
              </p>

              <div className="flex flex-col gap-2 text-[11px]">
                <a
                  href="https://linkedin.com/in/radheshyamsuthar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  LinkedIn Profile
                </a>

                <a
                  href="https://github.com/Radhe-jangir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  GitHub
                </a>

                <a
                  href="mailto:jangirradhe175@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  Email
                </a>
              </div>
              <p className="text-[12px] text-zinc-500 mt-3">
                EcoTwin Intelligence © 2026
              </p>
            </div>
          </div>

        </aside>

        {/* Mobile Navigation Header */}
        <header className="md:hidden w-full bg-black border-b border-zinc-900 p-4 flex justify-between items-center relative z-40">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              width={40}
              height={40}
              alt="EcoTwin Intelligence"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">EcoTwin AI</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 px-2 text-zinc-400 hover:text-white rounded bg-gradient-to-br from-emerald-500 to-cyan-500
text-black transition"
          >
            {mobileMenuOpen ? <X className="w-7 h-7 text-emerald-400" /> : <Menu className="w-7 h-7 text-emerald-400" />}
          </button>

          {/* Mobile Slide panel */}
          {mobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/70 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              <div className="fixed top-0 left-0 h-screen w-[85vw] max-w-[320px] z-50 bg-zinc-950 border-r border-zinc-800 p-4 overflow-y-auto">

                <div className="flex items-center gap-2 mb-6">
                  <img
                    src={logo}
                    width={40}
                    height={40}
                    alt="EcoTwin Intelligence"
                    className="w-8 h-8"
                  />
                  <span className="text-white font-bold font-mono">
                    EcoTwin AI
                  </span>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition ${isSelected
                          ? "bg-zinc-900 text-white font-bold"
                          : "text-zinc-500 hover:bg-zinc-900/40"
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-900 my-4 pt-4" />

                <button
                  onClick={() => {
                    localStorage.removeItem("carbontwin_user");
                    setCurrentUser(null);
                    setLatestFeature(null);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-red-400 font-bold hover:bg-zinc-900/40 transition"
                >
                  Sign Out from Session
                </button>
              </div>
            </>
          )}
        </header>
        {/* Right hand Content Stage Area */}
        <main className="w-full md:ml-[260px] flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Floating chatbot eco-coach drawer layout */}
      <EcoCoach onSendMessage={handleSendCoachMessage} />

      {/* Input Modal logs */}
      {isOpenAddModal && (
        <AddInputModal
          onClose={() => setIsOpenAddModal(false)}
          onSave={handleSaveInput}
        />
      )}

    </div>
  );
}
