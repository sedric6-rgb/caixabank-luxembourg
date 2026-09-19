import { db } from "@/lib/db";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import type { RowDataPacket } from "mysql2";

// ============================================================
// Types
// ============================================================

export interface BankClient {
  id: number;
  client_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  status: string;
}

export interface BankAccount {
  id: number;
  account_number: string;
  client_id: number;
  account_type: string;
  label: string;
  balance: number;
  currency: string;
  status: string;
}

export interface BankTransaction {
  id: number;
  account_id: number;
  type: string;
  category: string;
  amount: number;
  balance_after: number;
  description: string;
  counterparty: string;
  reference: string;
  executed_at: string;
}

export interface BankCard {
  id: number;
  account_id: number;
  client_id: number;
  card_number_last4: string;
  card_type: string;
  expiry_date: string;
  status: string;
  monthly_limit: number;
  contactless_enabled: boolean;
  online_payment_enabled: boolean;
}

export interface BankLoan {
  id: number;
  client_id: number;
  loan_type: string;
  amount: number;
  interest_rate: number;
  duration_months: number;
  monthly_payment: number;
  remaining_amount: number;
  status: string;
  start_date: string;
  end_date: string;
}

export interface BankBeneficiary {
  id: number;
  client_id: number;
  label: string;
  beneficiary_name: string;
  iban: string;
  bic: string;
  is_favorite: boolean;
}

export interface BankMessage {
  id: number;
  client_id: number;
  subject: string;
  body: string;
  sender: string;
  is_read: boolean;
  created_at: string;
}

export interface BankNotification {
  id: number;
  client_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalClients: number;
  activeAccounts: number;
  totalDeposits: string;
  pendingLoans: number;
  newClientsThisMonth: number;
  transactionsToday: number;
}

// ============================================================
// Donnees de demonstration generees depuis DEMO_CLIENTS
// ============================================================

function getDemoClient(clientId: number): BankClient | null {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return null;
  return {
    id: c.id, client_number: c.client_number,
    first_name: c.first_name, last_name: c.last_name,
    email: c.email, phone: c.phone, date_of_birth: c.date_of_birth,
    address: c.address, city: c.city, postal_code: c.postal_code,
    country: c.country, status: c.status,
  };
}

function getDemoAccounts(clientId: number): BankAccount[] {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  return c.accounts.map((a, i) => ({
    id: clientId * 100 + i + 1,
    account_number: a.number,
    client_id: clientId,
    account_type: a.type,
    label: a.label,
    balance: a.balance,
    currency: "EUR",
    status: "actif",
  }));
}

function getDemoTransactions(accountId: number): BankTransaction[] {
  const clientId = Math.floor(accountId / 100);
  const acctIdx = (accountId % 100) - 1;
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  return c.transactions.map((tx, i) => {
    const isCredit = tx.amount >= 0;
    const parts = tx.desc.split(" — ");
    return {
      id: accountId * 1000 + i + 1,
      account_id: accountId,
      type: isCredit ? "credit" : "debit",
      category: isCredit ? "virement_entrant" : "carte",
      amount: Math.abs(tx.amount),
      balance_after: c.accounts[acctIdx]?.balance ?? 0,
      description: tx.desc,
      counterparty: parts[1] || parts[0],
      reference: `TXN-${clientId}-${i + 1}`,
      executed_at: convertDate(tx.date),
    };
  });
}

function convertDate(d: string): string {
  const [day, month, year] = d.split("/");
  return `${year}-${month}-${day}T12:00:00`;
}

function getDemoCards(clientId: number): BankCard[] {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  const baseAcctId = clientId * 100 + 1;
  const CARD_LIMITS: Record<string, number> = {
    "Visa Infinite": 50000, "Visa Platinum": 20000, "Visa Gold": 10000,
    "Visa Classic": 3000, "Mastercard Gold": 10000, "Mastercard Classic": 3000,
    "Visa Debit": 2000, "Visa Business": 15000,
  };
  return c.cards.map((card, i) => ({
    id: clientId * 100 + i + 1,
    account_id: baseAcctId,
    client_id: clientId,
    card_number_last4: card.last4,
    card_type: card.type.toLowerCase().replace(/ /g, "_"),
    expiry_date: `20${card.expiry.split("/")[1]}-${card.expiry.split("/")[0]}-28`,
    status: card.status === "Active" ? "active" : "bloquee",
    monthly_limit: CARD_LIMITS[card.type] || 5000,
    contactless_enabled: true,
    online_payment_enabled: true,
  }));
}

