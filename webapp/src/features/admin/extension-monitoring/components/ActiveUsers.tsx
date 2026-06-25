import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function ActiveUsers() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/extension/metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setExtensionData(data);
        } else {
          setExtensionData(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading user data..." />;

  const activeUsers = extensionData?.users || { dau: 0, dauChange: "0%", wau: 0, wauChange: "0%", mau: 0, mauChange: "0%" };
  const stats = [
    { label: "DAU", value: activeUsers.dau.toLocaleString(), change: activeUsers.dauChange },
    { label: "WAU", value: activeUsers.wau.toLocaleString(), change: activeUsers.wauChange },
    { label: "MAU", value: activeUsers.mau.toLocaleString(), change: activeUsers.mauChange },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Users
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <Users className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                stat.change.startsWith("+") ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
