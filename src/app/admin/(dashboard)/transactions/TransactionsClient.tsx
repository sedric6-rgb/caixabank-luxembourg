"use client";

import { useState, useTransition } from "react";
import type { AdminClient } from "@/lib/admin-view";
import { adminAddTransactionAction } from "@/lib/actions/virements";

type AdminTx = {
  id: number;
  date: string;
  account: string;
  client: string;
  type: string;
  amount: number;
  counterparty: string;
  ref: string;
};

function buildTransactions(clients: AdminClient[]): AdminTx[] {
  const txs: AdminTx[] = [];
  let txId = 1;
  for (const c of clients) {
    if (c.transactions.length === 0) continue;
    const acctShort = c.accounts[0]
      ? `${c.accounts[0].number.split(" ")[0]}...${c.accounts[0].number.split(" ").pop()}`
      : "—";
    for (const tx of c.transactions) {
      if (tx.amount === 0) continue;
      const isCredit = tx.amount > 0;
      const parts = tx.desc.split(" — ");
      const prefix = isCredit ? "VIR" : tx.desc.toLowerCase().includes("carte") || tx.desc.toLowerCase().includes("cactus") || tx.desc.toLowerCase().includes("delhaize") || tx.desc.toLowerCase().includes("auchan") || tx.desc.toLowerCase().includes("monoprix") || tx.desc.toLowerCase().includes("zara") || tx.desc.toLowerCase().includes("ikea") || tx.desc.toLowerCase().includes("amazon") ? "CB" : tx.desc.toLowerCase().includes("loyer") || tx.desc.toLowerCase().includes("credit") || tx.desc.toLowerCase().includes("assurance") || tx.desc.toLowerCase().includes("abonnement") || tx.desc.toLowerCase().includes("charges") || tx.desc.toLowerCase().includes("taxe") || tx.desc.toLowerCase().includes("cotisation") ? "PRLV" : tx.desc.toLowerCase().includes("retrait") || tx.desc.toLowerCase().includes("dab") ? "ATM" : tx.desc.toLowerCase().includes("interet") || tx.desc.toLowerCase().includes("dividende") ? "INT" : "OP";
      const explicitType = TYPES.find((t) => tx.desc.startsWith(`${t} — `));
      const type = explicitType ? explicitType : isCredit
        ? tx.desc.toLowerCase().includes("salaire") ? "Virement entrant" : tx.desc.toLowerCase().includes("interet") || tx.desc.toLowerCase().includes("dividende") ? "Intérêt" : "Virement entrant"
        : tx.desc.toLowerCase().includes("carte") || ["cactus", "delhaize", "auchan", "monoprix", "zara", "ikea", "amazon", "restaurant", "spotify", "netflix", "uber", "cfl", "parking", "pharmacie", "fitness"].some((k) => tx.desc.toLowerCase().includes(k)) ? "Carte"
        : tx.desc.toLowerCase().includes("loyer") || tx.desc.toLowerCase().includes("credit") || tx.desc.toLowerCase().includes("assurance") || tx.desc.toLowerCase().includes("abonnement") || tx.desc.toLowerCase().includes("charges") || tx.desc.toLowerCase().includes("taxe") || tx.desc.toLowerCase().includes("cotisation") || tx.desc.toLowerCase().includes("leasing") || tx.desc.toLowerCase().includes("enovos") || tx.desc.toLowerCase().includes("edf") ? "Prélèvement"
        : tx.desc.toLowerCase().includes("retrait") || tx.desc.toLowerCase().includes("dab") ? "Retrait"
        : "Virement sortant";

      const [day, month, year] = tx.date.split("/");
      const hour = String(8 + (txId * 3) % 14).padStart(2, "0");
      const min = String((txId * 7) % 60).padStart(2, "0");

      txs.push({
        id: txId++,
        date: `${tx.date} ${hour}:${min}`,
        account: acctShort,
        client: `${c.first_name} ${c.last_name}`,
        type,
        amount: tx.amount,
        counterparty: parts.length > 1 ? parts[1] : parts[0],
        ref: `${prefix}-${year}${month}${day}${hour}${min}${String(txId).padStart(4, "0")}`,
      });
    }
  }
  return txs.sort((a, b) => {
    const da = a.date.split(" ")[0].split("/").reverse().join("");
    const db = b.date.split(" ")[0].split("/").reverse().join("");
    return db.localeCompare(da) || b.date.localeCompare(a.date);
  });
}

