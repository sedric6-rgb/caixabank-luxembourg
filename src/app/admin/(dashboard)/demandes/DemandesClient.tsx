"use client";

import { useState, useTransition } from "react";
import { getTypeLabel, type Demande, type DemandeStatus } from "@/lib/demandes-store";
import { updateDemandeStatusAction } from "@/lib/actions/demandes";

const STATUS_COLORS: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-800",
  en_cours: "bg-blue-100 text-blue-800",
  validee: "bg-green-100 text-green-700",
  refusee: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  validee: "Validee",
  refusee: "Refusee",
};

export default function DemandesClient({ initialDemandes }: { initialDemandes: Demande[] }) {
  const [demandes, setDemandes] = useState<Demande[]>(initialDemandes);
  const [filter, setFilter] = useState<string>("all");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<Demande | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const changeStatus = (id: number, status: DemandeStatus) => {
    startTransition(async () => {
      await updateDemandeStatusAction(id, status);
      const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
      setDemandes((prev) => prev.map((d) => d.id === id ? { ...d, status, updatedAt: today } : d));
      setDetail(null);
      notify(`Demande ${STATUS_LABELS[status].toLowerCase()}`);
    });
  };

  const filtered = filter === "all" ? demandes : demandes.filter((d) => d.status === filter);
  const counts = {
    all: demandes.length,
    en_attente: demandes.filter((d) => d.status === "en_attente").length,
    en_cours: demandes.filter((d) => d.status === "en_cours").length,
    validee: demandes.filter((d) => d.status === "validee").length,
    refusee: demandes.filter((d) => d.status === "refusee").length,
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Demandes clients</h1>
      <p className="text-sm text-gray-500 mb-6">Gerez les demandes de cartes, chequiers, plafonds et ouvertures de compte</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "en_attente", "en_cours", "validee", "refusee"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filter === s ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {s === "all" ? "Toutes" : STATUS_LABELS[s]} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className="bg-white rounded-xl border border-gray-200 p-4" onClick={() => setDetail(d)}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{d.label}</p>
                <p className="text-xs text-gray-500">{d.clientName}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[d.status]}`}>{STATUS_LABELS[d.status]}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{getTypeLabel(d.type)}</span>
              <span>{d.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">#</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Demande</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 font-mono">{d.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{d.clientName}</p>
                  <p className="text-xs text-gray-400">{d.clientNumber}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{getTypeLabel(d.type)}</td>
                <td className="px-4 py-3">
                  <p className="text-gray-900">{d.label}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[200px]">{d.details}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{d.createdAt}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[d.status]}`}>{STATUS_LABELS[d.status]}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {d.status === "en_attente" && (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => changeStatus(d.id, "validee")} disabled={isPending} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200">Valider</button>
                      <button onClick={() => changeStatus(d.id, "en_cours")} disabled={isPending} className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200">En cours</button>
                      <button onClick={() => changeStatus(d.id, "refusee")} disabled={isPending} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200">Refuser</button>
                    </div>
                  )}
                  {d.status === "en_cours" && (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => changeStatus(d.id, "validee")} disabled={isPending} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200">Valider</button>
                      <button onClick={() => changeStatus(d.id, "refusee")} disabled={isPending} className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200">Refuser</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune demande</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{detail.label}</h2>
            <p className="text-xs text-gray-500 mb-1">{detail.clientName} — {detail.clientNumber}</p>
            <p className="text-xs text-gray-500 mb-4">{getTypeLabel(detail.type)} — {detail.createdAt}</p>
            <p className="text-sm text-gray-700 mb-4">{detail.details}</p>
            <div className="mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
            </div>
            {(detail.status === "en_attente" || detail.status === "en_cours") && (
              <div className="flex gap-2 mb-4">
                <button onClick={() => changeStatus(detail.id, "validee")} className="flex-1 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700">Valider</button>
                {detail.status === "en_attente" && (
                  <button onClick={() => changeStatus(detail.id, "en_cours")} className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">En cours</button>
                )}
                <button onClick={() => changeStatus(detail.id, "refusee")} className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700">Refuser</button>
              </div>
            )}
            <button onClick={() => setDetail(null)} className="w-full py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
