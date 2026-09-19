"use client";

import { useState, useTransition } from "react";
import { executeVirementAction, addBeneficiaryAction } from "@/lib/actions/virements";
import { formatAmount } from "@/lib/format";

type Account = { id: number; label: string; balance: number; iban: string };
type Beneficiary = { id: number; label: string; iban: string };

const TRANSFER_TYPES = [
  { key: "immediat", label: "Virement immédiat", desc: "SEPA — Exécution sous 24h", icon: "send" },
  { key: "instantane", label: "Virement instantané", desc: "SEPA Instant — Exécution en 10 secondes", icon: "zap" },
  { key: "programme", label: "Virement programmé", desc: "Exécution à une date choisie", icon: "calendar" },
  { key: "permanent", label: "Virement permanent", desc: "Récurrent — mensuel, hebdomadaire...", icon: "repeat" },
  { key: "international", label: "Virement international", desc: "SWIFT — Hors zone SEPA", icon: "globe" },
];

export default function VirementForm({ accounts, beneficiaries: initialBens, blocked = false }: { accounts: Account[]; beneficiaries: Beneficiary[]; blocked?: boolean }) {
  if (blocked) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 4a8 8 0 00-8 8v4H6a2 2 0 00-2 2v10a2 2 0 002 2h20a2 2 0 002-2V18a2 2 0 00-2-2h-2v-4a8 8 0 00-8-8zm-4 8a4 4 0 118 0v4h-8v-4z" fill="#ea580c"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Transactions suspendues</h2>
        <p className="text-gray-500 mb-4">Vos transactions sont temporairement suspendues.</p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-orange-800 font-medium">Veuillez contacter votre conseiller pour plus d&apos;informations.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <a href="/espace-client/messagerie" className="text-sm text-blue-600 hover:underline">Contacter via la messagerie</a>
          <p className="text-xs text-gray-400">Ou appelez le +352 26 00 00 00</p>
        </div>
      </div>
    );
  }

  const [transferType, setTransferType] = useState("immediat");
  const [step, setStep] = useState<"type" | "form" | "confirm" | "done">("type");
  const [source, setSource] = useState(accounts[0]?.id ? String(accounts[0].id) : "");
  const [benMode, setBenMode] = useState<"existing" | "new">("existing");
  const [selectedBenId, setSelectedBenId] = useState("");
  const [newBenName, setNewBenName] = useState("");
  const [newBenIban, setNewBenIban] = useState("");
  const [newBenBic, setNewBenBic] = useState("");
  const [saveBen, setSaveBen] = useState(true);
  const [amount, setAmount] = useState("");
  const [motif, setMotif] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [scheduleDate, setScheduleDate] = useState("");
  const [frequency, setFrequency] = useState("mensuel");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [beneficiaries, setBeneficiaries] = useState(initialBens);

  const sourceAcc = accounts.find((a) => String(a.id) === source);
  const selectedBen = beneficiaries.find((b) => String(b.id) === selectedBenId);

  const benName = benMode === "existing" ? (selectedBen?.label || "") : newBenName;
  const benIban = benMode === "existing" ? (selectedBen?.iban || "") : newBenIban;

  const canContinue = source && amount && Number(amount) > 0 &&
    ((benMode === "existing" && selectedBenId) || (benMode === "new" && newBenName && newBenIban.length >= 15)) &&
    (transferType !== "programme" || scheduleDate) &&
    (transferType !== "international" || newBenBic || benMode === "existing");

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

  function resetForm() {
    setStep("type");
    setAmount("");
    setMotif("");
    setSelectedBenId("");
    setNewBenName("");
    setNewBenIban("");
    setNewBenBic("");
    setBenMode("existing");
    setScheduleDate("");
    setEndDate("");
    setCurrency("EUR");
  }

  if (step === "done") {
    const typeLabel = TRANSFER_TYPES.find((t) => t.key === transferType)?.label || "Virement";
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {transferType === "programme" ? "Virement programmé" : transferType === "permanent" ? "Virement permanent créé" : transferType === "instantane" ? "Virement instantané exécuté" : "Virement effectué"}
        </h2>
        <p className="text-gray-500 mb-1">
          {typeLabel} de <strong>{formatAmount(Number(amount))} {currency}</strong> vers <strong>{benName}</strong>
          {transferType === "programme" && scheduleDate && <> prévu le <strong>{scheduleDate}</strong></>}
          {transferType === "permanent" && <> — Fréquence : <strong>{frequency}</strong></>}
        </p>
        <p className="text-xs text-gray-400 font-mono mb-6">{benIban}</p>
        {benMode === "new" && saveBen && <p className="text-sm text-green-600 mb-4">Le bénéficiaire a été enregistré.</p>}
        <button onClick={resetForm} className="mt-2 text-sm text-blue-600 hover:underline">Faire un autre virement</button>
      </div>
    );
  }

  if (step === "confirm") {
    const typeLabel = TRANSFER_TYPES.find((t) => t.key === transferType)?.label || "Virement";
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Confirmer le virement</h1>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200"><p className="text-sm text-red-600">{error}</p></div>}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4">
          <Row label="Type" value={typeLabel} />
          <Row label="Compte débiteur" value={sourceAcc?.label || ""} sub={sourceAcc?.iban} />
          <Row label="Bénéficiaire" value={benName} sub={benIban} />
          <Row label="Montant" value={`${formatAmount(Number(amount))} ${currency}`} />
          {motif && <Row label="Motif" value={motif} />}
          {transferType === "programme" && scheduleDate && <Row label="Date d'exécution" value={scheduleDate} />}
          {transferType === "permanent" && (
            <>
              <Row label="Fréquence" value={frequency} />
              {endDate && <Row label="Date de fin" value={endDate} />}
            </>
          )}
          {transferType === "instantane" && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1l1.5 4.5H13L9 8l1.5 5L7 10 3.5 13 5 8 1 5.5h4.5z" fill="currentColor"/></svg>
              Exécution en 10 secondes
            </div>
          )}
          {transferType === "international" && <Row label="Devise" value={currency} />}
          {benMode === "new" && saveBen && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M5 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Le bénéficiaire sera enregistré
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button onClick={submitVirement} disabled={isPending} className="flex-1 bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] disabled:opacity-50">
              {isPending ? "Traitement..." : "Confirmer le virement"}
            </button>
            <button onClick={() => setStep("form")} disabled={isPending} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50">
              Modifier
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "type") {
    return (
      <div className="max-w-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Faire un virement</h1>
        <p className="text-sm text-gray-500 mb-6">Choisissez le type de virement</p>
        <div className="space-y-3">
          {TRANSFER_TYPES.map((t) => (
            <button key={t.key} onClick={() => { setTransferType(t.key); setStep("form"); }}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <TransferIcon name={t.icon} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
              </div>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="ml-auto shrink-0 text-gray-400"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const typeLabel = TRANSFER_TYPES.find((t) => t.key === transferType)?.label || "Virement";

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-1">
        <button onClick={() => setStep("type")} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{typeLabel}</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {transferType === "immediat" && "Virement SEPA en zone euro — Exécution sous 24h"}
        {transferType === "instantane" && "Virement SEPA Instant — Exécution en 10 secondes"}
        {transferType === "programme" && "Programmez un virement à une date future"}
        {transferType === "permanent" && "Mettez en place un virement récurrent"}
        {transferType === "international" && "Virement SWIFT hors zone SEPA"}
      </p>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200"><p className="text-sm text-red-600">{error}</p></div>}

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compte à débiter</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.label} — {formatAmount(a.balance)} EUR</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bénéficiaire</label>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => setBenMode("existing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${benMode === "existing" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Existant
            </button>
            <button type="button" onClick={() => setBenMode("new")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${benMode === "new" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              Nouveau bénéficiaire
            </button>
          </div>

          {benMode === "existing" ? (
            <select value={selectedBenId} onChange={(e) => setSelectedBenId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sélectionner un bénéficiaire</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>{b.label} — {b.iban}</option>
              ))}
            </select>
          ) : (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom du bénéficiaire *</label>
                <input type="text" value={newBenName} onChange={(e) => setNewBenName(e.target.value)} placeholder="Nom complet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">IBAN *</label>
                <input type="text" value={newBenIban} onChange={(e) => setNewBenIban(e.target.value.toUpperCase())} placeholder="LU00 0000 0000 0000 0000 0000 0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">BIC / SWIFT {transferType === "international" ? "*" : "(facultatif)"}</label>
                <input type="text" value={newBenBic} onChange={(e) => setNewBenBic(e.target.value.toUpperCase())} placeholder="CABORLULLUX"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={saveBen} onChange={(e) => setSaveBen(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-xs text-gray-600">Enregistrer ce bénéficiaire</span>
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Montant ({currency})</label>
          <div className="flex gap-2">
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {transferType === "international" && (
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
                <option value="XAF">XAF</option>
              </select>
            )}
          </div>
          {sourceAcc && <p className="text-xs text-gray-400 mt-1">Solde disponible : {formatAmount(sourceAcc.balance)} EUR</p>}
          {transferType === "international" && <p className="text-xs text-orange-600 mt-1">Frais : 25,00 EUR par virement</p>}
          {transferType === "instantane" && <p className="text-xs text-blue-600 mt-1">Gratuit — Limité à 100 000 EUR</p>}
        </div>

        {transferType === "programme" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;exécution</label>
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        {transferType === "permanent" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="hebdomadaire">Hebdomadaire</option>
                <option value="bimensuel">Bimensuel</option>
                <option value="mensuel">Mensuel</option>
                <option value="trimestriel">Trimestriel</option>
                <option value="annuel">Annuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin (optionnel)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motif / Libellé</label>
          <input type="text" value={motif} onChange={(e) => setMotif(e.target.value)} placeholder="Facultatif"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button onClick={goToConfirm} disabled={!canContinue}
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

function TransferIcon({ name }: { name: string }) {
  switch (name) {
    case "send": return <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M17 3L9 11M17 3l-5 14-3-6-6-3 14-5z" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "zap": return <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M11 1L4 11h5l-1 8 7-10h-5l1-8z" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "calendar": return <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="13" rx="2" stroke="#003d82" strokeWidth="1.5"/><path d="M3 8h14M7 2v4M13 2v4" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "repeat": return <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M15 5l2 2-2 2M5 15l-2-2 2-2" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7H7a3 3 0 000 6M3 13h10a3 3 0 000-6" stroke="#003d82" strokeWidth="1.5"/></svg>;
    case "globe": return <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" stroke="#003d82" strokeWidth="1.5"/><path d="M3 10h14M10 3c-2 2.5-2 11 0 14M10 3c2 2.5 2 11 0 14" stroke="#003d82" strokeWidth="1.5"/></svg>;
    default: return null;
  }
}
