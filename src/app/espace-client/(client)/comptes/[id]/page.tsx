import { getClientSession } from "@/lib/auth-client";
import { getAccountById, getAccountTransactions, getClientById, isTransactionsBlocked } from "@/lib/queries/banking";
import { formatCurrency, formatIBAN } from "@/lib/format";
import { redirect } from "next/navigation";
import AccountActions from "./AccountActions";
import TransactionsTable from "./TransactionsTable";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const account = await getAccountById(Number(id));
  const transactions = await getAccountTransactions(Number(id));
  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";
  const blocked = isTransactionsBlocked(session.clientId);

  if (!account) {
    return <div className="text-center py-12 text-gray-500">Compte introuvable</div>;
  }

  return (
    <div>
      {blocked && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="shrink-0 mt-0.5"><path d="M10 2a6 6 0 00-6 6v3H3a1.5 1.5 0 00-1.5 1.5v4A1.5 1.5 0 003 18h14a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0017 11h-1V8a6 6 0 00-6-6zM7 8a3 3 0 116 0v3H7V8z" fill="#ea580c"/></svg>
          <div>
            <p className="text-sm font-semibold text-orange-800">Transactions suspendues</p>
            <p className="text-xs text-orange-700 mt-0.5">Vos transactions sont temporairement suspendues. Veuillez contacter votre conseiller pour plus d&apos;informations.</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{account.label}</h1>
            <p className="text-sm text-gray-400 font-mono mt-1">{formatIBAN(account.account_number)}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(account.balance, account.currency)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.status === "actif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {account.status === "actif" ? "Actif" : account.status}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <AccountActions
            accountLabel={account.label}
            accountNumber={account.account_number}
            clientName={clientName}
            balance={account.balance}
            currency={account.currency}
            transactions={transactions}
          />
        </div>
      </div>

      <TransactionsTable transactions={transactions} currency={account.currency} />
    </div>
  );
}
