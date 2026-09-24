"use client";

import { useState, useTransition } from "react";
import type { AdminClient } from "@/lib/admin-view";
import type { Insurance } from "@/lib/insurances-store";
import { adminCreateInsuranceAction, adminSetInsuranceStatusAction } from "@/lib/actions/admin-data";
import { formatAmount } from "@/lib/format";


const INSURANCE_TYPES = ["Vie", "Habitation", "Auto", "Sante", "Responsabilite civile", "Voyage"];
const FORMULES: Record<string, string[]> = {
  Vie: ["Capital deces", "Epargne capitalisation", "Mixte"],
  Habitation: ["Essentielle", "Confort", "Premium"],
  Auto: ["Tiers", "Tiers etendu", "Tous risques"],
  Sante: ["Hospitalisation", "Complementaire", "Premium"],
  "Responsabilite civile": ["Standard", "Etendue"],
  Voyage: ["Europe", "Monde", "Business"],
};
const PRIMES: Record<string, number> = { Vie: 250, Habitation: 85, Auto: 120, Sante: 180, "Responsabilite civile": 45, Voyage: 35 };


const S: Record<string, string> = { active: "bg-green-100 text-green-700", en_attente: "bg-yellow-100 text-yellow-700", expiree: "bg-gray-100 text-gray-500", resiliee: "bg-red-100 text-red-700" };
const SL: Record<string, string> = { active: "Active", en_attente: "En attente", expiree: "Expiree", resiliee: "Resiliee" };

export default function AssurancesClient({ clients, initialInsurances }: { clients: AdminClient[]; initialInsurances: Insurance[] }) {
  const [insurances, setInsurances] = useState<Insurance[]>(initialInsurances);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [detail, setDetail] = useState<Insurance | null>(null);
  const [selectedType, setSelectedType] = useState(INSURANCE_TYPES[0]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const addInsurance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      clientId: Number(fd.get("clientId")),
      type: String(fd.get("type")),
      formule: String(fd.get("formule")),
      prime: Number(fd.get("prime")),
      couverture: Number(fd.get("couverture") || 0),
    };
    startTransition(async () => {
      const res = await adminCreateInsuranceAction(data);
      if (!res.success) { notify(res.error); return; }
      setInsurances((prev) => [...prev, res.insurance]);
      setShowForm(false);
      notify("Contrat d'assurance cree");
    });
  };

  const setStatus = (id: number, status: "active" | "resiliee") => {
    startTransition(async () => {
      const res = await adminSetInsuranceStatusAction(id, status);
      setDetail(null);
      if (!res.success) { notify(res.error); return; }
      setInsurances((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      notify(status === "active" ? "Contrat active" : "Contrat resilie");
    });
  };

  const filtered = insurances.filter((i) => {
    if (filter !== "Tous" && i.status !== filter) return false;
    if (typeFilter !== "Tous" && i.type !== typeFilter) return false;
    return true;
  });

  const actives = insurances.filter((i) => i.status === "active");
  const totalPrimes = actives.reduce((s, i) => s + i.prime, 0);
  const totalCouverture = actives.reduce((s, i) => s + i.couverture, 0);

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assurances</h1>
          <p className="text-sm text-gray-500 mt-1">{insurances.length} contrats — {actives.length} actifs</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#002a5c]">
          + Nouveau contrat
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Contrats actifs</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{actives.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">En attente</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">{insurances.filter((i) => i.status === "en_attente").length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Primes mensuelles</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatAmount(totalPrimes)} EUR</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Couverture totale</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-600">{formatAmount(totalCouverture)} EUR</p>
        </div>
      </div>

      {/* New insurance form */}
      {showForm && (
        <form onSubmit={addInsurance} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Nouveau contrat d&apos;assurance</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {INSURANCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formule</label>
              <select name="formule" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {(FORMULES[selectedType] || []).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prime mensuelle (EUR)</label>
              <input name="prime" type="number" min="10" step="5" defaultValue={PRIMES[selectedType] || 100} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant de couverture (EUR)</label>
              <input name="couverture" type="number" min="0" step="1000" defaultValue="100000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Creer le contrat</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500">Annuler</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {["Tous", "active", "en_attente", "expiree", "resiliee"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {f === "Tous" ? "Tous" : SL[f]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {["Tous", ...INSURANCE_TYPES].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.map((i) => (
          <div key={i.id} onClick={() => setDetail(i)} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 text-sm">{i.client}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[i.status]}`}>{SL[i.status]}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">{i.type}</span>
                <p className="text-xs text-gray-400 mt-0.5">{i.formule}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-gray-900">{formatAmount(i.prime)} EUR</span>
                <p className="text-xs text-gray-400">/mois</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Aucun contrat</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Formule</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Prime/mois</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Couverture</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Echeance</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setDetail(i)}>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{i.client}</td>
                <td className="px-4 py-3 text-gray-500">{i.type}</td>
                <td className="px-4 py-3 text-gray-500">{i.formule}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">{formatAmount(i.prime)}</td>
                <td className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">{i.couverture > 0 ? formatAmount(i.couverture) : "—"}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[i.status]}`}>{SL[i.status]}</span></td>
                <td className="px-4 py-3 text-gray-500">{i.echeance}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={(e) => { e.stopPropagation(); setDetail(i); }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Detail</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Aucun contrat</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Contrat d&apos;assurance</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-gray-500">Client</span><span className="text-sm font-medium text-gray-900">{detail.client}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Type</span><span className="text-sm font-medium text-gray-900">{detail.type}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Formule</span><span className="text-sm font-medium text-gray-900">{detail.formule}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Prime mensuelle</span><span className="text-sm font-bold text-gray-900">{formatAmount(detail.prime)} EUR</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Prime annuelle</span><span className="text-sm font-medium text-gray-900">{formatAmount(detail.prime * 12)} EUR</span></div>
              {detail.couverture > 0 && <div className="flex justify-between"><span className="text-sm text-gray-500">Couverture</span><span className="text-sm font-bold text-blue-700">{formatAmount(detail.couverture)} EUR</span></div>}
              <div className="flex justify-between border-t border-gray-100 pt-3"><span className="text-sm text-gray-500">Debut</span><span className="text-sm text-gray-900">{detail.debut}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Echeance</span><span className="text-sm text-gray-900">{detail.echeance}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500">Statut</span><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[detail.status]}`}>{SL[detail.status]}</span></div>
            </div>
            <div className="mt-5 flex gap-3">
              {detail.status === "en_attente" && (
                <button disabled={isPending} onClick={() => setStatus(detail.id, "active")} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700">Activer</button>
              )}
              {(detail.status === "active" || detail.status === "en_attente") && (
                <button disabled={isPending} onClick={() => setStatus(detail.id, "resiliee")} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700">Resilier</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
