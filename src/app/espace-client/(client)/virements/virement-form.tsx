"use client";

import { useState, useTransition } from "react";
import { executeVirementAction, addBeneficiaryAction } from "@/lib/actions/virements";

type Account = { id: number; label: string; balance: number; iban: string };
type Beneficiary = { id: number; label: string; iban: string };

export default function VirementForm({ accounts, beneficiaries: initialBens }: { accounts: Account[]; beneficiaries: Beneficiary[] }) {
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [source, setSource] = useState(accounts[0]?.id ? String(accounts[0].id) : "");
  const [benMode, setBenMode] = useState<"existing" | "new">("existing");
  const [selectedBenId, setSelectedBenId] = useState("");
  const [newBenName, setNewBenName] = useState("");
  const [newBenIban, setNewBenIban] = useState("");
  const [newBenBic, setNewBenBic] = useState("");
  const [saveBen, setSaveBen] = useState(true);
  const [amount, setAmount] = useState("");
  const [motif, setMotif] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [beneficiaries, setBeneficiaries] = useState(initialBens);

  const sourceAcc = accounts.find((a) => String(a.id) === source);
  const selectedBen = beneficiaries.find((b) => String(b.id) === selectedBenId);

  const benName = benMode === "existing" ? (selectedBen?.label || "") : newBenName;
  const benIban = benMode === "existing" ? (selectedBen?.iban || "") : newBenIban;

  const canContinue = source && amount && Number(amount) > 0 &&
    ((benMode === "existing" && selectedBenId) || (benMode === "new" && newBenName && newBenIban.length >= 15));

  function goToConfirm() {
    setError("");
    if (!canContinue) return;
    const amt = Number(amount);
    if (sourceAcc && amt > sourceAcc.balance) {
      setError("Solde insuffisant");
      return;
    }
    setStep("confirm");
  }

  function submitVirement() {
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("source_account_id", source);
      fd.set("beneficiary_name", benName);
      fd.set("beneficiary_iban", benIban);
      fd.set("amount", amount);
      fd.set("motif", motif);
      fd.set("save_beneficiary", benMode === "new" && saveBen ? "true" : "false");
      fd.set("ben_label", newBenName);

      const res = await executeVirementAction(fd);
      if (res.success) {
        if (benMode === "new" && saveBen) {
          setBeneficiaries((prev) => [...prev, { id: Date.now(), label: newBenName, iban: newBenIban }]);
        }
        setStep("done");
      } else {
        setError(res.error || "Erreur lors du virement");
        setStep("form");
      }
    });
  }

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Virement effectue</h2>
        <p className="text-gray-500 mb-1">
          Votre virement de <strong>{Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</strong> vers <strong>{benName}</strong> a ete soumis avec succes.
        </p>
        <p className="text-xs text-gray-400 font-mono mb-6">{benIban}</p>
        {benMode === "new" && saveBen && (
          <p className="text-sm text-green-600 mb-4">Le beneficiaire a ete enregistre.</p>
        )}
        <button onClick={() => {
          setStep("form");
          setAmount("");
          setMotif("");
          setSelectedBenId("");
          setNewBenName("");
          setNewBenIban("");
          setNewBenBic("");
          setBenMode("existing");
        }} className="mt-2 text-sm text-blue-600 hover:underline">Faire un autre virement</button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Confirmer le virement</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
          <Row label="Compte debiteur" value={sourceAcc?.label || ""} sub={sourceAcc?.iban} />
          <Row label="Beneficiaire" value={benName} sub={benIban} />
          <Row label="Montant" value={`${Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR`} />
          {motif && <Row label="Motif" value={motif} />}
          {benMode === "new" && saveBen && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Le beneficiaire sera enregistre
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={submitVirement} disabled={isPending}
              className="flex-1 bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] disabled:opacity-50">
              {isPending ? "Traitement..." : "Confirmer le virement"}
            </button>
            <button onClick={() => setStep("form")} disabled={isPending}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50">
              Modifier
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Faire un virement</h1>
      <p className="text-sm text-gray-500 mb-6">Virement SEPA en zone euro</p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compte a debiter</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.label} — {a.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiaire</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setBenMode("existing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${benMode === "existing" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Existant
            </button>
            <button type="button" onClick={() => setBenMode("new")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${benMode === "new" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Nouveau beneficiaire
            </button>
          </div>

          {benMode === "existing" ? (
            <select value={selectedBenId} onChange={(e) => setSelectedBenId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selectionner un beneficiaire</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>{b.label} — {b.iban}</option>
              ))}
            </select>
          ) : (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom du beneficiaire *</label>
                <input type="text" value={newBenName} onChange={(e) => setNewBenName(e.target.value)} placeholder="Nom complet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">IBAN *</label>
                <input type="text" value={newBenIban} onChange={(e) => setNewBenIban(e.target.value.toUpperCase())} placeholder="LU00 0000 0000 0000 0000 0000 0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">BIC / SWIFT</label>
                <input type="text" value={newBenBic} onChange={(e) => setNewBenBic(e.target.value.toUpperCase())} placeholder="CABORLULLUX (facultatif)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={saveBen} onChange={(e) => setSaveBen(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs text-gray-600">Enregistrer ce beneficiaire pour les prochains virements</span>
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {sourceAcc && (
            <p className="text-xs text-gray-400 mt-1">Solde disponible : {sourceAcc.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif / Libelle</label>
          <input type="text" value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Facultatif"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={goToConfirm}
          disabled={!canContinue}
          className="w-full bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] disabled:opacity-40 disabled:cursor-not-allowed">
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
      {sub && <dd className="text-xs text-gray-400 font-mono break-all">{sub}</dd>}
    </div>
  );
}
