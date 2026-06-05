import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import {
  Search,
  FileText,
  ChevronDown,
  Filter,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  User,
  Shield,
  Database,
} from "lucide-react";

interface LogData {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  category: string;
  message: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  details?: string;
}

export function Logs() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null);

  useEffect(() => {
    document.title = "System Logs — ScamSniff";
  }, []);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const mockLogs: LogData[] = [
          {
            id: "1",
            timestamp: "2024-06-05 14:32:15",
            level: "error",
            category: "Authentication",
            message: "Failed login attempt - invalid credentials",
            userId: "user_123",
            userEmail: "unknown@example.com",
            ip: "192.168.1.100",
            details: "Multiple failed attempts from same IP",
          },
          {
            id: "2",
            timestamp: "2024-06-05 14:28:42",
            level: "warning",
            category: "API",
            message: "Rate limit exceeded for user",
            userId: "user_456",
            userEmail: "john@example.com",
            ip: "10.0.0.50",
            details: "User exceeded 100 requests per minute",
          },
          {
            id: "3",
            timestamp: "2024-06-05 14:25:18",
            level: "success",
            category: "System",
            message: "Database backup completed successfully",
            details: "Backup size: 2.3GB, Duration: 45s",
          },
          {
            id: "4",
            timestamp: "2024-06-05 14:22:05",
            level: "info",
            category: "User",
            message: "New user registration",
            userId: "user_789",
            userEmail: "newuser@example.com",
            ip: "172.16.0.25",
          },
          {
            id: "5",
            timestamp: "2024-06-05 14:18:33",
            level: "error",
            category: "Scanning",
            message: "ML model inference failed",
            details: "Model timeout after 30s for scan ID: scan_abc123",
          },
          {
            id: "6",
            timestamp: "2024-06-05 14:15:21",
            level: "warning",
            category: "Payment",
            message: "Payment processing delayed",
            userId: "user_321",
            userEmail: "customer@example.com",
            details: "Payment gateway response timeout",
          },
          {
            id: "7",
            timestamp: "2024-06-05 14:12:09",
            level: "info",
            category: "System",
            message: "Scheduled maintenance started",
            details: "Routine server maintenance",
          },
          {
            id: "8",
            timestamp: "2024-06-05 14:08:45",
            level: "success",
            category: "Authentication",
            message: "User login successful",
            userId: "user_654",
            userEmail: "admin@scamsniff.com",
            ip: "192.168.1.1",
          },
          {
            id: "9",
            timestamp: "2024-06-05 14:05:32",
            level: "error",
            category: "Database",
            message: "Connection pool exhausted",
            details: "Max connections reached, consider increasing pool size",
          },
          {
            id: "10",
            timestamp: "2024-06-05 14:02:18",
            level: "info",
            category: "API",
            message: "Pattern updated",
            details: "Pattern 'Crypto Wallet Activation' updated by admin",
          },
        ];
        setLogs(mockLogs);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const categories = [...new Set(logs.map((l) => l.category))];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle2;
      default:
        return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "var(--clay-pink)";
      case "warning":
        return "var(--clay-yellow)";
      case "success":
        return "var(--clay-green)";
      default:
        return "var(--clay-blue)";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication":
        return Shield;
      case "User":
        return User;
      case "Database":
        return Database;
      case "System":
        return Server;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">System Logs</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor system events, errors, and activities in real-time.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="clay p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search logs by message, details, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
                  showFilters ? "is-on" : ""
                }`}
              >
                <Filter className="h-4 w-4" /> Filters
                <ChevronDown
                  className={`h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
              <button className="clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border-2 border-dashed p-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Level
                </label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All levels</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {filteredLogs.map((log) => {
              const LevelIcon = getLevelIcon(log.level);
              const CategoryIcon = getCategoryIcon(log.category);
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="clay-sm flex cursor-pointer items-start gap-4 p-4 transition hover:-translate-y-0.5"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{ background: getLevelColor(log.level) }}
                  >
                    <LevelIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="clay-pill text-[10px] uppercase">{log.level}</span>
                      <span className="text-xs text-muted-foreground">{log.category}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {log.timestamp}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{log.message}</p>
                    {log.userEmail && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        User: {log.userEmail}
                      </p>
                    )}
                    {log.ip && (
                      <p className="mt-1 text-xs text-muted-foreground">IP: {log.ip}</p>
                    )}
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg clay-inset">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  </span>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm font-semibold">No logs found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </FadeIn>

      {selectedLog && (
        <FadeIn>
          <div className="clay p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="clay-btn px-3 py-1.5 text-xs font-semibold"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm font-semibold">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <span
                    className="clay-pill inline-block text-[10px] uppercase"
                    style={{ background: getLevelColor(selectedLog.level) }}
                  >
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold">{selectedLog.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Log ID</p>
                  <p className="text-sm font-mono text-xs">{selectedLog.id}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Message</p>
                <p className="mt-1 text-sm">{selectedLog.message}</p>
              </div>
              {selectedLog.details && (
                <div>
                  <p className="text-xs text-muted-foreground">Details</p>
                  <div className="mt-1 clay-inset p-3 text-sm font-mono">
                    {selectedLog.details}
                  </div>
                </div>
              )}
              {selectedLog.userId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-sm font-mono text-xs">{selectedLog.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User Email</p>
                    <p className="text-sm">{selectedLog.userEmail}</p>
                  </div>
                </div>
              )}
              {selectedLog.ip && (
                <div>
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p className="text-sm font-mono">{selectedLog.ip}</p>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