function accountOptions(clients: AdminClient[]) {
  return clients.filter((c) => c.accounts.length > 0).flatMap((c) =>
    c.accounts.map((a) => {
      const parts = a.number.split(" ");
      return { value: `${c.id}|${a.number}`, short: `${parts[0]}...${parts[parts.length - 1]}`, client: `${c.first_name} ${c.last_name}`, label: `${a.type === "courant" ? "Courant" : a.type === "epargne" ? "Épargne" : "Pro"} — ${parts[0]}...${parts[parts.length - 1]} (${c.first_name} ${c.last_name})` };
    })
  );
}

const TYPES = ["Virement entrant", "Virement sortant", "Prélèvement", "Carte", "Retrait", "Intérêt", "Crédit", "Débit"];
const FILTERS = ["Tout", "Virements", "Prélèvements", "Cartes", "Retraits"];

function fmt(n: number) {
  const s = Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/ /g, " ");
  return n >= 0 ? `+${s}` : `-${s}`;
}

function now() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function TransactionsClient({ clients }: { clients: AdminClient[] }) {
  const [txs, setTxs] = useState(() => buildTransactions(clients));
  const [allAccounts] = useState(() => accountOptions(clients));
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState("Tout");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<AdminTx | null>(null);
  const [toast, setToast] = useState("");

  const filtered = txs.filter((tx) => {
    if (filter === "Virements" && !tx.type.includes("Virement")) return false;
    if (filter === "Prélèvements" && tx.type !== "Prélèvement") return false;
    if (filter === "Cartes" && tx.type !== "Carte") return false;
    if (filter === "Retraits" && tx.type !== "Retrait") return false;
    if (search) {
      const q = search.toLowerCase();
      return tx.counterparty.toLowerCase().includes(q) || tx.ref.toLowerCase().includes(q) || tx.client.toLowerCase().includes(q);
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
    const amount = isCredit ? rawAmount : -rawAmount;
    const option = allAccounts.find((a) => a.value === String(fd.get("account")));
    if (!option) return;
    const [clientId, accountNumber] = option.value.split("|");
    const counterparty = String(fd.get("counterparty")).trim();
    const description = String(fd.get("description") || "").trim();
    const stamp = now();
    const desc = `${type} — ${counterparty}${description ? ` — ${description}` : ""}`;
    startTransition(async () => {
      const res = await adminAddTransactionAction(Number(clientId), accountNumber, { date: stamp.split(" ")[0], desc, amount });
      if (!res.success) { setToast("Erreur lors de l'enregistrement"); setTimeout(() => setToast(""), 3000); return; }
      const newTx: AdminTx = {
        id: Math.max(0, ...txs.map((t) => t.id)) + 1,
        date: stamp,
        account: option.short,
        client: option.client,
        type,
        amount,
        counterparty,
        ref: `${prefix}-${Date.now()}`,
      };
      setTxs((prev) => [newTx, ...prev]);
      setShowForm(false);
      setToast("Opération enregistrée avec succès");
      setTimeout(() => setToast(""), 3000);
    });
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} opération{filtered.length > 1 ? "s" : ""} — tous les clients</p>
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
                {allAccounts.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
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
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Enregistrer</button>
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher client, contrepartie..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (EUR)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Contrepartie</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden xl:table-cell">Référence</th>
          </tr></thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} onClick={() => setSelected(tx)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                <td className="px-4 py-3 text-gray-900 font-medium text-xs whitespace-nowrap">{tx.client}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden lg:table-cell">{tx.account}</td>
                <td className="px-4 py-3 text-gray-700">{tx.type}</td>
                <td className={`px-4 py-3 text-right font-medium ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(tx.amount)}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{tx.counterparty}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden xl:table-cell">{tx.ref}</td>
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
              <Row label="Client" value={selected.client} />
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
