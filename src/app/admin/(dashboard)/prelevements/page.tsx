import { readState } from "@/lib/state";
import { MANDATES } from "@/lib/mandates-store";
import PrelevementsClient from "./PrelevementsClient";

export const dynamic = "force-dynamic";

export default async function AdminPrelevementsPage() {
  await readState();
  return <PrelevementsClient initialMandates={structuredClone(MANDATES)} />;
}
