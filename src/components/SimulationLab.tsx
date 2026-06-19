import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Sliders, Fuel, Coins, HelpCircle, Leaf, Zap, RefreshCw, Undo, Percent 
} from 'lucide-react';
import { EngineeredFeatures, SimulationResult } from '../types';

interface SimulationLabProps {
  latestFeature: EngineeredFeatures;
  onRunSimulation: (selections: {
    transportMilesPct: number;
    commuteElectric: boolean;
    meatMealsPct: number;
    hasRooftopSolar: boolean;
    compostRatePct: number;
    shoppingReductionPct: number;
  }) => Promise<SimulationResult>;
}

export default function SimulationLab({
  latestFeature,
  onRunSimulation
}: SimulationLabProps) {
  // Simulator input parameters state vectors
  const [transportMilesPct, setTransportMilesPct] = useState(1.0); // 1.0 = 100% of baseline
  const [commuteElectric, setCommuteElectric] = useState(false);
  const [meatMealsPct, setMeatMealsPct] = useState(1.0);       // 1.0 = current meat proteins
  const [hasRooftopSolar, setHasRooftopSolar] = useState(false);
  const [compostRatePct, setCompostRatePct] = useState(0.0);   // 0.0 = no composting
  const [shoppingReductionPct, setShoppingReductionPct] = useState(0.0);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SimulationResult>({
    scenarioName: 'Loading base...',
    originalCO2e_kg: latestFeature ? latestFeature.totalCO2e_kg : 850,
    simulatedCO2e_kg: latestFeature ? latestFeature.totalCO2e_kg : 850,
    reduction_kgCO2e: 0,
    reductionPercent: 0,
    costSavingsUSD: 0,
    impactSummary: 'Simulating hypothetical adjustments...'
  });

  const triggerSimulation = async () => {
    setIsLoading(true);
    try {
      const resp = await onRunSimulation({
        transportMilesPct,
        commuteElectric,
        meatMealsPct,
        hasRooftopSolar,
        compostRatePct,
        shoppingReductionPct
      });
      setResults(resp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run simulation reactively when state changes
  useEffect(() => {
    triggerSimulation();
  }, [transportMilesPct, commuteElectric, meatMealsPct, hasRooftopSolar, compostRatePct, shoppingReductionPct, latestFeature]);

  const resetSelectors = () => {
    setTransportMilesPct(1.0);
    setCommuteElectric(false);
    setMeatMealsPct(1.0);
    setHasRooftopSolar(false);
    setCompostRatePct(0.0);
    setShoppingReductionPct(0.0);
  };

  // Recharts preparation
  const chartData = [
    {
      name: 'Baseline Footprint',
      CO2e: results.originalCO2e_kg
    },
    {
      name: 'Simulated Footprint',
      CO2e: results.simulatedCO2e_kg
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Upper header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1 text-emerald-400 font-mono text-sm tracking-widest uppercase mb-1">
            <Sliders className="w-4 h-4 animate-pulse" /> Sandbox Strategy Simulator
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">What-If Lifecycle Simulation Lab</h1>
          <p className="mt-1 text-zinc-400 text-sm max-w-2xl">
            Test custom carbon saving strategies interactively to immediately evaluate how policy shifts impact cumulative footprints and future trends.
          </p>
        </div>

        <button 
          onClick={resetSelectors}
          className="flex items-center gap-1 px-3 py-1.5 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-900 transition font-mono text-xs rounded"
        >
          <Undo className="w-3.5 h-3.5" /> Force Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-mono text-xs text-gray-100">
        
        {/* Left column: slidable knobs */}
        <div className="lg:col-span-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
            <span className="font-bold text-white text-sm uppercase">Strategy Knobs</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">REACTIVE INTEGRATION</span>
          </div>

          <div className="space-y-5">
            {/* Knob 1: Commute Distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-zinc-400">Commute multiplier distance:</span>
                <span className="text-emerald-400">{Math.round(transportMilesPct * 100)}% of base</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1"
                value={transportMilesPct} 
                onChange={(e) => setTransportMilesPct(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 accent-emerald-500 rounded appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">Models remote shift options or walk offsets.</p>
            </div>

            {/* EV Commute Checkbox */}
            <div className="flex items-center gap-3 bg-black/40 border border-zinc-900 p-3 rounded-lg">
              <input 
                id="ev_commute_sim"
                type="checkbox" 
                checked={commuteElectric}
                onChange={(e) => setCommuteElectric(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 border border-zinc-700 bg-zinc-900 text-zinc-950 rounded cursor-pointer"
              />
              <label htmlFor="ev_commute_sim" className="text-zinc-300 select-none cursor-pointer">
                <span className="font-bold block text-white">Substitute all drives with EV</span>
                <span className="text-[10px] text-zinc-500 block leading-normal">Swapping fuel factor metrics from raw diesel/petrol coefficients to grid electric.</span>
              </label>
            </div>

            {/* Protein selection ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-zinc-400">Meat meals retention:</span>
                <span className="text-emerald-400">{Math.round(meatMealsPct * 100)}% base protein</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={meatMealsPct} 
                onChange={(e) => setMeatMealsPct(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 accent-emerald-500 rounded appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">Sliding left models transitioning meat meals to plant-based.</p>
            </div>

            {/* Solar rooftop */}
            <div className="flex items-center gap-3 bg-black/40 border border-zinc-900 p-3 rounded-lg">
              <input 
                id="solar_heat_sim"
                type="checkbox" 
                checked={hasRooftopSolar}
                onChange={(e) => setHasRooftopSolar(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 border border-zinc-700 bg-zinc-900 text-zinc-950 rounded cursor-pointer"
              />
              <label htmlFor="solar_heat_sim" className="text-zinc-300 select-none cursor-pointer">
                <span className="font-bold block text-white">Rooftop Solar installation</span>
                <span className="text-[10px] text-zinc-500 block leading-normal">Offsets monthly utility grid invoices by up to 75% on-site carbon offset credits.</span>
              </label>
            </div>

            {/* Organic Composting */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-zinc-400">Organic Kitchen composting:</span>
                <span className="text-emerald-400">{Math.round(compostRatePct * 100)}% composting rate</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={compostRatePct} 
                onChange={(e) => setCompostRatePct(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 accent-emerald-500 rounded appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">Models composting waste, diverting anaerobic food decay in landfills.</p>
            </div>

            {/* Less Shopping slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold">
                <span className="text-zinc-400">Reduce lifestyle shopping spent:</span>
                <span className="text-emerald-400">Divert {Math.round(shoppingReductionPct * 100)}% purchases</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={shoppingReductionPct} 
                onChange={(e) => setShoppingReductionPct(Number(e.target.value))}
                className="w-full h-1 bg-zinc-800 accent-emerald-500 rounded appearance-none cursor-pointer"
              />
              <p className="text-[10px] text-zinc-500">Avoids footprint of buying new apparel or fast electronics.</p>
            </div>

          </div>
        </div>

        {/* Right column: Results outputs */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <span className="text-[10px] font-mono uppercase text-zinc-500 leading-wider block">Calculated Reduction metrics</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 text-left">
                <span className="text-zinc-500 text-[10px] block">Offset Volume</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
                  -{results.reduction_kgCO2e} kg
                </span>
                <span className="text-[10px] text-zinc-500">Carbon offset monthly</span>
              </div>

              <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 text-left">
                <span className="text-zinc-500 text-[10px] block">Percentage decrease</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
                  -{results.reductionPercent}%
                </span>
                <span className="text-[10px] text-zinc-500">From baseline target</span>
              </div>

              <div className="p-4 rounded-xl border border-zinc-900 bg-black/40 text-left col-span-2">
                <span className="text-zinc-500 text-[10px] block flex items-center justify-between">
                  <span>Economic Capital Benefit (Mo)</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono block">
                  +${results.costSavingsUSD} USD
                </span>
                <span className="text-[10px] text-zinc-500">Estimated home HVAC + fuel cash savings</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Comparison chart */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 font-mono text-[10px]">
            <span className="text-zinc-500 block mb-2 font-semibold">Baseline Footprint vs. Simulated Footprint (kg CO2e)</span>
            <div className="h-40 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" tickLine={false} />
                  <YAxis stroke="#71717a" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a' }} />
                  <Bar dataKey="CO2e" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {/* Fill different color for simulated */}
                    {chartData.map((entry, index) => (
                      <rect key={index} fill={index === 1 ? '#6366f1' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Narrative description */}
          <div className="p-5 rounded-2xl border border-dashed border-zinc-800 bg-black/20 text-zinc-400 leading-relaxed leading-normal block">
            <span className="font-bold text-white uppercase block mb-1 text-[11px] font-mono text-emerald-400">Simulation feedback</span>
            <p className="font-sans text-xs">{results.impactSummary}</p>
          </div>

        </div>

      </div>
    </div>
  );
}
