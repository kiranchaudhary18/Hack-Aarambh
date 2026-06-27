import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Shield, Mail, Bell, Check, ExternalLink } from "lucide-react";
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
  metadata?: any;
}

export function NotificationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notification, isLoading } = useQuery({
    queryKey: ["notification", id],
    queryFn: async () => {
      const notifications = await api.getNotifications();
      return notifications.find((n: Notification) => n.id === id);
    },
    enabled: !!id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => api.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  useEffect(() => {
    if (notification && !notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
  }, [notification]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "scam_alert":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "security_alert":
        return <Shield className="h-6 w-6 text-orange-500" />;
      case "pattern_update":
        return <Mail className="h-6 w-6 text-blue-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "scam_alert":
        return "var(--clay-pink)";
      case "security_alert":
        return "var(--clay-orange)";
      case "pattern_update":
        return "var(--clay-blue)";
      default:
        return "var(--clay-purple)";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  useEffect(() => {
    document.title = "Notification — ScamSniff";
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-screen overflow-hidden">
        <ClayBlobs />
        <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
          <Sidebar />
          <main className="hide-scrollbar min-w-0 flex-1 flex items-center justify-center overflow-y-auto pr-2 pb-6">
            <p className="text-muted-foreground">Loading notification...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="relative h-screen overflow-hidden">
        <ClayBlobs />
        <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
          <Sidebar />
          <main className="hide-scrollbar min-w-0 flex-1 flex items-center justify-center overflow-y-auto pr-2 pb-6">
            <div className="p-12 text-center">
              <Bell className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-lg font-semibold text-muted-foreground">Notification not found</p>
              <Link
                to="/notifications"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to notifications
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <div className="mb-6">
              <Link
                to="/notifications"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to notifications
              </Link>
            </div>

            <div className="clay p-8">
              <div className="flex gap-6">
                <div
                  className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
                  style={{ background: getNotificationColor(notification.type) }}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="font-display text-2xl font-bold">{notification.title}</h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {notification.read && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <Check className="h-3 w-3" /> Read
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/30">
                <p className="text-base leading-relaxed">{notification.message}</p>
              </div>

              {notification.data && (
                <div className="mt-6 p-4 rounded-2xl bg-background/50 border border-border/30">
                  <h3 className="text-sm font-semibold mb-3">Additional Details</h3>
                  <div className="space-y-2 text-sm">
                    {notification.data.url && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">URL:</span>
                        <a
                          href={notification.data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {notification.data.url} <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {notification.data.riskScore !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Risk Score:</span>
                        <span className="font-semibold">{notification.data.riskScore}/100</span>
                      </div>
                    )}
                    {notification.data.scanId && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Scan ID:</span>
                        <span className="font-mono text-xs">{notification.data.scanId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {notification.metadata?.priority && (
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      notification.metadata.priority === "high"
                        ? "bg-red-500/10 text-red-600"
                        : notification.metadata.priority === "medium"
                        ? "bg-orange-500/10 text-orange-600"
                        : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    Priority: {notification.metadata.priority}
                  </span>
                </div>
              )}
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
