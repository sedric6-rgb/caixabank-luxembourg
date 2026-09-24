"use server";

import { requireAdmin } from "./admin-guard";
import { getClientSession } from "@/lib/auth-client";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import {
  initClientConversations,
  createConversation,
  addMessage,
  getConversation,
} from "@/lib/messages-store";

export async function createConversationAction(formData: FormData) {
  const session = await getClientSession();
  if (!session) return { success: false, error: "Non connecte" };

  const subject = String(formData.get("subject") || "").trim();
  const category = String(formData.get("category") || "general");
  const message = String(formData.get("message") || "").trim();

  if (!subject || !message) {
    return { success: false, error: "Veuillez remplir tous les champs" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === session.clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  initClientConversations(client.id, `${client.first_name} ${client.last_name}`, client.client_number);

  const conv = createConversation({
    clientId: client.id,
    clientName: `${client.first_name} ${client.last_name}`,
    clientNumber: client.client_number,
    subject,
    category,
    message,
  });

  return { success: true, conversationId: conv.id };
}

export async function replyConversationAction(formData: FormData) {
  const session = await getClientSession();
  if (!session) return { success: false, error: "Non connecte" };

  const conversationId = Number(formData.get("conversationId"));
  const text = String(formData.get("message") || "").trim();

  if (!conversationId || !text) {
    return { success: false, error: "Message requis" };
  }

  const conv = getConversation(conversationId);
  if (!conv || conv.clientId !== session.clientId) {
    return { success: false, error: "Conversation introuvable" };
  }

  const msg = addMessage(conversationId, "client", text);
  if (!msg) return { success: false, error: "Erreur" };

  return { success: true };
}

export async function adminReplyAction(formData: FormData) {
  await requireAdmin();
  const conversationId = Number(formData.get("conversationId"));
  const text = String(formData.get("message") || "").trim();

  if (!conversationId || !text) {
    return { success: false, error: "Message requis" };
  }

  const msg = addMessage(conversationId, "banque", text);
  if (!msg) return { success: false, error: "Conversation introuvable" };

  return { success: true };
}
