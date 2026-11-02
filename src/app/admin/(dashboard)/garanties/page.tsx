import { loadAdminClients } from "@/lib/admin-view";
import { GUARANTEES } from "@/lib/guarantees-store";
import GarantiesClient from "./GarantiesClient";

export const dynamic = "force-dynamic";

export default async function AdminGarantiesPage() {
  const clients = await loadAdminClients();
  return <GarantiesClient clients={clients} initialGuarantees={structuredClone(GUARANTEES)} />;
}
