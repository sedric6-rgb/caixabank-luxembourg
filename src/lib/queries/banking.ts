import { db } from "@/lib/db";
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
// Donnees de demonstration
// ============================================================

const DEMO_CLIENT: BankClient = {
  id: 1,
  client_number: "CBP-284751",
  first_name: "Jan",
  last_name: "Kowalski",
  email: "jan.kowalski@email.lu",
  phone: "+352 621 345 678",
  date_of_birth: "1985-03-15",
  address: "12 Av. de la Gare",
  city: "Luxembourg",
  postal_code: "1611",
  country: "Luxembourg",
  status: "actif",
};

const DEMO_ACCOUNTS: BankAccount[] = [
  {
    id: 1,
    account_number: "LU61 0019 1014 0000 0712 1981 2874",
    client_id: 1,
    account_type: "courant",
    label: "Compte Courant",
    balance: 12847.53,
    currency: "EUR",
    status: "actif",
  },
  {
    id: 2,
    account_number: "LU27 0019 2004 0000 3002 0135 5387",
    client_id: 1,
    account_type: "epargne",
    label: "Livret Epargne",
    balance: 45230.0,
    currency: "EUR",
    status: "actif",
  },
  {
    id: 3,
    account_number: "LU10 0019 0099 7603 1234 5678 9012",
    client_id: 1,
    account_type: "professionnel",
    label: "Compte Pro",
    balance: 89415.22,
    currency: "EUR",
    status: "actif",
  },
];

