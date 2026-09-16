import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import crypto from "crypto";
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

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const conn = await getConnection();
  console.log("Connecte a la base de donnees.");

  // Appliquer le schema
  const schemaPath = path.join(process.cwd(), "db", "banking-schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await conn.query(schema);
  console.log("Schema bancaire applique.");

  // Verifier si des donnees existent deja
  const [existing] = await conn.query<mysql.RowDataPacket[]>(
    "SELECT COUNT(*) as c FROM bank_clients"
  );
  if ((existing[0] as { c: number }).c > 0) {
    console.log(
      "Des donnees existent deja — seed ignore (supprimez les lignes pour reseeder)."
    );
    await conn.end();
    return;
  }

  // ============================================================
  // Admin users
  // ============================================================

  await conn.query(
    `INSERT INTO admin_users (username, password_hash, full_name, role) VALUES
     ('admin', ?, 'Administrateur Principal', 'super_admin'),
     ('agent1', ?, 'Marie Dubois', 'agent'),
     ('agent2', ?, 'Pierre Martin', 'agent')`,
    [hashPassword("admin2024"), hashPassword("agent2024"), hashPassword("agent2024")]
  );
  console.log("Administrateurs inseres.");

  // ============================================================
  // Bank clients
  // ============================================================

  const [clientResult] = await conn.query<mysql.ResultSetHeader>(
    `INSERT INTO bank_clients
       (client_number, first_name, last_name, email, phone, date_of_birth,
        address, city, postal_code, country, id_type, id_number, status, password_hash)
     VALUES
       ('CBP-284751', 'Jan', 'Kowalski', 'jan.kowalski@email.pl', '+48 612 345 678',
        '1985-03-15', '12 ul. Marszalkowska', 'Varsovie', '00-001', 'Pologne',
        'carte_identite', 'ABC123456', 'actif', ?),
       ('CBP-391862', 'Anna', 'Nowak', 'anna.nowak@email.pl', '+48 698 765 432',
        '1990-07-22', '45 ul. Dluga', 'Cracovie', '31-001', 'Pologne',
        'passeport', 'XY9876543', 'actif', ?),
       ('CBP-502947', 'Piotr', 'Wisniewski', 'piotr.w@email.pl', '+48 501 234 567',
        '1978-11-30', '8 ul. Piotrkowska', 'Lodz', '90-001', 'Pologne',
        'permis_conduire', 'DRV456789', 'actif', ?),
       ('CBP-618034', 'Katarzyna', 'Wojcik', 'k.wojcik@email.pl', '+48 512 876 543',
        '1995-01-10', '23 ul. Swidnicka', 'Wroclaw', '50-001', 'Pologne',
        'carte_identite', 'DEF789012', 'en_attente', ?)`,
    [
      hashPassword("demo2024"),
      hashPassword("anna2024"),
      hashPassword("piotr2024"),
      hashPassword("kata2024"),
    ]
  );
  const client1Id = clientResult.insertId;
  const client2Id = clientResult.insertId + 1;
  const client3Id = clientResult.insertId + 2;
  console.log("Clients bancaires inseres.");

  // ============================================================
  // Bank accounts
  // ============================================================

  const [accountResult] = await conn.query<mysql.ResultSetHeader>(
    `INSERT INTO bank_accounts
       (account_number, client_id, account_type, label, balance, currency, status)
     VALUES
       ('PL61109010140000071219812874', ?, 'courant', 'Compte Courant', 12847.53, 'PLN', 'actif'),
       ('PL27114020040000300201355387', ?, 'epargne', 'Livret Epargne', 45230.00, 'PLN', 'actif'),
       ('PL10105000997603123456789012', ?, 'professionnel', 'Compte Pro', 89415.22, 'PLN', 'actif'),
       ('PL33102010260000042200005678', ?, 'courant', 'Compte Courant', 8934.17, 'PLN', 'actif'),
       ('PL55114020040000300201359876', ?, 'epargne', 'Livret Epargne', 22100.00, 'PLN', 'actif'),
       ('PL77105000997603987654321098', ?, 'courant', 'Compte Courant', 15672.89, 'PLN', 'actif')`,
    [client1Id, client1Id, client1Id, client2Id, client2Id, client3Id]
  );
  const acc1Id = accountResult.insertId;
  const acc4Id = accountResult.insertId + 3;
  const acc6Id = accountResult.insertId + 5;
  console.log("Comptes bancaires inseres.");

  // ============================================================
  // Transactions (compte courant du client 1)
  // ============================================================

  await conn.query(
    `INSERT INTO bank_transactions
       (account_id, type, category, amount, balance_after, description, counterparty, reference, executed_at)
     VALUES
       (?, 'debit', 'carte', 125.50, 12847.53, 'Achat Biedronka ul. Pulawska', 'Biedronka', 'TXN-2024091401', '2024-09-14 09:23:00'),
       (?, 'debit', 'carte', 42.90, 12973.03, 'Achat Zabka Mokotow', 'Zabka', 'TXN-2024091302', '2024-09-13 18:45:00'),
       (?, 'credit', 'virement_entrant', 4500.00, 13015.93, 'Salaire septembre 2024', 'Entreprise ABC Sp. z o.o.', 'SAL-2024-09', '2024-09-10 06:00:00'),
       (?, 'debit', 'prelevement', 1567.23, 8515.93, 'Echeance pret immobilier', 'Caixa Banque Pologne', 'PRET-IMM-09', '2024-09-05 00:00:00'),
       (?, 'debit', 'carte', 234.00, 10083.16, 'Achat Allegro - Elektronika', 'Allegro', 'TXN-2024090501', '2024-09-04 14:12:00'),
       (?, 'debit', 'prelevement', 189.00, 10317.16, 'Abonnement Orange Polska', 'Orange Polska', 'ORANGE-09-2024', '2024-09-03 00:00:00'),
       (?, 'debit', 'carte', 67.30, 10506.16, 'Achat Rossmann Centrum', 'Rossmann', 'TXN-2024090301', '2024-09-03 11:30:00'),
       (?, 'debit', 'virement_sortant', 2500.00, 10573.46, 'Loyer septembre', 'Immobiliare Sp. z o.o.', 'LOYER-09-2024', '2024-09-01 08:00:00'),
       (?, 'debit', 'carte', 312.50, 13073.46, 'Billet PKP Intercity Varsovie-Cracovie', 'PKP Intercity', 'TXN-2024083101', '2024-08-31 07:15:00'),
       (?, 'credit', 'virement_entrant', 1200.00, 13385.96, 'Remboursement Anna Kowalska', 'Anna Kowalska', 'VIR-AK-0831', '2024-08-30 15:20:00'),
       (?, 'debit', 'carte', 89.90, 12185.96, 'Achat Lidl ul. Wolska', 'Lidl', 'TXN-2024082901', '2024-08-29 12:40:00'),
       (?, 'debit', 'prelevement', 450.00, 12275.86, 'Cotisation ZUS', 'ZUS', 'ZUS-08-2024', '2024-08-28 00:00:00'),
       (?, 'debit', 'carte', 156.00, 12725.86, 'Restaurant Zapiecek Nowy Swiat', 'Zapiecek', 'TXN-2024082701', '2024-08-27 20:15:00'),
       (?, 'debit', 'retrait', 500.00, 12881.86, 'Retrait DAB Euronet Centrum', 'Euronet', 'ATM-2024082601', '2024-08-26 16:00:00'),
       (?, 'debit', 'carte', 78.50, 13381.86, 'Carrefour Express Mokotow', 'Carrefour Express', 'TXN-2024082501', '2024-08-25 10:20:00'),
       (?, 'credit', 'interet', 12.36, 13460.36, 'Interets crediteurs Q3', 'Caixa Banque Pologne', 'INT-Q3-2024', '2024-08-25 00:00:00'),
       (?, 'debit', 'carte', 45.00, 13448.00, 'Cinema Helios Arkadia', 'Helios', 'TXN-2024082401', '2024-08-24 19:30:00'),
       (?, 'debit', 'frais', 15.00, 13493.00, 'Frais tenue de compte aout', 'Caixa Banque Pologne', 'FRAIS-08-2024', '2024-08-23 00:00:00'),
       (?, 'debit', 'carte', 399.00, 13508.00, 'Achat MediaMarkt - Smartfon', 'MediaMarkt', 'TXN-2024082201', '2024-08-22 13:45:00'),
       (?, 'credit', 'virement_entrant', 4500.00, 13907.00, 'Salaire aout 2024', 'Entreprise ABC Sp. z o.o.', 'SAL-2024-08', '2024-08-10 06:00:00')`,
    Array(20).fill(acc1Id)
  );

  // Quelques transactions pour les autres clients
  await conn.query(
    `INSERT INTO bank_transactions
       (account_id, type, category, amount, balance_after, description, counterparty, reference, executed_at)
     VALUES
       (?, 'credit', 'virement_entrant', 3800.00, 8934.17, 'Salaire septembre', 'Firma XYZ', 'SAL-AN-09', '2024-09-10 06:00:00'),
       (?, 'debit', 'carte', 234.50, 8699.67, 'Achat Empik Galeria', 'Empik', 'TXN-AN-0912', '2024-09-12 14:30:00'),
       (?, 'credit', 'virement_entrant', 5200.00, 15672.89, 'Salaire septembre', 'Korporacja ABC', 'SAL-PW-09', '2024-09-10 06:00:00'),
       (?, 'debit', 'carte', 567.00, 15105.89, 'Achat RTV Euro AGD', 'Euro AGD', 'TXN-PW-0911', '2024-09-11 11:00:00')`,
    [acc4Id, acc4Id, acc6Id, acc6Id]
  );
  console.log("Transactions inserees.");

  // ============================================================
  // Cards
  // ============================================================

  await conn.query(
    `INSERT INTO bank_cards
       (account_id, client_id, card_number_last4, card_type, expiry_date, status,
        monthly_limit, contactless_enabled, online_payment_enabled)
     VALUES
       (?, ?, '4827', 'visa_gold', '2027-09-30', 'active', 5000.00, TRUE, TRUE),
       (?, ?, '9153', 'visa_debit', '2028-03-31', 'active', 2000.00, TRUE, TRUE),
       (?, ?, '3341', 'visa_classic', '2027-06-30', 'active', 3000.00, TRUE, TRUE),
       (?, ?, '7782', 'mastercard', '2028-01-31', 'active', 4000.00, TRUE, FALSE)`,
    [
      acc1Id, client1Id,
      acc1Id, client1Id,
      acc4Id, client2Id,
      acc6Id, client3Id,
    ]
  );
  console.log("Cartes bancaires inserees.");

  // ============================================================
  // Beneficiaries
  // ============================================================

  await conn.query(
    `INSERT INTO bank_beneficiaries
       (client_id, label, beneficiary_name, iban, bic, is_favorite)
     VALUES
       (?, 'Anna Kowalska', 'Anna Kowalska', 'PL83102010260000042200001234', 'BPKOPLPW', TRUE),
       (?, 'Loyer appartement', 'Immobiliare Sp. z o.o.', 'PL44116022020000000244471234', 'BIGBPLPW', TRUE),
       (?, 'Electricite PGE', 'PGE Polska Grupa Energetyczna', 'PL92124062471111001043198745', 'PKOPPLPW', FALSE),
       (?, 'Internet Netia', 'Netia S.A.', 'PL15109010140000071219009876', 'WBKPPLPP', FALSE),
       (?, 'Jan Kowalski', 'Jan Kowalski', 'PL61109010140000071219812874', 'WBKPPLPP', TRUE),
       (?, 'Agence voyages', 'Rainbow Tours S.A.', 'PL28114020040000300201354321', 'BREXPLPW', FALSE)`,
    [client1Id, client1Id, client1Id, client1Id, client2Id, client3Id]
  );
  console.log("Beneficiaires inseres.");

  // ============================================================
  // Loans
  // ============================================================

  await conn.query(
    `INSERT INTO bank_loans
       (client_id, loan_type, amount, interest_rate, duration_months,
        monthly_payment, remaining_amount, status, start_date, end_date)
     VALUES
       (?, 'immobilier', 350000.00, 3.45, 300, 1567.23, 312450.00, 'en_cours', '2022-06-01', '2047-06-01'),
       (?, 'consommation', 15000.00, 7.90, 36, 469.52, 8450.00, 'en_cours', '2023-09-01', '2026-09-01'),
       (?, 'auto', 45000.00, 5.20, 60, 852.34, 38200.00, 'en_cours', '2024-01-15', '2029-01-15')`,
    [client1Id, client2Id, client3Id]
  );
  console.log("Prets inseres.");

  // ============================================================
  // Messages
  // ============================================================

  await conn.query(
    `INSERT INTO bank_messages
       (client_id, subject, body, sender, is_read, created_at)
     VALUES
       (?, 'Bienvenue chez Caixa Banque Pologne',
        'Cher M. Kowalski, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif. N''hesitez pas a nous contacter pour toute question concernant nos services bancaires. Cordialement, L''equipe Caixa Banque Pologne.',
        'banque', TRUE, '2024-01-15 10:00:00'),
       (?, 'Votre nouvelle carte Visa Gold',
        'Votre carte Visa Gold est prete et sera livree a votre adresse dans un delai de 5 jours ouvrables. Le code PIN vous sera envoye separement. Votre plafond mensuel est fixe a 5 000 PLN.',
        'banque', FALSE, '2024-09-10 14:30:00'),
       (?, 'Mise a jour des conditions generales',
        'Nous vous informons que nos conditions generales ont ete mises a jour. Vous pouvez les consulter dans votre espace client ou dans nos agences. Les nouvelles conditions entrent en vigueur le 1er novembre 2024.',
        'banque', FALSE, '2024-09-08 09:00:00'),
       (?, 'Demande de releve annuel',
        'Bonjour, je souhaiterais recevoir un releve annuel de mon compte courant pour l''annee 2023. Merci de me l''envoyer par courrier a mon adresse. Cordialement, Jan Kowalski.',
        'client', TRUE, '2024-08-20 16:45:00'),
       (?, 'Bienvenue chez Caixa Banque Pologne',
        'Chere Mme Nowak, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif.',
        'banque', TRUE, '2024-02-10 10:00:00'),
       (?, 'Bienvenue chez Caixa Banque Pologne',
        'Cher M. Wisniewski, bienvenue chez Caixa Banque Pologne. Votre compte est actif.',
        'banque', TRUE, '2024-03-05 10:00:00')`,
    [client1Id, client1Id, client1Id, client1Id, client2Id, client3Id]
  );
  console.log("Messages inseres.");

  // ============================================================
  // Notifications
  // ============================================================

  await conn.query(
    `INSERT INTO bank_notifications
       (client_id, title, message, type, is_read, created_at)
     VALUES
       (?, 'Paiement carte recu', 'Paiement de 125.50 PLN chez Biedronka', 'info', FALSE, '2024-09-14 09:25:00'),
       (?, 'Virement recu', 'Virement de 4 500.00 PLN de Entreprise ABC', 'info', FALSE, '2024-09-10 06:05:00'),
       (?, 'Echeance pret immobilier', 'Le prelevement de 1 567.23 PLN pour votre pret immobilier a ete effectue', 'info', TRUE, '2024-09-05 00:05:00'),
       (?, 'Connexion inhabituelle detectee', 'Une connexion depuis un nouvel appareil a ete detectee. Si ce n''etait pas vous, contactez-nous immediatement.', 'securite', TRUE, '2024-09-01 22:30:00'),
       (?, 'Offre speciale epargne', 'Profitez d''un taux promotionnel de 4.5% sur votre livret epargne jusqu''au 31 decembre 2024', 'promotion', FALSE, '2024-08-28 10:00:00'),
       (?, 'Carte livree', 'Votre carte Visa Gold a ete livree a votre adresse', 'info', TRUE, '2024-08-15 14:00:00'),
       (?, 'Paiement carte recu', 'Paiement de 234.50 PLN chez Empik', 'info', FALSE, '2024-09-12 14:35:00'),
       (?, 'Virement recu', 'Virement de 3 800.00 PLN de Firma XYZ', 'info', TRUE, '2024-09-10 06:05:00'),
       (?, 'Paiement carte recu', 'Paiement de 567.00 PLN chez RTV Euro AGD', 'info', FALSE, '2024-09-11 11:05:00')`,
    [
      client1Id, client1Id, client1Id, client1Id, client1Id, client1Id,
      client2Id, client2Id,
      client3Id,
    ]
  );
  console.log("Notifications inserees.");

  console.log("Donnees de demonstration bancaires inserees avec succes.");
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
