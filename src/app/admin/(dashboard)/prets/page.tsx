import { loadAdminClients } from "@/lib/admin-view";
import { getAllLoans } from "@/lib/loans-store";
import PretsClient, { type Loan } from "./PretsClient";

export const dynamic = "force-dynamic";

export default async function AdminPretsPage() {
  const clients = await loadAdminClients();
  const loans: Loan[] = getAllLoans().map((l) => {
    const client = clients.find((c) => c.id === l.clientId);
    const [y, m, d] = l.startDate.split("-");
    return {
      id: l.id,
      clientId: l.clientId,
      client: client ? `${client.first_name} ${client.last_name}` : l.clientName ?? "Inconnu",
      type: l.loanType,
      amount: l.amount,
      rate: l.interestRate.toFixed(2).replace(".", ","),
      duration: l.durationMonths % 12 === 0 ? `${l.durationMonths / 12} ans` : `${l.durationMonths} mois`,
      status: l.status,
      date: `${d}/${m}/${y}`,
      mensualite: l.monthlyPayment,
      isStored: true,
    };
  });
  return <PretsClient clients={clients} initialLoans={loans} />;
}
