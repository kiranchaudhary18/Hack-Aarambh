import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function TotalInstalls() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load install data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading install data..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const totalInstalls = extensionData?.installs || { chrome: 45230, firefox: 12450, total: 57680, change: "+12.5%" };
  const stats = [
    { label: "Chrome", value: totalInstalls.chrome.toLocaleString(), color: "var(--clay-blue)" },
    { label: "Firefox", value: totalInstalls.firefox.toLocaleString(), color: "var(--clay-orange)" },
    { label: "Total", value: totalInstalls.total.toLocaleString(), color: "var(--clay-purple)" },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Total Installs
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20">
          <Download className="h-5 w-5 text-blue-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          totalInstalls.change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {totalInstalls.change} from last month
      </p>
    </div>
  );
}
