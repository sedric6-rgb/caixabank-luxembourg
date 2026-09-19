import { getClientSession } from "@/lib/auth-client";
import { getClientById } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import PrelevementsClient from "./prelevements-client";

export default async function PrelevementsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);

  return (
    <PrelevementsClient
      clientName={client ? `${client.first_name} ${client.last_name}` : "Client"}
    />
  );
}
