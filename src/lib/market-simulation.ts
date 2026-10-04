export type MarketScenario = "normal" | "bull" | "correction" | "crash" | "stable";

export interface MarketState {
  scenario: MarketScenario;
  appliedAt: string;
  multiplier: number;
}

const SCENARIO_CONFIG: Record<MarketScenario, { label: string; multiplier: number; perfShift: number }> = {
  normal: { label: "Normal (par défaut)", multiplier: 1.0, perfShift: 0 },
  bull: { label: "Marché haussier (+20 %)", multiplier: 1.20, perfShift: 12 },
  correction: { label: "Correction (-15 %)", multiplier: 0.85, perfShift: -10 },
  crash: { label: "Krach (-35 %)", multiplier: 0.65, perfShift: -25 },
  stable: { label: "Marché stable", multiplier: 1.02, perfShift: 1 },
};

export function getScenarioConfig(scenario: MarketScenario) {
  return SCENARIO_CONFIG[scenario];
}

export function getAllScenarios() {
  return Object.entries(SCENARIO_CONFIG).map(([key, cfg]) => ({
    key: key as MarketScenario,
    ...cfg,
  }));
}

const g = globalThis as unknown as { __marketState?: MarketState };

export function getMarketState(): MarketState {
  return g.__marketState ?? { scenario: "normal", appliedAt: "", multiplier: 1.0 };
}

export function setMarketState(scenario: MarketScenario): MarketState {
  const cfg = SCENARIO_CONFIG[scenario];
  const d = new Date();
  const appliedAt = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const state: MarketState = { scenario, appliedAt, multiplier: cfg.multiplier };
  g.__marketState = state;
  return state;
}
