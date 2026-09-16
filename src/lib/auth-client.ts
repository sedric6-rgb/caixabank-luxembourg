import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "cbp_client_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

function getSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "CLIENT_SESSION_SECRET n'est pas defini. Ajoutez-le dans vos variables d'environnement."
    );
  }
  return secret;
}

function hmacSign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/**
 * Cree un token de session client signe par HMAC.
 * Le payload JSON contient clientId et expiresAt.
 */
export function createClientSessionToken(
  clientId: number
): { name: string; value: string; expires: Date } {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = JSON.stringify({ clientId, expiresAt });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = hmacSign(encoded);
  return {
    name: COOKIE_NAME,
    value: `${encoded}.${signature}`,
    expires: new Date(expiresAt),
  };
}

/**
 * Extrait et verifie la session client depuis le cookie.
 * Retourne { clientId } si valide, null sinon.
 */
export async function getClientSession(): Promise<{ clientId: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = hmacSign(encoded);
  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as { clientId: number; expiresAt: number };

    if (!payload.clientId || !payload.expiresAt) return null;
    if (payload.expiresAt <= Date.now()) return null;

    return { clientId: payload.clientId };
  } catch {
    return null;
  }
}

/**
 * Verifie rapidement si la session client est valide.
 */
export async function isValidClientSession(): Promise<boolean> {
  const session = await getClientSession();
  return session !== null;
}

export const CLIENT_SESSION_COOKIE_NAME = COOKIE_NAME;
