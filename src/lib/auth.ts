import crypto from "crypto";

const COOKIE_NAME = "mf_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET n'est pas défini. Ajoutez-le dans vos variables d'environnement."
    );
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Construit la valeur du cookie de session : "expiration.signature" */
export function createSessionToken(): { name: string; value: string; expires: Date } {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const payload = String(expires.getTime());
  const signature = sign(payload);
  return { name: COOKIE_NAME, value: `${payload}.${signature}`, expires };
}

/** Vérifie qu'un cookie de session est valide et non expiré. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD n'est pas défini. Ajoutez-le dans vos variables d'environnement."
    );
  }
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
