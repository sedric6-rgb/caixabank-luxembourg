import { getClientSession } from "@/lib/auth-client";
import { getClientBeneficiaries } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import BeneficiairesClient from "./beneficiaires-client";

export default async function BeneficiairesPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const beneficiaries = await getClientBeneficiaries(session.clientId);
  const bens = beneficiaries.map((b) => ({
    id: b.id,
    label: b.label,
    name: b.beneficiary_name,
    iban: b.iban,
    bic: b.bic,
    favorite: b.is_favorite,
  }));

  return <BeneficiairesClient initialBeneficiaries={bens} />;
}
