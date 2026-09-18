import Link from "next/link";
import { getClientSession } from "@/lib/auth-client";
import { getClientById, getClientAccounts, getAccountTransactions } from "@/lib/queries/banking";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ClientDashboard() {
  const session = await getClientSession();
  const client = session ? await getClientById(session.clientId) : null;
  const accounts = session ? await getClientAccounts(session.clientId) : [];
  const transactions = accounts.length > 0 ? await getAccountTransactions(accounts[0].id) : [];
  const recentTxs = transactions.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {client?.first_name || "Client"}</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/espace-client/virements" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M17 3L9 11M17 3l-5 14-3-6-6-3 14-5z" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Faire un virement</span>
        </Link>
        <Link href="/espace-client/cartes" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#0d8a3e" strokeWidth="1.5"/><path d="M3 9h14" stroke="#0d8a3e" strokeWidth="1.5"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Gérer mes cartes</span>
        </Link>
        <Link href="/espace-client/messagerie" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2" stroke="#7c3aed" strokeWidth="1.5"/><path d="M3 6l7 5 7-5" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Contacter un conseiller</span>
        </Link>
      </div>

      {/* Accounts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Mes comptes</h2>
          <Link href="/espace-client/comptes" className="text-sm text-blue-600 hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => (
            <Link key={acc.id} href={`/espace-client/comptes/${acc.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{acc.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acc.account_type === "epargne" ? "bg-green-100 text-green-700" : acc.account_type === "professionnel" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {acc.account_type === "courant" ? "Courant" : acc.account_type === "epargne" ? "Épargne" : "Pro"}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(acc.balance, acc.currency)}</p>
              <p className="text-xs text-gray-400 font-mono mt-2">{acc.account_number.slice(0, 12)}...{acc.account_number.slice(-4)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Dernières opérations</h2>
          {accounts.length > 0 && (
            <Link href={`/espace-client/comptes/${accounts[0].id}`} className="text-sm text-blue-600 hover:underline">Voir tout</Link>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {recentTxs.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-100" : "bg-red-50"}`}>
                  {tx.type === "credit" ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 12V4M5 7l3-3 3 3" stroke="#0d8a3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 4v8M5 9l3 3 3-3" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(tx.executed_at)}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
          {recentTxs.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Aucune opération récente</p>}
        </div>
      </div>
    </div>
  );
}
