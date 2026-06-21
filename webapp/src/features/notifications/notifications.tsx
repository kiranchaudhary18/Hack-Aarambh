import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, AlertTriangle, Shield, Mail, Trash2, Filter } from "lucide-react";
import { api } from "@/shared/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { Sidebar } from "@/layouts/Sidebar";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export function Notifications() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: () => api.getNotifications(filter === "unread"),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => api.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      toast.success("All notifications marked as read");
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "scam_alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "security_alert":
        return <Shield className="h-5 w-5 text-orange-500" />;
      case "pattern_update":
        return <Mail className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications?.filter((n: Notification) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  }) || [];

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length || 0;

  useEffect(() => {
    document.title = "Notifications — ScamSniff";
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <p className="clay-pill inline-block">Notifications</p>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Your notifications</h1>
            <p className="mt-2 text-muted-foreground">
              Stay updated with your scam alerts and security notifications
            </p>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="clay p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      filter === "all" ? "clay-primary" : "clay-btn"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      filter === "unread" ? "clay-primary" : "clay-btn"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter("read")}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      filter === "read" ? "clay-primary" : "clay-btn"
                    }`}
                  >
                    Read
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold clay-btn"
                  >
                    <Check className="h-4 w-4" /> Mark all as read
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="mx-auto h-16 w-16 text-muted-foreground/30" />
                  <p className="mt-4 text-lg font-semibold text-muted-foreground">No notifications</p>
                  <p className="mt-2 text-sm text-muted-foreground/70">
                    {filter === "unread" ? "You're all caught up!" : "No notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification: Notification) => (
                    <Link
                      key={notification.id}
                      to={`/notifications/${notification.id}`}
                      className={`block p-4 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer ${
                        !notification.read
                          ? "bg-primary/5 border-primary/20"
                          : "bg-background/50 border-border/30"
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full clay-inset">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-1">{notification.title}</h3>
                            {!notification.read && (
                              <span className="grid h-2 w-2 shrink-0 place-items-center rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center gap-4">
                            <p className="text-xs text-muted-foreground/70">
                              {formatTime(notification.createdAt)}
                            </p>
                            {notification.data?.url && (
                              <Link
                                to={notification.data.url}
                                className="text-xs font-semibold text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Details
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
