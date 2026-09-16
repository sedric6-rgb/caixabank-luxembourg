"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createClientSessionToken,
  CLIENT_SESSION_COOKIE_NAME,
} from "@/lib/auth-client";
import type { RowDataPacket } from "mysql2";

// Identifiants de demonstration
const DEMO_CLIENT_NUMBER = "CBP-284751";
const DEMO_PASSWORD = "demo2024";
const DEMO_CLIENT_ID = 1;

/**
 * Action serveur pour la connexion client.
 * Verifie le numero client + mot de passe, cree un token de session
 * et redirige vers l'espace client.
 */
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

  // Fallback : identifiants de demonstration
  if (
    clientId === null &&
    clientNumber === DEMO_CLIENT_NUMBER &&
    password === DEMO_PASSWORD
  ) {
    clientId = DEMO_CLIENT_ID;
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
