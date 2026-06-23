import { ShieldAlert } from "lucide-react";
import { permissionErrors } from "../data/errorData";

export function PermissionErrors() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Permission Errors</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-500/20">
          <ShieldAlert className="h-5 w-5 text-yellow-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {permissionErrors.map((error) => (
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
