import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Database, Award, Server, Layers, HelpCircle, ArrowRight } from 'lucide-react';

export default function RecruiterMode() {
  return (
    <div className="space-y-8 text-gray-100">
      {/* Header section with technical elegance */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-sm tracking-widest uppercase mb-2">
          <Award className="w-4 h-4 animate-pulse" /> Engineering Credentials Walkthrough
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          CarbonTwin AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Recruiter Blueprint</span>
        </h1>
        <p className="mt-2 text-zinc-400 max-w-4xl text-sm sm:text-base">
          This system stands as an enterprise-grade showcase of full-stack engineering, combining custom predictive models, modular data pipelines, multi-criteria decision heuristics, and LLM-synthesized explains.
        </p>
      </div>

      {/* Grid of highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Custom ML Forecasting Layer</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Unlike static dashboards, this engine implements true time-series mathematics (Single Exponential Smoothing, OLS Linear Regression, MoAv) inside TS/Node, yielding projection vectors complete with backtested 95% Confidence Intervals.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Feature Engineering Pipeline</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Raw consumer inputs (e.g. travel distance, diet inputs, electricity kWh logs) are streamed through transformation vectors loading dynamic regional coefficients, computing data completeness scores and composite indices on the fly.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
            <Server className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Durable Full-Stack Node DB</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Powered by a localized file-based database store in Express, guaranteeing session persistence for user data entries, logging history, and training targets, complete with full CRUD capacity.
          </p>
        </div>
      </div>

      {/* Pipeline flowchart mapping */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" /> End-to-End Data Lifecycle
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch relative">
          
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 block mb-2">INPUT NODE</span>
            <span className="text-white font-semibold text-sm">Consumer Inputs Logged</span>
            <p className="text-zinc-400 text-xs mt-2">Commute times, meal proteins, waste weights, HVAC logs.</p>
          </div>

          <div className="col-span-1 lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
            <ArrowRight className="w-6 h-6 text-zinc-700 rotate-90 lg:rotate-0" />
          </div>

          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 block mb-2">ENGINEERING ENGINE</span>
            <span className="text-emerald-400 font-semibold text-sm">Feature Transformation</span>
            <p className="text-zinc-400 text-xs mt-2">Emission multiplication, Normalizations, Data completeness checks.</p>
          </div>

          <div className="col-span-1 lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
            <ArrowRight className="w-6 h-6 text-zinc-700 rotate-90 lg:rotate-0" />
          </div>

          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center flex flex-col justify-between">
            <span className="font-mono text-xs text-zinc-500 block mb-2">INTELLIGENT LAYER</span>
            <span className="text-indigo-400 font-semibold text-sm">Custom TS/ML Calculus</span>
            <p className="text-zinc-400 text-xs mt-2">Exponential Smoothing, multi-attribute recommendation scoring, personas clustering.</p>
          </div>

        </div>
      </div>

      {/* Core Heuristic Mathematics Reference */}
      <div className="border border-zinc-800 bg-black/60 rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" /> Mathematical Formulation Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs text-zinc-300">
          
          <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-900">
            <span className="text-emerald-400 text-sm font-bold block mb-1">Time Series: Simple Exponential Smoothing</span>
            <div className="bg-black p-3 rounded text-center text-white font-bold my-2 text-sm border border-zinc-800">
              Fₜ₊₁ = αYₜ + (1 - α)Fₜ
            </div>
            <p className="text-zinc-400">
              Generates demand projections balancing noise filter. α sets training velocity. F represents upcoming predictions, Y representing our actual logged emissions ground truth.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-900">
            <span className="text-emerald-400 text-sm font-bold block mb-1">Ordinary Least Squares Regression Projection</span>
            <div className="bg-black p-3 rounded text-center text-white font-bold my-2 text-sm border border-zinc-800">
              Y = Slope(X) + Intercept
            </div>
            <p className="text-zinc-400">
              Calculates structural slope gradients to project cumulative trend vectors. Confidence margins calculated on backtested standard deviations of residual distributions.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-900">
            <span className="text-emerald-400 text-sm font-bold block mb-1">Multi-Criteria Action Score Model</span>
            <div className="bg-black p-3 rounded text-center text-white font-bold my-2 text-base border border-zinc-800">
              S = w₁I + w₂C + w₃D + w₄P
            </div>
            <p className="text-zinc-400">
              Computes absolute utility weights to dynamically sort Net-Zero suggestions: I = carbon impact ratio, C = cost rating impact, D = friction difficulty rating, P = alignment affinity with user's core persona profile.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-zinc-950 border border-zinc-900">
            <span className="text-emerald-400 text-sm font-bold block mb-1">Composite Sustainability Index Formula</span>
            <div className="bg-black p-3 rounded text-center text-white font-bold my-2 text-base border border-zinc-800">
              Index = Σ (100 - (C_cat / Target_cat)) / N
            </div>
            <p className="text-zinc-400">
              Calculates current green efficiencies across transportation, HVAC, lifestyle shopping, and circular waste. Scaled strictly between (0 - 100).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
