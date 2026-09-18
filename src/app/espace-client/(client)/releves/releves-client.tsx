"use client";

import { useState } from "react";

type AccountInfo = { id: number; label: string; iban: string };
type Transaction = { date: string; description: string; amount: number };

function fmtAbs(n: number) {
  return Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RelevesClient({
  accounts,
  transactionsByAccount,
}: {
  accounts: AccountInfo[];
  transactionsByAccount: Record<number, Transaction[]>;
}) {
  const [selectedAcctId, setSelectedAcctId] = useState(accounts[0]?.id ?? 0);
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const txs = transactionsByAccount[selectedAcctId] || [];
  const totalCredits = txs.filter((t) => t.amount >= 0).reduce((s, t) => s + t.amount, 0);
  const totalDebits = txs.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const selectedAcct = accounts.find((a) => a.id === selectedAcctId);

  const downloadCSV = () => {
    const header = "Date;Description;Debit (EUR);Credit (EUR)\n";
    const rows = txs.map((tx) => {
      const debit = tx.amount < 0 ? fmtAbs(tx.amount) : "";
      const credit = tx.amount >= 0 ? fmtAbs(tx.amount) : "";
      return `${tx.date};${tx.description};${debit};${credit}`;
    }).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `releve_${selectedAcct?.label || "compte"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Releve telecharge");
  };

  if (showDetail) {
    return (
      <div>
        {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowDetail(false)} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Releve — {selectedAcct?.label}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500">Compte</p><p className="font-medium text-gray-900 font-mono text-xs break-all">{selectedAcct?.iban}</p></div>
            <div><p className="text-gray-500">Total credits</p><p className="font-medium text-green-600">+{fmtAbs(totalCredits)} EUR</p></div>
            <div><p className="text-gray-500">Total debits</p><p className="font-medium text-red-600">-{fmtAbs(Math.abs(totalDebits))} EUR</p></div>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <button onClick={downloadCSV} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
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
              {txs.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3 text-gray-700">{tx.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">{tx.amount < 0 ? fmtAbs(tx.amount) : ""}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{tx.amount >= 0 ? fmtAbs(tx.amount) : ""}</td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">Aucune operation</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Releves de compte</h1>
          <p className="text-sm text-gray-500 mt-1">Consultez et telechargez vos releves</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
        <select
          value={selectedAcctId}
          onChange={(e) => setSelectedAcctId(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{selectedAcct?.label}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><p className="text-gray-500">Total credits</p><p className="font-medium text-green-600">+{fmtAbs(totalCredits)} EUR</p></div>
          <div><p className="text-gray-500">Total debits</p><p className="font-medium text-red-600">-{fmtAbs(Math.abs(totalDebits))} EUR</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDetail(true)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Consulter</button>
          <button onClick={downloadCSV} className="flex-1 bg-[#003d82] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Telecharger</button>
        </div>
      </div>
    </div>
  );
}
