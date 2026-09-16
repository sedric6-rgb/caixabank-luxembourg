"use client";

import { useState } from "react";

const ACCOUNTS = [
  { id: 1, label: "Compte Courant", balance: 12847.53, iban: "LU61 0019 1014 0000 0712 1981 2874" },
  { id: 2, label: "Livret Épargne", balance: 45230.00, iban: "LU27 0019 2004 0000 3002 0135 5387" },
  { id: 3, label: "Compte Pro", balance: 89415.22, iban: "LU10 0019 0099 7603 1234 5678 9012" },
];

const BENEFICIARIES = [
  { id: 1, label: "Anna Kowalska", iban: "LU83 0019 1026 0000 0422 0000 1234" },
  { id: 2, label: "Loyer appartement", iban: "LU44 0019 2202 0000 0002 4447 1234" },
  { id: 3, label: "Électricité Enovos", iban: "LU92 0019 6247 1111 0010 4319 8745" },
];

export default function VirementsPage() {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [source, setSource] = useState("1");
  const [dest, setDest] = useState("");
  const [amount, setAmount] = useState("");
  const [motif, setMotif] = useState("");

  const sourceAcc = ACCOUNTS.find((a) => String(a.id) === source);
  const destBen = BENEFICIARIES.find((b) => String(b.id) === dest);

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Virement effectué</h2>
        <p className="text-gray-500">Votre virement de <strong>{Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</strong> a été soumis avec succès.</p>
        <button onClick={() => { setStep("form"); setAmount(""); setMotif(""); }} className="mt-6 text-sm text-blue-600 hover:underline">Faire un autre virement</button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmer le virement</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Row label="Compte débiteur" value={sourceAcc?.label || ""} sub={sourceAcc?.iban} />
          <Row label="Bénéficiaire" value={destBen?.label || "IBAN saisi"} sub={destBen?.iban || dest} />
          <Row label="Montant" value={`${Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR`} />
          {motif && <Row label="Motif" value={motif} />}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => setStep("done")} className="flex-1 bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">Confirmer</button>
            <button onClick={() => setStep("form")} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">Modifier</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Faire un virement</h1>
      <p className="text-sm text-gray-500 mb-6">Virement SEPA en zone euro</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compte à débiter</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {ACCOUNTS.map((a) => (
              <option key={a.id} value={a.id}>{a.label} — {a.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire</label>
          <select value={dest} onChange={(e) => setDest(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Sélectionner un bénéficiaire</option>
            {BENEFICIARIES.map((b) => (
              <option key={b.id} value={b.id}>{b.label} — {b.iban}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif / Libellé</label>
          <input type="text" value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Facultatif"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={() => { if (dest && amount) setStep("confirm"); }}
          disabled={!dest || !amount}
          className="w-full bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Continuer
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
      {sub && <dd className="text-xs text-gray-400 font-mono">{sub}</dd>}
    </div>
  );
}
