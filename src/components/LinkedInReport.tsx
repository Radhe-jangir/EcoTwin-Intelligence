import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Linkedin, CheckCircle, Copy, Award, ShieldCheck, FileCheck } from 'lucide-react';
import { EngineeredFeatures, UserPersona } from '../types';

interface LinkedInReportProps {
  latestFeature: EngineeredFeatures;
  userPersona: UserPersona;
}

export default function LinkedInReport({ latestFeature, userPersona }: LinkedInReportProps) {
  const [copied, setCopied] = useState(false);

  // Compute neat parameters
  const ecoScore = latestFeature ? latestFeature.sustainabilityIndex : 88;
  const reductionGoal = 43; // approximate decrease %

  const postText = `🌍 Delighted to share my latest sustainability analytics report generated via EcoTwin Intelligence! 

By continuously auditing my lifestyle variables, modeling what-if strategies, and tracking my carbon twin, I've optimized my carbon metrics:

• Carbon Twin Persona: ${userPersona}
• Current Eco Score: ${ecoScore} / 100 
• Portfolio Carbon Reduction: -${reductionGoal}% from original baseline
• High efficiency sectors: Circular waste diversion & low-carbon commutes!

We can't optimize what we don't calculate. Striving towards net-zero on-site emissions daily! 🚀

#Sustainability #AI #DataScience #MLOps #NetZero #CSR`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2">
          <Linkedin className="w-4 h-4" /> Share Environmental Impact Professional Report
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Social & Corporate Impact</h1>
        <p className="mt-1 text-zinc-400 text-sm max-w-2xl text-zinc-400">
          Export verified metrics into corporate-friendly, recruiter-vetted copy ready to boost your environmental profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-mono text-xs">
        
        {/* Left column: Visual Share preview frame */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Award className="w-48 h-48 text-emerald-400" />
          </div>

          <div className="space-y-4">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider block">Generated Corporate Badge</span>

            {/* Premium badge visualization card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-950/40 to-indigo-950/40 border border-zinc-800 space-y-6 text-center select-none relative overflow-hidden">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                <FileCheck className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-white text-base font-extrabold uppercase tracking-wide">CarbonTwin certified</h3>
                <p className="text-zinc-500 text-[10px]">VERIFIED ENVIRONMENTAL PORTFOLIO</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left bg-black/40 border border-zinc-900 p-3 rounded-lg text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Current Persona</span>
                  <span className="text-white font-bold block truncate">{userPersona}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 block">Eco Score index</span>
                  <span className="text-emerald-400 font-extrabold text-xs block">{ecoScore} / 100</span>
                </div>
              </div>

              <span className="text-[9px] text-zinc-600 block">Authenticated by EcoTwin Intelligence Model networks</span>
            </div>
          </div>

          <p className="text-[11px] font-sans leading-normal leading-relaxed text-zinc-500 pt-4 border-t border-zinc-900 mt-4">
            These scores reference active statistical features stored in your durable user database. Sharing benchmarks demonstrates proactive corporate accountability.
          </p>
        </div>

        {/* Right column: Pre-styled clipboard text */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-300 font-semibold block w-fit">
              Corporate Share Copy template
            </span>
            <p className="text-zinc-400 font-sans text-xs sm:text-sm">
              Copy the synthesized copy below directly to your Clipboard to post on professional networks:
            </p>
          </div>

          {/* Copy holder */}
          <div className="p-4 rounded-lg border border-zinc-900 bg-black/60 relative group">
            <button 
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition rounded-lg"
              title="Copy to clipboard"
            >
              {copied ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <pre className="font-mono text-[11px] leading-relaxed text-zinc-300 overflow-y-auto max-h-72 whitespace-pre-wrap select-all pr-12">
              {postText}
            </pre>
          </div>

          {copied && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-xs animate-pulse">
              Metrics formatted & successfully copied to your Clipboard!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
