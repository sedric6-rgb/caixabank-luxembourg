import { getClientSession } from "@/lib/auth-client";
import { getClientAccounts, getClientById } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import EpargneClient from "./epargne-client";

export default async function EpargnePage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const accounts = await getClientAccounts(session.clientId);
  const client = await getClientById(session.clientId);
  const epargneAccounts = accounts.filter((a) => a.account_type === "epargne");
  const courantAccounts = accounts.filter((a) => a.account_type === "courant" || a.account_type === "professionnel");

  return (
    <EpargneClient
      epargneAccounts={epargneAccounts.map((a) => ({
        id: a.id,
        label: a.label,
        balance: a.balance,
        iban: a.account_number,
      }))}
      courantAccounts={courantAccounts.map((a) => ({
        id: a.id,
        label: a.label,
        balance: a.balance,
      }))}
      clientName={client ? `${client.first_name} ${client.last_name}` : "Client"}
    />
  );
}
