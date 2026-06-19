import React, { useState } from 'react';
import { X, Calendar, Truck, Heart, Zap, Trash2, Globe, ShoppingBag, Loader2 } from 'lucide-react';
import { DayInput } from '../types';

interface AddInputModalProps {
  onClose: () => void;
  onSave: (input: Omit<DayInput, 'id'>) => Promise<void>;
}

export default function AddInputModal({ onClose, onSave }: AddInputModalProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [distanceKm, setDistanceKm] = useState(15);
  const [mode, setMode] = useState<'car' | 'public' | 'bike' | 'walk' | 'ev'>('car');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'none'>('petrol');
  const [mealType, setMealType] = useState<'vegan' | 'vegetarian' | 'poultry' | 'fish' | 'red_meat'>('vegetarian');
  const [kwhUsage, setKwhUsage] = useState(8);
  const [shopCategory, setShopCategory] = useState<'electronics' | 'clothing' | 'home_goods' | 'other' | 'none'>('none');
  const [shopUSD, setShopUSD] = useState(0);
  const [wasteKg, setWasteKg] = useState(0.5);
  const [wasteType, setWasteType] = useState<'recyclable' | 'compost' | 'landfill'>('recyclable');

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        date,
        transport: {
          distance_km: Number(distanceKm),
          mode,
          fuelType: mode === 'car' ? fuelType : 'none'
        },
        food: {
          meal_type: mealType
        },
        electricity: {
          kwh_usage: Number(kwhUsage),
          bill_amount_usd: 0
        },
        shopping: {
          category: shopCategory,
          amount_usd: Number(shopUSD)
        },
        waste: {
          weight_kg: Number(wasteKg),
          type: wasteType
        },
        travel: {
          distance_km: 0,
          mode: 'none',
          cabinClass: 'none'
        }
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono text-xs text-gray-100">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-black/40">
          <div>
            <h3 className="text-base font-extrabold text-white">Log daily lifestyle metrics</h3>
            <p className="text-zinc-500 text-[10px]">Your inputs compile directly into the digital carbon twin features.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form scroll body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 divide-y divide-zinc-900 pr-4">
          
          {/* General Date selection */}
          <div className="grid grid-cols-2 gap-4 pb-2 items-center">
            <span className="text-zinc-400 font-bold block flex items-center gap-1.5 leading-none">
              <Calendar className="w-4 h-4 text-emerald-400" /> Ground Date:
            </span>
            <input 
              type="date" 
              value={date} 
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded p-1.5 text-zinc-300 text-right uppercase focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Transport panel */}
          <div className="space-y-3 pt-3">
            <span className="text-emerald-400 font-bold block flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Truck className="w-4 h-4" /> 1. Mobile & Commuting
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-zinc-500">Commute Mode:</span>
                <select 
                  value={mode}
                  onChange={(e: any) => setMode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="car">Personal Car</option>
                  <option value="public">Public Transit (Bus/Train)</option>
                  <option value="ev">Electric Cruiser (EV)</option>
                  <option value="bike">Bicycle</option>
                  <option value="walk">Active Footing</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500">Distance traveled (km):</span>
                <input 
                  type="number" 
                  min="0"
                  max="1000"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {mode === 'car' && (
                <div className="space-y-1 col-span-2">
                  <span className="text-zinc-500 font-bold">ICE Fuel Metric:</span>
                  <select 
                    value={fuelType}
                    onChange={(e: any) => setFuelType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 focus:outline-none"
                  >
                    <option value="petrol">Unleaded Petrol Octane</option>
                    <option value="diesel">Light Heavy Diesel</option>
                    <option value="electric">Direct Battery Electric (EV)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Food proteins */}
          <div className="space-y-3 pt-3">
            <span className="text-blue-400 font-bold block flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Heart className="w-4 h-4" /> 2. Protein Nutrition
            </span>
            <div className="space-y-1">
              <span className="text-zinc-500">Primary protein tier:</span>
              <select 
                value={mealType}
                onChange={(e: any) => setMealType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 capitalize focus:outline-none focus:border-emerald-500"
              >
                <option value="red_meat">Red Beef / Lamb Steak</option>
                <option value="poultry">Poultry / Local Chicken</option>
                <option value="fish">Wild Salmon / Seafood</option>
                <option value="vegetarian">Dairy Egg Vegetarian</option>
                <option value="vegan">100% Plant-Based vegan tofu</option>
              </select>
            </div>
          </div>

          {/* Electric utility */}
          <div className="space-y-3 pt-3">
            <span className="text-amber-400 font-bold block flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Zap className="w-4 h-4" /> 3. Home Utility Grid
            </span>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <span className="text-zinc-500">Estimated power consumed of today (kWh):</span>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  value={kwhUsage}
                  onChange={(e) => setKwhUsage(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Shopping Purchases */}
          <div className="space-y-3 pt-3">
            <span className="text-pink-400 font-bold block flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <ShoppingBag className="w-4 h-4" /> 4. Lifecycle Shopping
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-zinc-500">Spent Category:</span>
                <select 
                  value={shopCategory}
                  onChange={(e: any) => setShopCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 capitalize focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">No major buys</option>
                  <option value="electronics">Electronics hardware</option>
                  <option value="clothing">Garments & Apparel</option>
                  <option value="home_goods">Home Design Furniture</option>
                  <option value="other">General small retail spent</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500">Total Spent Amount (USD):</span>
                <input 
                  type="number" 
                  min="0"
                  max="5000"
                  value={shopUSD}
                  onChange={(e) => setShopUSD(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-semibold focus:outline-none"
                  disabled={shopCategory === 'none'}
                />
              </div>
            </div>
          </div>

          {/* Organic Waste */}
          <div className="space-y-3 pt-3 pb-2">
            <span className="text-violet-400 font-bold block flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Trash2 className="w-4 h-4" /> 5. Circular Materials Waste
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-zinc-500">Weight generated (kg):</span>
                <input 
                  type="number" 
                  step="0.05"
                  min="0"
                  max="15"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500">Disposal destination:</span>
                <select 
                  value={wasteType}
                  onChange={(e: any) => setWasteType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 capitalize focus:outline-none focus:border-emerald-500"
                >
                  <option value="recyclable">Plastics Recycled batch</option>
                  <option value="compost">Kitchen Scraps Composting</option>
                  <option value="landfill">Non-organic plain Landfill</option>
                </select>
              </div>
            </div>
          </div>

        </form>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-900 flex justify-end gap-3 bg-black/40">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-zinc-400 font-bold transition text-xs"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 hover:bg-emerald-400 bg-emerald-500 text-zinc-950 rounded-lg transition font-extrabold text-xs inline-flex items-center gap-1"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              'Save telemetry parameters'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
