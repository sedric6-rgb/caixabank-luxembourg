"use client";

import { useState } from "react";

const INITIAL_CARDS = [
  { id: 1, last4: "4827", client: "Jan Kowalski", type: "Visa Gold", account: "LU61...2874", status: "active", expiry: "09/2027" },
  { id: 2, last4: "9153", client: "Jan Kowalski", type: "Visa Débit", account: "LU61...2874", status: "active", expiry: "03/2028" },
  { id: 3, last4: "3841", client: "Anna Nowak", type: "Visa Classic", account: "LU83...1234", status: "active", expiry: "12/2026" },
  { id: 4, last4: "7629", client: "Piotr Wiśniewski", type: "Visa Gold", account: "LU44...1234", status: "active", expiry: "06/2027" },
  { id: 5, last4: "1058", client: "Katarzyna Wójcik", type: "Visa Débit", account: "LU92...8745", status: "en_fabrication", expiry: "09/2028" },
  { id: 6, last4: "5294", client: "Tomasz Kamiński", type: "Visa Platinum", account: "LU15...8523", status: "active", expiry: "01/2027" },
  { id: 7, last4: "8173", client: "Magdalena Lewandowska", type: "Visa Classic", account: "LU44...7821", status: "bloquee", expiry: "05/2026" },
  { id: 8, last4: "2946", client: "Michał Zieliński", type: "Visa Débit", account: "LU29...4512", status: "active", expiry: "08/2028" },
];

const S: Record<string, string> = { active: "bg-green-100 text-green-700", bloquee: "bg-red-100 text-red-700", en_fabrication: "bg-blue-100 text-blue-700", expiree: "bg-gray-100 text-gray-500" };
const L: Record<string, string> = { active: "Active", bloquee: "Bloquée", en_fabrication: "En fabrication", expiree: "Expirée" };

export default function AdminCartesPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; action: string } | null>(null);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleStatus = (id: number) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "bloquee" : "active" } : c));
    notify(confirm?.action === "block" ? "Carte bloquée" : "Carte activée");
    setConfirm(null);
  };

  const addCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const last4 = String(Math.floor(1000 + Math.random() * 9000));
    const y = new Date().getFullYear() + 4;
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    setCards((prev) => [...prev, {
      id: Date.now(), last4, client: String(fd.get("client")), type: String(fd.get("type")),
      account: String(fd.get("account")), status: "en_fabrication", expiry: `${m}/${y}`,
    }]);
    setShowForm(false);
    notify("Carte commandée avec succès");
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cartes bancaires</h1>
          <p className="text-sm text-gray-500 mt-1">{cards.length} cartes émises</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Nouvelle carte
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCard} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Commander une carte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input name="client" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de carte</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Visa Débit</option><option>Visa Classic</option><option>Visa Gold</option><option>Visa Platinum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte associé</label>
              <input name="account" required placeholder="LU..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Commander</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

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
            {cards.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">**** {c.last4}</td>
                <td className="px-4 py-3 text-gray-700">{c.client}</td>
                <td className="px-4 py-3 text-gray-500">{c.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden md:table-cell">{c.account}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[c.status]}`}>{L[c.status]}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.expiry}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {c.status === "active" && <button onClick={() => setConfirm({ id: c.id, action: "block" })} className="text-xs text-red-600 hover:underline">Bloquer</button>}
                  {c.status === "bloquee" && <button onClick={() => setConfirm({ id: c.id, action: "activate" })} className="text-xs text-green-600 hover:underline">Activer</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{confirm.action === "block" ? "Bloquer la carte ?" : "Activer la carte ?"}</h2>
            <p className="text-sm text-gray-500 mb-6">{confirm.action === "block" ? "La carte sera immédiatement désactivée." : "La carte sera réactivée."}</p>
            <div className="flex gap-3">
              <button onClick={() => toggleStatus(confirm.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${confirm.action === "block" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>
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
