import { DEMO_CLIENTS } from "@/lib/demo-data";
import { syncClientStatuses } from "@/lib/client-status";
import ClientsTable from "./ClientsTable";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await syncClientStatuses();
  const clients = DEMO_CLIENTS.map((c) => ({
    id: c.id,
    client_number: c.client_number,
    first_name: c.first_name,
    last_name: c.last_name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    created_at: c.created_at,
  }));
  return <ClientsTable allClients={clients} />;
}
