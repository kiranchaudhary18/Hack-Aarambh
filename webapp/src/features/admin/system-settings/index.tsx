import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Settings, Database, Bell, Shield, Globe, Save } from "lucide-react";
import { useLocation } from "react-router-dom";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function SystemSettings() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();
  const [settingsData, setSettingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "System Settings — ScamSniff Admin";
    async function fetchData() {
      try {
        const data = await api.getSettings();
        setSettingsData(data);
      } catch (err) {
        setError("Failed to load settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading settings..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const integrations = settingsData?.integrations || [
    { name: "OpenAI API", status: "Connected", icon: "🤖" },
    { name: "PostgreSQL Database", status: "Connected", icon: "🗄️" },
    { name: "Redis Cache", status: "Connected", icon: "⚡" },
  ];

  const notifications = settingsData?.notifications || [
    { name: "Email Notifications", enabled: true, description: "Receive alerts via email" },
    { name: "Slack Notifications", enabled: false, description: "Receive alerts in Slack" },
  ];

  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes("/general")) return "general";
    if (path.includes("/integrations")) return "integrations";
    if (path.includes("/notifications")) return "notifications";
    if (path.includes("/security")) return "security";
    return "general";
  };

  const activeSection = getActiveSection();

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">System Settings</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Configuration</h1>
        <p className="mt-2 text-muted-foreground">
          Manage system configuration and integrations
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      {activeSection === "general" && (
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">General Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure general system settings
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold">Application Name</label>
              <input
                type="text"
                defaultValue="ScamSniff"
                className="clay-inset mt-2 w-full rounded-xl px-4 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Timezone</label>
              <select className="clay-inset mt-2 w-full rounded-xl px-4 py-2 text-sm outline-none">
                <option>UTC</option>
                <option>UTC+5:30 (India)</option>
                <option>UTC-5 (Eastern)</option>
                <option>UTC-8 (Pacific)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">Default Language</label>
              <select className="clay-inset mt-2 w-full rounded-xl px-4 py-2 text-sm outline-none">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold">Maintenance Mode</label>
                <p className="text-xs text-muted-foreground">Disable access for maintenance</p>
              </div>
              <button className="h-6 w-11 rounded-full bg-muted transition-colors" />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {activeSection === "integrations" && (
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Integrations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure third-party integrations
          </p>
          <div className="mt-6 space-y-4">
            {integrations.map((integration: any) => (
              <div key={integration.name} className="clay-inset flex items-center justify-between rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <p className="font-semibold">{integration.name}</p>
                    <span
                      className={`text-xs font-medium ${
                        integration.status === "Connected"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                  Configure
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "notifications" && (
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Notification Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure notification preferences
          </p>
          <div className="mt-6 space-y-4">
            {notifications.map((notification: any) => (
              <div key={notification.name} className="clay-inset flex items-center justify-between rounded-xl p-4">
                <div>
                  <p className="font-semibold">{notification.name}</p>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                </div>
                <button
                  className={`h-6 w-11 rounded-full transition-colors ${
                    notification.enabled ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "security" && (
        <div className="clay p-6">
          <h2 className="font-display text-2xl font-bold">Security Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure security settings
          </p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold">Session Timeout (minutes)</label>
              <input
                type="number"
                defaultValue="30"
                className="clay-inset mt-2 w-full rounded-xl px-4 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Password Policy</label>
              <select className="clay-inset mt-2 w-full rounded-xl px-4 py-2 text-sm outline-none">
                <option>Standard (8+ characters)</option>
                <option>Strong (12+ characters, special chars)</option>
                <option>Very Strong (16+ characters, 2FA required)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold">Two-Factor Authentication</label>
                <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
              </div>
              <button className="h-6 w-11 rounded-full bg-muted transition-colors" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold">IP Whitelist</label>
                <p className="text-xs text-muted-foreground">Restrict access to specific IPs</p>
              </div>
              <button className="h-6 w-11 rounded-full bg-muted transition-colors" />
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
