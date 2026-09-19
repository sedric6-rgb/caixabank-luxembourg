import { getClientSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { getClientById } from "@/lib/queries/banking";
import { initClientConversations, getClientConversations } from "@/lib/messages-store";
import MessagerieClient from "./messagerie-client";

export default async function MessageriePage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";
  const clientNumber = client?.client_number || "";

  initClientConversations(session.clientId, clientName, clientNumber);
  const conversations = getClientConversations(session.clientId);

  return <MessagerieClient initialConversations={conversations} />;
}
