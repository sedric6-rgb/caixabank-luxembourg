import dotenv from "dotenv";
// Next.js utilise .env.local en développement ; on le charge explicitement ici
// car ce script tourne en dehors de Next.js.
dotenv.config({ path: ".env.local" });
dotenv.config();
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

async function getConnection() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const separator = url.includes("?") ? "&" : "?";
    return mysql.createConnection(url + separator + "multipleStatements=true");
  }
  return mysql.createConnection({
    host: process.env.MYSQLHOST || "localhost",
    port: Number(process.env.MYSQLPORT) || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "maison_fritz",
    multipleStatements: true,
  });
}

async function main() {
  const conn = await getConnection();
  console.log("Connecté à la base de données.");

  const schemaPath = path.join(process.cwd(), "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await conn.query(schema);
  console.log("Schéma appliqué.");

  const [existing] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) as c FROM agents"
  );
  if ((existing[0] as { c: number }).c > 0) {
    console.log("Des données existent déjà — seed ignoré (supprimez les lignes pour reseeder).");
    await conn.end();
    return;
  }

  // Agents
  const [agentResult] = await conn.query<mysql.ResultSetHeader>(
    `INSERT INTO agents (slug, full_name, role, phone, email, city, bio, photo_url) VALUES
     ('sarah-nkounkou','Sarah Nkounkou','Agent senior — vente','+242 06 000 00 01','sarah@maisonfritz.com','Pointe-Noire','Cinq ans d\\'expérience dans la vente résidentielle à Pointe-Noire.', NULL),
     ('paul-obiang','Paul Obiang','Agent — gestion locative','+242 06 000 00 02','paul@maisonfritz.com','Brazzaville','Spécialiste de la gestion locative pour propriétaires à distance.', NULL)`
  );
  const agent1 = agentResult.insertId;
  const agent2 = agentResult.insertId + 1;

  // Properties
  const [propResult] = await conn.query<mysql.ResultSetHeader>(
    `INSERT INTO properties
      (slug, title, listing_type, status, is_exclusive, is_newly_built, is_frontline_beach, featured, city, neighborhood, price, bedrooms, bathrooms, surface_m2, description, agent_id) VALUES
     ('villa-vue-mer-cote-sauvage','Villa vue mer — Côte Sauvage','vente','disponible',1,1,1,1,'Pointe-Noire','Côte Sauvage',185000000,4,3,320,'Villa neuve en front de mer, finitions haut de gamme, piscine et jardin paysager.', ?),
     ('appartement-3-pieces-centre-ville','Appartement 3 pièces — Centre-ville','location','disponible',1,0,0,0,'Pointe-Noire','Centre-ville',450000,2,1,85,'Appartement lumineux au cœur de Pointe-Noire, proche des commerces.', ?),
     ('duplex-moderne-mpita','Duplex moderne — Mpita','vente','disponible',0,1,0,0,'Pointe-Noire','Mpita',95000000,3,2,180,'Duplex fraîchement construit dans un quartier résidentiel calme.', ?),
     ('maison-familiale-talangai','Maison familiale — Talangaï','vente','vendu',0,0,0,0,'Brazzaville','Talangaï',60000000,4,2,220,'Maison familiale avec grand jardin, vendue en 2026.', ?),
     ('studio-meuble-poto-poto','Studio meublé — Poto-Poto','location','loue',0,0,0,0,'Brazzaville','Poto-Poto',180000,1,1,35,'Studio meublé idéal pour un premier logement en ville.', ?)`,
    [agent1, agent2, agent1, agent2, agent1]
  );
  const firstPropertyId = propResult.insertId;

  await conn.query(
    `INSERT INTO property_photos (property_id, url, position) VALUES
     (?, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 0),
     (?, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 1)`,
    [firstPropertyId, firstPropertyId]
  );

  // Blog
  await conn.query(
    `INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url) VALUES
     ('investir-depuis-la-diaspora','Investir dans l\\'immobilier depuis la diaspora : par où commencer ?',
      'Les trois étapes essentielles avant de confier un premier bien depuis l\\'étranger.',
      'Investir depuis l\\'étranger commence par le choix d\\'un mandataire de confiance. Vérifiez toujours que les fonds transitent par un compte séquestre notarié avant toute signature...',
      NULL)`
  );

  // Careers
  await conn.query(
    `INSERT INTO job_listings (slug, title, city, contract_type, description, is_active) VALUES
     ('agent-immobilier-pointe-noire','Agent immobilier','Pointe-Noire','Indépendant / commission',
      'Nous recherchons un agent immobilier motivé pour rejoindre notre réseau à Pointe-Noire.', 1)`
  );

  // Testimonials
  await conn.query(
    `INSERT INTO testimonials (author_name, rating, message, is_published) VALUES
     ('Jean-Marc D.', 5, 'Un suivi impeccable depuis la France, je n\\'ai eu aucune mauvaise surprise.', 1),
     ('Aïcha B.', 5, 'Mon bien a été loué en deux semaines, avec un vrai contrat et un état des lieux sérieux.', 1)`
  );

  console.log("Données de démonstration insérées.");
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
