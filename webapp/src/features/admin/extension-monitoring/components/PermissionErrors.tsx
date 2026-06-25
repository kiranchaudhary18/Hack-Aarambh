import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { api } from "@/shared/lib/api";
import { LoadingState } from "@/shared/components/LoadingState";

export function PermissionErrors() {
  const [extensionData, setExtensionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getExtensionUsage();
        setExtensionData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState message="Loading permission errors..." />;

  const permissionErrors = extensionData?.permissionErrors || [];

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
