import { useApp } from "@/contexts/AppContext";
import { Shield, Zap, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Marketplace() {
  const app = useApp();
  const premium = app.getPremium();
  const riskScore = app.getRiskScore();
  const payout = app.getPayout();
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handleBuy = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      app.buyInsurance();
      setTimeout(() => setPaySuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="px-4 pt-4 pb-24 space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground">Insurance Plans</h1>
      <p className="text-xs text-muted-foreground">AI-calculated based on your city, weather & risk profile</p>

      {/* AI Plan Card */}
      <div className="bg-card rounded-2xl border-2 border-primary/30 p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
          AI RECOMMENDED
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Weekly Income Shield</h2>
            <p className="text-xs text-muted-foreground">Parametric coverage • Auto-payout</p>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Weekly Premium</span>
            <span className="text-2xl font-bold text-foreground">₹{premium}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Risk Score Used</span>
            <span className="text-sm font-mono font-bold text-primary">{riskScore}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Max Payout</span>
            <span className="text-sm font-bold text-success">₹{payout}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Sparkles size={12} className="text-accent" /> What's Covered
          </h3>
          {[
            "Heavy Rain (>60mm/hr) disruptions",
            "Extreme Heat (>45°C) downtime",
            "Severe AQI (>400) health alerts",
            "Auto-verified via AI — no paperwork",
            "Instant UPI payout within minutes",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foreground">
              <CheckCircle size={14} className="text-success mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {app.isInsured ? (
          <div className="bg-success/10 border border-success/30 rounded-xl py-3 text-center">
            <span className="text-success font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle size={16} /> Plan Active
            </span>
          </div>
        ) : (
          <button
            onClick={handleBuy}
            disabled={paying}
            className="w-full py-3.5 rounded-xl bg-accent text-accent-foreground font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
          >
            {paying ? (
              <>
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Zap size={18} /> Buy Now — ₹{premium}/week
              </>
            )}
          </button>
        )}
      </div>

      {/* Payment Success Toast */}
      {paySuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-success text-success-foreground rounded-xl p-4 animate-slide-up shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <div>
              <p className="font-bold text-sm">Payment Successful!</p>
              <p className="text-xs opacity-90">₹{premium} debited • Insurance now active</p>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-bold text-foreground">How Parametric Insurance Works</h3>
        {[
          { step: "1", text: "AI monitors weather, AQI & temp 24/7" },
          { step: "2", text: "If thresholds are breached, a disruption event triggers" },
          { step: "3", text: "Claim is auto-generated — zero paperwork" },
          { step: "4", text: "Payout sent to your UPI in minutes" },
        ].map((s) => (
          <div key={s.step} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {s.step}
            </span>
            <p className="text-xs text-foreground">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
