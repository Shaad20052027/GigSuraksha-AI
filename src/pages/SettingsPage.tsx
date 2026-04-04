import { useApp } from "@/contexts/AppContext";
import { Moon, Sun, User, MapPin, Briefcase, Clock } from "lucide-react";

export default function SettingsPage() {
  const app = useApp();

  return (
    <div className="px-4 pt-4 pb-24 space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <span className="text-xs font-semibold text-muted-foreground">PROFILE</span>
        <div className="space-y-2">
          <InfoRow icon={User} label="Phone" value={`+91-${app.user?.phone || ""}`} />
          <InfoRow icon={Briefcase} label="Platform" value={app.user?.platform || ""} />
          <InfoRow icon={MapPin} label="City" value={app.getCityData().name} />
          <InfoRow icon={Clock} label="Daily Hours" value={`${app.user?.hoursPerDay || 8} hrs`} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {app.isDarkMode ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-accent" />}
            <span className="text-sm font-medium text-foreground">Dark Mode</span>
          </div>
          <button
            onClick={app.toggleDarkMode}
            className={`w-11 h-6 rounded-full relative transition-colors ${app.isDarkMode ? "bg-primary" : "bg-muted"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-card shadow absolute top-0.5 transition-transform ${app.isDarkMode ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 text-center">
        <p className="text-[10px] text-muted-foreground">GigSuraksha AI v1.0 • Parametric Insurance Platform</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
