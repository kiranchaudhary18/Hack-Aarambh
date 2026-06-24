import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function TrainingDataDrift() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAIHealth();
        setHealthData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading data drift metrics..." />;

  const dataDriftMetrics = healthData?.dataDrift || [
    { feature: "Job Title", driftScore: 0, status: "normal" },
    { feature: "Company Name", driftScore: 0, status: "normal" },
    { feature: "Description Length", driftScore: 0, status: "normal" },
    { feature: "Salary Range", driftScore: 0, status: "normal" },
  ];

  return (
    <div className="clay p-6">
      <h2 className="font-display text-2xl font-bold">Training Data Drift</h2>
      <p className="text-sm text-muted-foreground">Feature distribution changes over time</p>
      <div className="mt-4 space-y-3">
        {dataDriftMetrics.map((metric: any) => {
          const Icon =
            metric.status === "normal"
              ? CheckCircle
              : metric.status === "warning"
              ? AlertTriangle
              : XCircle;
          const color =
            metric.status === "normal"
              ? "text-green-500"
              : metric.status === "warning"
              ? "text-yellow-500"
              : "text-red-500";
          return (
            <div
              key={metric.feature}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${color}`} />
                <p className="font-semibold">{metric.feature}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold">{metric.driftScore.toFixed(2)}</p>
                <p className={`text-xs font-medium ${color}`}>{metric.status}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
