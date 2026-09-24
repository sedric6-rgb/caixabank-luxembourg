import { loadAdminClients } from "@/lib/admin-view";
import { INSURANCES } from "@/lib/insurances-store";
import AssurancesClient from "./AssurancesClient";

export const dynamic = "force-dynamic";

export default async function AdminAssurancesPage() {
  const clients = await loadAdminClients();
  return <AssurancesClient clients={clients} initialInsurances={structuredClone(INSURANCES)} />;
}
