import { useApp } from "@/contexts/AppContext";
import { useState, useEffect, useRef } from "react";
import PayoutReceipt from "@/components/PayoutReceipt";
import { firePayoutConfetti } from "@/lib/confetti";
import { AlertTriangle, CheckCircle, Clock, Wallet, ShieldOff, FileText } from "lucide-react";

export default function Claims() {
  const app = useApp();
  const payout = app.getPayout();
  const [showReceipt, setShowReceipt] = useState(false);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (app.payoutProcessed && !confettiFired.current) {
      confettiFired.current = true;
      firePayoutConfetti();
    }
    if (!app.payoutProcessed) confettiFired.current = false;
  }, [app.payoutProcessed]);

  return (
    <div className="px-4 pt-4 pb-24 space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground">Claims</h1>
      <p className="text-xs text-muted-foreground">Automated parametric claims engine</p>

      {!app.isInsured ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center space-y-3">
          <ShieldOff size={40} className="mx-auto text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No Active Coverage</p>
          <p className="text-xs text-muted-foreground">Buy a plan from the Marketplace to enable auto-claims.</p>
        </div>
      ) : app.activeDisruption ? (
        <div className="space-y-4 animate-slide-up">
          {/* Active Disruption */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-destructive" size={18} />
              <span className="font-bold text-destructive text-sm">Active Disruption Alert</span>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Event</span>
                <span className="font-medium text-foreground">{app.activeDisruption}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">City</span>
                <span className="font-medium text-foreground">{app.getCityData().name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Triggered At</span>
                <span className="font-mono text-foreground">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Claim Status */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <span className="text-xs font-semibold text-muted-foreground">CLAIM PIPELINE</span>

            <div className="space-y-3">
              <ClaimStep icon={AlertTriangle} label="Disruption Detected" status="done" />
              <ClaimStep icon={CheckCircle} label="AI Verification Complete" status={app.payoutProcessed ? "done" : "active"} />
              <ClaimStep icon={Wallet} label={`₹${payout} Payout Disbursed`} status={app.payoutProcessed ? "done" : "pending"} />
            </div>

            {app.payoutProcessed && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-3 animate-count-up">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-success" size={16} />
                  <span className="text-sm font-bold text-success">₹{payout} sent to UPI</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Transaction ID: GS{Date.now().toString(36).toUpperCase()}</p>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="mt-2 w-full py-2 rounded-lg bg-success/20 text-success text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-success/30 transition-colors"
                >
                  <FileText size={13} /> View Digital Receipt
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="text-success" size={24} />
            </div>
            <p className="text-sm font-medium text-foreground">No Active Disruptions</p>
            <p className="text-xs text-muted-foreground">
              AI is monitoring weather, AQI & temperature 24/7. Claims are auto-generated when thresholds are breached.
            </p>
          </div>

          {/* Past claims mock */}
          <div className="bg-card rounded-xl border border-border p-4">
            <span className="text-xs font-semibold text-muted-foreground">CLAIM HISTORY</span>
            <p className="text-xs text-muted-foreground mt-2">No past claims yet. Enable Demo Mode on the Dashboard to simulate a disruption event.</p>
          </div>
        </div>
      )}
      {showReceipt && <PayoutReceipt onClose={() => setShowReceipt(false)} />}
    </div>
  );
}

function ClaimStep({ icon: Icon, label, status }: { icon: React.ElementType; label: string; status: "done" | "active" | "pending" }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        status === "done" ? "bg-success/10" : status === "active" ? "bg-accent/10" : "bg-muted"
      }`}>
        {status === "active" ? (
          <Clock size={14} className="text-accent animate-pulse" />
        ) : (
          <Icon size={14} className={status === "done" ? "text-success" : "text-muted-foreground"} />
        )}
      </div>
      <span className={`text-sm ${status === "done" ? "text-foreground font-medium" : status === "active" ? "text-accent font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
      {status === "active" && <div className="w-2 h-2 rounded-full bg-accent animate-pulse-ring ml-auto" />}
    </div>
  );
}
