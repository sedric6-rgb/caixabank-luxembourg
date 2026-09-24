"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createClientSessionToken,
  CLIENT_SESSION_COOKIE_NAME,
} from "@/lib/auth-client";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { syncClientStatuses } from "@/lib/client-status";
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
    await syncClientStatuses();
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

export async function resetPasswordAction(formData: FormData): Promise<{ success: boolean; error?: string; newPassword?: string }> {
  const clientNumber = String(formData.get("client_number") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!clientNumber || !email) {
    return { success: false, error: "Veuillez remplir tous les champs" };
  }

  const client = DEMO_CLIENTS.find(
    (c) => c.client_number === clientNumber && c.email === email && c.status === "actif"
  );

  if (!client) {
    return { success: false, error: "Aucun compte ne correspond a ces informations" };
  }

  const newPassword = "Temp" + String(Math.floor(1000 + Math.random() * 9000)) + "!";
  client.password = newPassword;

  return { success: true, newPassword };
}

export async function changePasswordAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const session = await (await import("@/lib/auth-client")).getClientSession();
  if (!session) return { success: false, error: "Non connecte" };

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
  return { success: true };
}
