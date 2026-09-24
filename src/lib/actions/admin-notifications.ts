"use server";

import { requireAdmin } from "./admin-guard";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { createAdminNotification } from "@/lib/notifications-store";
import {
  initClientConversations,
  createBroadcastConversation,
} from "@/lib/messages-store";
import { revalidatePath } from "next/cache";

export async function sendNotificationToAllAction(formData: FormData): Promise<{ success: boolean; error?: string; count?: number }> {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const type = (String(formData.get("type") || "info")) as "info" | "alerte" | "promotion";

  if (!title || !message) {
    return { success: false, error: "Le titre et le message sont requis" };
  }

  createAdminNotification({ title, message, type, targetClientIds: "all" });

  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin", "layout");

  return { success: true, count: DEMO_CLIENTS.length };
}

export async function sendNotificationToClientAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const clientId = Number(formData.get("clientId"));
  const title = String(formData.get("title") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const type = (String(formData.get("type") || "info")) as "info" | "alerte" | "promotion";

  if (!clientId || !title || !message) {
    return { success: false, error: "Tous les champs sont requis" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  createAdminNotification({ title, message, type, targetClientIds: [clientId] });

  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin", "layout");

  return { success: true };
}

export async function sendMessageToAllAction(formData: FormData): Promise<{ success: boolean; error?: string; count?: number }> {
  await requireAdmin();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const category = String(formData.get("category") || "information");

  if (!subject || !message) {
    return { success: false, error: "L'objet et le message sont requis" };
  }

  const activeClients = DEMO_CLIENTS.filter((c) => c.status === "actif");
  let count = 0;

  for (const client of activeClients) {
    const clientName = `${client.first_name} ${client.last_name}`;
    initClientConversations(client.id, clientName, client.client_number);
    createBroadcastConversation({
      clientId: client.id,
      clientName,
      clientNumber: client.client_number,
      subject,
      category,
      message,
    });
    count++;
  }

  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin", "layout");

  return { success: true, count };
}
