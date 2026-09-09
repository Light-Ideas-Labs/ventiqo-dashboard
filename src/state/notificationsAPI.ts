import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export interface AppNotification {
  _id: string;
  title: string;
  text: string;
  type: string;
  link?: string | null;
  priority: number;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
}

interface GetAllNotificationsResponse {
  success: boolean;
  data: {
    data: AppNotification[];
    _meta: { total: number; totalPages: number; currentPage: number };
  };
}

interface UnreadCountResponse {
  success: boolean;
  count: number;
}

// ── Query keys ──────────────────────────────────────────────────────────
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (limit = 10) => [...notificationKeys.all, "list", limit] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const getNotifications = (limit = 10) =>
  apiFetch<GetAllNotificationsResponse>(`/notifications/all?limit=${limit}`);

export const getUnreadNotificationsCount = () =>
  apiFetch<UnreadCountResponse>("/notifications/unread-count");

export const markNotificationAsRead = (id: string) =>
  apiFetch<any>("/notifications/mark/read", { method: "POST", body: { id } });

export const markAllNotificationsAsRead = () =>
  apiFetch<any>("/notifications/mark/read/all", { method: "POST" });

export const deleteNotification = (id: string) =>
  apiFetch<any>("/notifications/delete", { method: "POST", body: { id } });

export const deleteAllNotifications = () =>
  apiFetch<any>("/notifications/delete/all", { method: "POST" });

// ── Query hooks ─────────────────────────────────────────────────────────
export const useNotifications = (limit = 10) =>
  useQuery({
    queryKey: notificationKeys.list(limit),
    queryFn: () => getNotifications(limit),
  });

export const useUnreadNotificationsCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationsCount,
    // Cheap enough to poll so the bell badge stays current without a socket subscription.
    refetchInterval: 60_000,
  });

// ── Mutation hooks ──────────────────────────────────────────────────────
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.all, "list"] });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.all, "list"] });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.all, "list"] });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...notificationKeys.all, "list"] });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
};
