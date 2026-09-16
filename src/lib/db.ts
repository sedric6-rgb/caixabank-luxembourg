import mysql from "mysql2/promise";

// Le pool est mis en cache sur `globalThis` pour survivre au rechargement à
// chaud en développement (sinon Next.js recréerait un pool à chaque
// modification de fichier, jusqu'à épuiser les connexions disponibles).
const globalForDb = globalThis as unknown as { mysqlPool?: mysql.Pool | null };

function createPool(): mysql.Pool | null {
  const url = process.env.DATABASE_URL;
  const host = process.env.MYSQLHOST;

  if (!url && !host) return null;

  if (url) {
    return mysql.createPool(url);
  }

  return mysql.createPool({
    host,
    port: Number(process.env.MYSQLPORT) || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "maison_fritz",
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export const db = globalForDb.mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = db;
}
