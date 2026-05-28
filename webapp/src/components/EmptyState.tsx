import { Link } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="clay-lg flex flex-col items-center gap-3 p-12 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl" style={{ background: "var(--clay-blue)" }}>
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="clay-primary mt-3 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
