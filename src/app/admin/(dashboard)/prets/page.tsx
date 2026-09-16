"use client";

import { useState } from "react";

const INITIAL_LOANS = [
  { id: 1, client: "Jan Kowalski", type: "Immobilier", amount: 350000, rate: "3,45%", duration: "25 ans", status: "en_cours", date: "01/06/2022" },
  { id: 2, client: "Anna Nowak", type: "Consommation", amount: 15000, rate: "6,20%", duration: "3 ans", status: "en_cours", date: "15/01/2024" },
  { id: 3, client: "Piotr Wiśniewski", type: "Auto", amount: 45000, rate: "4,50%", duration: "5 ans", status: "en_cours", date: "10/03/2023" },
  { id: 4, client: "Katarzyna Wójcik", type: "Immobilier", amount: 280000, rate: "3,75%", duration: "20 ans", status: "demande", date: "05/09/2024" },
  { id: 5, client: "Tomasz Kamiński", type: "Professionnel", amount: 120000, rate: "4,10%", duration: "7 ans", status: "approuve", date: "20/08/2024" },
  { id: 6, client: "Michał Zieliński", type: "Étudiant", amount: 8000, rate: "2,00%", duration: "2 ans", status: "en_cours", date: "01/10/2023" },
  { id: 7, client: "Agnieszka Szymańska", type: "Consommation", amount: 25000, rate: "5,80%", duration: "4 ans", status: "refuse", date: "12/07/2024" },
  { id: 8, client: "Magdalena Lewandowska", type: "Auto", amount: 60000, rate: "4,30%", duration: "5 ans", status: "demande", date: "08/09/2024" },
];

const S: Record<string, string> = { en_cours: "bg-green-100 text-green-700", demande: "bg-yellow-100 text-yellow-700", approuve: "bg-blue-100 text-blue-700", refuse: "bg-red-100 text-red-700" };
const SL: Record<string, string> = { en_cours: "En cours", demande: "Demande", approuve: "Approuvé", refuse: "Refusé" };
const RATES: Record<string, string> = { Immobilier: "3,45%", Consommation: "5,80%", Auto: "4,30%", Étudiant: "2,00%", Professionnel: "4,10%" };

export default function AdminPretsPage() {
  const [loans, setLoans] = useState(INITIAL_LOANS);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; action: "approve" | "refuse" } | null>(null);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = () => {
    if (!confirm) return;
    const newStatus = confirm.action === "approve" ? "approuve" : "refuse";
    setLoans((prev) => prev.map((l) => l.id === confirm.id ? { ...l, status: newStatus } : l));
    notify(confirm.action === "approve" ? "Prêt approuvé" : "Prêt refusé");
    setConfirm(null);
  };

  const addLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = new Date();
    setLoans((prev) => [...prev, {
      id: Date.now(), client: String(fd.get("client")), type: String(fd.get("type")),
      amount: Number(fd.get("amount")), rate: RATES[String(fd.get("type"))] || "4,00%",
      duration: `${fd.get("duration")} ans`, status: "demande",
      date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    }]);
    setShowForm(false);
    notify("Demande de prêt enregistrée");
  };

  const enCours = loans.filter((l) => l.status === "en_cours");
  const demandes = loans.filter((l) => l.status === "demande");
  const totalMontant = enCours.reduce((s, l) => s + l.amount, 0);

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crédits & Prêts</h1>
          <p className="text-sm text-gray-500 mt-1">{loans.length} dossiers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Nouveau prêt
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Prêts en cours</p>
          <p className="text-2xl font-bold text-gray-900">{enCours.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Demandes en attente</p>
          <p className="text-2xl font-bold text-yellow-600">{demandes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Encours total</p>
          <p className="text-2xl font-bold text-gray-900">{totalMontant.toLocaleString("fr-FR")} EUR</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addLoan} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouveau dossier de prêt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client</label><input name="client" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Immobilier</option><option>Consommation</option><option>Auto</option><option>Étudiant</option><option>Professionnel</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label><input name="amount" type="number" min="1000" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Durée (années)</label><input name="duration" type="number" min="1" max="30" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (EUR)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Taux</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Durée</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{l.client}</td>
                <td className="px-4 py-3 text-gray-500">{l.type}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{l.amount.toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{l.rate}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{l.duration}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[l.status]}`}>{SL[l.status]}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{l.date}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {l.status === "demande" && (
                    <>
                      <button onClick={() => setConfirm({ id: l.id, action: "approve" })} className="text-xs text-green-600 hover:underline">Approuver</button>
                      <button onClick={() => setConfirm({ id: l.id, action: "refuse" })} className="text-xs text-red-600 hover:underline">Refuser</button>
                    </>
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
            <h2 className="text-lg font-bold text-gray-900 mb-2">{confirm.action === "approve" ? "Approuver le prêt ?" : "Refuser le prêt ?"}</h2>
            <p className="text-sm text-gray-500 mb-6">{confirm.action === "approve" ? "Le prêt sera validé et les fonds débloqués." : "Le dossier sera marqué comme refusé."}</p>
            <div className="flex gap-3">
              <button onClick={updateStatus} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${confirm.action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>Confirmer</button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
