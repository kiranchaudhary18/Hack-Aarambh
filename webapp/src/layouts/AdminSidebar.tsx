import { Link, useLocation } from "react-router-dom";
import { Gauge, Flag, BarChart3, ArrowLeft, Activity, Cpu, Server, Puzzle, Wifi, Users, Settings, AlertTriangle, ChevronDown, ChevronRight, Activity as TrafficIcon, AlertTriangle as ErrorIcon, Zap, Target, HeartPulse, Download, TrendingUp, Clock, Database, Bell, Shield, Key, History, AlertCircle, FileText } from "lucide-react";
import { useState, useEffect } from "react";

const items = [
  { to: "/admin", label: "Overview", icon: Gauge },
  { 
    label: "Website Event", 
    icon: Activity,
    subItems: [
      { to: "/admin/website-monitoring/traffic", label: "Traffic & Behavior", icon: TrafficIcon },
      { to: "/admin/website-monitoring/errors", label: "Error Monitoring", icon: ErrorIcon },
      { to: "/admin/website-monitoring/performance", label: "Performance", icon: Zap },
    ]
  },
  { 
    label: "AI Model Event", 
    icon: Cpu,
    subItems: [
      { to: "/admin/ai-model-monitoring/accuracy", label: "Accuracy", icon: Target },
      { to: "/admin/ai-model-monitoring/performance", label: "Performance", icon: Zap },
      { to: "/admin/ai-model-monitoring/resources", label: "Resources", icon: Cpu },
      { to: "/admin/ai-model-monitoring/health", label: "Health", icon: HeartPulse },
    ]
  },
  { 
    label: "Server Event", 
    icon: Server,
    subItems: [
      { to: "/admin/server-monitoring/resources", label: "Resources", icon: Cpu },
      { to: "/admin/server-monitoring/api", label: "API Performance", icon: Zap },
      { to: "/admin/server-monitoring/database", label: "Database", icon: Database },
      { to: "/admin/server-monitoring/uptime", label: "Uptime", icon: Clock },
    ]
  },
  { 
    label: "Extension Event", 
    icon: Puzzle,
    subItems: [
      { to: "/admin/extension-monitoring/installation", label: "Installation", icon: Download },
      { to: "/admin/extension-monitoring/usage", label: "Usage", icon: Users },
      { to: "/admin/extension-monitoring/retention", label: "Retention", icon: TrendingUp },
      { to: "/admin/extension-monitoring/errors", label: "Errors", icon: ErrorIcon },
      { to: "/admin/extension-monitoring/performance", label: "Performance", icon: Zap },
    ]
  },
  { 
    label: "Live Event", 
    icon: Wifi,
    subItems: [
      { to: "/admin/real-time-monitoring/events", label: "Live Events", icon: Activity },
      { to: "/admin/real-time-monitoring/alerts", label: "Alerts", icon: AlertTriangle },
      { to: "/admin/real-time-monitoring/websocket", label: "WebSocket", icon: Wifi },
    ]
  },
  { 
    label: "Alerts & Incidents", 
    icon: AlertTriangle,
    subItems: [
      { to: "/admin/alerts-incidents/history", label: "Alert History", icon: History },
      { to: "/admin/alerts-incidents/incidents", label: "Incidents", icon: AlertCircle },
      { to: "/admin/alerts-incidents/configuration", label: "Configuration", icon: Settings },
    ]
  },
  { 
    label: "User Management", 
    icon: Users,
    subItems: [
      { to: "/admin/user-management/users", label: "Users", icon: Users },
      { to: "/admin/user-management/roles", label: "Roles", icon: Shield },
      { to: "/admin/user-management/permissions", label: "Permissions", icon: Key },
    ]
  },
  {
    label: "System Settings",
    icon: Settings,
    subItems: [
      { to: "/admin/system-settings/general", label: "General", icon: Settings },
      { to: "/admin/system-settings/integrations", label: "Integrations", icon: Database },
      { to: "/admin/system-settings/notifications", label: "Notifications", icon: Bell },
      { to: "/admin/system-settings/security", label: "Security", icon: Shield },
    ]
  },
  { to: "/admin/pending-reports", label: "Pending Reports", icon: FileText },
  { to: "/admin/flagged", label: "Flagged Cases", icon: Flag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();
  const path = location.pathname;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const path = location.pathname;
    const newExpanded = new Set<string>();

    items.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((sub: any) => path === sub.to);
        if (hasActiveSubItem) {
          newExpanded.add(item.label);
        }
      }
    });

    setExpandedItems(newExpanded);
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const isItemActive = (item: any) => {
    if (item.to) return path === item.to;
    if (item.subItems) {
      return item.subItems.some((sub: any) => path === sub.to);
    }
    return false;
  };

  const isSubItemActive = (subItem: any) => path === subItem;

  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="clay flex h-full flex-col gap-2 p-5">
        <Link to="/" className="mb-4 flex items-center gap-2 px-2">
          <span className="grid h-10 w-10 place-items-center">
            <img src="/favicon.ico" alt="ScamSniff" className="h-10 w-10" />
          </span>
          <div>
            <p className="font-display text-lg font-bold leading-tight">ScamSniff</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Admin
            </p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const Icon = it.icon;
            const hasSubItems = it.subItems && it.subItems.length > 0;
            const isExpanded = expandedItems.has(it.label);
            const isActive = isItemActive(it);

            if (hasSubItems) {
              return (
                <div key={it.label}>
                  <button
                    onClick={() => toggleExpand(it.label)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "clay-primary"
                        : "text-muted-foreground hover:text-foreground hover:clay-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                      {it.label}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {it.subItems.map((sub: any) => {
                        const SubIcon = sub.icon;
                        const isSubActive = isSubItemActive(sub.to);
                        return (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium transition ${
                              isSubActive
                                ? "clay-primary"
                                : "text-muted-foreground hover:text-foreground hover:clay-sm"
                            }`}
                          >
                            <SubIcon className="h-4 w-4" strokeWidth={2.2} />
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={it.to}
                to={it.to!}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "clay-primary"
                    : "text-muted-foreground hover:text-foreground hover:clay-sm"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
