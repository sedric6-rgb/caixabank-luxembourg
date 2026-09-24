"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./admin-guard";
import { ensureState, persist } from "@/lib/state";
import { DEMO_CLIENTS, type DemoAccount, type DemoCard, type DemoTx } from "@/lib/demo-data";
import { INSURANCES, newInsuranceId, type Insurance } from "@/lib/insurances-store";
import { MANDATES, newMandateId, type Mandate } from "@/lib/mandates-store";

type Result<T = object> = ({ success: true } & T) | { success: false; error: string };

function today(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function findAccount(number: string) {
  for (const client of DEMO_CLIENTS) {
    const account = client.accounts.find((a) => a.number === number);
    if (account) return { client, account };
  }
  return null;
}

function refresh() {
  revalidatePath("/admin", "layout");
  revalidatePath("/espace-client", "layout");
}

const ACCOUNT_LABELS: Record<DemoAccount["type"], string> = {
  courant: "Compte Courant",
  epargne: "Livret Epargne",
  professionnel: "Compte Pro",
};

export async function adminCreateAccountAction(
  clientId: number,
  type: DemoAccount["type"],
  balance: number
): Promise<Result<{ account: DemoAccount }>> {
  await requireAdmin();
  await ensureState();
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (!client) return { success: false, error: "Client introuvable" };
  if (!ACCOUNT_LABELS[type]) return { success: false, error: "Type de compte invalide" };
  if (!Number.isFinite(balance) || balance < 0) return { success: false, error: "Solde initial invalide" };

  const r = () => String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  let number: string;
  do {
    number = `LU${r().slice(0, 2)} 0019 ${r()} ${r()} ${r()} ${r()} ${r()}`;
  } while (findAccount(number));

  const account: DemoAccount = { label: ACCOUNT_LABELS[type], number, balance, type };
  client.accounts.push(account);
  if (balance > 0) client.transactions.unshift({ date: today(), desc: `Depot initial — ${account.label}`, amount: balance });
  await persist("clients");
  refresh();
  return { success: true, account };
}

export async function adminInternalTransferAction(fromNumber: string, toNumber: string, amount: number): Promise<Result> {
  await requireAdmin();
  await ensureState();
  if (fromNumber === toNumber) return { success: false, error: "Les comptes source et destination doivent etre differents" };
  if (!Number.isFinite(amount) || amount <= 0) return { success: false, error: "Montant invalide" };
  const from = findAccount(fromNumber);
  const to = findAccount(toNumber);
  if (!from || !to) return { success: false, error: "Compte introuvable" };

  from.account.balance -= amount;
  to.account.balance += amount;
  const date = today();
  const fromName = `${from.client.first_name} ${from.client.last_name}`;
  const toName = `${to.client.first_name} ${to.client.last_name}`;
  from.client.transactions.unshift({ date, desc: `Virement vers ${toName} — Virement interne`, amount: -amount });
  to.client.transactions.unshift({ date, desc: `Virement de ${fromName} — Virement interne`, amount });
  await persist("clients");
  refresh();
  return { success: true };
}

function sameTx(a: DemoTx, b: DemoTx) {
  return a.date === b.date && a.desc === b.desc && a.amount === b.amount;
}

// The transaction is identified by its position and checked against its previous content, since transactions have no id.
export async function adminUpdateTransactionAction(
  clientId: number,
  accountNumber: string,
  index: number,
  previous: DemoTx,
  updated: DemoTx
): Promise<Result> {
  await requireAdmin();
  await ensureState();
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  const account = client?.accounts.find((a) => a.number === accountNumber);
  const current = client?.transactions[index];
  if (!client || !account || !current || !sameTx(current, previous)) {
    return { success: false, error: "Operation introuvable, actualisez la page" };
  }
  if (!Number.isFinite(updated.amount)) return { success: false, error: "Montant invalide" };
  account.balance += updated.amount - current.amount;
  client.transactions[index] = { date: updated.date, desc: updated.desc, amount: updated.amount };
  await persist("clients");
  refresh();
  return { success: true };
}

export async function adminDeleteTransactionAction(
  clientId: number,
  accountNumber: string,
  index: number,
  previous: DemoTx
): Promise<Result> {
  await requireAdmin();
  await ensureState();
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  const account = client?.accounts.find((a) => a.number === accountNumber);
  const current = client?.transactions[index];
  if (!client || !account || !current || !sameTx(current, previous)) {
    return { success: false, error: "Operation introuvable, actualisez la page" };
  }
  account.balance -= current.amount;
  client.transactions.splice(index, 1);
  await persist("clients");
  refresh();
  return { success: true };
}

const CARD_STATUSES = ["active", "bloquee", "opposed", "en_fabrication"];

export async function adminSetCardStatusAction(clientId: number, last4: string, status: string): Promise<Result> {
  await requireAdmin();
  await ensureState();
  if (!CARD_STATUSES.includes(status)) return { success: false, error: "Statut invalide" };
  const card = DEMO_CLIENTS.find((c) => c.id === clientId)?.cards.find((c) => c.last4 === last4);
  if (!card) return { success: false, error: "Carte introuvable" };
  card.status = status;
  await persist("clients");
  refresh();
  return { success: true };
}

export async function adminOrderCardAction(clientId: number, type: string): Promise<Result<{ card: DemoCard }>> {
  await requireAdmin();
  await ensureState();
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (!client) return { success: false, error: "Client introuvable" };
  if (!type.trim()) return { success: false, error: "Type de carte requis" };
  let last4: string;
  do {
    last4 = String(Math.floor(1000 + Math.random() * 9000));
  } while (client.cards.some((c) => c.last4 === last4));
  const d = new Date();
  const card: DemoCard = {
    last4,
    type: type.trim(),
    status: "en_fabrication",
    expiry: `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 4}`,
  };
  client.cards.push(card);
  await persist("clients");
  refresh();
  return { success: true, card };
}

export async function adminCreateInsuranceAction(
  data: Pick<Insurance, "clientId" | "type" | "formule" | "prime" | "couverture">
): Promise<Result<{ insurance: Insurance }>> {
  await requireAdmin();
  await ensureState();
  const client = DEMO_CLIENTS.find((c) => c.id === data.clientId);
  if (!client) return { success: false, error: "Client introuvable" };
  if (!data.type || !data.formule || !Number.isFinite(data.prime) || data.prime < 0 || !Number.isFinite(data.couverture) || data.couverture < 0) {
    return { success: false, error: "Informations du contrat invalides" };
  }
  const d = new Date();
  const ech = new Date(d.getFullYear() + (data.type === "Vie" ? 30 : 1), d.getMonth(), d.getDate());
  const insurance: Insurance = {
    id: newInsuranceId(),
    clientId: client.id,
    client: `${client.first_name} ${client.last_name}`,
    type: data.type,
    formule: data.formule,
    prime: data.prime,
    couverture: data.couverture,
    status: "en_attente",
    debut: today(),
    echeance: `${String(ech.getDate()).padStart(2, "0")}/${String(ech.getMonth() + 1).padStart(2, "0")}/${ech.getFullYear()}`,
  };
  INSURANCES.push(insurance);
  await persist("insurances");
  refresh();
  return { success: true, insurance };
}

export async function adminSetInsuranceStatusAction(id: number, status: "active" | "resiliee"): Promise<Result> {
  await requireAdmin();
  await ensureState();
  if (status !== "active" && status !== "resiliee") return { success: false, error: "Statut invalide" };
  const insurance = INSURANCES.find((i) => i.id === id);
  if (!insurance) return { success: false, error: "Contrat introuvable" };
  insurance.status = status;
  await persist("insurances");
  refresh();
  return { success: true };
}

export async function adminCreateMandateAction(
  data: Pick<Mandate, "creditor" | "debtor" | "amount" | "frequency" | "nextDate">
): Promise<Result<{ mandate: Mandate }>> {
  await requireAdmin();
  await ensureState();
  if (!data.creditor.trim() || !data.debtor.trim() || !Number.isFinite(data.amount) || data.amount <= 0) {
    return { success: false, error: "Informations du mandat invalides" };
  }
  const id = newMandateId();
  const mandate: Mandate = {
    id,
    creditor: data.creditor.trim(),
    debtor: data.debtor.trim(),
    rum: `MNDT-${new Date().getFullYear()}-${String(id).padStart(3, "0")}`,
    amount: data.amount,
    frequency: data.frequency,
    nextDate: data.nextDate,
    status: "En attente",
  };
  MANDATES.unshift(mandate);
  await persist("mandates");
  refresh();
  return { success: true, mandate };
}

export async function adminToggleMandateAction(id: number): Promise<Result<{ status: Mandate["status"] }>> {
  await requireAdmin();
  await ensureState();
  const mandate = MANDATES.find((m) => m.id === id);
  if (!mandate) return { success: false, error: "Mandat introuvable" };
  if (mandate.status !== "Actif" && mandate.status !== "Suspendu") {
    return { success: false, error: "Seul un mandat actif ou suspendu peut changer d'etat" };
  }
  mandate.status = mandate.status === "Actif" ? "Suspendu" : "Actif";
  await persist("mandates");
  refresh();
  return { success: true, status: mandate.status };
}
