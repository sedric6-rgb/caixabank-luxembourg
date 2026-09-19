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

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const courantAccounts = accounts.filter((a) => a.account_type === "courant");
  const epargneAccounts = accounts.filter((a) => a.account_type === "epargne");

  const debits = transactions.filter((t) => t.type === "debit");
  const categoryTotals: Record<string, number> = {};
  for (const tx of debits) {
    const cat = tx.category.replace(/_/g, " ");
    categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
  }
  const topCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCategoryAmount = topCategories.length > 0 ? topCategories[0][1] : 1;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {client?.first_name || "Client"}</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Balance overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#001f42] to-[#003d82] rounded-xl p-5 text-white">
          <p className="text-sm text-white/70">Solde total</p>
          <p className="text-2xl font-bold mt-1 select-none">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-white/50 mt-2">{accounts.length} compte{accounts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Comptes courants</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 select-none">{formatCurrency(courantAccounts.reduce((s, a) => s + a.balance, 0))}</p>
          <p className="text-xs text-gray-400 mt-2">{courantAccounts.length} compte{courantAccounts.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Épargne</p>
          <p className="text-2xl font-bold text-green-600 mt-1 select-none">{formatCurrency(epargneAccounts.reduce((s, a) => s + a.balance, 0))}</p>
          <p className="text-xs text-gray-400 mt-2">{epargneAccounts.length} compte{epargneAccounts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickAction href="/espace-client/virements" label="Virement" color="bg-blue-100" iconColor="#003d82"
            icon={<path d="M17 3L9 11M17 3l-5 14-3-6-6-3 14-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} />
          <QuickAction href="/espace-client/cartes" label="Cartes" color="bg-green-100" iconColor="#0d8a3e"
            icon={<><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h14" stroke="currentColor" strokeWidth="1.5"/></>} />
          <QuickAction href="/espace-client/epargne" label="Épargne" color="bg-emerald-100" iconColor="#047857"
            icon={<path d="M10 2a5 5 0 015 5v1h1a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a5 5 0 015-5zm3 6V7a3 3 0 10-6 0v1h6z" stroke="currentColor" strokeWidth="1.5" fill="none"/>} />
          <QuickAction href="/espace-client/investissements" label="Investir" color="bg-purple-100" iconColor="#7c3aed"
            icon={<path d="M3 17l4-4 3 2 4-5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>} />
          <QuickAction href="/espace-client/documents" label="Documents" color="bg-amber-100" iconColor="#d97706"
            icon={<><path d="M4 4h8l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M12 4v4h4" stroke="currentColor" strokeWidth="1.5"/></>} />
          <QuickAction href="/espace-client/messagerie" label="Conseiller" color="bg-indigo-100" iconColor="#4f46e5"
            icon={<><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M3 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></>} />
        </div>
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
              <p className="text-2xl font-bold text-gray-900 select-none">{formatCurrency(acc.balance, acc.currency)}</p>
              <p className="text-xs text-gray-400 font-mono mt-2">{acc.account_number.slice(0, 12)}...{acc.account_number.slice(-4)}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Spending by category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Dépenses par catégorie</h2>
            {accounts.length > 0 && (
              <Link href={`/espace-client/comptes/${accounts[0].id}`} className="text-sm text-blue-600 hover:underline">Détails</Link>
            )}
          </div>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 capitalize">{cat}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#003d82] rounded-full" style={{ width: `${(amount / maxCategoryAmount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">Aucune dépense enregistrée</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label, color, iconColor, icon }: { href: string; label: string; color: string; iconColor: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{ color: iconColor }}>{icon}</svg>
      </div>
      <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
    </Link>
  );
}
