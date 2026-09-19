import { getClientSession } from "@/lib/auth-client";
import { getClientAccounts, getAccountTransactions, getClientById } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import RelevesClient from "./releves-client";

export default async function RelevesPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const accounts = await getClientAccounts(session.clientId);
  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";

  const accountList = accounts.map((a) => ({
    id: a.id,
    label: a.label,
    iban: a.account_number,
  }));

  const txsByAccount: Record<number, { date: string; description: string; amount: number }[]> = {};
  for (const a of accounts) {
    const txs = await getAccountTransactions(a.id, 30);
    txsByAccount[a.id] = txs.map((tx) => ({
      date: new Date(tx.executed_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      description: tx.description,
      amount: tx.type === "credit" ? tx.amount : -tx.amount,
    }));
  }

  return <RelevesClient accounts={accountList} transactionsByAccount={txsByAccount} clientName={clientName} />;
}
