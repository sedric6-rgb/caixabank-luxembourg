export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: "info" | "alerte" | "promotion";
  targetClientIds: number[] | "all";
  createdAt: string;
}

let nextNotifId = 50000;

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [];

export function createAdminNotification(data: {
  title: string;
  message: string;
  type: "info" | "alerte" | "promotion";
  targetClientIds: number[] | "all";
}): AdminNotification {
  const now = new Date().toISOString().split("T")[0];
  const notif: AdminNotification = {
    id: nextNotifId++,
    title: data.title,
    message: data.message,
    type: data.type,
    targetClientIds: data.targetClientIds,
    createdAt: now,
  };
  ADMIN_NOTIFICATIONS.push(notif);
  return notif;
}

export function getNotificationsForClient(clientId: number): AdminNotification[] {
  return ADMIN_NOTIFICATIONS.filter(
    (n) => n.targetClientIds === "all" || n.targetClientIds.includes(clientId)
  ).sort((a, b) => b.id - a.id);
}

export function getAllAdminNotifications(): AdminNotification[] {
  return [...ADMIN_NOTIFICATIONS].sort((a, b) => b.id - a.id);
}
