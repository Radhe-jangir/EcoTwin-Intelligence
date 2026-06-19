import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Settings, Share2, ShieldCheck, ArrowRight, Cpu, FlaskConical, CircleDot, RefreshCw } from 'lucide-react';
import { EMISSION_FACTORS } from '../mlEngine';

export default function FeatureLab() {
  const [testCommute, setTestCommute] = useState(30);
  const [testFuel, setTestFuel] = useState<'car_petrol' | 'car_diesel' | 'ev' | 'public_bus'>('car_petrol');
  const [testProtein, setTestProtein] = useState<'red_meat' | 'poultry' | 'fish' | 'vegetarian' | 'vegan'>('red_meat');

  // Interactive Live pipeline transformation calculator
  const rawCommuteFactor = EMISSION_FACTORS.transport[testFuel];
  const derivedTransportEmissions = parseFloat((testCommute * rawCommuteFactor).toFixed(2));

  const rawProteinFactor = EMISSION_FACTORS.food[testProtein];
  const derivedFoodEmissions = parseFloat((3 * rawProteinFactor).toFixed(2));

  return (
    <div className="space-y-8 text-gray-100">
      {/* Header section with elite tech layout */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-sm tracking-widest uppercase mb-2">
          <FlaskConical className="w-4 h-4 animate-bounce" /> Feature Engineering Lab
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Feature Pipelines & Transformations
        </h1>
        <p className="mt-2 text-zinc-400 text-sm max-w-3xl leading-relaxed">
          Explore how sparse, unstructured daily consumer datasets are cleaned, scaled, normalized, and transformed into highly converged model-ready feature vectors feeding CarbonTwin's digital neural weights.
        </p>
      </div>

      {/* Grid of pipeline elements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: '1. Raw Ingestion',
            icon: Code,
            color: 'text-emerald-400 bg-emerald-500/10',
            desc: 'Continuous streams of user activity (commute miles, diet selections, energy utility invoices).',
            samples: ['Daily Commute: 32 km', 'Beef Sandwich', 'Invoice: 85 kWh']
          },
          {
            title: '2. Normalization & Cleanse',
            icon: Settings,
            color: 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/10',
            desc: 'Detects outlayer anomalies, handles null/empty logs, and converts monetary rates to operational quantities (e.g., $ to kWh).',
            samples: ['Anomalous flight filters', 'Unit conversions', 'Interpolated missing days']
          },
          {
            title: '3. Derived Feature Matrix',
            icon: Share2,
            color: 'text-pink-400 bg-pink-500/10 border border-pink-500/10',
            desc: 'Binds regional green-grid emission coefficients, computes diversion indexes, and establishes composite health variables.',
            samples: ['Transport Emissions', 'Food Impact Score Coefficient', 'Waste Diversion ratio']
          },
          {
            title: '4. Model Input Vectors',
            icon: ShieldCheck,
            color: 'text-teal-400 bg-teal-500/10 border border-teal-500/10',
            desc: 'Vectors are assembled, scaled, chronological sorted, and parsed directly into forecasting and recommending algorithms.',
            samples: ['feature_vector = [785.4, 0.35, 120, ...]', 'History tensors', 'Prediction inputs']
          }
        ].map((node, i) => (
          <div key={i} className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${node.color}`}>
                  <node.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{node.title}</h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{node.desc}</p>
            </div>
            <div className="pt-2 border-t border-zinc-900 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">Example Output:</span>
              <ul className="space-y-1 text-xs font-mono text-zinc-300">
                {node.samples.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CircleDot className="w-2.5 h-2.5 text-zinc-700" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Feature Transformation Simulator */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" /> Interactive Feature Compiler Sandbox
            </h3>
            <p className="text-xs text-zinc-400">
              Manipulate raw telemetry fields below to observe live derived calculations processed by the pipeline.
            </p>
          </div>
          <span className="text-[10px] border border-zinc-800 px-2 py-1 rounded bg-black/40 text-emerald-400 font-mono">LIVE PIPELINE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* User Inputs Sandbox */}
          <div className="lg:col-span-5 space-y-4 text-xs font-mono p-5 rounded-xl border border-zinc-900 bg-black/40">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold mb-2">RAW TELEMETRY INGESTION PANEL</span>
            
            <div className="space-y-1.5">
              <label className="text-zinc-400 block justify-between flex">
                <span>Commute Distance:</span>
                <span className="text-emerald-400 font-bold">{testCommute} km</span>
              </label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={testCommute} 
                onChange={(e) => setTestCommute(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Transport fuel coefficient:</label>
              <select 
                value={testFuel} 
                onChange={(e: any) => setTestFuel(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="car_petrol">Petrol Sedan Car (0.192 CO2e/km)</option>
                <option value="car_diesel">Diesel Estate SUV (0.171 CO2e/km)</option>
                <option value="ev">Tesla Model 3 EV (0.052 CO2e/km)</option>
                <option value="public_bus">City Urban Transit Metrolink (0.105 CO2e/km)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 block">Daily Food Intake Protein:</label>
              <select 
                value={testProtein} 
                onChange={(e: any) => setTestProtein(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="red_meat">Premium Beef/Ruminant steak (8.52kg CO2e/meal)</option>
                <option value="poultry">Free Range Local Chicken (2.84kg CO2e/meal)</option>
                <option value="fish">Wild Atlantic Salmon Cod (3.12kg CO2e/meal)</option>
                <option value="vegetarian">Dairy, egg, legume scramble (1.42kg CO2e/meal)</option>
                <option value="vegan">Organic vegan tofu and veggies (0.65kg CO2e/meal)</option>
              </select>
            </div>
          </div>

          {/* Transformation visual flow */}
          <div className="lg:col-span-2 flex justify-center text-zinc-600">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-1 mx-auto" />
              <span className="text-[10px] font-mono font-bold block text-zinc-400">TRANSFORM</span>
              <span className="text-[9px] text-zinc-500">running equations</span>
            </div>
          </div>

          {/* Derived Features vector */}
          <div className="lg:col-span-5 p-5 rounded-xl border border-zinc-900 bg-black/60 space-y-4">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block font-bold">DERIVED ML FEATURE ATTRIBUTES</span>
            
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded border border-zinc-900">
                <span className="text-zinc-400">derived_transport_CO2e_kg:</span>
                <span className="text-emerald-400 font-bold">
                  {testCommute} km × {rawCommuteFactor} = <span className="text-white text-sm">{derivedTransportEmissions}</span> kg
                </span>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded border border-zinc-900">
                <span className="text-zinc-400">derived_food_intake_CO2e_kg:</span>
                <span className="text-emerald-400 font-bold">
                  3 meals × {rawProteinFactor} = <span className="text-white text-sm">{derivedFoodEmissions}</span> kg
                </span>
              </div>

              <div className="flex justify-between items-center bg-zinc-950 p-2.5 rounded border border-zinc-900">
                <span className="text-zinc-400">feature_vector_array:</span>
                <span className="text-indigo-400 text-xs font-bold leading-none select-all bg-black p-1 px-2 rounded">
                  [{derivedTransportEmissions}, {derivedFoodEmissions}, 1.28, 0.42]
                </span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 leading-normal font-sans">
              This array contains your real-time carbon equivalents ready to be queried by CarbonTwin forecasting networks. Keep parameters updated to eliminate pipeline drift telemetry error coefficients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
