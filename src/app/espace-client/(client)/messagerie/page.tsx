import { getClientSession } from "@/lib/auth-client";
import { getClientMessages } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import MessagerieClient from "./messagerie-client";

export default async function MessageriePage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const messages = await getClientMessages(session.clientId);
  const msgs = messages.map((m) => ({
    id: m.id,
    subject: m.subject,
    body: m.body,
    sender: m.sender,
    read: m.is_read,
    date: new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
  }));

  return <MessagerieClient initialMessages={msgs} />;
}
