import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import { registry, storesMap, hydrate, type StoreKey, type Identified } from "@/lib/shared-store";

export type { StoreKey };

async function load(): Promise<void> {
  if (!db) return;
  await db.query(
    `CREATE TABLE IF NOT EXISTS app_state (
      k VARCHAR(50) PRIMARY KEY,
      v LONGTEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  );
  const [rows] = await db.query<RowDataPacket[]>("SELECT k, v FROM app_state");
  const snapshot: Partial<Record<StoreKey, Identified[]>> = {};
  for (const row of rows) snapshot[row.k as StoreKey] = JSON.parse(row.v);
  registry.__cblSnapshot = snapshot;

  const stores = storesMap();
  for (const [key, arr] of Object.entries(stores) as [StoreKey, Identified[]][]) {
    const saved = snapshot[key];
    if (saved) hydrate(arr, saved);
  }

  if (!snapshot.clients) await importLegacyClientStatuses();
  const missing = (Object.keys(stores) as StoreKey[]).filter((k) => !snapshot[k]);
  if (missing.length) await write(missing);
}

async function importLegacyClientStatuses() {
  const clients = storesMap().clients as ({ id: number; status: string }[] | undefined);
  if (!db || !clients) return;
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT client_id, status FROM client_status_overrides");
    for (const row of rows) {
      const client = clients.find((c) => c.id === row.client_id);
      if (client) client.status = row.status;
    }
  } catch {
    // Table only exists where client statuses were saved before app_state.
  }
}

async function write(keys: StoreKey[]) {
  if (!db) return;
  const stores = storesMap();
  for (const key of keys) {
    const arr = stores[key];
    if (!arr) continue;
    await db.query(
      "INSERT INTO app_state (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)",
      [key, JSON.stringify(arr)]
    );
  }
}

// Throws if MySQL is configured but unreachable, so a change is never written over data that was not loaded.
export function ensureState(): Promise<void> {
  if (!db) return Promise.resolve();
  registry.__cblLoad ??= load().catch((err) => {
    registry.__cblLoad = undefined;
    throw err;
  });
  return registry.__cblLoad;
}

export async function persist(...keys: StoreKey[]): Promise<void> {
  if (!db) return;
  await ensureState();
  await write(keys);
}

export async function readState(): Promise<void> {
  try {
    await ensureState();
  } catch (err) {
    console.error("[state] load failed, serving data from code:", err);
  }
}