function getDemoLoans(clientId: number): BankLoan[] {
  return [];
}

function getDemoBeneficiaries(clientId: number): BankBeneficiary[] {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  const otherClients = DEMO_CLIENTS.filter((cl) => cl.id !== clientId).slice(0, 3);
  const base: BankBeneficiary[] = otherClients.map((oc, i) => ({
    id: clientId * 100 + i + 1,
    client_id: clientId,
    label: `${oc.first_name} ${oc.last_name}`,
    beneficiary_name: `${oc.first_name} ${oc.last_name}`,
    iban: oc.accounts[0]?.number || "",
    bic: "CABORLULL",
    is_favorite: i === 0,
  }));
  const extra = (c._beneficiaries || []).map((b) => ({
    id: b.id,
    client_id: clientId,
    label: b.label,
    beneficiary_name: b.name,
    iban: b.iban,
    bic: b.bic,
    is_favorite: b.favorite,
  }));
  return [...base, ...extra];
}

function getDemoMessages(clientId: number): BankMessage[] {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  return [
    {
      id: clientId * 10 + 1, client_id: clientId,
      subject: "Bienvenue chez CaixaBank Luxembourg",
      body: `Cher(e) ${c.first_name} ${c.last_name}, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif. N'hesitez pas a nous contacter pour toute question. Cordialement, L'equipe CaixaBank Luxembourg.`,
      sender: "banque", is_read: true, created_at: "2024-01-15",
    },
    {
      id: clientId * 10 + 2, client_id: clientId,
      subject: "Mise a jour de vos conditions tarifaires",
      body: "Nous vous informons que vos conditions tarifaires ont ete mises a jour. Vous pouvez consulter le detail dans la rubrique Tarifs de votre espace client.",
      sender: "banque", is_read: false, created_at: "2024-09-10",
    },
  ];
}

function getDemoNotifications(clientId: number): BankNotification[] {
  const c = DEMO_CLIENTS.find((cl) => cl.id === clientId);
  if (!c) return [];
  const notifs: BankNotification[] = [];
  if (c.transactions.length > 0) {
    const tx = c.transactions[0];
    notifs.push({
      id: clientId * 10 + 1, client_id: clientId,
      title: tx.amount >= 0 ? "Virement recu" : "Paiement effectue",
      message: tx.desc,
      type: "info", is_read: false, created_at: "2024-09-14",
    });
  }
  notifs.push({
    id: clientId * 10 + 2, client_id: clientId,
    title: "Offre speciale epargne",
    message: "Profitez d'un taux promotionnel de 4.5% sur votre livret epargne",
    type: "promotion", is_read: false, created_at: "2024-08-28",
  });
  return notifs;
}

const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalClients: DEMO_CLIENTS.length,
  activeAccounts: DEMO_CLIENTS.reduce((s, c) => s + c.accounts.length, 0),
  totalDeposits: new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(
    DEMO_CLIENTS.reduce((s, c) => s + c.accounts.reduce((a, acc) => a + acc.balance, 0), 0)
  ) + " EUR",
  pendingLoans: 3,
  newClientsThisMonth: 4,
  transactionsToday: DEMO_CLIENTS.reduce((s, c) => s + c.transactions.length, 0),
};

// ============================================================
// Fonctions de requete
// ============================================================

/**
 * Recupere un client par son ID.
 */
export async function getClientById(
  clientId: number
): Promise<BankClient | null> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, client_number, first_name, last_name, email, phone,
              date_of_birth, address, city, postal_code, country, status
       FROM bank_clients WHERE id = ?`,
      [clientId]
    );
    if (rows.length === 0) return null;
    return rows[0] as BankClient;
  } catch {
    return getDemoClient(clientId);
  }
}

/**
 * Recupere tous les comptes d'un client.
 */
export async function getClientAccounts(
  clientId: number
): Promise<BankAccount[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, account_number, client_id, account_type, label,
              balance, currency, status
       FROM bank_accounts WHERE client_id = ? ORDER BY id`,
      [clientId]
    );
    return rows as BankAccount[];
  } catch {
    return getDemoAccounts(clientId);
  }
}

/**
 * Recupere un compte par son ID.
 */
