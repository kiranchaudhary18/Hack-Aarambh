import { useState, useEffect, forwardRef } from "react";
import { Bell } from "lucide-react";
import { api } from "@/shared/lib/api";
import { useQuery } from "@tanstack/react-query";
import { wsClient, eventEmitter } from "@/shared/lib/websocket";

interface NotificationBellProps {
  onOpenDropdown?: () => void;
}

export const NotificationBell = forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ onOpenDropdown }, ref) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const { data: countData } = useQuery({
      queryKey: ["unread-count"],
      queryFn: () => api.getUnreadCount(),
      refetchInterval: 30000, // Refetch every 30 seconds
    });

    useEffect(() => {
      if (countData?.count !== undefined) {
        setUnreadCount(countData.count);
      }
    }, [countData]);

    useEffect(() => {
      // Connect to WebSocket when component mounts
      const token = localStorage.getItem("token");
      if (token) {
        wsClient.connect(token);
      }

      // Listen for real-time unread count updates
      const handleUnreadCountUpdate = (data: { count: number }) => {
        setUnreadCount(data.count);
      };

      // Listen for new notifications
      const handleNewNotification = (notification: any) => {
        setUnreadCount((prev) => prev + 1);
      };

      eventEmitter.on("notifications:unread-count", handleUnreadCountUpdate);
      eventEmitter.on("notification:new", handleNewNotification);

      return () => {
        eventEmitter.off("notifications:unread-count", handleUnreadCountUpdate);
        eventEmitter.off("notification:new", handleNewNotification);
        wsClient.disconnect();
      };
    }, []);

    return (
      <button
        ref={ref}
        onClick={onOpenDropdown}
        className="relative grid h-10 w-10 place-items-center rounded-full clay-inset hover:scale-105 transition-transform"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  },
);
NotificationBell.displayName = "NotificationBell";
