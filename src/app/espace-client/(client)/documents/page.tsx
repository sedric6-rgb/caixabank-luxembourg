import { getClientSession } from "@/lib/auth-client";
import { getClientById, getClientAccounts } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import DocumentsClient from "./documents-client";

export default async function DocumentsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);
  const accounts = await getClientAccounts(session.clientId);

  return (
    <DocumentsClient
      clientName={client ? `${client.first_name} ${client.last_name}` : "Client"}
      accounts={accounts.map((a) => ({ id: a.id, label: a.label, iban: a.account_number }))}
    />
  );
}
