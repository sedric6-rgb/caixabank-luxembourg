import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { ensureState, persist } from "@/lib/state";

type Migration = { name: string; run: () => Promise<void> };

const MIGRATIONS: Migration[] = [
  {
    // The holding client (id 24) is added from code and auto-appended on load; this only removes
    // the now-transferred professional account from Fritz's saved record in an existing database.
    name: "2026-09-holding-ats-transfer",
    run: async () => {
      const fritz = DEMO_CLIENTS.find((c) => c.id === 21);
      if (!fritz) return;
      const before = fritz.accounts.length;
      fritz.accounts = fritz.accounts.filter((a) => a.type !== "professionnel");
      if (fritz.accounts.length !== before) await persist("clients");
    },
  },
];

// Applied-once data fixups for existing databases, recorded in app_migrations so an admin can
// later change the same data without it being reverted on the next restart. Skipped without a DB,
// where demo-data.ts already carries the final state.
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
