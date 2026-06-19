import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, HelpCircle, Dumbbell, Wallet, Zap, ShieldCheck, HelpCircle as HelpIcon, Sparkles } from 'lucide-react';
import { Recommendation, CarbonCategory } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
  onAcceptAction: (id: string) => void;
  onCompleteAction: (id: string) => void;
}

export default function Recommendations({
  recommendations,
  onAcceptAction,
  onCompleteAction
}: RecommendationsProps) {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  // Category Icon Map
  const getCategoryColor = (cat: CarbonCategory) => {
    switch(cat) {
      case 'transport': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'food': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'electricity': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'shopping': return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'waste': return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getCostBadge = (rating: 'low' | 'medium' | 'high') => {
    switch (rating) {
      case 'low': return 'text-emerald-400 bg-emerald-500/5';
      case 'medium': return 'text-amber-400 bg-amber-500/5';
      default: return 'text-rose-400 bg-rose-500/5';
    }
  };

  const getDiffBadge = (rating: 'easy' | 'medium' | 'hard') => {
    switch (rating) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/5';
      case 'medium': return 'text-amber-400 bg-amber-500/5';
      default: return 'text-rose-400 bg-rose-500/5';
    }
  };

  return (
    <div className="space-y-8 text-gray-100">
      
      {/* Header section with elite details */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1 text-emerald-400 font-mono text-sm tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" /> Personalized Recommendations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Prescriptive Net-Zero Actions</h1>
          <p className="mt-1 text-zinc-400 text-sm max-w-2xl">
            Hyper-tailored suggestions sorted dynamically via multi-criteria heuristic alignments matching your digital twin.
          </p>
        </div>

        <div className="bg-zinc-950 px-3 py-2 border border-zinc-900 rounded-lg text-xs text-zinc-400 leading-normal max-w-xs font-mono">
          <span className="font-semibold text-white block mb-0.5">Ranking Model Active</span>
          Estimating carbon impact weight against difficulty and implementation offsets.
        </div>
      </div>

      {/* Main recommendation cards/table list */}
      <div className="grid grid-cols-1 gap-4 font-mono text-xs">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
            <p className="text-zinc-500">All actions completed! High efficiency achieved across all carbon sectors.</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`p-6 rounded-2xl border transition relative overflow-hidden group flex flex-col lg:flex-row justify-between lg:items-center gap-6 ${rec.status === 'completed' ? 'border-emerald-500/30 bg-emerald-950/5' : 'border-zinc-800 bg-zinc-950/20 hover:border-zinc-700'}`}
            >
              
              {/* Left hand details */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(rec.category)}`}>
                    {rec.category}
                  </span>
                  {rec.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase text-[10px] items-center gap-1 inline-flex font-bold">
                      <ShieldCheck className="w-3 h-3" /> Completed
                    </span>
                  )}
                  {rec.status === 'accepted' && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase text-[10px] font-bold">
                      Enrolled
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white tracking-tight">{rec.actionTitle}</h3>
                  <p className="text-zinc-400 font-sans leading-relaxed text-xs sm:text-sm">{rec.description}</p>
                </div>

                {/* Sub row parameters */}
                <div className="flex items-center gap-4 flex-wrap text-zinc-500 text-[11px] pt-1.5 border-t border-zinc-900">
                  <span className="flex items-center gap-1.5 hover:text-white transition">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> 
                    Offset: <span className="font-bold text-emerald-400">-{rec.estimatedImpact_kgCO2e} kg/mo</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${getCostBadge(rec.costRating)}`}>
                    <Wallet className="w-3 h-3" /> Capital: {rec.costRating}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${getDiffBadge(rec.difficultyRating)}`}>
                    <Dumbbell className="w-3 h-3" /> Friction: {rec.difficultyRating}
                  </span>
                </div>
              </div>

              {/* Right hand dynamic score display and call to actions */}
              <div className="flex lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-4 min-w-[200px] border-t lg:border-t-0 border-zinc-900 pt-4 lg:pt-0">
                
                {/* Score gauge */}
                <div className="text-left lg:text-right space-y-1">
                  <div className="flex items-center lg:justify-end gap-1.5">
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Gain score</span>
                    <HelpCircle 
                      className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400 transition cursor-help"
                      onMouseEnter={() => setHoveredInfo(rec.id)}
                      onMouseLeave={() => setHoveredInfo(null)}
                    />
                  </div>
                  
                  {hoveredInfo === rec.id && (
                    <div className="absolute right-6 top-12 z-20 w-64 bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-400 leading-normal shadow-2xl text-[11px] font-sans">
                      Heuristic composite score. High score signifies high reduction utility with lower cost friction.
                    </div>
                  )}

                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-extrabold text-indigo-400">{rec.sustainabilityGainScore}</span>
                    <span className="text-zinc-600 text-xs">/ 100</span>
                  </div>
                </div>

                {/* Status action buttons */}
                {rec.status === 'completed' ? (
                  <div className="text-emerald-400 text-xs font-semibold py-1 px-3 bg-emerald-500/10 rounded-lg inline-flex items-center gap-1">
                    Done
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {rec.status !== 'accepted' ? (
                      <button 
                        onClick={() => onAcceptAction(rec.id)}
                        className="px-3 py-1.5 border border-zinc-800 bg-zinc-900 rounded-lg hover:bg-zinc-800 text-zinc-300 font-bold transition text-[11px]"
                      >
                        Enroll Action
                      </button>
                    ) : (
                      <button 
                        onClick={() => onCompleteAction(rec.id)}
                        className="px-3 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg hover:bg-emerald-400 font-extrabold transition text-[11px] inline-flex items-center gap-1"
                      >
                        Complete Check
                      </button>
                    )}
                  </div>
                )}

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
