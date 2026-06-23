import { UserPlus } from "lucide-react";
import { userRegistrations } from "../data/eventFeedData";

export function UserRegistrations() {
  return (
    <div className="clay p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">User Registrations</h2>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <UserPlus className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {userRegistrations.map((reg) => (
          <div key={reg.userId} className="clay-inset flex items-center justify-between rounded-xl p-4">
            <div className="flex-1">
              <p className="font-semibold">{reg.email}</p>
              <p className="text-xs text-muted-foreground">
                ID: {reg.userId} • Source: {reg.source}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{reg.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
