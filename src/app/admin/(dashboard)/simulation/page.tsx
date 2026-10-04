import { getMarketState, getAllScenarios } from "@/lib/market-simulation";
import SimulationClient from "./SimulationClient";

export default function SimulationPage() {
  const state = getMarketState();
  const scenarios = getAllScenarios();
  return <SimulationClient currentState={state} scenarios={scenarios} />;
}
