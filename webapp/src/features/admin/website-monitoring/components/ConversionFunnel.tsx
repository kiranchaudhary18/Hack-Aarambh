import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function ConversionFunnel() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteTraffic();
        setWebsiteData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading conversion funnel..." />;

  const conversionFunnelData = websiteData?.conversionFunnel || [
    { stage: "Page View", count: 0, percentage: 0 },
    { stage: "Sign Up", count: 0, percentage: 0 },
    { stage: "Onboarding", count: 0, percentage: 0 },
    { stage: "Active User", count: 0, percentage: 0 },
  ];

  const maxCount = Math.max(...conversionFunnelData.map((d: any) => d.count));

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-yellow)" }}>
          <Filter className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">Conversion Funnel</h2>
          <p className="text-sm text-muted-foreground">User journey through key stages</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {conversionFunnelData.map((stage: any, index: number) => {
          const width = (stage.count / maxCount) * 100;
          const colors = ["var(--clay-purple)", "var(--clay-pink)", "var(--clay-blue)", "var(--clay-green)"];
          return (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{stage.stage}</span>
                <span className="text-muted-foreground">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
              </div>
              <div className="clay-inset h-8 overflow-hidden rounded-lg">
                <div
                  className="flex h-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-all"
                  style={{ width: `${width}%`, background: colors[index] }}
                >
                  {stage.percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
