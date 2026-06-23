import { useState, useEffect } from "react";
import { Route, Footprints, ArrowRight } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function UserJourney() {
  const [websiteData, setWebsiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getWebsiteMetrics();
        setWebsiteData(data);
      } catch (err) {
        setError("Failed to load user journey data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading user journey..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const userJourneyData = websiteData?.userJourney || [
    { users: 4520, completionRate: 85, path: ["home", "scams", "report"] },
    { users: 2840, completionRate: 72, path: ["home", "about", "contact"] },
    { users: 1820, completionRate: 65, path: ["scams", "details", "report"] },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-blue)" }}>
          <Route className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold">User Journey</h2>
          <p className="text-sm text-muted-foreground">Common user paths through the app</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {userJourneyData.map((journey: any, index: number) => (
          <div key={index} className="clay-inset p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Footprints className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">{journey.users.toLocaleString()} users</span>
              </div>
              <span className="clay-pill text-xs" style={{ background: "var(--clay-green)" }}>
                {journey.completionRate}% completion
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {journey.path.map((page, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="clay-sm px-3 py-1 text-sm font-medium">/{page}</span>
                  {i < journey.path.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
