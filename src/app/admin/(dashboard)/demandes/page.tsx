import { readState } from "@/lib/state";
import { getAllDemandes } from "@/lib/demandes-store";
import DemandesClient from "./DemandesClient";

export const dynamic = "force-dynamic";

export default async function AdminDemandesPage() {
  await readState();
  return <DemandesClient initialDemandes={structuredClone(getAllDemandes())} />;
}
