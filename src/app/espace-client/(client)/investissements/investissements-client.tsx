"use client";

import { useState } from "react";

const PORTFOLIO = [
  { id: 1, name: "Actions Européennes", type: "Actions", allocation: 35, value: 87500, perf: 8.4 },
  { id: 2, name: "Obligations Investment Grade", type: "Obligations", allocation: 25, value: 62500, perf: 3.2 },
  { id: 3, name: "Fonds Immobilier REIT", type: "Immobilier", allocation: 15, value: 37500, perf: 5.7 },
  { id: 4, name: "ETF Monde (MSCI World)", type: "ETF", allocation: 15, value: 37500, perf: 12.1 },
  { id: 5, name: "Monétaire Court Terme", type: "Monétaire", allocation: 10, value: 25000, perf: 2.8 },
];

const PERF_HISTORY = [
  { period: "Septembre 2026", value: 250000, change: 1.2 },
  { period: "Août 2026", value: 247000, change: 0.8 },
  { period: "Juillet 2026", value: 245050, change: -0.5 },
  { period: "Juin 2026", value: 246280, change: 1.5 },
  { period: "Mai 2026", value: 242640, change: 2.1 },
  { period: "Avril 2026", value: 237650, change: -1.3 },
];

const ALLOCATION_COLORS: Record<string, string> = {
  Actions: "bg-blue-500",
  Obligations: "bg-green-500",
  Immobilier: "bg-yellow-500",
  ETF: "bg-purple-500",
  Monétaire: "bg-gray-400",
};

export default function InvestissementsClient({
  clientName,
  totalBalance,
}: {
  clientName: string;
  totalBalance: number;
}) {
  const [profile, setProfile] = useState<"prudent" | "equilibre" | "dynamique">("equilibre");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const totalPortfolio = PORTFOLIO.reduce((s, p) => s + p.value, 0);
  const totalPerf = PORTFOLIO.reduce((s, p) => s + (p.value * p.perf) / 100, 0);
  const avgPerf = totalPortfolio > 0 ? (totalPerf / totalPortfolio) * 100 : 0;

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Investissements</h1>
      <p className="text-sm text-gray-500 mb-6">Suivez votre portefeuille et vos performances</p>

      {/* Portfolio overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#001f42] to-[#003d82] rounded-xl p-5 text-white">
          <p className="text-sm text-white/70">Valeur du portefeuille</p>
          <p className="text-2xl font-bold mt-1">{fmtCurrency(totalPortfolio)}</p>
          <p className="text-xs text-white/60 mt-2">{PORTFOLIO.length} lignes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Performance annuelle</p>
          <p className={`text-2xl font-bold mt-1 ${avgPerf >= 0 ? "text-green-600" : "text-red-600"}`}>
            {avgPerf >= 0 ? "+" : ""}{avgPerf.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {avgPerf >= 0 ? "+" : ""}{fmtCurrency(totalPerf)} depuis le début
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Profil investisseur</p>
          <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{profile}</p>
          <button onClick={() => setShowProfileForm(!showProfileForm)} className="text-xs text-blue-600 hover:underline mt-2">
            Modifier le profil
          </button>
        </div>
      </div>

      {showProfileForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Modifier votre profil investisseur</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(["prudent", "equilibre", "dynamique"] as const).map((p) => (
              <button key={p} onClick={() => { setProfile(p); setShowProfileForm(false); notify(`Profil mis à jour : ${p}`); }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${profile === p ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                <p className="font-semibold text-gray-900 capitalize">{p}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {p === "prudent" && "Risque faible — Obligations et monétaire principalement"}
                  {p === "equilibre" && "Risque modéré — Mix actions/obligations équilibré"}
                  {p === "dynamique" && "Risque élevé — Forte exposition actions et marchés"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Allocation */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition du portefeuille</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex h-6 rounded-full overflow-hidden mb-4">
            {PORTFOLIO.map((p) => (
              <div key={p.id} className={`${ALLOCATION_COLORS[p.type] || "bg-gray-300"} transition-all`} style={{ width: `${p.allocation}%` }} title={`${p.type}: ${p.allocation}%`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {PORTFOLIO.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm">
                <span className={`w-3 h-3 rounded-full ${ALLOCATION_COLORS[p.type] || "bg-gray-300"}`} />
                <span className="text-gray-600">{p.type} ({p.allocation}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio lines */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Détail du portefeuille</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Instrument</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Allocation</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Valeur</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Performance</th>
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-3 text-gray-500">{p.type}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{p.allocation}%</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">{fmtCurrency(p.value)}</td>
                  <td className={`px-6 py-3 text-right font-semibold ${p.perf >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {p.perf >= 0 ? "+" : ""}{p.perf}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance history */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Période</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Valorisation</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Variation</th>
              </tr>
            </thead>
            <tbody>
              {PERF_HISTORY.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3 text-gray-700">{item.period}</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">{fmtCurrency(item.value)}</td>
                  <td className={`px-6 py-3 text-right font-semibold ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wealth advisory */}
      <div className="bg-gradient-to-r from-[#001f42] to-[#003d82] rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Conseil patrimonial personnalisé</h3>
            <p className="text-sm text-white/70 mt-1">Prenez rendez-vous avec votre conseiller dédié pour optimiser votre stratégie d&apos;investissement</p>
          </div>
          <a href="/espace-client/messagerie" className="inline-flex items-center gap-2 bg-white text-[#003d82] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 shrink-0">
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </div>
  );
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n).replace(/ /g, " ");
}
