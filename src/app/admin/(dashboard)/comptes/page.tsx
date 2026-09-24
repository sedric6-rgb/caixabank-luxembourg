import { loadAdminClients } from "@/lib/admin-view";
import ComptesClient from "./ComptesClient";

export const dynamic = "force-dynamic";

export default async function AdminComptesPage() {
  return <ComptesClient clients={await loadAdminClients()} />;
}
