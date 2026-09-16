"use client";

import { useState } from "react";

const INITIAL_TXS = [
  { id: 1, date: "15/09/2024 14:23", account: "LU61...2874", type: "Carte", amount: -125.5, counterparty: "Cactus", ref: "CB-2024091514230001" },
  { id: 2, date: "15/09/2024 11:05", account: "LU61...2874", type: "Virement entrant", amount: 4500, counterparty: "Entreprise ABC", ref: "VIR-2024091511050002" },
  { id: 3, date: "14/09/2024 18:47", account: "LU61...2874", type: "Carte", amount: -42.3, counterparty: "Delhaize", ref: "CB-2024091418470003" },
  { id: 4, date: "14/09/2024 09:00", account: "LU61...2874", type: "Prélèvement", amount: -1567.23, counterparty: "Crédit Immobilier CBL", ref: "PRLV-2024091409000004" },
  { id: 5, date: "13/09/2024 16:30", account: "LU10...9012", type: "Virement sortant", amount: -8500, counterparty: "Fournisseur XYZ S.à r.l.", ref: "VIR-2024091316300005" },
  { id: 6, date: "13/09/2024 12:15", account: "LU27...5387", type: "Intérêt", amount: 122.34, counterparty: "Intérêts Livret Épargne", ref: "INT-2024091312150006" },
  { id: 7, date: "12/09/2024 20:10", account: "LU61...2874", type: "Carte", amount: -89.9, counterparty: "Amazon.lu", ref: "CB-2024091220100007" },
  { id: 8, date: "12/09/2024 08:00", account: "LU61...2874", type: "Virement sortant", amount: -2800, counterparty: "Immobiliare S.à r.l.", ref: "VIR-2024091208000008" },
  { id: 9, date: "11/09/2024 15:45", account: "LU10...9012", type: "Virement entrant", amount: 15000, counterparty: "Client Projekt Alfa", ref: "VIR-2024091115450009" },
  { id: 10, date: "11/09/2024 10:30", account: "LU61...2874", type: "Retrait", amount: -500, counterparty: "DAB Luxembourg-Gare", ref: "ATM-2024091110300010" },
  { id: 11, date: "10/09/2024 19:20", account: "LU61...2874", type: "Carte", amount: -234.5, counterparty: "CFL", ref: "CB-2024091019200011" },
  { id: 12, date: "10/09/2024 14:00", account: "LU61...2874", type: "Prélèvement", amount: -350, counterparty: "Enovos", ref: "PRLV-2024091014000012" },
];

const ACCOUNTS = [
  { value: "LU61...2874", label: "Courant — LU61...2874 (Jan Kowalski)" },
  { value: "LU27...5387", label: "Épargne — LU27...5387 (Jan Kowalski)" },
  { value: "LU10...9012", label: "Pro — LU10...9012 (Jan Kowalski)" },
  { value: "LU83...1234", label: "Courant — LU83...1234 (Anna Nowak)" },
];

const TYPES = ["Virement entrant", "Virement sortant", "Prélèvement", "Carte", "Retrait", "Intérêt", "Crédit", "Débit"];
const FILTERS = ["Tout", "Virements", "Prélèvements", "Cartes", "Retraits"];

function fmt(n: number) {
  const s = Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n >= 0 ? `+${s}` : `-${s}`;
}

function now() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState(INITIAL_TXS);
  const [filter, setFilter] = useState("Tout");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<typeof INITIAL_TXS[0] | null>(null);
  const [toast, setToast] = useState("");

  const filtered = txs.filter((tx) => {
    if (filter === "Virements" && !tx.type.includes("Virement")) return false;
    if (filter === "Prélèvements" && tx.type !== "Prélèvement") return false;
    if (filter === "Cartes" && tx.type !== "Carte") return false;
    if (filter === "Retraits" && tx.type !== "Retrait") return false;
    if (search) {
      const q = search.toLowerCase();
      return tx.counterparty.toLowerCase().includes(q) || tx.ref.toLowerCase().includes(q);
    }
    return true;
  });

  const addTx = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = String(fd.get("type"));
    const prefix = type.includes("Virement") ? "VIR" : type === "Prélèvement" ? "PRLV" : type === "Retrait" ? "ATM" : type === "Carte" ? "CB" : "OP";
    const rawAmount = Number(fd.get("amount"));
    const isCredit = type === "Virement entrant" || type === "Intérêt" || type === "Crédit";
    const newTx = {
      id: Date.now(),
      date: now(),
      account: String(fd.get("account")),
      type,
      amount: isCredit ? rawAmount : -rawAmount,
      counterparty: String(fd.get("counterparty")),
      ref: `${prefix}-${Date.now()}`,
    };
    setTxs((prev) => [newTx, ...prev]);
    setShowForm(false);
    setToast("Opération enregistrée avec succès");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} opération{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Nouvelle opération
        </button>
      </div>

      {showForm && (
        <form onSubmit={addTx} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouvelle opération</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
              <select name="account" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {ACCOUNTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
              <input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrepartie</label>
              <input name="counterparty" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input name="description" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (EUR)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Contrepartie</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Référence</th>
          </tr></thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} onClick={() => setSelected(tx)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{tx.account}</td>
                <td className="px-4 py-3 text-gray-700">{tx.type}</td>
                <td className={`px-4 py-3 text-right font-medium ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(tx.amount)}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{tx.counterparty}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden lg:table-cell">{tx.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Détails de l&apos;opération</h2>
            <div className="space-y-3 text-sm">
              <Row label="Référence" value={selected.ref} />
              <Row label="Date" value={selected.date} />
              <Row label="Type" value={selected.type} />
              <Row label="Compte" value={selected.account} />
              <Row label="Contrepartie" value={selected.counterparty} />
              <Row label="Montant" value={`${fmt(selected.amount)} EUR`} />
            </div>
            <button onClick={() => setSelected(null)} className="mt-6 w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
