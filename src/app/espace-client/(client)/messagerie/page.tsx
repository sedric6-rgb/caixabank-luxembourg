import { getClientSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { getClientById } from "@/lib/queries/banking";
import { initClientConversations, getClientConversations } from "@/lib/messages-store";
import MessagerieClient from "./messagerie-client";
import { persist, readState } from "@/lib/state";

export default async function MessageriePage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  await readState();
  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";
  const clientNumber = client?.client_number || "";

  if (initClientConversations(session.clientId, clientName, clientNumber)) {
    await persist("conversations").catch((err) => console.error("[messagerie] save failed:", err));
  }
  const conversations = getClientConversations(session.clientId);

  return <MessagerieClient initialConversations={conversations} />;
}
