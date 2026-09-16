"use client";

import { useState } from "react";

const INITIAL = [
  { id: 1, label: "Anna Kowalska", name: "Anna Kowalska", iban: "LU83 0019 1026 0000 0422 0000 1234", bic: "CABORLUL", favorite: true },
  { id: 2, label: "Loyer appartement", name: "Immobiliare S.à r.l.", iban: "LU44 0019 2202 0000 0002 4447 1234", bic: "BGLLLULL", favorite: true },
  { id: 3, label: "Électricité Enovos", name: "Enovos Luxembourg S.A.", iban: "LU92 0019 6247 1111 0010 4319 8745", bic: "BILLLULL", favorite: false },
];

export default function BeneficiairesPage() {
  const [beneficiaries, setBeneficiaries] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);

  const toggleFav = (id: number) => {
    setBeneficiaries((prev) => prev.map((b) => b.id === id ? { ...b, favorite: !b.favorite } : b));
  };

  const addBeneficiary = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newB = {
      id: Date.now(),
      label: String(fd.get("label")),
      name: String(fd.get("name")),
      iban: String(fd.get("iban")),
      bic: String(fd.get("bic")),
      favorite: false,
    };
    setBeneficiaries((prev) => [...prev, newB]);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bénéficiaires</h1>
          <p className="text-sm text-gray-500 mt-1">{beneficiaries.length} bénéficiaires enregistrés</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBeneficiary} className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">Nouveau bénéficiaire</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label><input name="label" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du bénéficiaire</label><input name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label><input name="iban" required placeholder="LU..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">BIC</label><input name="bic" placeholder="CABORLUL" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div className="flex gap-3"><button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Ajouter</button><button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button></div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {beneficiaries.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <button onClick={() => toggleFav(b.id)} className="text-yellow-400 hover:text-yellow-500">
                  {b.favorite ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.5 6.5H19l-5.3 4 2.1 6.5L10 14l-5.8 4 2.1-6.5L1 7.5h6.5z"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 1l2.5 6.5H19l-5.3 4 2.1 6.5L10 14l-5.8 4 2.1-6.5L1 7.5h6.5z"/></svg>
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium text-gray-900">{b.label}</p>
                  <p className="text-xs text-gray-500">{b.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{b.iban}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono hidden sm:block">{b.bic}</span>
                <a href="/espace-client/virements" className="text-xs text-blue-600 hover:underline">Virer</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
