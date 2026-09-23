"use client";

import { useState, useTransition } from "react";
import { addBeneficiaryAction, deleteBeneficiaryAction, toggleBeneficiaryFavoriteAction } from "@/lib/actions/virements";

type Beneficiary = { id: number; label: string; name: string; iban: string; bic: string; favorite: boolean };

export default function BeneficiairesClient({ initialBeneficiaries }: { initialBeneficiaries: Beneficiary[] }) {
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleFav = (id: number) => {
    setBeneficiaries((prev) => prev.map((b) => b.id === id ? { ...b, favorite: !b.favorite } : b));
    startTransition(async () => {
      await toggleBeneficiaryFavoriteAction(id);
    });
  };

  const deleteBen = (id: number) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    notify("Beneficiaire supprime");
    startTransition(async () => {
      await deleteBeneficiaryAction(id);
    });
  };

  const addBeneficiary = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await addBeneficiaryAction(fd);
      if (res.success) {
        const newB: Beneficiary = {
          id: res.id || Date.now(),
          label: String(fd.get("label")),
          name: String(fd.get("name")),
          iban: String(fd.get("iban")).toUpperCase(),
          bic: String(fd.get("bic") || "CABORLULLUX").toUpperCase(),
          favorite: false,
        };
        setBeneficiaries((prev) => [...prev, newB]);
        setShowForm(false);
        notify("Beneficiaire ajoute");
      } else {
        setError(res.error || "Erreur");
      }
    });
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Beneficiaires</h1>
          <p className="text-sm text-gray-500 mt-1">{beneficiaries.length} beneficiaire{beneficiaries.length > 1 ? "s" : ""} enregistre{beneficiaries.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); }} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBeneficiary} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Nouveau beneficiaire</h2>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Libelle *</label><input name="label" required placeholder="Ex: Mon proprietaire" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du beneficiaire *</label><input name="name" required placeholder="Nom complet" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">IBAN *</label><input name="iban" required placeholder="LU00 0000 0000 0000 0000 0000 0000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">BIC / SWIFT</label><input name="bic" placeholder="CABORLULLUX (facultatif)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
              {isPending ? "Ajout..." : "Ajouter"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {beneficiaries.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <button onClick={() => toggleFav(b.id)} className="text-yellow-400 hover:text-yellow-500 shrink-0">
                  {b.favorite ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.5 6.5H19l-5.3 4 2.1 6.5L10 14l-5.8 4 2.1-6.5L1 7.5h6.5z"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 1l2.5 6.5H19l-5.3 4 2.1 6.5L10 14l-5.8 4 2.1-6.5L1 7.5h6.5z"/></svg>
                  )}
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.label}</p>
                  <p className="text-xs text-gray-500 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{b.iban}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-xs text-gray-400 font-mono hidden sm:block">{b.bic}</span>
                <a href="/espace-client/virements" className="text-xs text-blue-600 hover:underline">Virer</a>
                <button onClick={() => deleteBen(b.id)} className="text-xs text-red-400 hover:text-red-600">
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M9 7v4M5 7v4M3 4l1 8a1 1 0 001 1h4a1 1 0 001-1l1-8"/></svg>
                </button>
              </div>
            </div>
          ))}
          {beneficiaries.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucun beneficiaire enregistre</div>
          )}
        </div>
      </div>
    </div>
  );
}
