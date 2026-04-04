import { useApp } from "@/contexts/AppContext";
import { Shield, CheckCircle, Receipt, X, Fingerprint, MapPin, Clock, CreditCard } from "lucide-react";

interface PayoutReceiptProps {
  onClose: () => void;
}

export default function PayoutReceipt({ onClose }: PayoutReceiptProps) {
  const app = useApp();
  const payout = app.getPayout();
  const premium = app.getPremium();
  const cityData = app.getCityData();
  const weather = app.currentWeather || cityData.weather;
  const txnId = `GS${Date.now().toString(36).toUpperCase()}`;
  const now = new Date();

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm animate-slide-up"
      onClick={onClose}>
      <div
        className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header strip */}
        <div className="bg-success px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="text-success-foreground" size={20} />
            <span className="font-bold text-success-foreground text-sm">Payout Receipt</span>
          </div>
          <button onClick={onClose} className="text-success-foreground/70 hover:text-success-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Amount hero */}
        <div className="text-center py-5 border-b border-dashed border-border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success/10 mb-3">
            <CheckCircle className="text-success" size={28} />
          </div>
          <p className="text-3xl font-bold text-foreground animate-count-up">₹{payout}</p>
          <p className="text-xs text-success font-semibold mt-1">Successfully Disbursed</p>
        </div>

        {/* Details grid */}
        <div className="px-5 py-4 space-y-3">
          <ReceiptRow icon={Fingerprint} label="Transaction ID" value={txnId} mono />
          <ReceiptRow icon={Clock} label="Timestamp" value={now.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
          <ReceiptRow icon={MapPin} label="City" value={cityData.name} />
          <ReceiptRow icon={Shield} label="Trigger Event" value={app.activeDisruption || "—"} />

          {/* Trigger data */}
          <div className="bg-muted rounded-lg p-3 mt-2">
            <span className="text-[10px] font-semibold text-muted-foreground">PARAMETRIC DATA</span>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <MiniStat label="Rain" value={`${weather.rain}mm`} breach={weather.rain > 60} />
              <MiniStat label="Temp" value={`${weather.temp}°C`} breach={weather.temp > 45} />
              <MiniStat label="AQI" value={`${weather.aqi}`} breach={weather.aqi > 400} />
            </div>
          </div>

          <ReceiptRow icon={CreditCard} label="Payout Method" value="UPI (Auto)" />
          <ReceiptRow icon={Shield} label="Premium Paid" value={`₹${premium}/week`} />

          <div className="border-t border-dashed border-border pt-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Verification</span>
            <span className="text-xs font-semibold text-success flex items-center gap-1">
              <CheckCircle size={12} /> AI-Verified • No Paperwork
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            Done
          </button>
          <p className="text-[9px] text-muted-foreground text-center mt-2">
            GigSuraksha AI • Parametric Insurance • Claim #{txnId}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <span className={`font-medium text-foreground ${mono ? "font-mono text-[11px]" : ""}`}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, breach }: { label: string; value: string; breach: boolean }) {
  return (
    <div className={`text-center rounded-md p-1.5 ${breach ? "bg-destructive/10" : "bg-card"}`}>
      <p className={`text-sm font-bold ${breach ? "text-destructive" : "text-foreground"}`}>{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
      {breach && <p className="text-[8px] font-bold text-destructive">BREACH</p>}
    </div>
  );
}
