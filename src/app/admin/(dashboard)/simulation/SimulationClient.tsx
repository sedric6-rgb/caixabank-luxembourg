"use client";

import { useState } from "react";
import { setMarketScenarioAction } from "@/lib/actions/market-simulation";
import type { MarketScenario, MarketState } from "@/lib/market-simulation";

interface ScenarioOption {
  key: MarketScenario;
  label: string;
  multiplier: number;
  perfShift: number;
}

const SCENARIO_STYLES: Record<MarketScenario, { bg: string; border: string; icon: string; text: string; badge: string }> = {
  normal: { bg: "bg-gray-50", border: "border-gray-200", icon: "⚖️", text: "text-gray-700", badge: "bg-gray-100 text-gray-600" },
  bull: { bg: "bg-green-50", border: "border-green-300", icon: "📈", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  correction: { bg: "bg-orange-50", border: "border-orange-300", icon: "📉", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
  crash: { bg: "bg-red-50", border: "border-red-300", icon: "💥", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  stable: { bg: "bg-blue-50", border: "border-blue-300", icon: "➡️", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
};

export default function SimulationClient({
  currentState,
  scenarios,
}: {
  currentState: MarketState;
  scenarios: ScenarioOption[];
}) {
  const [state, setState] = useState(currentState);
  const [loading, setLoading] = useState<MarketScenario | null>(null);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const apply = async (scenario: MarketScenario) => {
    setLoading(scenario);
    const res = await setMarketScenarioAction(scenario);
    setLoading(null);
    if (res.success) {
      setState(res.state);
      const cfg = scenarios.find((s) => s.key === scenario);
      notify(`Scénario "${cfg?.label}" appliqué avec succès`);
    } else {
      notify(res.error);
    }
  };

  const activeStyle = SCENARIO_STYLES[state.scenario];

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Simulation de marché</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simulez différents scénarios de marché pour l&apos;entraînement. Les changements affectent l&apos;onglet investissements de tous les clients.
        </p>
      </div>

      {/* Current state card */}
      <div className={`rounded-xl border-2 ${activeStyle.border} ${activeStyle.bg} p-6 mb-8`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{activeStyle.icon}</span>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400">Scénario actif</p>
            <p className={`text-xl font-bold ${activeStyle.text}`}>
              {scenarios.find((s) => s.key === state.scenario)?.label ?? "Normal"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          <div>
            <span className="text-gray-500">Multiplicateur : </span>
            <span className={`font-bold ${activeStyle.text}`}>{state.multiplier.toFixed(2)}x</span>
          </div>
          {state.appliedAt && (
            <div>
              <span className="text-gray-500">Appliqué le : </span>
              <span className="font-medium text-gray-700">{state.appliedAt}</span>
            </div>
          )}
        </div>
        {state.scenario !== "normal" && (
          <div className="mt-4">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${activeStyle.badge}`}>
              Mode simulation actif — les clients voient des valeurs ajustées
            </span>
          </div>
        )}
      </div>

      {/* Scenario cards */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Choisir un scénario</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {scenarios.map((s) => {
          const style = SCENARIO_STYLES[s.key];
          const isActive = s.key === state.scenario;
          return (
            <div
              key={s.key}
              className={`rounded-xl border-2 p-5 transition-all ${
                isActive ? `${style.border} ${style.bg} ring-2 ring-offset-1 ring-${style.border.replace("border-", "")}` : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{style.icon}</span>
                <h3 className={`font-bold ${isActive ? style.text : "text-gray-900"}`}>{s.label}</h3>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Impact portefeuille</span>
                  <span className={`font-semibold ${s.multiplier >= 1 ? "text-green-600" : "text-red-600"}`}>
                    {s.multiplier >= 1 ? "+" : ""}{((s.multiplier - 1) * 100).toFixed(0)} %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shift performance</span>
                  <span className={`font-semibold ${s.perfShift >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {s.perfShift >= 0 ? "+" : ""}{s.perfShift} pts
                  </span>
                </div>
              </div>
              <button
                onClick={() => apply(s.key)}
                disabled={isActive || loading !== null}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#003d82] text-white hover:bg-[#002a5c]"
                } disabled:opacity-50`}
              >
                {loading === s.key ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Application...
                  </span>
                ) : isActive ? (
                  "Actif"
                ) : (
                  "Appliquer ce scénario"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 8v4M9 6h0" strokeLinecap="round"/></svg>
          Comment fonctionne la simulation
        </h3>
        <ul className="text-sm text-blue-800 space-y-1.5">
          <li>• Le scénario choisi ajuste les <strong>valeurs actuelles</strong> de tous les portefeuilles clients proportionnellement</li>
          <li>• La <strong>courbe de performance</strong> 12 mois est recalculée pour refléter le scénario</li>
          <li>• L&apos;<strong>évolution par classe d&apos;actifs</strong> est ajustée selon la sensibilité de chaque classe</li>
          <li>• Revenir au scénario &laquo; Normal &raquo; restaure les valeurs de base</li>
          <li>• Cette simulation est destinée à l&apos;<strong>entraînement interne</strong> uniquement</li>
        </ul>
      </div>
    </div>
  );
}
