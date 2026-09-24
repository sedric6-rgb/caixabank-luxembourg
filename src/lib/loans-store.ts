import { shared, nextId } from "@/lib/shared-store";
export interface StoredLoan {
  id: number;
  clientId: number;
  loanType: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  monthlyPayment: number;
  remainingAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  clientName?: string;
}

// clientId 0: file kept from the former admin list whose borrower is not a client of the bank.
function legacyLoan(id: number, clientId: number, loanType: string, amount: number, interestRate: number, years: number, status: string, startDate: string, clientName?: string): StoredLoan {
  const months = years * 12;
  const [y, m, d] = startDate.split("-");
  return {
    id, clientId, loanType, amount, interestRate,
    durationMonths: months,
    monthlyPayment: Math.round(calcMonthly(amount, interestRate, months) * 100) / 100,
    remainingAmount: amount,
    status,
    startDate,
    endDate: `${Number(y) + years}-${m}-${d}`,
    ...(clientName ? { clientName } : {}),
  };
}

export const LOANS: StoredLoan[] = shared<StoredLoan>("loans", () => [
  legacyLoan(1, 19, "Immobilier", 350000, 3.45, 25, "en_cours", "2022-06-01"),
  legacyLoan(2, 20, "Professionnel", 120000, 4.10, 7, "en_cours", "2026-01-15"),
  legacyLoan(3, 0, "Auto", 45000, 4.30, 5, "en_cours", "2025-03-10", "Sophie Laurent"),
  legacyLoan(4, 0, "Immobilier", 280000, 3.45, 20, "demande", "2026-09-05", "Michel Weber"),
  legacyLoan(5, 21, "Professionnel", 500000, 4.10, 10, "en_cours", "2026-08-20"),
  legacyLoan(6, 0, "Consommation", 25000, 5.80, 4, "demande", "2026-09-12", "Elena Popov"),
  {
    id: 70001,
    clientId: 23,
    loanType: "Immobilier",
    amount: 400000,
    interestRate: 3.45,
    durationMonths: 300,
    monthlyPayment: 0,
    remainingAmount: 0,
    status: "annule",
    startDate: "2026-09-23",
    endDate: "2051-09-23",
  },
]);

function calcMonthly(amount: number, rate: number, months: number): number {
  const r = rate / 100 / 12;
  if (r === 0) return amount / months;
  return (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function createLoan(data: {
  clientId: number;
  loanType: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  status: string;
}): StoredLoan {
  const monthly = calcMonthly(data.amount, data.interestRate, data.durationMonths);
  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + data.durationMonths);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const loan: StoredLoan = {
    id: nextId(LOANS, 80000),
    clientId: data.clientId,
    loanType: data.loanType,
    amount: data.amount,
    interestRate: data.interestRate,
    durationMonths: data.durationMonths,
    monthlyPayment: Math.round(monthly * 100) / 100,
    remainingAmount: data.amount,
    status: data.status,
    startDate: fmt(now),
    endDate: fmt(end),
  };
  LOANS.push(loan);
  return loan;
}

export function getLoansForClient(clientId: number): StoredLoan[] {
  return LOANS.filter((l) => l.clientId === clientId);
}

export function approveLoan(loanId: number): StoredLoan | null {
  const loan = LOANS.find((l) => l.id === loanId);
  if (loan) loan.status = "en_cours";
  return loan || null;
}

export function refuseLoan(loanId: number): StoredLoan | null {
  const loan = LOANS.find((l) => l.id === loanId);
  if (loan) loan.status = "refuse";
  return loan || null;
}

export function getAllLoans(): StoredLoan[] {
  return [...LOANS];
}
