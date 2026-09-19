"use client";

import { useState } from "react";

const DEMO_MANDATES = [
  { id: 1, creditor: "Electro Lux S.A.", ref: "MNDT-2026-001", iban: "LU28 0019 4100 0000 5500 1234", amount: 127.50, frequency: "Mensuel", next: "01/10/2026", status: "actif" },
  { id: 2, creditor: "Immobilière du Grand-Duché", ref: "MNDT-2026-002", iban: "LU33 0019 1014 0000 6600 3333", amount: 1450.00, frequency: "Mensuel", next: "01/10/2026", status: "actif" },
  { id: 3, creditor: "AXA Assurances Luxembourg", ref: "MNDT-2026-003", iban: "LU55 0019 2004 0000 7700 5555", amount: 245.00, frequency: "Mensuel", next: "15/10/2026", status: "actif" },
  { id: 4, creditor: "POST Telecom", ref: "MNDT-2026-004", iban: "LU44 0019 1014 0000 2200 4444", amount: 49.99, frequency: "Mensuel", next: "05/10/2026", status: "actif" },
  { id: 5, creditor: "CFL Transport", ref: "MNDT-2026-005", iban: "LU77 0019 1014 0000 9900 7777", amount: 75.00, frequency: "Mensuel", next: "01/10/2026", status: "actif" },
  { id: 6, creditor: "Netflix International", ref: "MNDT-2025-010", iban: "IE29 AIBK 9311 5212 3456 78", amount: 15.49, frequency: "Mensuel", next: "20/10/2026", status: "actif" },
  { id: 7, creditor: "Fitness Club Lux", ref: "MNDT-2025-012", iban: "LU88 0019 1014 0000 1100 8888", amount: 49.90, frequency: "Mensuel", next: "01/10/2026", status: "actif" },
  { id: 8, creditor: "Ancienne Assurance Auto", ref: "MNDT-2024-008", iban: "LU12 0019 1014 0000 5500 1111", amount: 0, frequency: "Annuel", next: "—", status: "revoque" },
];

const DEMO_HISTORY = [
  { id: 100, date: "01/09/2026", creditor: "Immobilière du Grand-Duché", amount: 1450.00, status: "exécuté" },
  { id: 101, date: "01/09/2026", creditor: "Electro Lux S.A.", amount: 127.50, status: "exécuté" },
  { id: 102, date: "01/09/2026", creditor: "CFL Transport", amount: 75.00, status: "exécuté" },
  { id: 103, date: "05/09/2026", creditor: "POST Telecom", amount: 49.99, status: "exécuté" },
  { id: 104, date: "15/09/2026", creditor: "AXA Assurances Luxembourg", amount: 245.00, status: "exécuté" },
  { id: 105, date: "20/09/2026", creditor: "Netflix International", amount: 15.49, status: "exécuté" },
  { id: 106, date: "01/09/2026", creditor: "Fitness Club Lux", amount: 49.90, status: "exécuté" },
];

export default function PrelevementsClient({ clientName }: { clientName: string }) {
  const [mandates, setMandates] = useState(DEMO_MANDATES);
  const [tab, setTab] = useState<"mandats" | "historique">("mandats");
  const [confirmRevoke, setConfirmRevoke] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const activeMandates = mandates.filter((m) => m.status === "actif");
  const revokedMandates = mandates.filter((m) => m.status === "revoque");
  const totalMonthly = activeMandates.reduce((s, m) => s + m.amount, 0);

  const revokeMandate = (id: number) => {
    setMandates((prev) => prev.map((m) => m.id === id ? { ...m, status: "revoque", next: "—", amount: 0 } : m));
    setConfirmRevoke(null);
    notify("Mandat révoqué avec succès");
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Prélèvements</h1>
      <p className="text-sm text-gray-500 mb-6">Gérez vos mandats de prélèvement SEPA</p>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Mandats actifs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{activeMandates.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total mensuel estimé</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{fmtCurrency(totalMonthly)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Mandats révoqués</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">{revokedMandates.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("mandats")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "mandats" ? "bg-[#003d82] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          Mandats ({mandates.length})
        </button>
        <button onClick={() => setTab("historique")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "historique" ? "bg-[#003d82] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          Historique
        </button>
      </div>

      {tab === "mandats" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {mandates.map((m) => (
              <div key={m.id} className={`px-4 sm:px-6 py-4 ${m.status === "revoque" ? "opacity-50" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{m.creditor}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.status === "actif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {m.status === "actif" ? "Actif" : "Révoqué"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Réf: {m.ref} — {m.frequency}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{m.iban}</p>
                    {m.status === "actif" && (
                      <p className="text-xs text-gray-400 mt-1">Prochain prélèvement : {m.next}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {m.status === "actif" && (
                      <>
                        <p className="text-sm font-bold text-gray-900">{fmtCurrency(m.amount)}</p>
                        <button onClick={() => setConfirmRevoke(m.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100">Révoquer</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "historique" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Créancier</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Montant</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_HISTORY.map((h) => (
                <tr key={h.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{h.date}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{h.creditor}</td>
                  <td className="px-6 py-3 text-right font-semibold text-red-600">-{fmtCurrency(h.amount)}</td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Exécuté</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Revoke confirmation modal */}
      {confirmRevoke && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirmRevoke(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Révoquer ce mandat ?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Le créancier ne pourra plus effectuer de prélèvement sur votre compte. Cette action est irréversible.
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">
              {mandates.find((m) => m.id === confirmRevoke)?.creditor}
            </p>
            <div className="flex gap-3">
              <button onClick={() => revokeMandate(confirmRevoke)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700">
                Révoquer
              </button>
              <button onClick={() => setConfirmRevoke(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(n).replace(/ /g, " ");
}