export async function getAccountById(
  accountId: number
): Promise<BankAccount | null> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, account_number, client_id, account_type, label,
              balance, currency, status
       FROM bank_accounts WHERE id = ?`,
      [accountId]
    );
    if (rows.length === 0) return null;
    return rows[0] as BankAccount;
  } catch {
    for (const c of DEMO_CLIENTS) {
      const accts = getDemoAccounts(c.id);
      const found = accts.find((a) => a.id === accountId);
      if (found) return found;
    }
    return null;
  }
}

/**
 * Recupere les transactions d'un compte (les 50 dernieres par defaut).
 */
export async function getAccountTransactions(
  accountId: number,
  limit: number = 50
): Promise<BankTransaction[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, account_id, type, category, amount, balance_after,
              description, counterparty, reference, executed_at
       FROM bank_transactions
       WHERE account_id = ?
       ORDER BY executed_at DESC
       LIMIT ?`,
      [accountId, limit]
    );
    return rows as BankTransaction[];
  } catch {
    return getDemoTransactions(accountId).slice(0, limit);
  }
}

/**
 * Recupere les cartes d'un client.
 */
export async function getClientCards(clientId: number): Promise<BankCard[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, account_id, client_id, card_number_last4, card_type,
              expiry_date, status, monthly_limit, contactless_enabled,
              online_payment_enabled
       FROM bank_cards WHERE client_id = ? ORDER BY id`,
      [clientId]
    );
    return rows as BankCard[];
  } catch {
    return getDemoCards(clientId);
  }
}

/**
 * Recupere les prets d'un client.
 */
export async function getClientLoans(clientId: number): Promise<BankLoan[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, client_id, loan_type, amount, interest_rate,
              duration_months, monthly_payment, remaining_amount,
              status, start_date, end_date
       FROM bank_loans WHERE client_id = ? ORDER BY id`,
      [clientId]
    );
    return rows as BankLoan[];
  } catch {
    return getDemoLoans(clientId);
  }
}

/**
 * Recupere les beneficiaires d'un client.
 */
export async function getClientBeneficiaries(
  clientId: number
): Promise<BankBeneficiary[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, client_id, label, beneficiary_name, iban, bic, is_favorite
       FROM bank_beneficiaries WHERE client_id = ?
       ORDER BY is_favorite DESC, label`,
      [clientId]
    );
    return rows as BankBeneficiary[];
  } catch {
    return getDemoBeneficiaries(clientId);
  }
}

/**
 * Recupere les messages d'un client.
 */
export async function getClientMessages(
  clientId: number
): Promise<BankMessage[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, client_id, subject, body, sender, is_read, created_at
       FROM bank_messages WHERE client_id = ?
       ORDER BY created_at DESC`,
      [clientId]
    );
    return rows as BankMessage[];
  } catch {
    return getDemoMessages(clientId);
  }
}

/**
 * Recupere les notifications d'un client.
 */
export async function getClientNotifications(
  clientId: number
): Promise<BankNotification[]> {
  try {
    if (!db) throw new Error("no db");
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, client_id, title, message, type, is_read, created_at
       FROM bank_notifications WHERE client_id = ?
       ORDER BY created_at DESC`,
      [clientId]
    );
    return rows as BankNotification[];
  } catch {
    return getDemoNotifications(clientId);
  }
}

/**
 * Recupere les statistiques pour le tableau de bord admin.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    if (!db) throw new Error("no db");
    const [[clientRow]] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM bank_clients"
    );
    const [[accountRow]] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM bank_accounts WHERE status = 'actif'"
    );
    const [[depositRow]] = await db.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(balance), 0) as total FROM bank_accounts WHERE status = 'actif'"
    );
    const [[loanRow]] = await db.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM bank_loans WHERE status = 'demande'"
    );
    const [[newClientRow]] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM bank_clients
       WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`
    );
    const [[txnRow]] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM bank_transactions
       WHERE DATE(executed_at) = CURDATE()`
    );

    const totalDeposits = Number(depositRow.total);
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalDeposits);

    return {
      totalClients: Number(clientRow.total),
      activeAccounts: Number(accountRow.total),
      totalDeposits: `${formatted} EUR`,
      pendingLoans: Number(loanRow.total),
      newClientsThisMonth: Number(newClientRow.total),
      transactionsToday: Number(txnRow.total),
    };
  } catch {
    return DEMO_DASHBOARD_STATS;
  }
}
