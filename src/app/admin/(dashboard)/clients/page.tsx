import { BANK_CLIENTS } from "@/lib/client-data";
import { readState } from "@/lib/state";
import ClientsTable from "./ClientsTable";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await readState();
  const clients = BANK_CLIENTS.map((c) => ({
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
