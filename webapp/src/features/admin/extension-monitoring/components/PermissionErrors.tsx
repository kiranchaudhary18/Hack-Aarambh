import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";

export function PermissionErrors() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionMetrics();
        setExtensionData(data);
      } catch (err) {
        setError("Failed to load permission error data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading permission errors..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  const permissionErrors = extensionData?.permissionErrors || [
    { permission: "tabs", users: 245, errors: 12 },
    { permission: "storage", users: 85, errors: 5 },
  ];

  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Permission Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <ShieldAlert className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {permissionErrors.map((error: any) => (
          <div key={error.permission} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{error.permission}</p>
              <p className="text-xs text-muted-foreground">{error.users} users affected</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-bold">{error.errors}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