const DEMO_TRANSACTIONS: BankTransaction[] = [
  {
    id: 1,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 125.5,
    balance_after: 12847.53,
    description: "Achat Cactus Belle Etoile",
    counterparty: "Cactus",
    reference: "TXN-2024091401",
    executed_at: "2024-09-14T09:23:00",
  },
  {
    id: 2,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 42.9,
    balance_after: 12973.03,
    description: "Achat Delhaize Kirchberg",
    counterparty: "Delhaize",
    reference: "TXN-2024091302",
    executed_at: "2024-09-13T18:45:00",
  },
  {
    id: 3,
    account_id: 1,
    type: "credit",
    category: "virement_entrant",
    amount: 4500.0,
    balance_after: 13015.93,
    description: "Salaire septembre 2024",
    counterparty: "Entreprise ABC S.à r.l.",
    reference: "SAL-2024-09",
    executed_at: "2024-09-10T06:00:00",
  },
  {
    id: 4,
    account_id: 1,
    type: "debit",
    category: "prelevement",
    amount: 1567.23,
    balance_after: 8515.93,
    description: "Echeance pret immobilier",
    counterparty: "CaixaBank Luxembourg",
    reference: "PRET-IMM-09",
    executed_at: "2024-09-05T00:00:00",
  },
  {
    id: 5,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 234.0,
    balance_after: 10083.16,
    description: "Achat Amazon.lu - Elektronik",
    counterparty: "Amazon.lu",
    reference: "TXN-2024090501",
    executed_at: "2024-09-04T14:12:00",
  },
  {
    id: 6,
    account_id: 1,
    type: "debit",
    category: "prelevement",
    amount: 189.0,
    balance_after: 10317.16,
    description: "Abonnement POST Telecom",
    counterparty: "POST Luxembourg",
    reference: "ORANGE-09-2024",
    executed_at: "2024-09-03T00:00:00",
  },
  {
    id: 7,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 67.3,
    balance_after: 10506.16,
    description: "Achat Di Luxembourg Gare",
    counterparty: "Di",
    reference: "TXN-2024090301",
    executed_at: "2024-09-03T11:30:00",
  },
  {
    id: 8,
    account_id: 1,
    type: "debit",
    category: "virement_sortant",
    amount: 2500.0,
    balance_after: 10573.46,
    description: "Loyer septembre",
    counterparty: "Immobiliare S.à r.l.",
    reference: "LOYER-09-2024",
    executed_at: "2024-09-01T08:00:00",
  },
  {
    id: 9,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 312.5,
    balance_after: 13073.46,
    description: "Billet CFL Luxembourg-Bruxelles",
    counterparty: "CFL",
    reference: "TXN-2024083101",
    executed_at: "2024-08-31T07:15:00",
  },
  {
    id: 10,
    account_id: 1,
    type: "credit",
    category: "virement_entrant",
    amount: 1200.0,
    balance_after: 13385.96,
    description: "Remboursement Anna Kowalska",
    counterparty: "Anna Kowalska",
    reference: "VIR-AK-0831",
    executed_at: "2024-08-30T15:20:00",
  },
  {
    id: 11,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 89.9,
    balance_after: 12185.96,
    description: "Achat Lidl Esch-sur-Alzette",
    counterparty: "Lidl",
    reference: "TXN-2024082901",
    executed_at: "2024-08-29T12:40:00",
  },
  {
    id: 12,
    account_id: 1,
    type: "debit",
    category: "prelevement",
    amount: 450.0,
    balance_after: 12275.86,
    description: "Cotisation CCSS",
    counterparty: "CCSS",
    reference: "ZUS-08-2024",
    executed_at: "2024-08-28T00:00:00",
  },
  {
    id: 13,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 156.0,
    balance_after: 12725.86,
    description: "Restaurant Mosconi Place Guillaume",
    counterparty: "Mosconi",
    reference: "TXN-2024082701",
    executed_at: "2024-08-27T20:15:00",
  },
  {
    id: 14,
    account_id: 1,
    type: "debit",
    category: "retrait",
    amount: 500.0,
    balance_after: 12881.86,
    description: "Retrait DAB CaixaBank Gare",
    counterparty: "CaixaBank",
    reference: "ATM-2024082601",
    executed_at: "2024-08-26T16:00:00",
  },
  {
    id: 15,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 78.5,
    balance_after: 13381.86,
    description: "Auchan Kirchberg",
    counterparty: "Auchan",
    reference: "TXN-2024082501",
    executed_at: "2024-08-25T10:20:00",
  },
  {
    id: 16,
    account_id: 1,
    type: "credit",
    category: "interet",
    amount: 12.36,
    balance_after: 13460.36,
    description: "Interets crediteurs Q3",
    counterparty: "CaixaBank Luxembourg",
    reference: "INT-Q3-2024",
    executed_at: "2024-08-25T00:00:00",
  },
  {
    id: 17,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 45.0,
    balance_after: 13448.0,
    description: "Cinema Kinepolis Kirchberg",
    counterparty: "Kinepolis",
    reference: "TXN-2024082401",
    executed_at: "2024-08-24T19:30:00",
  },
  {
    id: 18,
    account_id: 1,
    type: "debit",
    category: "frais",
    amount: 15.0,
    balance_after: 13493.0,
    description: "Frais tenue de compte aout",
    counterparty: "CaixaBank Luxembourg",
    reference: "FRAIS-08-2024",
    executed_at: "2024-08-23T00:00:00",
  },
  {
    id: 19,
    account_id: 1,
    type: "debit",
    category: "carte",
    amount: 399.0,
    balance_after: 13508.0,
    description: "Achat Saturn - Smartphone",
    counterparty: "Saturn",
    reference: "TXN-2024082201",
    executed_at: "2024-08-22T13:45:00",
  },
  {
    id: 20,
    account_id: 1,
    type: "credit",
    category: "virement_entrant",
    amount: 4500.0,
    balance_after: 13907.0,
    description: "Salaire aout 2024",
    counterparty: "Entreprise ABC S.à r.l.",
    reference: "SAL-2024-08",
    executed_at: "2024-08-10T06:00:00",
  },
];

const DEMO_CARDS: BankCard[] = [
  {
    id: 1,
    account_id: 1,
    client_id: 1,
    card_number_last4: "4827",
    card_type: "visa_gold",
    expiry_date: "2027-09-30",
    status: "active",
    monthly_limit: 5000,
    contactless_enabled: true,
    online_payment_enabled: true,
  },
  {
    id: 2,
    account_id: 1,
    client_id: 1,
    card_number_last4: "9153",
    card_type: "visa_debit",
    expiry_date: "2028-03-31",
    status: "active",
    monthly_limit: 2000,
    contactless_enabled: true,
    online_payment_enabled: true,
  },
];

const DEMO_LOANS: BankLoan[] = [
  {
    id: 1,
    client_id: 1,
    loan_type: "immobilier",
    amount: 350000,
    interest_rate: 3.45,
    duration_months: 300,
    monthly_payment: 1567.23,
    remaining_amount: 312450.0,
    status: "en_cours",
    start_date: "2022-06-01",
    end_date: "2047-06-01",
  },
];

