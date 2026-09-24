"use server";

import { ensureState, persist } from "@/lib/state";
import { requireAdmin } from "./admin-guard";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { createLoan, approveLoan, refuseLoan, getAllLoans } from "@/lib/loans-store";
import { revalidatePath } from "next/cache";

const RATES: Record<string, number> = {
  Immobilier: 3.45,
  Consommation: 5.80,
  Auto: 4.30,
  Etudiant: 2.00,
  Professionnel: 4.10,
};

export async function adminCreateLoanAction(formData: FormData): Promise<{ success: boolean; error?: string; loanId?: number }> {
  await requireAdmin();
  await ensureState();
  const clientId = Number(formData.get("clientId"));
  const type = String(formData.get("type") || "").trim();
  const amount = Number(formData.get("amount"));
  const duration = Number(formData.get("duration"));
  const autoApprove = formData.get("autoApprove") === "true";

  if (!clientId || !type || !amount || !duration) {
    return { success: false, error: "Tous les champs sont requis" };
  }

  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (!client) return { success: false, error: "Client introuvable" };

  const rate = RATES[type] || 4.0;
  const status = autoApprove ? "en_cours" : "demande";

  const loan = createLoan({
    clientId,
    loanType: type,
    amount,
    interestRate: rate,
    durationMonths: duration * 12,
    status,
  });

  if (autoApprove) {
    const acct = client.accounts[0];
    if (acct) {
      acct.balance += amount;
      const d = new Date();
      const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      client.transactions.unshift({
        date: dateStr,
        desc: `Deblocage pret ${type} — CaixaBank Luxembourg`,
        amount: amount,
      });
    }
  }

  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin", "layout");

  await persist("loans", "clients");
  return { success: true, loanId: loan.id };
}

export async function adminApproveLoanAction(loanId: number): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await ensureState();
  if (getAllLoans().find((l) => l.id === loanId)?.status !== "demande") {
    return { success: false, error: "Ce pret n'est pas en attente de decision" };
  }
  const loan = approveLoan(loanId);
  if (!loan) return { success: false, error: "Pret introuvable" };

  const client = DEMO_CLIENTS.find((c) => c.id === loan.clientId);
  if (client) {
    const acct = client.accounts[0];
    if (acct) {
      acct.balance += loan.amount;
      const d = new Date();
      const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      client.transactions.unshift({
        date: dateStr,
        desc: `Deblocage pret ${loan.loanType} — CaixaBank Luxembourg`,
        amount: loan.amount,
      });
    }
  }

  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin", "layout");

  await persist("loans", "clients");
  return { success: true };
}

export async function adminRefuseLoanAction(loanId: number): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  await ensureState();
  if (getAllLoans().find((l) => l.id === loanId)?.status !== "demande") {
    return { success: false, error: "Ce pret n'est pas en attente de decision" };
  }
  const loan = refuseLoan(loanId);
  if (!loan) return { success: false, error: "Pret introuvable" };

  revalidatePath("/admin", "layout");
  await persist("loans");
  return { success: true };
}
