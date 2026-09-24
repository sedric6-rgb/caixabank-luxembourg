"use client";

import { useState, useTransition } from "react";
import type { AdminClient } from "@/lib/admin-view";
import { adminOrderCardAction, adminSetCardStatusAction } from "@/lib/actions/admin-data";

type AdminCard = {
  id: number;
  clientId: number;
  last4: string;
  client: string;
  type: string;
  account: string;
  status: string;
  expiry: string;
};

function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === "bloquee" || s === "bloquée") return "bloquee";
  if (s === "opposition" || s === "opposed") return "opposed";
  return s;
}

function buildCards(clients: AdminClient[]): AdminCard[] {
  const cards: AdminCard[] = [];
  let cardId = 1;
  for (const c of clients) {
    if (c.cards.length === 0) continue;
    const acctShort = c.accounts[0]
      ? `${c.accounts[0].number.split(" ")[0]}...${c.accounts[0].number.split(" ").pop()}`
      : "—";
    for (const card of c.cards) {
      cards.push({
        id: cardId++,
        clientId: c.id,
        last4: card.last4,
        client: `${c.first_name} ${c.last_name}`,
        type: card.type,
        account: acctShort,
        status: normalizeStatus(card.status),
        expiry: card.expiry,
      });
    }
  }
  return cards;
}

function clientOptions(clients: AdminClient[]) {
  return clients.filter((c) => c.accounts.length > 0).map((c) => ({
    id: String(c.id),
    name: `${c.first_name} ${c.last_name}`,
    accounts: c.accounts.map((a) => {
      const parts = a.number.split(" ");
      return { value: `${parts[0]}...${parts[parts.length - 1]}`, label: `${a.type === "courant" ? "Courant" : a.type === "epargne" ? "Épargne" : "Pro"} — ${parts[0]}...${parts[parts.length - 1]}` };
    }),
  }));
}

const S: Record<string, string> = { active: "bg-green-100 text-green-700", bloquee: "bg-red-100 text-red-700", opposed: "bg-orange-100 text-orange-700", en_fabrication: "bg-blue-100 text-blue-700", expiree: "bg-gray-100 text-gray-500" };
const L: Record<string, string> = { active: "Active", bloquee: "Bloquée", opposed: "Opposition", en_fabrication: "En fabrication", expiree: "Expirée" };

export default function CartesClient({ clients }: { clients: AdminClient[] }) {
  const [allClients] = useState(() => clientOptions(clients));
  const [cards, setCards] = useState(() => buildCards(clients));
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; action: string } | null>(null);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("Tout");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(allClients[0]?.id || "");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const changeStatus = (id: number, newStatus: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    startTransition(async () => {
      const res = await adminSetCardStatusAction(card.clientId, card.last4, newStatus);
      setConfirm(null);
      if (!res.success) { notify(res.error); return; }
      setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
      const labels: Record<string, string> = { active: "Carte activée", bloquee: "Carte bloquée", opposed: "Carte mise en opposition" };
      notify(labels[newStatus] || "Statut mis à jour");
    });
  };

  const addCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const client = allClients.find((c) => c.id === String(fd.get("client")));
    if (!client) return;
    const type = String(fd.get("type"));
    const account = String(fd.get("account"));
    startTransition(async () => {
      const res = await adminOrderCardAction(Number(client.id), type);
      if (!res.success) { notify(res.error); return; }
      setCards((prev) => [...prev, {
        id: Math.max(0, ...prev.map((c) => c.id)) + 1, clientId: Number(client.id), last4: res.card.last4, client: client.name, type,
        account, status: "en_fabrication", expiry: res.card.expiry,
      }]);
      setShowForm(false);
      notify("Carte commandée avec succès");
    });
  };

  const filtered = cards.filter((c) => {
    if (filter === "Actives" && c.status !== "active") return false;
    if (filter === "Bloquées" && c.status !== "bloquee") return false;
    if (filter === "Opposition" && c.status !== "opposed") return false;
    if (filter === "En fabrication" && c.status !== "en_fabrication") return false;
    if (search) {
      const q = search.toLowerCase();
      return c.client.toLowerCase().includes(q) || c.last4.includes(q) || c.type.toLowerCase().includes(q);
    }
    return true;
  });

  const clientAccounts = allClients.find((c) => c.id === selectedClient)?.accounts || [];

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cartes bancaires</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} carte{filtered.length > 1 ? "s" : ""} — tous les clients</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Nouvelle carte
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCard} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Commander une carte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select name="client" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {allClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de carte</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Visa Débit</option><option>Visa Classic</option><option>Visa Gold</option><option>Visa Platinum</option><option>Visa Infinite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte associé</label>
              <select name="account" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500">
                {clientAccounts.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Commander</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {["Tout", "Actives", "Bloquées", "Opposition", "En fabrication"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher client, numéro..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Carte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Expiration</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">**** {c.last4}</td>
                <td className="px-4 py-3 text-gray-700">{c.client}</td>
                <td className="px-4 py-3 text-gray-500">{c.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden md:table-cell">{c.account}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[c.status] || S.active}`}>{L[c.status] || c.status}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.expiry}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {c.status === "active" && (
                    <>
                      <button onClick={() => setConfirm({ id: c.id, action: "block" })} className="text-xs text-red-600 hover:underline">Bloquer</button>
                      <button onClick={() => setConfirm({ id: c.id, action: "oppose" })} className="text-xs text-orange-600 hover:underline">Opposition</button>
                    </>
                  )}
                  {(c.status === "bloquee" || c.status === "opposed" || c.status === "en_fabrication") && (
                    <button onClick={() => setConfirm({ id: c.id, action: "activate" })} className="text-xs text-green-600 hover:underline">Activer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {confirm.action === "block" ? "Bloquer la carte ?" : confirm.action === "oppose" ? "Mettre en opposition ?" : "Activer la carte ?"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {confirm.action === "block" ? "La carte sera immédiatement désactivée. Vous pourrez la réactiver." : confirm.action === "oppose" ? "La carte sera mise en opposition. Vous pourrez lever l'opposition." : "La carte sera réactivée et utilisable."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => changeStatus(confirm.id, confirm.action === "block" ? "bloquee" : confirm.action === "oppose" ? "opposed" : "active")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${confirm.action === "activate" ? "bg-green-600 hover:bg-green-700" : confirm.action === "oppose" ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700"}`}>
                Confirmer
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
