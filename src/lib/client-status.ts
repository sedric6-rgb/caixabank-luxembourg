import { db } from "@/lib/db";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import type { RowDataPacket } from "mysql2";

let tableReady = false;

async function ensureTable() {
  if (!db || tableReady) return;
  await db.query(
    `CREATE TABLE IF NOT EXISTS client_status_overrides (
      client_id INT PRIMARY KEY,
      status VARCHAR(20) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  );
  tableReady = true;
}

// Demo clients live in memory and reset on every deploy, so admin status changes are persisted in MySQL and re-applied here.
export async function syncClientStatuses(): Promise<void> {
  if (!db) return;
  try {
    await ensureTable();
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT client_id, status FROM client_status_overrides"
    );
    for (const row of rows) {
      const client = DEMO_CLIENTS.find((c) => c.id === row.client_id);
      if (client) client.status = row.status;
    }
  } catch (err) {
    console.error("[client-status] sync failed:", err);
  }
}

export async function saveClientStatus(clientId: number, status: string): Promise<void> {
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (client) client.status = status;
  if (!db) return;
  try {
    await ensureTable();
    await db.query(
      `INSERT INTO client_status_overrides (client_id, status) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [clientId, status]
    );
  } catch (err) {
    console.error("[client-status] save failed:", err);
  }
}
