"use client";

import { useState, useTransition } from "react";
import type { AdminClient } from "@/lib/admin-view";
import type { BankGuarantee, GuaranteeStatus } from "@/lib/guarantees-store";
import { GUARANTEE_TYPES, DEVISES } from "@/lib/guarantees-store";
import { adminCreateGuaranteeAction, adminSetGuaranteeStatusAction } from "@/lib/actions/admin-data";
import { formatAmount } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  brouillon: "bg-gray-100 text-gray-600",
  en_attente: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  expiree: "bg-orange-100 text-orange-700",
  annulee: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  brouillon: "Brouillon",
  en_attente: "En attente",
  active: "Active",
  expiree: "Expiree",
  annulee: "Annulee",
};

const SWIFT_BADGE: Record<string, string> = {
  "MT 760": "bg-blue-100 text-blue-800",
  "MT 700": "bg-indigo-100 text-indigo-800",
  "MT 799": "bg-purple-100 text-purple-800",
};

export default function GarantiesClient({
  clients,
  initialGuarantees,
}: {
  clients: AdminClient[];
  initialGuarantees: BankGuarantee[];
}) {
  const [guarantees, setGuarantees] = useState<BankGuarantee[]>(initialGuarantees);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [swiftFilter, setSwiftFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<BankGuarantee | null>(null);
  const [selectedType, setSelectedType] = useState(GUARANTEE_TYPES[0]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      clientId: Number(fd.get("clientId")),
      type: selectedType.label,
      swiftType: selectedType.swift,
      beneficiaire: String(fd.get("beneficiaire")),
      montant: Number(fd.get("montant")),
      devise: String(fd.get("devise")),
      objet: String(fd.get("objet")),
      dateExpiration: String(fd.get("dateExpiration")),
      banqueCorrespondante: String(fd.get("banqueCorrespondante")),
      conditions: String(fd.get("conditions")),
    };
    startTransition(async () => {
      const res = await adminCreateGuaranteeAction(data);
      if (!res.success) {
        notify(res.error);
        return;
      }
      setGuarantees((prev) => [...prev, res.guarantee]);
      setShowForm(false);
      notify("Garantie bancaire creee — Ref. " + res.guarantee.reference);
    });
  };

  const setStatus = (id: number, status: GuaranteeStatus) => {
    startTransition(async () => {
      const res = await adminSetGuaranteeStatusAction(id, status);
      setDetail(null);
      if (!res.success) {
        notify(res.error);
        return;
      }
      setGuarantees((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
      notify(status === "active" ? "Garantie activee et delivree" : `Statut mis a jour: ${STATUS_LABELS[status]}`);
    });
  };

  const filtered = guarantees.filter((g) => {
    if (statusFilter !== "Tous" && g.status !== statusFilter) return false;
    if (swiftFilter !== "Tous" && g.swiftType !== swiftFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        g.client.toLowerCase().includes(q) ||
        g.reference.toLowerCase().includes(q) ||
        g.beneficiaire.toLowerCase().includes(q) ||
        g.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const actives = guarantees.filter((g) => g.status === "active");
  const totalMontant = actives.reduce((s, g) => s + g.montant, 0);
  const bySwift = guarantees.reduce(
    (m, g) => {
      m[g.swiftType] = (m[g.swiftType] || 0) + 1;
      return m;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Garanties Bancaires &amp; Lettres</h1>
          <p className="text-sm text-gray-500 mt-1">
            {guarantees.length} garanties — {actives.length} actives — SWIFT MT 760 / MT 700 / MT 799
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#002a5c] transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Emettre une garantie
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Garanties actives</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{actives.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">En attente / Brouillon</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {guarantees.filter((g) => g.status === "en_attente" || g.status === "brouillon").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Engagement total (actif)</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatAmount(totalMontant)} EUR</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-500">Par type SWIFT</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(bySwift).map(([sw, count]) => (
              <span key={sw} className={`text-xs px-1.5 py-0.5 rounded font-medium ${SWIFT_BADGE[sw] || "bg-gray-100 text-gray-700"}`}>
                {sw}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M10 2l6 3v4c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8V5l6-3z" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.5 10l2 2 3.5-3.5" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Nouvelle garantie bancaire</h2>
              <p className="text-xs text-gray-500">SBLC MT 760, LC MT 700, Lettres MT 799 et autres instruments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de garantie / lettre bancaire</label>
              <select
                value={selectedType.label}
                onChange={(e) => setSelectedType(GUARANTEE_TYPES.find((t) => t.label === e.target.value) || GUARANTEE_TYPES[0])}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {GUARANTEE_TYPES.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label} ({t.swift})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">{selectedType.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client donneur d&apos;ordre</label>
              <select name="clientId" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selectionner un client</option>
                {clients
                  .filter((c) => c.status === "actif")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} — {c.client_number}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaire</label>
              <input
                name="beneficiaire"
                required
                placeholder="Nom de l'entreprise ou du tiers"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                name="montant"
                type="number"
                min="1000"
                step="100"
                required
                placeholder="500 000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select name="devise" defaultValue="EUR" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DEVISES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Objet / Description</label>
              <textarea
                name="objet"
                required
                rows={2}
                placeholder="Description de l'objet de la garantie..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
              <input
                name="dateExpiration"
                required
                placeholder="JJ/MM/AAAA"
                pattern="\d{2}/\d{2}/\d{4}"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banque correspondante</label>
              <input
                name="banqueCorrespondante"
                placeholder="Deutsche Bank AG, Frankfurt"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conditions</label>
              <textarea
                name="conditions"
                rows={2}
                placeholder="Irrevocable, payable a premiere demande conforme aux ISP98..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
              Creer la garantie
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par client, reference, beneficiaire..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {["Tous", "active", "en_attente", "brouillon", "expiree", "annulee"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {f === "Tous" ? "Tous" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {["Tous", "MT 760", "MT 700", "MT 799"].map((s) => (
            <button
              key={s}
              onClick={() => setSwiftFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${swiftFilter === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.map((g) => (
          <div key={g.id} onClick={() => setDetail(g)} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${SWIFT_BADGE[g.swiftType] || "bg-gray-100"}`}>{g.swiftType}</span>
                <span className="text-xs text-gray-400 font-mono">{g.reference}</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[g.status]}`}>{STATUS_LABELS[g.status]}</span>
            </div>
            <p className="font-medium text-gray-900 text-sm truncate">{g.type}</p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-xs text-gray-500">{g.client}</p>
                <p className="text-xs text-gray-400 truncate max-w-[180px]">→ {g.beneficiaire}</p>
              </div>
              <span className="text-base font-bold text-gray-900 whitespace-nowrap">{formatAmount(g.montant)} {g.devise}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Aucune garantie</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Reference</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">SWIFT</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Beneficiaire</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Montant</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Expiration</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setDetail(g)}>
                <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{g.reference}</td>
                <td className="px-4 py-3 text-gray-900 max-w-[200px] truncate">{g.type.split("(")[0].split("—")[0].trim()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${SWIFT_BADGE[g.swiftType] || "bg-gray-100"}`}>{g.swiftType}</span>
                </td>
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{g.client}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{g.beneficiaire}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">{formatAmount(g.montant)} {g.devise}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{g.dateExpiration}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[g.status]}`}>{STATUS_LABELS[g.status]}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={(e) => { e.stopPropagation(); setDetail(g); }} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">Aucune garantie</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${SWIFT_BADGE[detail.swiftType] || "bg-gray-100"}`}>{detail.swiftType}</span>
                  <span className="text-xs font-mono text-gray-500">{detail.reference}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{detail.type}</h2>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">Montant de la garantie</span>
                  <span className="text-2xl font-bold text-blue-900">{formatAmount(detail.montant)} {detail.devise}</span>
                </div>
              </div>

              <Row label="Donneur d'ordre" value={detail.client} />
              <Row label="Beneficiaire" value={detail.beneficiaire} />
              <Row label="Objet" value={detail.objet} />
              <div className="border-t border-gray-100 pt-3" />
              <Row label="Date d'emission" value={detail.dateEmission} />
              <Row label="Date d'expiration" value={detail.dateExpiration} />
              <Row label="Banque correspondante" value={detail.banqueCorrespondante} />
              <Row label="Conditions" value={detail.conditions} />
              <div className="border-t border-gray-100 pt-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Statut</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-5 py-4 flex flex-wrap gap-2">
              {detail.status === "brouillon" && (
                <>
                  <button disabled={isPending} onClick={() => setStatus(detail.id, "en_attente")} className="flex-1 bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50">
                    Soumettre pour validation
                  </button>
                  <button disabled={isPending} onClick={() => setStatus(detail.id, "active")} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                    Activer et delivrer
                  </button>
                </>
              )}
              {detail.status === "en_attente" && (
                <>
                  <button disabled={isPending} onClick={() => setStatus(detail.id, "active")} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                    Valider et delivrer
                  </button>
                  <button disabled={isPending} onClick={() => setStatus(detail.id, "annulee")} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                    Annuler
                  </button>
                </>
              )}
              {detail.status === "active" && (
                <button disabled={isPending} onClick={() => setStatus(detail.id, "annulee")} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                  Revoquer la garantie
                </button>
              )}
              {(detail.status === "expiree" || detail.status === "annulee") && (
                <p className="text-xs text-gray-400 text-center w-full">Cette garantie n&apos;est plus active.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
