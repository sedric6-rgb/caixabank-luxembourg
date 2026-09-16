"use client";

import { useState } from "react";

const LOANS = [
  { id: 1, type: "Prêt immobilier", amount: 350000, rate: 3.45, duration: 300, monthly: 1567.23, remaining: 312450, status: "en_cours", start: "01/06/2022", end: "01/06/2047" },
];

export default function PretsPage() {
  const [simAmount, setSimAmount] = useState(100000);
  const [simDuration, setSimDuration] = useState(240);
  const simRate = 3.45;
  const monthlyRate = simRate / 100 / 12;
  const simMonthly = monthlyRate > 0 ? (simAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -simDuration)) : simAmount / simDuration;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Crédits & Prêts</h1>
      <p className="text-sm text-gray-500 mb-6">Gérez vos crédits et simulez de nouveaux prêts</p>

      {/* Active loans */}
      {LOANS.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes crédits en cours</h2>
          <div className="space-y-4">
            {LOANS.map((loan) => {
              const progress = ((loan.amount - loan.remaining) / loan.amount) * 100;
              return (
                <div key={loan.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{loan.type}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">En cours</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                    <div><p className="text-gray-500">Montant total</p><p className="font-bold text-gray-900">{loan.amount.toLocaleString("fr-FR")} EUR</p></div>
                    <div><p className="text-gray-500">Capital restant</p><p className="font-bold text-gray-900">{loan.remaining.toLocaleString("fr-FR")} EUR</p></div>
                    <div><p className="text-gray-500">Taux</p><p className="font-bold text-gray-900">{loan.rate}%</p></div>
                    <div><p className="text-gray-500">Mensualité</p><p className="font-bold text-gray-900">{loan.monthly.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</p></div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Remboursé</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Du {loan.start} au {loan.end}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loan simulator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Simuler un crédit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Montant emprunté : <span className="font-bold">{simAmount.toLocaleString("fr-FR")} EUR</span></label>
              <input type="range" min="5000" max="500000" step="5000" value={simAmount} onChange={(e) => setSimAmount(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400"><span>5 000 EUR</span><span>500 000 EUR</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée : <span className="font-bold">{Math.floor(simDuration / 12)} ans ({simDuration} mois)</span></label>
              <input type="range" min="12" max="360" step="12" value={simDuration} onChange={(e) => setSimDuration(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400"><span>1 an</span><span>30 ans</span></div>
            </div>
            <p className="text-xs text-gray-500">Taux indicatif : {simRate}% (TAEG)</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-6">
            <p className="text-sm text-gray-500 mb-2">Mensualité estimée</p>
            <p className="text-4xl font-bold text-[#003d82]">{simMonthly.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR</p>
            <p className="text-sm text-gray-500 mt-2">Coût total : {(simMonthly * simDuration).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR</p>
            <button className="mt-4 bg-[#003d82] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors">
              Demander ce crédit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
