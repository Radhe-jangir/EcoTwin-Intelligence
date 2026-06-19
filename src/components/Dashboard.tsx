import React from 'react';
import logo from "/assets/logo.png";
import CountUp from "react-countup";
import CarbonDonutChart from "./CarbonDonutChart";
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  Leaf, Zap, Truck, ShoppingBag, Trash2, Globe, Heart, Award, Calendar, Plus, RefreshCw, Layers
} from 'lucide-react';
import { DayInput, EngineeredFeatures, UserPersona } from '../types';
import { calculateEmissionsFromDayInput } from '../mlEngine';

interface DashboardProps {
  profile: {
    userId: string;
    displayName: string;
    email: string;
    persona: UserPersona;
    currentEcoScore: number;
    lastUpdated: string;
  };
  latestFeature: EngineeredFeatures;
  history: EngineeredFeatures[];
  dailyInputs: DayInput[];
  onAddInputClick: () => void;
  onRefresh: () => void;
  onDeleteInput: (id: string) => void;
}

export default function Dashboard({
  profile,
  latestFeature,
  history,
  dailyInputs,
  onAddInputClick,
  onRefresh,
  onDeleteInput
}: DashboardProps) {

  // Category Color Map (Warm, modern, professional slate palette)
  const colors = {
    transport: '#10b981',   // emerald
    food: '#3b82f6',        // indigo
    electricity: '#f59e0b', // amber
    shopping: '#ec4899',    // pink
    waste: '#8b5cf6',       // violet
    travel: '#ef4444'       // rose
  };

  const getPersonaBadgeStyle = (p: UserPersona) => {
    switch (p) {
      case 'Climate Champion':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Sustainability Enthusiast':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Green Commuter':
        return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'Conscious Consumer':
        return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    }
  };

  // Prepare chart format
  const chartData = history.map(h => ({
    period: h.period,
    Transport: h.transportCO2e_kg,
    Food: h.foodCO2e_kg,
    Electricity: h.electricityCO2e_kg,
    Shopping: h.shoppingCO2e_kg,
    Waste: h.wasteCO2e_kg,
    Travel: h.travelCO2e_kg,
    Total: h.totalCO2e_kg
  }));

  // Framer Motion staggered grid variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 110,
        damping: 14
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-4">
        {/* <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Digital Carbon Twin Dashboard
          </h1>
          
          <p className="text-zinc-400 text-sm">
            Analytical environment mirroring lifestyle footprint computations in real-time.
          </p>
        </div> */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <img
            src={logo}
            alt="CarbonTwin AI"
            className="
w-10 h-10
object-contain
drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]
"
          />

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Digital Carbon Twin Dashboard
            </h1>
            <p className="text-zinc-400">
              Analytical environment mirroring lifestyle footprint computations in real-time.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition rounded-lg text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Recalculate Models
          </button>
          <button
            onClick={onAddInputClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition font-semibold rounded-lg text-sm flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" /> Log Daily Input
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <motion.div
        variants={cardVariants}
        whileHover={{
          y: -6,
          scale: 1.02
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {/* Card 1: User Persona */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -6,
            scale: 1.02
          }}
          className="
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
            <Award className="w-24 h-24 text-emerald-400" />
          </div>
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Sustainability Segment</span>
          <h2 className="text-2xl font-bold text-white mt-1 mb-2 font-mono">{profile.persona}</h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPersonaBadgeStyle(profile.persona)}`}>
            ACTIVE MODEL MATCH
          </span>
        </motion.div>

        {/* Card 2: Eco Score */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -6,
            scale: 1.02
          }}
          className="
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
"
        >
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Sustainability Composite Score</span>
          <div className="flex items-baseline gap-2 mt-1 mb-2">
            <span className="
text-4xl
font-extrabold
text-emerald-400
font-mono
drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]
">{latestFeature ? latestFeature.sustainabilityIndex : 0}</span>
            <span className="text-zinc-500 text-sm">/ 100</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-1000"
              style={{ width: `${latestFeature ? latestFeature.sustainabilityIndex : 0}%` }}
            />
          </div>
        </motion.div>

        {/* Card 3: Total Carbon Monthly */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -6,
            scale: 1.02
          }}
          className="
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
"
        >
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Monthly Carbon Intensity</span>
          <div className="flex items-baseline gap-2 mt-1 mb-2">
            <CountUp
              end={latestFeature ? latestFeature.totalCO2e_kg : 0}
              duration={2}
              decimals={1}
            >
              {({ countUpRef }) => (
                <span
                  ref={countUpRef}
                  className="text-4xl font-extrabold text-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                />
              )}
            </CountUp>
            <span className="text-zinc-500 text-sm">kg CO2e</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Derived directly from logged lifestyle features.
          </p>
        </motion.div>

        {/* Card 4: Completeness */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -6,
            scale: 1.02
          }}
          className="
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
"
        >
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Pipeline completeness</span>
          <div className="flex items-baseline gap-2 mt-1 mb-2">
            <span className="text-4xl font-extrabold text-indigo-400 font-mono">
              {latestFeature ? Math.round(latestFeature.dataCompletenessScore * 100) : 0}%
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Determines convergence confidence. Maintain logins to clear error parameters.
          </p>
        </motion.div>
      </motion.div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Time series Stacked Chart */}
        <div
          className="
lg:col-span-2
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Historic Emissions Breakdown
            </h3>
            <span className="text-xs text-zinc-500 font-mono uppercase">Unit: kg CO2e / month</span>
          </div>

          <div className="mt-4 h-[260px] sm:h-[320px] md:h-[550px]">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.transport} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={colors.transport} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="period" stroke="#71717a" tickLine={false} />
                <YAxis stroke="#71717a" tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend iconSize={8} iconType="circle" />
                <Area type="monotone" dataKey="Transport" stackId="1" stroke={colors.transport} fill={colors.transport} fillOpacity={0.25} />
                <Area type="monotone" dataKey="Food" stackId="1" stroke={colors.food} fill={colors.food} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Electricity" stackId="1" stroke={colors.electricity} fill={colors.electricity} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Shopping" stackId="1" stroke={colors.shopping} fill={colors.shopping} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Waste" stackId="1" stroke={colors.waste} fill={colors.waste} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Travel" stackId="1" stroke={colors.travel} fill={colors.travel} fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Period Share Donut representation via Recharts Bar */}
        <div
          className="
p-6
rounded-2xl
overflow-hidden
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
hover:border-emerald-500/20
transition-all duration-300
"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" /> Current Sector Weight
            </h3>
            <CarbonDonutChart
              data={[
                {
                  category: "Transport",
                  value: latestFeature.transportCO2e_kg,
                },
                {
                  category: "Food",
                  value: latestFeature.foodCO2e_kg,
                },
                {
                  category: "Utilities",
                  value: latestFeature.electricityCO2e_kg,
                },
                {
                  category: "Purchases",
                  value: latestFeature.shoppingCO2e_kg,
                },
                {
                  category: "Waste",
                  value: latestFeature.wasteCO2e_kg,
                },
                {
                  category: "Travel",
                  value: latestFeature.travelCO2e_kg,
                },
              ]}
            />
            <p className="text-xs text-zinc-400 mb-4">
              Breakdown of carbon equivalents for period {latestFeature?.period}.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {latestFeature ? (
              <>
                {[
                  { label: 'Transport', value: latestFeature.transportCO2e_kg, color: colors.transport, icon: Truck },
                  { label: 'Food Intake', value: latestFeature.foodCO2e_kg, color: colors.food, icon: Heart },
                  { label: 'Home Utilities', value: latestFeature.electricityCO2e_kg, color: colors.electricity, icon: Zap },
                  { label: 'Purchases', value: latestFeature.shoppingCO2e_kg, color: colors.shopping, icon: ShoppingBag },
                  { label: 'Circular Waste', value: latestFeature.wasteCO2e_kg, color: colors.waste, icon: Trash2 },
                  { label: 'Long Travel', value: latestFeature.travelCO2e_kg, color: colors.travel, icon: Globe }
                ].map((cat, idx) => {
                  const pct = latestFeature.totalCO2e_kg > 0
                    ? Math.round((cat.value / latestFeature.totalCO2e_kg) * 100)
                    : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-zinc-300">
                        <span className="flex items-center gap-1.5 font-medium">
                          <cat.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                          {cat.label}
                        </span>
                        <span className="font-mono text-zinc-400">{cat.value} kg ({pct}%)</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-6 text-zinc-500 text-sm font-mono">No period features compiled.</div>
            )}
          </div>
        </div>
      </div>

      {/* Inputs Log History Table */}
      <div
        className="
p-6
rounded-2xl
backdrop-blur-xl
bg-white/[0.03]
border border-white/10
hover:border-emerald-500/30
hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
transition-all
duration-300
space-y-4
"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Ground-Truth Lifestyle Log
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Count: {dailyInputs.length} entries matching this cycle</span>
        </div>

        {dailyInputs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-500 text-sm font-mono">No inputs logged for the active period.</p>
            <button
              onClick={onAddInputClick}
              className="mt-3 text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Add your first entry <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-2">Transport</th>
                  <th className="py-3 px-2">Food Intake</th>
                  <th className="py-3 px-2">Electricity Usage</th>
                  <th className="py-3 px-2">Shopping Cat</th>
                  <th className="py-3 px-2">Organic Waste</th>
                  <th className="py-3 px-2 text-right">Total Est</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {dailyInputs.slice().sort((a, b) => b.date.localeCompare(a.date)).map((inp) => {
                  const dailyCalc = calculateEmissionsFromDayInput(inp);
                  return (
                    <tr key={inp.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3 px-4 font-semibold text-white">{inp.date}</td>
                      <td className="py-3 px-2 text-zinc-400">
                        {inp.transport.distance_km}km ({inp.transport.mode})
                      </td>
                      <td className="py-3 px-2 text-zinc-400 capitalize">{inp.food.meal_type.replace('_', ' ')}</td>
                      <td className="py-3 px-2 text-zinc-400">{inp.electricity.kwh_usage} kWh</td>
                      <td className="py-3 px-2 text-zinc-400 capitalize">{inp.shopping.category}</td>
                      <td className="py-3 px-2 text-zinc-400">{inp.waste.weight_kg}kg ({inp.waste.type})</td>
                      <td className="py-3 px-2 text-right font-semibold text-emerald-400">{dailyCalc.total} kg</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onDeleteInput(inp.id)}
                          className="p-1 px-2 rounded hover:bg-zinc-800 text-rose-400 hover:text-rose-300 transition"
                          title="Delete log"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
