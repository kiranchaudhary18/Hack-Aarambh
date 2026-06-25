import { useState, useEffect } from "react";
import { Settings, Mail, MessageSquare, Smartphone, Webhook, ToggleRight, ToggleLeft } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function AlertConfiguration() {
  const [alertData, setAlertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAdminStats();
        setAlertData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading alert configuration..." />;

  const alertRules = alertData?.rules || [];

  const alertChannels = alertData?.channels || [];

  return (
    <div className="space-y-6">
      <div className="clay p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Alert Rules</h2>
        </div>
        <div className="mt-4 space-y-3">
          {alertRules.map((rule: any) => (
            <div key={rule.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/20 text-purple-500">
                  <Settings className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rule.metric} {rule.condition} {rule.threshold}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      rule.severity === "critical"
                        ? "bg-red-500/20 text-red-500"
                        : rule.severity === "high"
                        ? "bg-orange-500/20 text-orange-500"
                        : rule.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Channels</p>
                  <p className="text-xs">{rule.channels.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Status</p>
                  {rule.enabled ? (
                    <ToggleRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="clay p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Alert Channels</h2>
        </div>
        <div className="mt-4 space-y-3">
          {alertChannels.map((channel) => (
            <div key={channel.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${
                    channel.type === "email"
                      ? "bg-blue-500/20 text-blue-500"
                      : channel.type === "slack"
                      ? "bg-purple-500/20 text-purple-500"
                      : channel.type === "sms"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-orange-500/20 text-orange-500"
                  }`}
                >
                  {channel.type === "email" && <Mail className="h-5 w-5" />}
                  {channel.type === "slack" && <MessageSquare className="h-5 w-5" />}
                  {channel.type === "sms" && <Smartphone className="h-5 w-5" />}
                  {channel.type === "webhook" && <Webhook className="h-5 w-5" />}
                </span>
                <div>
                  <p className="font-semibold">{channel.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{channel.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Status</p>
                  {channel.enabled ? (
                    <ToggleRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
