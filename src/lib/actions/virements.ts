"use server";

import { getClientSession } from "@/lib/auth-client";
import { DEMO_CLIENTS } from "@/lib/demo-data";

let nextBenId = 10000;
let nextTxId = 900000;

export async function addBeneficiaryAction(formData: FormData): Promise<{ success: boolean; error?: string; id?: number }> {
  const session = await getClientSession();
  if (!session) return { success: false, error: "Non connecte" };

  const label = String(formData.get("label") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const iban = String(formData.get("iban") || "").trim().toUpperCase();
  const bic = String(formData.get("bic") || "CABORLULLUX").trim().toUpperCase();

  if (!label || !name || !iban) {
    return { success: false, error: "Veuillez remplir tous les champs obligatoires" };
  }

  if (iban.length < 15) {
    return { success: false, error: "IBAN invalide" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === session.clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  const id = ++nextBenId;

  if (!client._beneficiaries) {
    client._beneficiaries = [];
  }
  client._beneficiaries.push({ id, label, name, iban, bic, favorite: false });

  return { success: true, id };
}

export async function executeVirementAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const session = await getClientSession();
  if (!session) return { success: false, error: "Non connecte" };

  const sourceAccountId = Number(formData.get("source_account_id"));
  const beneficiaryName = String(formData.get("beneficiary_name") || "").trim();
  const beneficiaryIban = String(formData.get("beneficiary_iban") || "").trim();
  const amount = parseFloat(String(formData.get("amount") || "0"));
  const motif = String(formData.get("motif") || "").trim();
  const saveBeneficiary = formData.get("save_beneficiary") === "true";
  const benLabel = String(formData.get("ben_label") || beneficiaryName).trim();

  if (!sourceAccountId || !beneficiaryName || !beneficiaryIban || !amount) {
    return { success: false, error: "Informations incompletes" };
  }

  if (amount <= 0) {
    return { success: false, error: "Le montant doit etre superieur a 0" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === session.clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  const acctIdx = client.accounts.findIndex((_, i) => session.clientId * 100 + i + 1 === sourceAccountId);
  if (acctIdx === -1) return { success: false, error: "Compte introuvable" };

  const account = client.accounts[acctIdx];
  if (account.balance < amount) {
    return { success: false, error: "Solde insuffisant" };
  }

  account.balance -= amount;

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
  const desc = motif
    ? `Virement vers ${beneficiaryName} — ${motif}`
    : `Virement vers ${beneficiaryName}`;

  client.transactions.unshift({
    date: dateStr,
    desc,
    amount: -amount,
  });

  if (saveBeneficiary) {
    if (!client._beneficiaries) {
      client._beneficiaries = [];
    }
    const alreadyExists = client._beneficiaries.some((b) => b.iban === beneficiaryIban) ||
      DEMO_CLIENTS.filter((c) => c.id !== session.clientId).slice(0, 3).some((oc) => oc.accounts[0]?.number === beneficiaryIban);

    if (!alreadyExists) {
      client._beneficiaries.push({
        id: ++nextBenId,
        label: benLabel,
        name: beneficiaryName,
        iban: beneficiaryIban,
        bic: "CABORLULLUX",
        favorite: false,
      });
    }
  }

  return { success: true };
}
