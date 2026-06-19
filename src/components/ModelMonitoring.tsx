import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ShieldCheck, AlertTriangle, Play, CheckCircle2, RefreshCw, Cpu, Gauge } from 'lucide-react';
import { ModelMetric } from '../types';

interface ModelMonitoringProps {
  metrics: ModelMetric[];
}

export default function ModelMonitoring({ metrics }: ModelMonitoringProps) {
  
  // Status helper mapping
  const getStatusBadge = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Nominal
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Drift warn
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 animate-pulse" /> Critical
          </span>
        );
    }
  };

  // Mock latencies over time representation for chart
  const latencyData = [
    { step: 'Ingestion', cleanMs: 2, pipelineMs: 3 },
    { step: 'Normalization', cleanMs: 4, pipelineMs: 6 },
    { step: 'Feature Map', cleanMs: 8, pipelineMs: 11 },
    { step: 'Forecast Network', cleanMs: 14, pipelineMs: 18 },
    { step: 'Rec Matrix', cleanMs: 5, pipelineMs: 7 }
  ];

  return (
    <div className="space-y-8">
      {/* Upper header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-sm tracking-widest uppercase mb-2">
            <Gauge className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> MLOps continuous model telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Feature & Model Monitoring</h1>
          <p className="mt-1 text-zinc-400 text-sm max-w-xl">
            Live evaluation of prediction residue variances, concept drift parameters, and data quality coefficients.
          </p>
        </div>

        <div className="bg-zinc-950 px-3 py-2 border border-zinc-900 rounded-lg text-xs text-zinc-400 font-mono">
          <span className="font-semibold text-white block">Pipeline Node: Active</span>
          Refreshed automatically during lifestyle changes.
        </div>
      </div>

      {/* Primary metrics tabular layout */}
      <div className="grid grid-cols-1 gap-4 font-mono text-xs">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            
            {/* Left name parameters */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-white">{m.name}</h4>
                {getStatusBadge(m.status)}
              </div>
              <p className="text-zinc-400 font-sans text-xs sm:text-sm leading-normal">{m.description}</p>
            </div>

            {/* Right value parameters */}
            <div className="text-left sm:text-right">
              <span className="text-zinc-500 uppercase text-[10px] block">Metric Value</span>
              <span className="text-2xl font-extrabold text-white font-mono">{m.value}</span>
              <span className="text-zinc-500 text-[10px] block font-mono">{m.unit}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Latency profiling area chart */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-8 space-y-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">Compute latency profiles across nodes</h4>
          <div className="h-48 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} margin={{ left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="step" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                <Legend iconSize={8} iconType="circle" />
                <Bar name="Feature Map execution" dataKey="cleanMs" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar name="Stochastic projection calculus" dataKey="pipelineMs" fill="#6366f1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Mlopps Node Health</span>
          <div className="p-4 rounded-xl bg-black border border-zinc-900 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-zinc-400">Concept drift status:</span>
              <span className="text-emerald-400 font-extrabold">Within Limits</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-zinc-400">Feature coverage drift:</span>
              <span className="text-white">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Backtested Error bounds:</span>
              <span className="text-indigo-400 font-extrabold">±45 kgCO2e</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 font-sans leading-normal leading-relaxed">
            Automatic alarms fire if prediction thresholds violate mean absolute percentage deviation boundaries (MAPE &gt; 15%). Maintain consistent ground-truth logs to optimize neural state estimation convergence.
          </p>
        </div>

      </div>

    </div>
  );
}
