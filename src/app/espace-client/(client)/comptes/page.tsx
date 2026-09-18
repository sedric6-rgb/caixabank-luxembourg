import Link from "next/link";
import { getClientSession } from "@/lib/auth-client";
import { getClientAccounts } from "@/lib/queries/banking";
import { formatCurrency, formatIBAN } from "@/lib/format";

export default async function ComptesPage() {
  const session = await getClientSession();
  const accounts = session ? await getClientAccounts(session.clientId) : [];
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mes comptes</h1>
      <p className="text-sm text-gray-500 mb-6">Solde total : <span className="font-bold text-gray-900">{formatCurrency(total)}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <Link key={acc.id} href={`/espace-client/comptes/${acc.id}`}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{acc.label}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${acc.status === "actif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {acc.status === "actif" ? "Actif" : acc.status}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-3">{formatCurrency(acc.balance, acc.currency)}</p>
            <p className="text-xs text-gray-400 font-mono">{formatIBAN(acc.account_number)}</p>
            <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-800">
              Voir les opérations
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="ml-1"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
