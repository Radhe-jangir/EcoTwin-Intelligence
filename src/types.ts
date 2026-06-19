export type CarbonCategory = 'transport' | 'food' | 'electricity' | 'shopping' | 'waste' | 'travel';

export type UserPersona = 
  | 'Eco Beginner' 
  | 'Conscious Consumer' 
  | 'Green Commuter' 
  | 'Sustainability Enthusiast' 
  | 'Climate Champion';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
  persona: UserPersona;
  ecoScore: number;
}

export interface DayInput {
  id: string; // YYYY-MM-DD
  date: string;
  transport: {
    distance_km: number;
    mode: 'car' | 'public' | 'bike' | 'walk' | 'ev';
    fuelType: 'petrol' | 'diesel' | 'electric' | 'none';
  };
  food: {
    meal_type: 'vegan' | 'vegetarian' | 'poultry' | 'fish' | 'red_meat';
  };
  electricity: {
    kwh_usage: number;
    bill_amount_usd: number;
  };
  shopping: {
    category: 'electronics' | 'clothing' | 'home_goods' | 'other' | 'none';
    amount_usd: number;
  };
  waste: {
    weight_kg: number;
    type: 'recyclable' | 'compost' | 'landfill';
  };
  travel: {
    distance_km: number;
    mode: 'flight' | 'train' | 'none';
    cabinClass: 'economy' | 'business' | 'none';
  };
}

export interface EngineeredFeatures {
  id: string; // Period ID e.g. YYYY-MM
  userId: string;
  period: string; // YYYY-MM
  totalCO2e_kg: number;
  transportCO2e_kg: number;
  foodCO2e_kg: number;
  electricityCO2e_kg: number;
  shoppingCO2e_kg: number;
  wasteCO2e_kg: number;
  travelCO2e_kg: number;
  monthlyTransportDistance_km: number;
  avgFoodImpactScore_normalized: number;
  avgElectricityUsage_kWh: number;
  wasteDiversionRate: number;
  sustainabilityIndex: number; // 0-100
  dataCompletenessScore: number; // 0-1.0
}

export interface Forecast {
  id: string;
  period: string; // YYYY-MM
  predictedCO2e_kg: number;
  confidenceLower_kg: number;
  confidenceUpper_kg: number;
  modelUsed: 'moving_average' | 'exponential_smoothing' | 'linear_trend';
  predictionDate: string;
  explanation: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface Recommendation {
  id: string;
  actionTitle: string;
  description: string;
  category: CarbonCategory;
  estimatedImpact_kgCO2e: number; // Monthly impact
  costRating: 'low' | 'medium' | 'high';
  difficultyRating: 'easy' | 'medium' | 'hard';
  sustainabilityGainScore: number; // 0-100 composite score
  callToAction: string;
  generatedDate: string;
  status: 'pending' | 'accepted' | 'completed' | 'dismissed';
}

export interface SimulationResult {
  scenarioName: string;
  originalCO2e_kg: number;
  simulatedCO2e_kg: number;
  reduction_kgCO2e: number;
  reductionPercent: number;
  costSavingsUSD: number;
  impactSummary: string;
}

export interface ModelMetric {
  name: string;
  value: number | string;
  unit?: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export interface DigitalCarbonTwinProfile {
  userId: string;
  currentEcoScore: number;
  lastUpdated: string;
  persona: UserPersona;
  engineeredFeatures: EngineeredFeatures;
}
