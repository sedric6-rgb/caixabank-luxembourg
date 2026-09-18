import { getClientSession } from "@/lib/auth-client";
import { getClientLoans } from "@/lib/queries/banking";
import { redirect } from "next/navigation";
import PretsClient from "./prets-client";

export default async function PretsPage() {
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const loans = await getClientLoans(session.clientId);
  const clientLoans = loans.map((l) => ({
    id: l.id,
    type: l.loan_type,
    amount: l.amount,
    rate: l.interest_rate,
    duration: l.duration_months,
    monthly: l.monthly_payment,
    remaining: l.remaining_amount,
    status: l.status,
    start: l.start_date,
    end: l.end_date,
  }));

  return <PretsClient initialLoans={clientLoans} />;
}
