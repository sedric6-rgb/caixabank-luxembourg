"use client";

import { useState } from "react";

type EpargneAccount = { id: number; label: string; balance: number; iban: string };
type CourantAccount = { id: number; label: string; balance: number };

const DEMO_GOALS = [
  { id: 1, name: "Vacances été 2027", target: 5000, current: 3200, icon: "sun" },
  { id: 2, name: "Apport immobilier", target: 50000, current: 28500, icon: "home" },
  { id: 3, name: "Fonds d'urgence", target: 15000, current: 12000, icon: "shield" },
];

const DEMO_PROGRAMMED = [
  { id: 1, label: "Épargne mensuelle", amount: 500, frequency: "Mensuel", source: "Compte Courant", next: "01/10/2026", active: true },
  { id: 2, label: "Épargne vacances", amount: 200, frequency: "Mensuel", source: "Compte Courant", next: "01/10/2026", active: true },
];

const INTEREST_HISTORY = [
  { month: "Septembre 2026", amount: 122.34 },
  { month: "Août 2026", amount: 119.87 },
  { month: "Juillet 2026", amount: 118.45 },
  { month: "Juin 2026", amount: 116.92 },
  { month: "Mai 2026", amount: 115.30 },
  { month: "Avril 2026", amount: 113.75 },
];

export default function EpargneClient({
  epargneAccounts,
  courantAccounts,
  clientName,
}: {
  epargneAccounts: EpargneAccount[];
  courantAccounts: CourantAccount[];
  clientName: string;
}) {
  const [goals, setGoals] = useState(DEMO_GOALS);
  const [programmed, setProgrammed] = useState(DEMO_PROGRAMMED);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewProgrammed, setShowNewProgrammed] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const totalEpargne = epargneAccounts.reduce((s, a) => s + a.balance, 0);
  const annualRate = 3.25;
  const monthlyInterest = (totalEpargne * annualRate) / 100 / 12;

  const addGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setGoals((prev) => [...prev, {
      id: Date.now(),
      name: String(fd.get("name")),
      target: Number(fd.get("target")),
      current: 0,
      icon: "star",
    }]);
    setShowNewGoal(false);
    notify("Objectif d'épargne créé");
  };

  const addProgrammed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setProgrammed((prev) => [...prev, {
      id: Date.now(),
      label: String(fd.get("label")),
      amount: Number(fd.get("amount")),
      frequency: String(fd.get("frequency")),
      source: String(fd.get("source")),
      next: "01/10/2026",
      active: true,
    }]);
    setShowNewProgrammed(false);
    notify("Épargne programmée créée");
  };

  const deleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    notify("Objectif supprimé");
  };

  const toggleProgrammed = (id: number) => {
    setProgrammed((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Mon épargne</h1>
      <p className="text-sm text-gray-500 mb-6">Gérez vos comptes épargne, objectifs et versements programmés</p>

      {/* Savings overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-5 text-white">
          <p className="text-sm text-white/70">Total épargne</p>
          <p className="text-2xl font-bold mt-1">{fmtCurrency(totalEpargne)}</p>
          <p className="text-xs text-white/60 mt-2">{epargneAccounts.length} compte{epargneAccounts.length > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Taux d&apos;intérêt annuel</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{annualRate}%</p>
          <p className="text-xs text-gray-400 mt-2">Taux brut annuel</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Intérêts mensuels estimés</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">+{fmtCurrency(monthlyInterest)}</p>
          <p className="text-xs text-gray-400 mt-2">Prochain versement : 01/10/2026</p>
        </div>
      </div>

      {/* Savings accounts */}
      {epargneAccounts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes comptes épargne</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {epargneAccounts.map((acct) => (
              <div key={acct.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{acct.label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Épargne</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{fmtCurrency(acct.balance)}</p>
                <p className="text-xs text-gray-400 font-mono mt-2">{acct.iban}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">+{fmtCurrency(acct.balance * annualRate / 100 / 12)}/mois</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {epargneAccounts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
          <p className="text-sm text-blue-800 font-medium">Vous n&apos;avez pas encore de compte épargne</p>
          <p className="text-xs text-blue-600 mt-1">Ouvrez un Livret Épargne et profitez d&apos;un taux attractif de {annualRate}%</p>
          <a href="/espace-client/demandes" className="inline-block mt-3 bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Ouvrir un compte épargne</a>
        </div>
      )}

      {/* Savings goals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Objectifs d&apos;épargne</h2>
          <button onClick={() => setShowNewGoal(!showNewGoal)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Nouvel objectif
          </button>
        </div>

        {showNewGoal && (
          <form onSubmit={addGoal} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;objectif</label>
                <input name="name" required placeholder="Ex: Vacances, Voiture..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant cible (EUR)</label>
                <input name="target" type="number" required min="100" placeholder="10000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Créer</button>
              <button type="button" onClick={() => setShowNewGoal(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, (goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GoalIcon name={goal.icon} />
                    <h3 className="font-semibold text-gray-900 text-sm">{goal.name}</h3>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-red-500">
                    <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5"><path d="M3 3l8 8M11 3l-8 8"/></svg>
                  </button>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{fmtCurrency(goal.current)}</span>
                  <span className="font-medium text-gray-900">{fmtCurrency(goal.target)}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400">{pct.toFixed(0)}% atteint</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Programmed savings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Épargne programmée</h2>
          <button onClick={() => setShowNewProgrammed(!showNewProgrammed)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Programmer
          </button>
        </div>

        {showNewProgrammed && (
          <form onSubmit={addProgrammed} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                <input name="label" required placeholder="Ex: Épargne mensuelle" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
                <input name="amount" type="number" required min="10" placeholder="500" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
                <select name="frequency" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Mensuel">Mensuel</option>
                  <option value="Bimensuel">Bimensuel</option>
                  <option value="Hebdomadaire">Hebdomadaire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte source</label>
                <select name="source" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {courantAccounts.map((a) => <option key={a.id} value={a.label}>{a.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Programmer</button>
              <button type="button" onClick={() => setShowNewProgrammed(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {programmed.map((p) => (
              <div key={p.id} className="px-4 sm:px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{fmtCurrency(p.amount)} — {p.frequency} — depuis {p.source}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Prochain prélèvement : {p.next}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleProgrammed(p.id)} className={`relative w-11 h-6 rounded-full transition-colors ${p.active ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${p.active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
            {programmed.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucune épargne programmée</div>
            )}
          </div>
        </div>
      </div>

      {/* Interest history */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des intérêts</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Période</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Intérêts versés</th>
              </tr>
            </thead>
            <tbody>
              {INTEREST_HISTORY.map((item, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3 text-gray-700">{item.month}</td>
                  <td className="px-6 py-3 text-right font-semibold text-green-600">+{fmtCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n).replace(/ /g, " ");
}

function GoalIcon({ name }: { name: string }) {
  const cls = "w-8 h-8 rounded-lg flex items-center justify-center";
  switch (name) {
    case "sun": return <div className={`${cls} bg-yellow-100`}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" stroke="#ca8a04" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round"/></svg></div>;
    case "home": return <div className={`${cls} bg-blue-100`}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 8l6-6 6 6M4 7v6a1 1 0 001 1h6a1 1 0 001-1V7" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
    case "shield": return <div className={`${cls} bg-green-100`}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 1L2 4v4c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1z" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 8l2 2 3-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
    default: return <div className={`${cls} bg-purple-100`}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 1l2 4.5H15L11 8.5l1.5 5L8 11l-4.5 2.5L5 8.5 1 5.5h5z" stroke="#9333ea" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>;
  }
}
