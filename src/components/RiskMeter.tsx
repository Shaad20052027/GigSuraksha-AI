import { getRiskLevel } from "@/lib/insurance";

interface RiskMeterProps {
  score: number;
}

export default function RiskMeter({ score }: RiskMeterProps) {
  const level = getRiskLevel(score);
  const rotation = (score / 100) * 180 - 90;

  const colorClass = level === "low" ? "text-success" : level === "medium" ? "text-warning" : "text-destructive";
  const glowClass = level === "low" ? "risk-glow-low" : level === "medium" ? "risk-glow-medium" : "risk-glow-high";
  const bgRing = level === "low" ? "stroke-success" : level === "medium" ? "stroke-warning" : "stroke-destructive";

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference * 0.75;

  return (
    <div className={`relative flex flex-col items-center ${glowClass} rounded-full p-4`}>
      <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-[135deg]">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeLinecap="round" />
        <circle cx="60" cy="60" r="54" fill="none" className={bgRing} strokeWidth="8" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Risk Score</span>
      </div>
    </div>
  );
}
