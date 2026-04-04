import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Shield, ChevronRight, Smartphone } from "lucide-react";
import { CITIES } from "@/lib/insurance";

export default function Onboarding() {
  const { onboardingStep, setOnboardingStep, setUser, completeOnboarding } = useApp();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [platform, setPlatform] = useState("");
  const [city, setCity] = useState("");
  const [hours, setHours] = useState("8");

  const sendOtp = () => {
    if (phone.length >= 10) setOtpSent(true);
  };

  const verifyOtp = () => {
    if (otp.length === 4) setOnboardingStep(1);
  };

  const finishProfile = () => {
    if (platform && city) {
      setUser({ phone, platform, city, hoursPerDay: parseInt(hours) || 8 });
      setOnboardingStep(2);
    }
  };

  const startApp = () => completeOnboarding();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Shield className="text-primary" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">GigSuraksha AI</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-Powered Income Protection</p>
      </div>

      <div className="flex-1 px-6 pb-8">
        {onboardingStep === 0 && (
          <div className="animate-slide-up space-y-5">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone size={20} className="text-primary" />
                <span className="font-semibold text-foreground">Mobile Login</span>
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-wider"
              />
              {!otpSent ? (
                <button
                  onClick={sendOtp}
                  disabled={phone.length < 10}
                  className="w-full mt-3 py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
                >
                  Send OTP
                </button>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="text-xs text-success font-medium">✓ OTP sent to +91-{phone}</p>
                  <input
                    type="tel"
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xl tracking-[0.5em] text-center"
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={otp.length < 4}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
                  >
                    Verify & Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {onboardingStep === 1 && (
          <div className="animate-slide-up space-y-4">
            <h2 className="text-lg font-bold text-foreground">Setup Your Profile</h2>

            <div className="bg-card rounded-xl p-4 border border-border space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Delivery Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Blinkit", "Zepto", "Swiggy", "Zomato"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                        platform === p
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your City</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CITIES).map(([key, c]) => (
                    <button
                      key={key}
                      onClick={() => setCity(key)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        city === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-foreground"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Avg. Daily Hours</label>
                <input
                  type="number"
                  min="2"
                  max="16"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              onClick={finishProfile}
              disabled={!platform || !city}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="animate-slide-up flex flex-col items-center text-center space-y-6 pt-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="text-success" size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">You're All Set!</h2>
              <p className="text-sm text-muted-foreground mt-2">
                AI is now scanning weather, AQI & risk data for your city to generate your personalized insurance plan.
              </p>
            </div>
            <button
              onClick={startApp}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-lg"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 pb-8">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s === onboardingStep ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
