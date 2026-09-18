import { getClientSession } from "@/lib/auth-client";
import { getAccountById, getAccountTransactions } from "@/lib/queries/banking";
import { formatCurrency, formatIBAN, formatDate } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getClientSession();
  if (!session) redirect("/espace-client/connexion");

  const account = await getAccountById(Number(id));
  const transactions = await getAccountTransactions(Number(id));

  if (!account) {
    return <div className="text-center py-12 text-gray-500">Compte introuvable</div>;
  }

  return (
    <div>
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
        <div className="mt-4 flex gap-3">
          <button className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100">Télécharger RIB</button>
          <button className="text-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">Relevé de compte</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Historique des opérations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500 hidden md:table-cell">Catégorie</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Montant</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Solde après</th>
            </tr></thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{formatDate(tx.executed_at)}</td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{tx.description}</p>
                    {tx.counterparty && <p className="text-xs text-gray-400">{tx.counterparty}</p>}
                  </td>
                  <td className="px-6 py-3 text-gray-500 hidden md:table-cell capitalize">{tx.category.replace(/_/g, " ")}</td>
                  <td className={`px-6 py-3 text-right font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-500 hidden sm:table-cell">{formatCurrency(tx.balance_after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
