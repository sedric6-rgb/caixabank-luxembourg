import { loadAdminClients } from "@/lib/admin-view";
import CartesClient from "./CartesClient";

export const dynamic = "force-dynamic";

export default async function AdminCartesPage() {
  return <CartesClient clients={await loadAdminClients()} />;
}
