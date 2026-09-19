import { getClientSession } from "@/lib/auth-client";
import { getClientById, getClientAccounts } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import InvestissementsClient from "./investissements-client";

export default async function InvestissementsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);
  const accounts = await getClientAccounts(session.clientId);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <InvestissementsClient
      clientName={client ? `${client.first_name} ${client.last_name}` : "Client"}
      totalBalance={totalBalance}
    />
  );
}
