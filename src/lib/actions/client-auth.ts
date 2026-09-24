"use server";

import { ensureState, persist, readState } from "@/lib/state";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createClientSessionToken,
  CLIENT_SESSION_COOKIE_NAME,
} from "@/lib/auth-client";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { DEMANDES, addDemande } from "@/lib/demandes-store";
import type { RowDataPacket } from "mysql2";

const DEMO_PASSWORD = "demo2024";

export async function clientLoginAction(formData: FormData): Promise<void> {
  const clientNumber = String(formData.get("client_number") || "").trim();
  const password = String(formData.get("password") || "");

  if (!clientNumber || !password) {
    redirect("/espace-client/connexion?error=missing");
  }

  let clientId: number | null = null;

  if (db) {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT id, password_hash FROM bank_clients
         WHERE client_number = ? AND status = 'actif'`,
        [clientNumber]
      );

      if (rows.length > 0) {
        const client = rows[0] as { id: number; password_hash: string };
        const crypto = await import("crypto");
        const inputHash = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");

        if (client.password_hash === inputHash) {
          clientId = client.id;
        }
      }
    } catch {
      // Base de donnees indisponible, verifier les identifiants demo
    }
  }

  if (clientId === null) {
    await readState();
    const demoClient = DEMO_CLIENTS.find(
      (c) => c.client_number === clientNumber && c.status === "actif"
    );
    if (demoClient) {
      const expected = demoClient.password || DEMO_PASSWORD;
      if (password === expected) {
        clientId = demoClient.id;
      }
    }
  }

  if (clientId === null) {
    redirect("/espace-client/connexion?error=invalid");
  }

  const session = createClientSessionToken(clientId);
  const cookieStore = await cookies();
  cookieStore.set(session.name, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });

  redirect("/espace-client");
}

/**
 * Action serveur pour la deconnexion client.
 * Supprime le cookie de session et redirige vers la page de connexion.
 */
export async function clientLogoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_SESSION_COOKIE_NAME);
  redirect("/espace-client/connexion");
}

// Never reveals whether the account exists and never changes the password: an adviser resets it from the admin.
export async function requestPasswordResetAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const clientNumber = String(formData.get("client_number") || "").trim().toUpperCase();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!clientNumber || !email) {
    return { success: false, error: "Veuillez remplir tous les champs" };
  }

  await ensureState();
  const client = DEMO_CLIENTS.find(
    (c) => c.client_number.toUpperCase() === clientNumber && c.email.toLowerCase() === email
  );
  const alreadyPending = client && DEMANDES.some(
    (d) => d.clientId === client.id && d.type === "mot_de_passe" && (d.status === "en_attente" || d.status === "en_cours")
  );

  if (client && !alreadyPending) {
    addDemande({
      clientId: client.id,
      clientName: `${client.first_name} ${client.last_name}`,
      clientNumber: client.client_number,
      type: "mot_de_passe",
      label: "Mot de passe oublie",
      details: "Demande faite depuis la page Mot de passe oublie. Verifier l'identite du client avant de lui communiquer un nouveau mot de passe.",
    });
    await persist("demandes");
  }

  return { success: true };
}

export async function changePasswordAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const session = await (await import("@/lib/auth-client")).getClientSession();
  if (!session) return { success: false, error: "Non connecte" };
  await ensureState();

  const current = String(formData.get("current_password") || "");
  const newPwd = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  if (!current || !newPwd || !confirm) {
    return { success: false, error: "Tous les champs sont requis" };
  }
  if (newPwd.length < 8) {
    return { success: false, error: "Le nouveau mot de passe doit contenir au moins 8 caracteres" };
  }
  if (newPwd !== confirm) {
    return { success: false, error: "Les mots de passe ne correspondent pas" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === session.clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  const expected = client.password || DEMO_PASSWORD;
  if (current !== expected) {
    return { success: false, error: "Mot de passe actuel incorrect" };
  }

  client.password = newPwd;
  await persist("clients");
  return { success: true };
}
