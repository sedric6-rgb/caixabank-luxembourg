"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_CLIENTS } from "@/lib/demo-data";

type Account = {
  id: number;
  clientId: number;
  acctIdx: number;
  number: string;
  shortNumber: string;
  holder: string;
  type: string;
  balance: number;
  status: string;
  opened: string;
};

const TYPE_MAP: Record<string, string> = { courant: "Courant", epargne: "Epargne", professionnel: "Pro" };

function buildAccounts(): Account[] {
  let id = 1;
  const list: Account[] = [];
  for (const c of DEMO_CLIENTS) {
    for (let ai = 0; ai < c.accounts.length; ai++) {
      const a = c.accounts[ai];
      const parts = a.number.split(" ");
      const short = `${parts[0]}...${parts[parts.length - 1]}`;
      list.push({
        id: id++,
        clientId: c.id,
        acctIdx: ai,
        number: a.number,
        shortNumber: short,
        holder: `${c.first_name} ${c.last_name}`,
        type: TYPE_MAP[a.type] || a.type,
        balance: a.balance,
        status: c.status,
        opened: c.created_at,
      });
    }
  }
  return list;
}

const S: Record<string, string> = { actif: "bg-green-100 text-green-700", en_attente: "bg-yellow-100 text-yellow-700", bloque: "bg-red-100 text-red-700" };
const L: Record<string, string> = { actif: "Actif", en_attente: "En attente", bloque: "Bloque" };
const TYPES = ["Courant", "Epargne", "Pro"];
const FILTERS = ["Tous", "Courant", "Epargne", "Pro"];

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function genIBAN() {
  const r = () => String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `LU${r().slice(0,2)} 0019 ${r()} ${r()} ${r()} ${r()} ${r().slice(0,4)}`;
}

export default function AdminComptesPage() {
  const [accounts, setAccounts] = useState<Account[]>(buildAccounts);
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);

  const filtered = accounts.filter((a) => {
    if (filter !== "Tous" && a.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.holder.toLowerCase().includes(q) || a.number.toLowerCase().includes(q);
    }
    return true;
  });

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const addAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const iban = genIBAN();
    const parts = iban.split(" ");
    const newAcc: Account = {
      id: Date.now(), clientId: 0, acctIdx: 0,
      number: iban, shortNumber: `${parts[0]}...${parts[parts.length - 1]}`,
      holder: String(fd.get("holder")), type: String(fd.get("type")),
      balance: Number(fd.get("balance") || 0), status: "en_attente",
      opened: new Date().toLocaleDateString("fr-FR"),
    };
    setAccounts((prev) => [...prev, newAcc]);
    setShowForm(false);
    notify("Compte cree avec succes");
  };

  const doTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const from = String(fd.get("from"));
    const to = String(fd.get("to"));
    const amount = Number(fd.get("amount"));
    if (from === to) { notify("Les comptes source et destination doivent etre differents"); return; }
    setAccounts((prev) => prev.map((a) => {
      if (a.number === from) return { ...a, balance: a.balance - amount };
      if (a.number === to) return { ...a, balance: a.balance + amount };
      return a;
    }));
    setShowTransfer(false);
    notify(`Virement interne de ${fmt(amount)} EUR effectue`);
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Comptes bancaires</h1>
          <p className="text-sm text-gray-500 mt-1">{accounts.length} comptes — total : {fmt(totalBalance)} EUR</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTransfer(!showTransfer)} className="inline-flex items-center gap-2 border border-[#003d82] text-[#003d82] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50">
            Virement
          </button>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#002a5c]">
            + Nouveau
          </button>
        </div>
      </div>

      {/* Transfer form */}
      {showTransfer && (
        <form onSubmit={doTransfer} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Virement entre comptes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte source</label>
              <select name="from" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {accounts.filter((a) => a.status === "actif").map((a) => <option key={a.id} value={a.number}>{a.holder} — {a.type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select name="to" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {accounts.filter((a) => a.status === "actif").map((a) => <option key={a.id} value={a.number}>{a.holder} — {a.type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
              <input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Executer</button>
            <button type="button" onClick={() => setShowTransfer(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        </form>
      )}

      {/* New account form */}
      {showForm && (
        <form onSubmit={addAccount} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouveau compte bancaire</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire</label>
              <input name="holder" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Solde initial (EUR)</label>
              <input name="balance" type="number" min="0" step="0.01" defaultValue="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Creer</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60" />
      </div>

      {/* Accounts list — cards on mobile, table on desktop */}
      <div className="block sm:hidden space-y-3">
        {filtered.map((a) => (
          <Link key={a.id} href={a.clientId > 0 ? `/admin/comptes/${a.clientId}-${a.acctIdx}` : "#"} className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm">{a.holder}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[a.status]}`}>{L[a.status]}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">{a.type}</span>
                <p className="text-xs font-mono text-gray-500 mt-0.5">{a.shortNumber}</p>
              </div>
              <span className="text-base font-bold text-gray-900">{fmt(a.balance)} EUR</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Aucun compte trouve</p>}
      </div>

      {/* Table on desktop */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">IBAN</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Titulaire</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Solde (EUR)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{a.shortNumber}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{a.holder}</td>
                <td className="px-4 py-3 text-gray-500">{a.type}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">{fmt(a.balance)}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[a.status]}`}>{L[a.status]}</span></td>
                <td className="px-4 py-3 text-right">
                  {a.clientId > 0 ? (
                    <Link href={`/admin/comptes/${a.clientId}-${a.acctIdx}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Ouvrir
                    </Link>
                  ) : <span className="text-xs text-gray-400">—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun compte trouve</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
