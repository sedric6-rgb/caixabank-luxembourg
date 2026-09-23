"use server";

import { DEMO_CLIENTS } from "@/lib/demo-data";
import { createLoan, approveLoan, refuseLoan } from "@/lib/loans-store";
import { revalidatePath } from "next/cache";

const RATES: Record<string, number> = {
  Immobilier: 3.45,
  Consommation: 5.80,
  Auto: 4.30,
  Etudiant: 2.00,
  Professionnel: 4.10,
};

export async function adminCreateLoanAction(formData: FormData): Promise<{ success: boolean; error?: string; loanId?: number }> {
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

  return { success: true, loanId: loan.id };
}

export async function adminApproveLoanAction(loanId: number): Promise<{ success: boolean; error?: string }> {
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

  return { success: true };
}

export async function adminRefuseLoanAction(loanId: number): Promise<{ success: boolean; error?: string }> {
  const loan = refuseLoan(loanId);
  if (!loan) return { success: false, error: "Pret introuvable" };

  revalidatePath("/admin", "layout");
  return { success: true };
}
