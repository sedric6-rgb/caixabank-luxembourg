"use client";

import { useState } from "react";

const STATUSES = ["Tous", "Actif", "En attente", "Suspendu", "Termine"] as const;

const INITIAL = [
  { id: 1, creditor: "Enovos Luxembourg S.A.", debtor: "LU61...2874", rum: "MNDT-2024-001", amount: 189.50, frequency: "Mensuel", nextDate: "01/10/2024", status: "Actif" as const },
  { id: 2, creditor: "POST Luxembourg", debtor: "LU61...2874", rum: "MNDT-2024-002", amount: 54.90, frequency: "Mensuel", nextDate: "05/10/2024", status: "Actif" as const },
  { id: 3, creditor: "CCSS", debtor: "LU61...2874", rum: "MNDT-2024-003", amount: 1567.23, frequency: "Mensuel", nextDate: "01/10/2024", status: "Actif" as const },
  { id: 4, creditor: "Assurances Foyer", debtor: "LU61...2874", rum: "MNDT-2024-004", amount: 245.00, frequency: "Trimestriel", nextDate: "01/01/2025", status: "Actif" as const },
  { id: 5, creditor: "SES Water", debtor: "LU10...9012", rum: "MNDT-2024-005", amount: 78.30, frequency: "Bimestriel", nextDate: "01/11/2024", status: "Actif" as const },
  { id: 6, creditor: "Fitness First", debtor: "LU61...2874", rum: "MNDT-2024-006", amount: 49.90, frequency: "Mensuel", nextDate: "—", status: "Suspendu" as const },
  { id: 7, creditor: "Ancien bailleur", debtor: "LU61...2874", rum: "MNDT-2023-012", amount: 1200.00, frequency: "Mensuel", nextDate: "—", status: "Termine" as const },
  { id: 8, creditor: "Crèche Les Petits", debtor: "LU61...2874", rum: "MNDT-2024-007", amount: 890.00, frequency: "Mensuel", nextDate: "01/10/2024", status: "En attente" as const },
];

type Mandate = typeof INITIAL[number];

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statusColor(s: string) {
  if (s === "Actif") return "bg-green-100 text-green-700";
  if (s === "En attente") return "bg-yellow-100 text-yellow-700";
  if (s === "Suspendu") return "bg-orange-100 text-orange-700";
  return "bg-gray-100 text-gray-500";
}

export default function AdminPrelevementsPage() {
  const [mandates, setMandates] = useState(INITIAL);
  const [filter, setFilter] = useState<string>("Tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Mandate | null>(null);
  const [toast, setToast] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = mandates.filter((m) => {
    if (filter !== "Tous" && m.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.creditor.toLowerCase().includes(q) || m.rum.toLowerCase().includes(q) || m.debtor.toLowerCase().includes(q);
    }
    return true;
  });

  const activeTotal = mandates.filter((m) => m.status === "Actif").reduce((s, m) => s + m.amount, 0);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const toggleStatus = (id: number) => {
    setMandates((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next = m.status === "Actif" ? "Suspendu" : m.status === "Suspendu" ? "Actif" : m.status;
        if (next !== m.status) notify(`Mandat ${m.rum} ${next === "Suspendu" ? "suspendu" : "reactived"}`);
        return { ...m, status: next };
      })
    );
    setSelected(null);
  };

  const addMandate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newM: Mandate = {
      id: Date.now(),
      creditor: String(fd.get("creditor")),
      debtor: String(fd.get("debtor")),
      rum: `MNDT-${Date.now()}`,
      amount: Number(fd.get("amount")),
      frequency: String(fd.get("frequency")),
      nextDate: String(fd.get("nextDate")),
      status: "En attente",
    };
    setMandates((prev) => [newM, ...prev]);
    setShowForm(false);
    notify("Mandat de prelevement cree avec succes");
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prelevements</h1>
          <p className="text-sm text-gray-500 mt-1">{mandates.filter((m) => m.status === "Actif").length} mandats actifs — total mensuel estime : {fmt(activeTotal)} EUR</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Nouveau mandat
        </button>
      </div>

      {showForm && (
        <form onSubmit={addMandate} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouveau mandat de prelevement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Creancier</label>
              <input name="creditor" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte debiteur</label>
              <select name="debtor" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="LU61...2874">Courant — LU61...2874</option>
                <option value="LU10...9012">Pro — LU10...9012</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
              <input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequence</label>
              <select name="frequency" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Mensuel</option>
                <option>Bimestriel</option>
                <option>Trimestriel</option>
                <option>Semestriel</option>
                <option>Annuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine echeance</label>
              <input name="nextDate" type="text" placeholder="JJ/MM/AAAA" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Creer le mandat</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{s}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Creancier</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">RUM</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (EUR)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Frequence</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Prochaine echeance</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
          </tr></thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} onClick={() => setSelected(m)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-gray-900 font-medium">{m.creditor}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.debtor}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden md:table-cell">{m.rum}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{fmt(m.amount)}</td>
                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{m.frequency}</td>
                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{m.nextDate}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(m.status)}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Details du mandat</h2>
            <div className="space-y-3 text-sm">
              <Row label="Creancier" value={selected.creditor} />
              <Row label="RUM" value={selected.rum} />
              <Row label="Compte debiteur" value={selected.debtor} />
              <Row label="Montant" value={`${fmt(selected.amount)} EUR`} />
              <Row label="Frequence" value={selected.frequency} />
              <Row label="Prochaine echeance" value={selected.nextDate} />
              <Row label="Statut" value={selected.status} />
            </div>
            <div className="mt-6 flex gap-3">
              {(selected.status === "Actif" || selected.status === "Suspendu") && (
                <button onClick={() => toggleStatus(selected.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${selected.status === "Actif" ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                  {selected.status === "Actif" ? "Suspendre" : "Reactiver"}
                </button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Fermer</button>
            </div>
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
