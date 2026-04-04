import { useApp } from "@/contexts/AppContext";
import { useState, useEffect, useRef } from "react";
import RiskMeter from "@/components/RiskMeter";
import RiskMap from "@/components/RiskMap";
import PayoutReceipt from "@/components/PayoutReceipt";
import { firePayoutConfetti } from "@/lib/confetti";
import { CloudRain, Thermometer, Wind, Shield, AlertTriangle, Wallet, ToggleLeft, ToggleRight, FileText } from "lucide-react";
import { getRiskLevel } from "@/lib/insurance";

export default function Dashboard() {
  const app = useApp();
  const cityData = app.getCityData();
  const weather = app.currentWeather || cityData.weather;
  const riskScore = app.getRiskScore();
  const riskLevel = getRiskLevel(riskScore);
  const payout = app.getPayout();
  const [showReceipt, setShowReceipt] = useState(false);
  const confettiFired = useRef(false);

  // Fire confetti when payout is processed
  useEffect(() => {
    if (app.payoutProcessed && !confettiFired.current) {
      confettiFired.current = true;
      firePayoutConfetti();
    }
    if (!app.payoutProcessed) {
      confettiFired.current = false;
    }
  }, [app.payoutProcessed]);

  return (
    <div className="px-4 pt-4 pb-24 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">GigSuraksha AI</h1>
          <p className="text-xs text-muted-foreground">{cityData.name} • {app.user?.platform}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={app.toggleDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              app.isDemoMode ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {app.isDemoMode ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            Demo
          </button>
        </div>
      </div>

      {/* Disruption Banner */}
      {app.activeDisruption && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-destructive" size={18} />
            <span className="font-bold text-destructive text-sm">DISRUPTION DETECTED</span>
          </div>
          <p className="text-xs text-foreground">{app.activeDisruption}</p>
          {app.payoutProcessed ? (
            <div className="mt-3 bg-success/10 border border-success/30 rounded-lg p-3 animate-count-up">
              <div className="flex items-center gap-2">
                <Wallet className="text-success" size={16} />
                <span className="font-bold text-success text-sm">₹{payout} Payout Processed</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Disbursed to UPI • Auto-verified via AI</p>
              <button
                onClick={() => setShowReceipt(true)}
                className="mt-2 w-full py-2 rounded-lg bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-success/30 transition-colors"
              >
                <FileText size={13} /> View Digital Receipt
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-xs text-accent font-medium">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse-ring" />
              Auto-generating claim...
            </div>
          )}
        </div>
      )}

      {/* Risk Meter */}
      <div className="bg-card rounded-xl border border-border p-5 flex flex-col items-center">
        <span className="text-xs font-medium text-muted-foreground mb-2">LIVE RISK METER</span>
        <RiskMeter score={riskScore} />
        <span className={`mt-2 text-xs font-bold uppercase tracking-wider ${
          riskLevel === "low" ? "text-success" : riskLevel === "medium" ? "text-warning" : "text-destructive"
        }`}>
          {riskLevel} Risk
        </span>
      </div>

      {/* Weather Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <CloudRain size={18} className="mx-auto text-primary mb-1" />
          <p className="text-lg font-bold text-foreground">{weather.rain}<span className="text-xs font-normal text-muted-foreground">mm</span></p>
          <p className="text-[10px] text-muted-foreground">Rain</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <Thermometer size={18} className="mx-auto text-accent mb-1" />
          <p className="text-lg font-bold text-foreground">{weather.temp}<span className="text-xs font-normal text-muted-foreground">°C</span></p>
          <p className="text-[10px] text-muted-foreground">Temp</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <Wind size={18} className="mx-auto text-warning mb-1" />
          <p className="text-lg font-bold text-foreground">{weather.aqi}</p>
          <p className="text-[10px] text-muted-foreground">AQI</p>
        </div>
      </div>

      {/* Risk Zone Map */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">HYPER-LOCAL RISK ZONES</span>
        <RiskMap cityKey={app.user?.city || "delhi"} overallRisk={riskScore} />
        <p className="text-[10px] text-muted-foreground text-center">Tap zones for details • Updates in real-time</p>
      </div>

      {/* Coverage Status */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className={app.isInsured ? "text-success" : "text-muted-foreground"} />
            <span className="font-semibold text-sm text-foreground">Coverage Status</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            app.isInsured ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}>
            {app.isInsured ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        {app.isInsured && (
          <p className="text-xs text-muted-foreground mt-2">Weekly plan • ₹{app.getPremium()}/week • Auto-renew ON</p>
        )}
      </div>

      {/* Earnings at Risk */}
      <div className="bg-card rounded-xl border border-border p-4">
        <span className="text-xs font-medium text-muted-foreground">EARNINGS AT RISK</span>
        <p className="text-2xl font-bold text-foreground mt-1">₹{payout}</p>
        <p className="text-xs text-muted-foreground">Based on {app.user?.hoursPerDay}hrs/day × ₹80/hr × 2 disrupted days</p>
      </div>

      {/* Demo Triggers */}
      {app.isDemoMode && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-3 animate-slide-up">
          <span className="text-xs font-bold text-accent">🧪 DEMO MODE — Trigger Events</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: "rain", label: "Heavy Rain", icon: "🌧️" },
              { type: "heat", label: "Extreme Heat", icon: "🔥" },
              { type: "aqi", label: "Severe AQI", icon: "💨" },
            ].map((t) => (
              <button
                key={t.type}
                onClick={() => app.triggerDisruption(t.type)}
                className="bg-card border border-border rounded-lg p-3 text-center hover:border-accent transition-colors"
              >
                <span className="text-xl">{t.icon}</span>
                <p className="text-[10px] font-medium text-foreground mt-1">{t.label}</p>
              </button>
            ))}
          </div>
          {app.activeDisruption && (
            <button
              onClick={app.clearDisruption}
              className="w-full py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Clear Disruption
            </button>
          )}
        </div>
      )}

      {/* Fraud Monitor */}
      <div className="bg-card rounded-xl border border-border p-4">
        <span className="text-xs font-medium text-muted-foreground">SECURITY STATUS</span>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground">GPS Heartbeat</span>
            <span className="text-success font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground">Activity Verification</span>
            <span className="text-success font-medium">✓ Verified</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground">Last Synced</span>
            <span className="text-muted-foreground font-mono">Just now</span>
          </div>
        </div>
      </div>
      {showReceipt && <PayoutReceipt onClose={() => setShowReceipt(false)} />}
    </div>
  );
}
