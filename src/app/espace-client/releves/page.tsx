"use client";

import { useState } from "react";

const ACCOUNTS = [
  { value: "LU61...2874", label: "Courant — LU61 0019 ...2874" },
  { value: "LU27...5387", label: "Epargne — LU27 0019 ...5387" },
  { value: "LU10...9012", label: "Pro — LU10 0019 ...9012" },
];

const STATEMENTS = [
  { id: 1, account: "LU61...2874", period: "Septembre 2024", date: "01/10/2024", openingBalance: 11234.56, closingBalance: 12450.00, credits: 19622.34, debits: -18406.90 },
  { id: 2, account: "LU61...2874", period: "Aout 2024", date: "01/09/2024", openingBalance: 9870.12, closingBalance: 11234.56, credits: 14500.00, debits: -13135.56 },
  { id: 3, account: "LU61...2874", period: "Juillet 2024", date: "01/08/2024", openingBalance: 8450.90, closingBalance: 9870.12, credits: 12800.00, debits: -11380.78 },
  { id: 4, account: "LU27...5387", period: "Septembre 2024", date: "01/10/2024", openingBalance: 25000.00, closingBalance: 25122.34, credits: 122.34, debits: 0 },
  { id: 5, account: "LU27...5387", period: "Aout 2024", date: "01/09/2024", openingBalance: 24877.50, closingBalance: 25000.00, credits: 122.50, debits: 0 },
  { id: 6, account: "LU10...9012", period: "Septembre 2024", date: "01/10/2024", openingBalance: 34200.00, closingBalance: 40700.00, credits: 15000.00, debits: -8500.00 },
  { id: 7, account: "LU10...9012", period: "Aout 2024", date: "01/09/2024", openingBalance: 28700.00, closingBalance: 34200.00, credits: 18000.00, debits: -12500.00 },
];

const DETAIL_TXS = [
  { date: "15/09/2024", description: "Virement entrant - Entreprise ABC S.a r.l.", amount: 4500.00 },
  { date: "15/09/2024", description: "Paiement carte - Cactus", amount: -125.50 },
  { date: "14/09/2024", description: "Paiement carte - Delhaize", amount: -42.30 },
  { date: "14/09/2024", description: "Prelevement - Credit Immobilier CBL", amount: -1567.23 },
  { date: "13/09/2024", description: "Virement entrant - Client Projekt Alfa", amount: 15000.00 },
  { date: "12/09/2024", description: "Paiement carte - Amazon.lu", amount: -89.90 },
  { date: "12/09/2024", description: "Virement sortant - Immobiliare S.a r.l.", amount: -2800.00 },
  { date: "11/09/2024", description: "Retrait DAB - Luxembourg-Gare", amount: -500.00 },
  { date: "10/09/2024", description: "Paiement carte - CFL", amount: -234.50 },
  { date: "10/09/2024", description: "Prelevement - Enovos", amount: -350.00 },
  { date: "05/09/2024", description: "Prelevement - POST Luxembourg", amount: -54.90 },
  { date: "01/09/2024", description: "Prelevement - CCSS", amount: -1567.23 },
  { date: "01/09/2024", description: "Interets crediteurs", amount: 122.34 },
];

function fmt(n: number) {
  const s = Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n >= 0 ? `+${s}` : `-${s}`;
}

function fmtAbs(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function downloadCSV(statement: typeof STATEMENTS[number]) {
  const header = "Date;Description;Debit (EUR);Credit (EUR);Solde\n";
  let balance = statement.openingBalance;
  const rows = DETAIL_TXS.map((tx) => {
    balance += tx.amount;
    const debit = tx.amount < 0 ? fmtAbs(Math.abs(tx.amount)) : "";
    const credit = tx.amount >= 0 ? fmtAbs(tx.amount) : "";
    return `${tx.date};${tx.description};${debit};${credit};${fmtAbs(balance)}`;
  }).join("\n");
  const csv = header + rows;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `releve_${statement.account}_${statement.period.replace(/ /g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RelevesPage() {
  const [account, setAccount] = useState("LU61...2874");
  const [selected, setSelected] = useState<typeof STATEMENTS[number] | null>(null);
  const [toast, setToast] = useState("");

  const filtered = STATEMENTS.filter((s) => s.account === account);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  if (selected) {
    return (
      <div>
        {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelected(null)} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
          <h1 className="text-xl font-bold text-gray-900">Releve — {selected.period}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-gray-500">Compte</p><p className="font-medium text-gray-900">{selected.account}</p></div>
            <div><p className="text-gray-500">Solde d&apos;ouverture</p><p className="font-medium text-gray-900">{fmtAbs(selected.openingBalance)} EUR</p></div>
            <div><p className="text-gray-500">Solde de cloture</p><p className="font-medium text-gray-900">{fmtAbs(selected.closingBalance)} EUR</p></div>
            <div><p className="text-gray-500">Variation</p><p className={`font-medium ${selected.closingBalance >= selected.openingBalance ? "text-green-600" : "text-red-600"}`}>{fmt(selected.closingBalance - selected.openingBalance)} EUR</p></div>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <button onClick={() => { downloadCSV(selected); notify("Releve telecharge"); }} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2v9M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Telecharger CSV
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Description</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Debit (EUR)</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Credit (EUR)</th>
            </tr></thead>
            <tbody>
              {DETAIL_TXS.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3 text-gray-700">{tx.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">{tx.amount < 0 ? fmtAbs(Math.abs(tx.amount)) : ""}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{tx.amount >= 0 ? fmtAbs(tx.amount) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Releves de compte</h1>
          <p className="text-sm text-gray-500 mt-1">Consultez et telechargez vos releves mensuels</p>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
        <select value={account} onChange={(e) => setAccount(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm">
          {ACCOUNTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{s.period}</h3>
              <span className="text-xs text-gray-400">{s.date}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Solde cloture</span><span className="font-medium text-gray-900">{fmtAbs(s.closingBalance)} EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total credits</span><span className="font-medium text-green-600">+{fmtAbs(s.credits)} EUR</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total debits</span><span className="font-medium text-red-600">{fmt(s.debits)} EUR</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setSelected(s)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Consulter</button>
              <button onClick={() => { downloadCSV(s); notify("Releve telecharge"); }} className="flex-1 bg-[#003d82] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Telecharger</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
