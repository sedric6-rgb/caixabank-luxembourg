import { getClientSession } from "@/lib/auth-client";
import { getClientCards, getClientAccounts } from "@/lib/queries/banking";
import { getDemandesByClient } from "@/lib/demandes-store";
import { redirect } from "next/navigation";
import DemandesClient from "./demandes-client";

export default async function DemandesPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const cards = await getClientCards(session.clientId);
  const accounts = await getClientAccounts(session.clientId);
  const demandes = getDemandesByClient(session.clientId);

  const clientCards = cards.map((c) => ({
    id: c.id,
    last4: c.card_number_last4,
    type: c.card_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    limit: c.monthly_limit,
  }));

  const clientAccounts = accounts.map((a) => ({
    id: a.id,
    label: a.label,
    type: a.account_type,
  }));

  const hasEpargne = accounts.some((a) => a.account_type === "epargne");

  return (
    <DemandesClient
      cards={clientCards}
      accounts={clientAccounts}
      hasEpargne={hasEpargne}
      initialDemandes={demandes.map((d) => ({
        id: d.id,
        type: d.type,
        label: d.label,
        details: d.details,
        status: d.status,
        createdAt: d.createdAt,
      }))}
    />
  );
}
