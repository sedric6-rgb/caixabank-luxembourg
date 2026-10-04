import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { BANK_CLIENTS } from "@/lib/client-data";
import { ensureState, persist } from "@/lib/state";

type Migration = { name: string; run: () => Promise<void> };

const ORIGINAL_PASSWORDS: Record<number, string> = {
  19: "France24",
  20: "France24",
  21: "Azerty31@",
  22: "France24",
  23: "France24",
  24: "AtsGroup2026!",
  25: "France24",
};

const MIGRATIONS: Migration[] = [
  {
    name: "2026-09-holding-ats-transfer",
    run: async () => {
      const fritz = BANK_CLIENTS.find((c) => c.id === 21);
      if (!fritz) return;
      const before = fritz.accounts.length;
      fritz.accounts = fritz.accounts.filter((a) => a.type !== "professionnel");
      if (fritz.accounts.length !== before) await persist("clients");
    },
  },
  {
    name: "2026-10-reset-passwords",
    run: async () => {
      const crypto = await import("crypto");
      for (const [idStr, pwd] of Object.entries(ORIGINAL_PASSWORDS)) {
        const id = Number(idStr);
        const hash = crypto.createHash("sha256").update(pwd).digest("hex");
        await db!.query(
          "UPDATE bank_clients SET password_hash = ? WHERE id = ?",
          [hash, id]
        );
        const client = BANK_CLIENTS.find((c) => c.id === id);
        if (client) client.password = pwd;
      }
      await persist("clients");
    },
  },
  {
    name: "2026-10-unblock-davin-servais",
    run: async () => {
      for (const id of [22, 23]) {
        const client = BANK_CLIENTS.find((c) => c.id === id);
        if (client && client.status !== "actif") {
          client.status = "actif";
        }
      }
      await persist("clients");
    },
  },
  {
    name: "2026-10-fritz-investment-debit",
    run: async () => {
      const fritz = BANK_CLIENTS.find((c) => c.id === 21);
      if (!fritz) return;
      const courant = fritz.accounts.find((a) => a.type === "courant");
      const epargne = fritz.accounts.find((a) => a.type === "epargne");
      if (courant && courant.balance > 160000) courant.balance -= 160000;
      if (epargne && epargne.balance > 100000) epargne.balance -= 100000;
      const hasTx = fritz.transactions.some((t) => t.desc.includes("Souscription portefeuille investissement"));
      if (!hasTx) {
        fritz.transactions.splice(4, 0,
          { date: "01/09/2026", desc: "Souscription portefeuille investissement — Livret Epargne", amount: -100000 },
          { date: "01/09/2026", desc: "Souscription portefeuille investissement — Compte Courant", amount: -160000 },
        );
      }
      await persist("clients");
    },
  },
  {
    name: "2026-10-fritz-rename-dienhy",
    run: async () => {
      const fritz = BANK_CLIENTS.find((c) => c.id === 21);
      if (fritz && fritz.first_name === "Fritz") {
        fritz.first_name = "Dienhy Fritz";
      }
      await persist("clients");
    },
  },
];

// Applied-once data fixups for existing databases, recorded in app_migrations so an admin can
// later change the same data without it being reverted on the next restart. Skipped without a DB,
// where client-data.ts already carries the final state.
export async function runMigrations(): Promise<void> {
  if (!db) return;
  try {
    await ensureState();
    await db.query(
      `CREATE TABLE IF NOT EXISTS app_migrations (
        name VARCHAR(100) PRIMARY KEY,
        ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    const [rows] = await db.query<RowDataPacket[]>("SELECT name FROM app_migrations");
    const done = new Set(rows.map((r) => r.name as string));
    for (const migration of MIGRATIONS) {
      if (done.has(migration.name)) continue;
      await migration.run();
      await db.query("INSERT IGNORE INTO app_migrations (name) VALUES (?)", [migration.name]);
      console.log(`[migrations] applied ${migration.name}`);
    }
  } catch (err) {
    console.error("[migrations] failed:", err);
  }
}
