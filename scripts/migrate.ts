import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  const connection = url
    ? await mysql.createConnection(url)
    : await mysql.createConnection({
        host: process.env.MYSQLHOST || "localhost",
        port: Number(process.env.MYSQLPORT) || 3306,
        user: process.env.MYSQLUSER || "root",
        password: process.env.MYSQLPASSWORD || "",
        database: process.env.MYSQLDATABASE || "maison_fritz",
      });

  const [columns] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'properties' AND COLUMN_NAME = 'is_visible'"
  );

  if (columns.length === 0) {
    await connection.query("ALTER TABLE properties ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE AFTER status");
    console.log("Colonne is_visible ajoutée.");
  } else {
    console.log("Migration déjà appliquée.");
  }

  await connection.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