const DEMO_BENEFICIARIES: BankBeneficiary[] = [
  {
    id: 1,
    client_id: 1,
    label: "Anna Kowalska",
    beneficiary_name: "Anna Kowalska",
    iban: "LU83 0019 1014 0000 4220 0012 34",
    bic: "CABORLULL",
    is_favorite: true,
  },
  {
    id: 2,
    client_id: 1,
    label: "Loyer appartement",
    beneficiary_name: "Immobiliare S.à r.l.",
    iban: "LU44 0030 2202 0000 0024 4712 34",
    bic: "BGLLLULL",
    is_favorite: true,
  },
  {
    id: 3,
    client_id: 1,
    label: "Electricite Enovos",
    beneficiary_name: "Enovos Luxembourg S.A.",
    iban: "LU92 0099 6247 1111 0010 4319 87",
    bic: "BILLLULL",
    is_favorite: false,
  },
];

const DEMO_MESSAGES: BankMessage[] = [
  {
    id: 1,
    client_id: 1,
    subject: "Bienvenue chez CaixaBank Luxembourg",
    body: "Cher M. Kowalski, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif. N'hesitez pas a nous contacter pour toute question concernant nos services bancaires. Cordialement, L'equipe CaixaBank Luxembourg.",
    sender: "banque",
    is_read: true,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    client_id: 1,
    subject: "Votre nouvelle carte Visa Gold",
    body: "Votre carte Visa Gold est prete et sera livree a votre adresse dans un delai de 5 jours ouvrables. Le code PIN vous sera envoye separement. Votre plafond mensuel est fixe a 5 000 EUR.",
    sender: "banque",
    is_read: false,
    created_at: "2024-09-10",
  },
];

const DEMO_NOTIFICATIONS: BankNotification[] = [
  {
    id: 1,
    client_id: 1,
    title: "Paiement carte recu",
    message: "Paiement de 125.50 EUR chez Cactus",
    type: "info",
    is_read: false,
    created_at: "2024-09-14",
  },
  {
    id: 2,
    client_id: 1,
    title: "Virement recu",
    message: "Virement de 4 500.00 EUR de Entreprise ABC",
    type: "info",
    is_read: false,
    created_at: "2024-09-13",
  },
  {
    id: 3,
    client_id: 1,
    title: "Echeance pret immobilier",
    message: "Le prelevement de 1 567.23 EUR pour votre pret immobilier a ete effectue",
    type: "info",
    is_read: true,
    created_at: "2024-09-05",
  },
  {
    id: 4,
    client_id: 1,
    title: "Connexion inhabituelle detectee",
    message: "Une connexion depuis un nouvel appareil a ete detectee. Si ce n'etait pas vous, contactez-nous immediatement.",
    type: "securite",
    is_read: true,
    created_at: "2024-09-01",
  },
  {
    id: 5,
    client_id: 1,
    title: "Offre speciale epargne",
    message: "Profitez d'un taux promotionnel de 4.5% sur votre livret epargne jusqu'au 31 decembre 2024",
    type: "promotion",
    is_read: false,
    created_at: "2024-08-28",
  },
];

const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalClients: 1247,
  activeAccounts: 2891,
  totalDeposits: "45 230 847,53 EUR",
  pendingLoans: 23,
  newClientsThisMonth: 47,
  transactionsToday: 1893,
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
    if (DEMO_CLIENT.id === clientId) return DEMO_CLIENT;
    return null;
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
    return DEMO_ACCOUNTS.filter((a) => a.client_id === clientId);
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
    return DEMO_ACCOUNTS.find((a) => a.id === accountId) ?? null;
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
    return DEMO_TRANSACTIONS.filter((t) => t.account_id === accountId).slice(
      0,
      limit
    );
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
    return DEMO_CARDS.filter((c) => c.client_id === clientId);
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
    return DEMO_LOANS.filter((l) => l.client_id === clientId);
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
    return DEMO_BENEFICIARIES.filter((b) => b.client_id === clientId);
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
    return DEMO_MESSAGES.filter((m) => m.client_id === clientId);
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
    return DEMO_NOTIFICATIONS.filter((n) => n.client_id === clientId);
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
