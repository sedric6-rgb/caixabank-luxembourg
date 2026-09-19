"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/format";

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: number;
  balance_after: number;
  description: string;
  counterparty: string;
  executed_at: string;
}

const CATEGORIES = [
  { value: "", label: "Toutes les catégories" },
  { value: "virement", label: "Virement" },
  { value: "salaire", label: "Salaire" },
  { value: "loyer", label: "Loyer" },
  { value: "courses", label: "Courses" },
  { value: "restaurant", label: "Restaurant" },
  { value: "transport", label: "Transport" },
  { value: "abonnement", label: "Abonnement" },
  { value: "assurance", label: "Assurance" },
  { value: "sante", label: "Santé" },
  { value: "loisirs", label: "Loisirs" },
  { value: "divers", label: "Divers" },
];

export default function TransactionsTable({ transactions, currency }: { transactions: Transaction[]; currency: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "credit" | "debit">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase()) && !(tx.counterparty || "").toLowerCase().includes(search.toLowerCase())) return false;
      if (category && tx.category !== category) return false;
      if (typeFilter && tx.type !== typeFilter) return false;
      if (dateFrom && tx.executed_at < dateFrom) return false;
      if (dateTo && tx.executed_at > dateTo + "T23:59:59") return false;
      return true;
    });
  }, [transactions, search, category, typeFilter, dateFrom, dateTo]);

  const exportCSV = () => {
    const header = "Date;Description;Contrepartie;Catégorie;Type;Montant;Solde après\n";
    const rows = filtered.map((tx) => {
      const date = new Date(tx.executed_at).toLocaleDateString("fr-FR");
      const desc = tx.description.replace(/;/g, ",");
      const cp = (tx.counterparty || "").replace(/;/g, ",");
      const cat = tx.category.replace(/_/g, " ");
      const sign = tx.type === "credit" ? "+" : "-";
      return `${date};${desc};${cp};${cat};${tx.type === "credit" ? "Crédit" : "Débit"};${sign}${tx.amount.toFixed(2)};${tx.balance_after.toFixed(2)}`;
    }).join("\n");

    const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `releve_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCredit = filtered.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = filtered.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const hasFilters = search || category || typeFilter || dateFrom || dateTo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-gray-900">Historique des opérations</h2>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100">
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v8M4 7l3 3 3-3M2 12h10"/></svg>
            Exporter CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "" | "credit" | "debit")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="">Crédits & Débits</option>
            <option value="credit">Crédits uniquement</option>
            <option value="debit">Débits uniquement</option>
          </select>
          <div className="flex gap-2">
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {filtered.length} opération{filtered.length !== 1 ? "s" : ""} —{" "}
              <span className="text-green-600">+{formatCurrency(totalCredit, currency)}</span>{" / "}
              <span className="text-red-600">-{formatCurrency(totalDebit, currency)}</span>
            </p>
            <button onClick={() => { setSearch(""); setCategory(""); setTypeFilter(""); setDateFrom(""); setDateTo(""); }}
              className="text-xs text-blue-600 hover:underline">Réinitialiser les filtres</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500 hidden md:table-cell">Catégorie</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Montant</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Solde après</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{formatDate(tx.executed_at)}</td>
                <td className="px-6 py-3">
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  {tx.counterparty && <p className="text-xs text-gray-400">{tx.counterparty}</p>}
                </td>
                <td className="px-6 py-3 text-gray-500 hidden md:table-cell capitalize">{tx.category.replace(/_/g, " ")}</td>
                <td className={`px-6 py-3 text-right font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-3 text-right text-gray-500 hidden sm:table-cell">{formatCurrency(tx.balance_after)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucune opération trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
