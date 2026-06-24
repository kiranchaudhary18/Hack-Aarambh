import { useState, useEffect } from "react";
import { Globe, MapPin } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function GeoDistribution() {
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

  if (loading) return <LoadingState message="Loading geo distribution..." />;

  const geoData = websiteData?.geoDistribution || [
    { country: "Pakistan", users: 0, percentage: 0, flag: "🇵🇰" },
    { country: "India", users: 0, percentage: 0, flag: "🇮🇳" },
    { country: "Nigeria", users: 0, percentage: 0, flag: "🇳🇬" },
    { country: "Philippines", users: 0, percentage: 0, flag: "🇵🇭" },
    { country: "United States", users: 0, percentage: 0, flag: "🇺🇸" },
    { country: "United Kingdom", users: 0, percentage: 0, flag: "🇬🇧" },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--clay-green)" }}>
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">Geographic Distribution</h2>
            <p className="text-sm text-muted-foreground">Users by country</p>
          </div>
        </div>
        <MapPin className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-4 space-y-3">
        {geoData.map((item: any) => (
          <div key={item.country} className="flex items-center gap-4">
            <span className="text-2xl">{item.flag}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{item.country}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
              </div>
              <div className="clay-inset mt-1 h-2 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.percentage}%`, background: "var(--clay-green)" }}
                />
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{item.users.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
