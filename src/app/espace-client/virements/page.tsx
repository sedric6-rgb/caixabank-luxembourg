import { getClientSession } from "@/lib/auth-client";
import { getClientAccounts, getClientBeneficiaries } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import VirementForm from "./virement-form";

export default async function VirementsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const accounts = await getClientAccounts(session.clientId);
  const beneficiaries = await getClientBeneficiaries(session.clientId);

  const accts = accounts.map((a) => ({
    id: a.id, label: a.label, balance: a.balance, iban: a.account_number,
  }));
  const bens = beneficiaries.map((b) => ({
    id: b.id, label: b.label, iban: b.iban,
  }));

  return <VirementForm accounts={accts} beneficiaries={bens} />;
}
