import { getClientSession } from "@/lib/auth-client";
import { getClientById, getClientAccounts } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import { getMarketState } from "@/lib/market-simulation";
import InvestissementsClient from "./investissements-client";

const INVESTMENT_AMOUNTS: Record<number, number> = {
  21: 260000,
};

export default async function InvestissementsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const client = await getClientById(session.clientId);
  const accounts = await getClientAccounts(session.clientId);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const investmentBase = INVESTMENT_AMOUNTS[session.clientId] ?? totalBalance;
  const marketState = getMarketState();

  return (
    <InvestissementsClient
      clientName={client ? `${client.first_name} ${client.last_name}` : "Client"}
      totalBalance={investmentBase}
      marketScenario={marketState.scenario}
      marketMultiplier={marketState.multiplier}
    />
  );
}
