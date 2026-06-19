import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, ShieldAlert, BadgeInfo, Cpu, HelpCircle, FileText, CheckCircle, FlameKindling, RefreshCw
} from 'lucide-react';
import { EngineeredFeatures, UserPersona } from '../types';

interface ExplainableAIProps {
  latestFeature: EngineeredFeatures;
  userPersona: UserPersona;
  onGeneratePlan: () => Promise<string>;
}

export default function ExplainableAI({
  latestFeature,
  userPersona,
  onGeneratePlan
}: ExplainableAIProps) {
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  const triggerAudit = async () => {
    setLoading(true);
    try {
      const response = await onGeneratePlan();
      setAiReport(response);
    } catch (err) {
      console.error(err);
      setAiReport("Failed to sync audit with server. Ensure Gemini API key is configured inside secrets.");
    } finally {
      setLoading(false);
    }
  };

  // Quick category factor weights explanation
  const coreFactors = [
    { title: 'Transport', formula: 'Distance (km) × Fuel Coefficient (Petrol: 0.192, EV: 0.052)', impactRating: 'Most volatile category.' },
    { title: 'Nutrition', formula: 'Protein Index (Red Meat: 8.52, Poultry: 2.84, Vegan: 0.65) × meals count', impactRating: 'Heavy soil methane impact.' },
    { title: 'Utility Grid', formula: 'Electricity kWh × Grid intensity factor (Grid average: 0.233)', impactRating: 'Highly correlated with season.' },
    { title: 'Lifecycle circular', formula: 'Waste mass (kg) × disposal factor (Landfill: 1.25, Recycle: 0.18)', impactRating: 'Directly scales with diversion.' }
  ];

  // Helper to parse Gemini Markdown nicely without external packages
  const renderParsedReport = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-zinc-100 font-bold border-b border-zinc-900 pb-1 mt-4 mb-2 font-mono text-sm uppercase tracking-wide">{line.replace('###', '').trim()}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-emerald-400 font-extrabold mt-6 mb-3 font-mono text-base uppercase tracking-wider">{line.replace('##', '').trim()}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-white font-extrabold text-lg mt-8 mb-4 border-b border-zinc-855 pb-2">{line.replace('#', '').trim()}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-zinc-300 text-xs py-1 leading-relaxed font-sans">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2" />;
      
      return <p key={idx} className="text-zinc-400 text-xs sm:text-sm leading-normal py-1 font-sans">{line}</p>;
    });
  };

  return (
    <div className="space-y-8 text-gray-100">
      
      {/* Upper header outline */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2">
            <Cpu className="w-4 h-4 animate-pulse" /> Explainable AI (XAI) Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Transparent Audit Calculations</h1>
          <p className="mt-1 text-zinc-400 text-sm max-w-xl">
            Unpacking the underlying multi-criteria weights, linear coefficients, and data telemetry calculations.
          </p>
        </div>

        <button 
          onClick={triggerAudit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 font-extrabold rounded-xl text-xs transition duration-300 shadow-md transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synthesizing Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> AI Net-Zero Audit Plan
            </>
          )}
        </button>
      </div>

      {/* Grid of details: score explainability */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Score Weights overview */}
        <div className="md:col-span-4 p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Digital twin telemetry</span>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg space-y-2 text-center">
              <span className="text-zinc-400 block text-xs font-mono">Current Composite score</span>
              <span className="text-4xl font-extrabold text-emerald-400 font-mono block">
                {latestFeature ? latestFeature.sustainabilityIndex : 0}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 bg-black px-2 py-0.5 rounded uppercase border border-zinc-950">
                Segment: {userPersona}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Your composite score is recalculated dynamically based on the weighted variance of your daily activity features from target net-zero pathways compiled by global carbon models.
            </p>
          </div>

          <div className="mt-4 p-3 bg-black/40 border border-zinc-900 rounded font-mono text-[10px] text-zinc-500 space-y-1">
            <div className="flex justify-between">
              <span>Target Baseline emissions:</span>
              <span className="text-zinc-400">450 kgCO2e</span>
            </div>
            <div className="flex justify-between">
              <span>Calibration factor:</span>
              <span className="text-zinc-400">0.962 (stabilized)</span>
            </div>
          </div>
        </div>

        {/* Dynamic prose audit breakdown */}
        <div className="md:col-span-8 p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
          <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-1.5 uppercase tracking-wide">
            <BadgeInfo className="w-4.5 h-4.5 text-indigo-400" /> Linear Coefficient parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {coreFactors.map((fc, i) => (
              <div key={i} className="p-3.5 rounded bg-black/40 border border-zinc-900 flex flex-col justify-between">
                <div>
                  <span className="font-extrabold text-white block mb-0.5">{fc.title}</span>
                  <span className="text-zinc-400 text-[11px] leading-relaxed block">{fc.formula}</span>
                </div>
                <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
                  <FlameKindling className="w-3.5 h-3.5 text-orange-400" /> {fc.impactRating}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Report Output section */}
      {(aiReport || loading) && (
        <div className="p-6 rounded-2xl border border-indigo-500/10 bg-gradient-to-b from-zinc-950 to-black space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <FileText className="w-40 h-40 text-emerald-400" />
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 px-2 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold animate-pulse">
              GEMINI ACTIVE
            </div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-1.5 font-mono uppercase tracking-wide">
              Server-Side Synthesized Net-Zero report
            </h3>
          </div>

          <div className="border-t border-zinc-900 pt-4 prose prose-invert max-w-none">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-xs text-zinc-500 font-mono">Running regression vector audits... Synthesizing AI tip profile...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {renderParsedReport(aiReport)}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
