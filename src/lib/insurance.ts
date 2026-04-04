export interface CityData {
  name: string;
  baseRisk: number;
  weather: { rain: number; temp: number; aqi: number };
}

export const CITIES: Record<string, CityData> = {
  delhi: {
    name: "Delhi",
    baseRisk: 45,
    weather: { rain: 12, temp: 38, aqi: 280 },
  },
  bangalore: {
    name: "Bangalore",
    baseRisk: 25,
    weather: { rain: 35, temp: 28, aqi: 90 },
  },
  lucknow: {
    name: "Lucknow",
    baseRisk: 40,
    weather: { rain: 8, temp: 40, aqi: 320 },
  },
  mumbai: {
    name: "Mumbai",
    baseRisk: 50,
    weather: { rain: 55, temp: 32, aqi: 150 },
  },
  hyderabad: {
    name: "Hyderabad",
    baseRisk: 30,
    weather: { rain: 20, temp: 35, aqi: 120 },
  },
};

export const DISRUPTED_WEATHER: Record<string, CityData["weather"]> = {
  rain: { rain: 75, temp: 26, aqi: 200 },
  heat: { rain: 0, temp: 47, aqi: 350 },
  aqi: { rain: 5, temp: 34, aqi: 450 },
};

export function calculateRiskScore(city: CityData, weather?: CityData["weather"]): number {
  const w = weather || city.weather;
  let score = city.baseRisk;
  if (w.rain > 40) score += 20;
  else if (w.rain > 20) score += 10;
  if (w.temp > 42) score += 20;
  else if (w.temp > 38) score += 10;
  if (w.aqi > 350) score += 20;
  else if (w.aqi > 200) score += 10;
  return Math.min(100, Math.max(1, score));
}

export function calculatePremium(riskScore: number): number {
  return Math.round(25 + (riskScore / 100) * 35);
}

export function checkDisruption(weather: CityData["weather"]): string | null {
  if (weather.rain > 60) return "Heavy Rain Alert";
  if (weather.aqi > 400) return "Severe AQI Alert";
  if (weather.temp > 45) return "Extreme Heat Alert";
  return null;
}

export function calculatePayout(hoursPerDay: number): number {
  const hourlyRate = 80;
  const missedDays = 2;
  return hoursPerDay * hourlyRate * missedDays;
}

export function getRiskLevel(score: number): "low" | "medium" | "high" {
  if (score < 35) return "low";
  if (score < 65) return "medium";
  return "high";
}
