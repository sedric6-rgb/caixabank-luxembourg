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
}

let nextLoanId = 80000;

export const LOANS: StoredLoan[] = [
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
];

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
    id: nextLoanId++,
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
