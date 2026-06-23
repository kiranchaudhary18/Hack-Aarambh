import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function FeatureUsage() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load feature usage");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading feature usage..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const featureUsage = extensionData?.features || [
    { feature: "Scan Selection", usage: 45200, change: "+12.5%" },
    { feature: "Scan Link", usage: 28450, change: "+8.2%" },
    { feature: "Report Scam", usage: 15200, change: "+15.8%" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Feature Usage</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <Zap className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {featureUsage.map((feature: any) => (
          <div key={feature.feature} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{feature.feature}</p>
              <p className="text-xs text-muted-foreground">{feature.usage.toLocaleString()} uses</p>
            </div>
            <p
              className={`text-sm font-medium ${
                feature.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {feature.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
