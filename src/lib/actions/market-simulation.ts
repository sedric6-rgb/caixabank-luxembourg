"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./admin-guard";
import { setMarketState, getMarketState, type MarketScenario, type MarketState } from "@/lib/market-simulation";

const VALID: MarketScenario[] = ["normal", "bull", "correction", "crash", "stable"];

export async function setMarketScenarioAction(
  scenario: MarketScenario
): Promise<{ success: true; state: MarketState } | { success: false; error: string }> {
  await requireAdmin();
  if (!VALID.includes(scenario)) return { success: false, error: "Scénario invalide" };
  const state = setMarketState(scenario);
  revalidatePath("/espace-client", "layout");
  revalidatePath("/admin/simulation");
  return { success: true, state };
}

export async function getMarketStateAction(): Promise<MarketState> {
  return getMarketState();
}
