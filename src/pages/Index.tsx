import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Claims from "@/pages/Claims";
import SettingsPage from "@/pages/SettingsPage";
import BottomNav from "@/components/BottomNav";

function AppShell() {
  const { step } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (step === "onboarding") return <Onboarding />;

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "marketplace" && <Marketplace />}
      {activeTab === "claims" && <Claims />}
      {activeTab === "settings" && <SettingsPage />}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
