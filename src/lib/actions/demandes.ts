"use server";

import { ensureState, persist } from "@/lib/state";
import { requireAdmin } from "./admin-guard";
import { getClientSession } from "@/lib/auth-client";
import { getClientById } from "@/lib/queries/banking";
import { addDemande, updateDemandeStatus, type DemandeType, type DemandeStatus } from "@/lib/demandes-store";
import { DEMO_CLIENTS } from "@/lib/demo-data";

export async function createDemandeAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const session = await getClientSession();
  if (!session) return { success: false, error: "Non connecte" };
  await ensureState();

  const client = await getClientById(session.clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  const type = String(formData.get("type")) as DemandeType;
  const label = String(formData.get("label") || "");
  const details = String(formData.get("details") || "");

  if (!type || !label) return { success: false, error: "Champs requis manquants" };

  const demande = addDemande({
    clientId: client.id,
    clientName: `${client.first_name} ${client.last_name}`,
    clientNumber: client.client_number,
    type,
    label,
    details,
  });

  if (type === "compte_epargne") {
    const src = DEMO_CLIENTS.find((c) => c.id === client.id);
    if (src && !src.accounts.some((a) => a.type === "epargne")) {
      const iban = `LU${String(10 + src.id).padStart(2, "0")} 0019 2004 0000 ${String(src.id).padStart(4, "0")} ${String(Date.now()).slice(-4)} ${String(Date.now()).slice(-8, -4)}`;
      src.accounts.push({ label: "Livret Epargne", number: iban, balance: 0, type: "epargne" });
    }
  }

  await persist("demandes");
  return { success: true };
}

export async function updateDemandeStatusAction(id: number, status: DemandeStatus): Promise<void> {
  await requireAdmin();
  await ensureState();
  updateDemandeStatus(id, status);
  await persist("demandes");
}
