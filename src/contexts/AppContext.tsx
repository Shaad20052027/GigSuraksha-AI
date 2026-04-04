import React, { createContext, useContext, useState, useCallback } from "react";
import { CITIES, CityData, DISRUPTED_WEATHER, calculateRiskScore, calculatePremium, checkDisruption, calculatePayout } from "@/lib/insurance";

interface UserProfile {
  phone: string;
  platform: string;
  city: string;
  hoursPerDay: number;
}

interface AppState {
  step: "onboarding" | "app";
  onboardingStep: number;
  user: UserProfile | null;
  isDarkMode: boolean;
  isDemoMode: boolean;
  isInsured: boolean;
  activeDisruption: string | null;
  payoutProcessed: boolean;
  currentWeather: CityData["weather"] | null;
}

interface AppContextType extends AppState {
  setOnboardingStep: (s: number) => void;
  setUser: (u: UserProfile) => void;
  completeOnboarding: () => void;
  toggleDarkMode: () => void;
  toggleDemoMode: () => void;
  buyInsurance: () => void;
  triggerDisruption: (type: string) => void;
  clearDisruption: () => void;
  getCityData: () => CityData;
  getRiskScore: () => number;
  getPremium: () => number;
  getPayout: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    step: "onboarding",
    onboardingStep: 0,
    user: null,
    isDarkMode: false,
    isDemoMode: false,
    isInsured: false,
    activeDisruption: null,
    payoutProcessed: false,
    currentWeather: null,
  });

  const getCityData = useCallback(() => {
    return CITIES[state.user?.city || "delhi"] || CITIES.delhi;
  }, [state.user?.city]);

  const getRiskScoreVal = useCallback(() => {
    const city = getCityData();
    return calculateRiskScore(city, state.currentWeather || undefined);
  }, [getCityData, state.currentWeather]);

  const getPremiumVal = useCallback(() => {
    return calculatePremium(getRiskScoreVal());
  }, [getRiskScoreVal]);

  const getPayoutVal = useCallback(() => {
    return calculatePayout(state.user?.hoursPerDay || 8);
  }, [state.user?.hoursPerDay]);

  const value: AppContextType = {
    ...state,
    setOnboardingStep: (s) => setState((p) => ({ ...p, onboardingStep: s })),
    setUser: (u) => setState((p) => ({ ...p, user: u })),
    completeOnboarding: () => setState((p) => ({ ...p, step: "app" })),
    toggleDarkMode: () => {
      setState((p) => {
        const next = !p.isDarkMode;
        document.documentElement.classList.toggle("dark", next);
        return { ...p, isDarkMode: next };
      });
    },
    toggleDemoMode: () => setState((p) => ({ ...p, isDemoMode: !p.isDemoMode, activeDisruption: null, payoutProcessed: false, currentWeather: null })),
    buyInsurance: () => setState((p) => ({ ...p, isInsured: true })),
    triggerDisruption: (type) => {
      const weather = DISRUPTED_WEATHER[type];
      if (!weather) return;
      const city = getCityData();
      const disruption = checkDisruption(weather);
      setState((p) => ({
        ...p,
        currentWeather: weather,
        activeDisruption: disruption,
        payoutProcessed: false,
      }));
      if (disruption && state.isInsured) {
        setTimeout(() => {
          setState((p) => ({ ...p, payoutProcessed: true }));
        }, 3000);
      }
    },
    clearDisruption: () => setState((p) => ({ ...p, activeDisruption: null, payoutProcessed: false, currentWeather: null })),
    getCityData,
    getRiskScore: getRiskScoreVal,
    getPremium: getPremiumVal,
    getPayout: getPayoutVal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
