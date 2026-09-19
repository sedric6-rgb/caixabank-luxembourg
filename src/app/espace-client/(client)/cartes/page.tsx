import { getClientSession } from "@/lib/auth-client";
import { getClientCards, getClientById } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import CartesClient from "./cartes-client";

export default async function CartesPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";
  const cards = await getClientCards(session.clientId);
  const clientCards = cards.map((c) => ({
    id: c.id, last4: c.card_number_last4,
    type: c.card_type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    expiry: c.expiry_date.slice(5, 7) + "/" + c.expiry_date.slice(0, 4),
    status: c.status, limit: c.monthly_limit,
    contactless: c.contactless_enabled, online: c.online_payment_enabled,
    account: "Compte Courant",
  }));

  return <CartesClient initialCards={clientCards} clientName={clientName} />;
}
