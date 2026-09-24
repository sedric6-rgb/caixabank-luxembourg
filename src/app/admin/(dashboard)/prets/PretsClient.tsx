"use client";

import { useState, useTransition } from "react";
import type { AdminClient } from "@/lib/admin-view";
import { formatAmount } from "@/lib/format";
import {
  adminCreateLoanAction,
  adminApproveLoanAction,
  adminRefuseLoanAction,
} from "@/lib/actions/admin-loans";

export type Loan = {
  id: number;
  clientId: number;
  client: string;
  type: string;
  amount: number;
  rate: string;
  duration: string;
  status: string;
  date: string;
  mensualite: number;
  isStored?: boolean;
};

function calcMensualite(amount: number, rateStr: string, years: number): number {
  const r = parseFloat(rateStr.replace(",", ".")) / 100 / 12;
  const n = years * 12;
  if (r === 0) return amount / n;
  return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const RATES: Record<string, string> = { Immobilier: "3,45", Consommation: "5,80", Auto: "4,30", Etudiant: "2,00", Professionnel: "4,10" };
const TYPES = ["Immobilier", "Consommation", "Auto", "Etudiant", "Professionnel"];


const S: Record<string, string> = { en_cours: "bg-green-100 text-green-700", demande: "bg-yellow-100 text-yellow-700", approuve: "bg-blue-100 text-blue-700", refuse: "bg-red-100 text-red-700", annule: "bg-gray-100 text-gray-500" };
const SL: Record<string, string> = { en_cours: "En cours", demande: "Demande", approuve: "Approuve", refuse: "Refuse", annule: "Annule" };

export default function PretsClient({ clients, initialLoans }: { clients: AdminClient[]; initialLoans: Loan[] }) {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<{ id: number; action: "approve" | "refuse" } | null>(null);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [detail, setDetail] = useState<Loan | null>(null);
  const [isPending, startTransition] = useTransition();

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = () => {
    if (!confirm) return;
    const loan = loans.find((l) => l.id === confirm.id);
    const newStatus = confirm.action === "approve" ? "en_cours" : "refuse";

    startTransition(async () => {
      if (loan?.isStored) {
        const res = confirm.action === "approve"
          ? await adminApproveLoanAction(loan.id)
          : await adminRefuseLoanAction(loan.id);
        if (!res.success) {
          notify(res.error || "Erreur");
          setConfirm(null);
          return;
        }
      }
      setLoans((prev) => prev.map((l) => l.id === confirm.id ? { ...l, status: newStatus } : l));
      notify(confirm.action === "approve" ? "Pret approuve — fonds debloques sur le compte client" : "Pret refuse");
      setConfirm(null);
    });
  };

  const addLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const clientId = Number(fd.get("clientId"));
    const cl = clients.find((c) => c.id === clientId);
    const type = String(fd.get("type"));
    const amount = Number(fd.get("amount"));
    const duration = Number(fd.get("duration"));
    const rate = RATES[type] || "4,00";
    const autoApprove = fd.get("autoApprove") === "true";

    startTransition(async () => {
      fd.set("autoApprove", autoApprove ? "true" : "false");
      const res = await adminCreateLoanAction(fd);
      if (res.success) {
        const d = new Date();
        setLoans((prev) => [...prev, {
          id: res.loanId!,
          clientId,
          client: cl ? `${cl.first_name} ${cl.last_name}` : "Inconnu",
          type,
          amount,
          rate,
          duration: `${duration} ans`,
          status: autoApprove ? "en_cours" : "demande",
          date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
          mensualite: calcMensualite(amount, rate, duration),
          isStored: true,
        }]);
        setShowForm(false);
        notify(autoApprove ? "Pret octroye et fonds debloques" : "Demande de pret enregistree");
      } else {
        notify(res.error || "Erreur");
      }
    });
  };

  const filtered = filter === "Tous" ? loans : loans.filter((l) => l.status === filter);
  const enCours = loans.filter((l) => l.status === "en_cours");
  const demandes = loans.filter((l) => l.status === "demande");
  const totalMontant = enCours.reduce((s, l) => s + l.amount, 0);

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Credits & Prets</h1>
          <p className="text-sm text-gray-500 mt-1">{loans.length} dossiers — encours : {formatAmount(totalMontant)} EUR</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#002a5c]">
          + Octroyer un pret
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Prets en cours</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{enCours.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Demandes</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">{demandes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Encours total</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatAmount(totalMontant)} EUR</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Taux moyen</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">3,87%</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addLoan} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Octroyer un nouveau pret</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select name="clientId" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selectionner un client</option>
                {clients.filter((c) => c.status === "actif").map((c) => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.client_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de pret</label>
              <select name="type" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {TYPES.map((t) => <option key={t} value={t}>{t} — {RATES[t]}%</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
              <input name="amount" type="number" min="1000" step="100" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duree (annees)</label>
              <input name="duration" type="number" min="1" max="30" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="autoApprove" value="true" className="rounded" />
            <span className="text-sm text-gray-700">Approuver et debloquer les fonds immediatement</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
              {isPending ? "Traitement..." : "Octroyer"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        </form>
      )}

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4 overflow-x-auto">
        {["Tous", "en_cours", "demande", "approuve", "refuse"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {f === "Tous" ? "Tous" : SL[f]}
          </button>
        ))}
      </div>

      <div className="block sm:hidden space-y-3">
        {filtered.map((l) => (
          <div key={l.id} onClick={() => setDetail(l)} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm">{l.client}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[l.status]}`}>{SL[l.status]}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">{l.type} — {l.rate}%</span>
                <p className="text-xs text-gray-500 mt-0.5">{l.duration}</p>
              </div>
              <span className="text-base font-bold text-gray-900">{formatAmount(l.amount)} EUR</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Mensualite</span>
              <span className="text-sm font-semibold text-blue-700">{formatAmount(l.mensualite)} EUR</span>
            </div>
            {l.status === "demande" && (
              <div className="mt-2 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setConfirm({ id: l.id, action: "approve" }); }} className="flex-1 text-xs bg-green-50 text-green-700 py-1.5 rounded-lg font-medium">Approuver</button>
                <button onClick={(e) => { e.stopPropagation(); setConfirm({ id: l.id, action: "refuse" }); }} className="flex-1 text-xs bg-red-50 text-red-700 py-1.5 rounded-lg font-medium">Refuser</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Aucun dossier</p>}
      </div>

      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Taux</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Duree</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Mensualite</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setDetail(l)}>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{l.client}</td>
                <td className="px-4 py-3 text-gray-500">{l.type}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">{formatAmount(l.amount)}</td>
                <td className="px-4 py-3 text-gray-500">{l.rate}%</td>
                <td className="px-4 py-3 text-gray-500">{l.duration}</td>
                <td className="px-4 py-3 text-right font-medium text-blue-700 whitespace-nowrap">{formatAmount(l.mensualite)}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[l.status]}`}>{SL[l.status]}</span></td>
                <td className="px-4 py-3 text-gray-500">{l.date}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {l.status === "demande" && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setConfirm({ id: l.id, action: "approve" }); }} className="text-xs text-green-600 hover:underline">Approuver</button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirm({ id: l.id, action: "refuse" }); }} className="text-xs text-red-600 hover:underline">Refuser</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Aucun dossier</td></tr>}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Detail du pret</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Client</span><span className="text-sm font-medium text-gray-900">{detail.client}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Type</span><span className="text-sm font-medium text-gray-900">{detail.type}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Montant</span><span className="text-sm font-bold text-gray-900">{formatAmount(detail.amount)} EUR</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Taux annuel</span><span className="text-sm font-medium text-gray-900">{detail.rate}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Duree</span><span className="text-sm font-medium text-gray-900">{detail.duration}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-3"><span className="text-sm text-gray-500">Mensualite</span><span className="text-sm font-bold text-blue-700">{formatAmount(detail.mensualite)} EUR</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Cout total</span><span className="text-sm font-medium text-gray-900">{formatAmount(detail.mensualite * parseInt(detail.duration) * 12)} EUR</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Statut</span><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[detail.status]}`}>{SL[detail.status]}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Date</span><span className="text-sm text-gray-900">{detail.date}</span></div>
            </div>
            {detail.status === "demande" && (
              <div className="mt-5 flex gap-3">
                <button onClick={() => { setConfirm({ id: detail.id, action: "approve" }); setDetail(null); }} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700">Approuver</button>
                <button onClick={() => { setConfirm({ id: detail.id, action: "refuse" }); setDetail(null); }} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700">Refuser</button>
              </div>
            )}
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{confirm.action === "approve" ? "Approuver le pret ?" : "Refuser le pret ?"}</h2>
            <p className="text-sm text-gray-500 mb-6">{confirm.action === "approve" ? "Le pret sera valide et les fonds debloques sur le compte du client." : "Le dossier sera marque comme refuse."}</p>
            <div className="flex gap-3">
              <button onClick={updateStatus} disabled={isPending} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${confirm.action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                {isPending ? "Traitement..." : "Confirmer"}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
