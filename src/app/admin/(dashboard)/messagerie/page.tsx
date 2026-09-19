import { getAllConversations } from "@/lib/messages-store";
import AdminMessagerieClient from "./admin-messagerie-client";

export default function AdminMessageriePage() {
  const conversations = getAllConversations();

  return <AdminMessagerieClient initialConversations={conversations} />;
}
