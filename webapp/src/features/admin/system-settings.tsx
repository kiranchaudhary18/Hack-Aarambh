import { useEffect, useState } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Settings, Save, ShieldAlert, Key, Mail, Sliders } from "lucide-react";

export function SystemSettings() {
  useEffect(() => {
    document.title = "System Settings — ScamSniff";
  }, []);

  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [threshold, setThreshold] = useState("80");
  const [modelType, setModelType] = useState("roberta-v3-large");

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin / Platform</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">System Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage system-wide environment flags, SMTP mail relays, AI classification criteria, and keys.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="clay p-6 space-y-6">
          {/* AI Model Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="h-5 w-5 text-[color:var(--primary)]" />
              <h2 className="font-display text-lg font-bold">Scam Sniffer AI Tuning</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">Active Model Version</label>
                <select 
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="clay-inset w-full px-3 py-2.5 text-sm"
                >
                  <option value="roberta-v3-large">RoBERTa v3 Large (Active)</option>
                  <option value="gemini-flash">Gemini 2.5 Flash</option>
                  <option value="hybrid-ensemble">Hybrid Ensemble (Regex + BERT)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">Flagging Confidence Threshold (%)</label>
                <input 
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="clay-inset w-full px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* SMTP Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-[color:var(--primary)]" />
              <h2 className="font-display text-lg font-bold">SMTP Configuration</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">SMTP Outbound Host</label>
                <input 
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="clay-inset w-full px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">SMTP Port</label>
                <input 
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="clay-inset w-full px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Security & 2FA */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-[color:var(--primary)]" />
              <h2 className="font-display text-lg font-bold">Access Controls & Security</h2>
            </div>
            <div className="flex items-center justify-between p-3 clay-inset rounded-2xl">
              <div>
                <p className="text-sm font-semibold">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-muted-foreground">Require all users to configure Authenticator TOTP codes</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[color:var(--primary)]" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => alert("Settings saved successfully!")}
              className="clay-primary flex items-center gap-2 px-6 py-3 font-semibold transition hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" /> Save System Settings
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
