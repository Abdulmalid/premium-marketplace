import { useEffect, useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "inquiry" | "status_change" | "message" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

/**
 * Hook for real-time notifications
 * In a real app, this would connect to Supabase real-time subscriptions
 */
export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: ["inquiry", "status_change", "message"][Math.floor(Math.random() * 3)] as any,
          title: "New Activity",
          message: "You have a new update",
          timestamp: new Date(),
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };
};

/**
 * Hook for listening to specific entity changes (listings, inquiries, etc.)
 */
export const useEntitySubscription = (
  entityType: "listings" | "inquiries" | "activity",
  onUpdate?: (data: any) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // In a real app, this would set up Supabase real-time subscription
    // For now, simulate connection
    setIsConnected(true);

    // Simulate updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mockData = {
          id: `${entityType}-${Date.now()}`,
          type: entityType,
          timestamp: new Date(),
        };
        setLastUpdate(new Date());
        onUpdate?.(mockData);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [entityType, onUpdate]);

  return { isConnected, lastUpdate };
};

/**
 * Hook for inquiry status updates
 */
export const useInquiryStatusUpdates = (inquiryId: string) => {
  const [status, setStatus] = useState<string | null>(null);
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);

  useEffect(() => {
    // In a real app, this would subscribe to inquiry status changes
    // For now, simulate status changes
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const statuses = ["new", "contacted", "viewing_scheduled", "negotiating", "closed_won"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        setStatus(newStatus);
        setLastStatusChange(new Date());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [inquiryId]);

  return { status, lastStatusChange };
};

/**
 * Hook for view count tracking
 */
export const useViewTracking = (listingId: string) => {
  const [viewCount, setViewCount] = useState(0);
  const [todayViews, setTodayViews] = useState(0);

  useEffect(() => {
    // In a real app, this would track views via backend
    // For now, simulate view tracking
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setViewCount((prev) => prev + 1);
        setTodayViews((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [listingId]);

  return { viewCount, todayViews };
};

/**
 * Hook for inquiry conversion tracking
 */
export const useConversionTracking = () => {
  const [conversions, setConversions] = useState({
    totalInquiries: 0,
    viewedListings: 0,
    contactedCustomers: 0,
    scheduledViewings: 0,
    closedDeals: 0,
  });

  const calculateConversionRate = (stage: keyof typeof conversions) => {
    const total = conversions.totalInquiries;
    if (total === 0) return 0;
    return ((conversions[stage] / total) * 100).toFixed(1);
  };

  return {
    conversions,
    calculateConversionRate,
  };
};
