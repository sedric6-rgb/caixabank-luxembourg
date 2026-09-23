import { DEMO_CLIENTS } from "@/lib/demo-data";
import { getAllAdminNotifications } from "@/lib/notifications-store";
import AdminNotificationsClient from "./admin-notifications-client";

export default function AdminNotificationsPage() {
  const notifications = getAllAdminNotifications();
  const clients = DEMO_CLIENTS.filter((c) => c.status === "actif").map((c) => ({
    id: c.id,
    name: `${c.first_name} ${c.last_name}`,
    clientNumber: c.client_number,
  }));

  return <AdminNotificationsClient sentNotifications={notifications} clients={clients} />;
}
