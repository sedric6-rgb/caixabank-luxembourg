import Link from "next/link";
import { getDashboardStats } from "@/lib/queries/banking";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d&apos;ensemble de l&apos;activité bancaire</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Clients actifs" value={stats.totalClients.toLocaleString("fr-FR")} icon="users" color="blue" />
        <StatCard label="Comptes ouverts" value={stats.activeAccounts.toLocaleString("fr-FR")} icon="wallet" color="green" />
        <StatCard label="Dépôts totaux" value={stats.totalDeposits} icon="chart" color="indigo" />
        <StatCard label="Crédits en attente" value={String(stats.pendingLoans)} icon="clock" color="amber" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Nouveaux clients (mois)" value={String(stats.newClientsThisMonth)} icon="plus" color="teal" />
        <StatCard label="Transactions aujourd'hui" value={stats.transactionsToday.toLocaleString("fr-FR")} icon="arrows" color="purple" />
        <StatCard label="Cartes en fabrication" value="12" icon="card" color="orange" />
        <StatCard label="Messages non lus" value="8" icon="mail" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="space-y-3">
            {[
              { action: "Nouveau client enregistré", detail: "Anna Nowak — CBP-384921", time: "Il y a 12 min" },
              { action: "Compte ouvert", detail: "Compte courant pour Piotr Wiśniewski", time: "Il y a 34 min" },
              { action: "Crédit approuvé", detail: "Prêt immobilier 280 000 EUR — Kamil Wójcik", time: "Il y a 1h" },
              { action: "Carte émise", detail: "Visa Gold *4827 pour Jan Kowalski", time: "Il y a 2h" },
              { action: "Virement traité", detail: "15 000 EUR — Entreprise ABC → DEF S.à r.l.", time: "Il y a 3h" },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/admin/clients/new" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 4v12M4 10h12" stroke="#003d82" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau client</p>
                <p className="text-xs text-gray-500">Enregistrer et ouvrir un compte</p>
              </div>
            </Link>
            <Link href="/admin/comptes" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#0d8a3e" strokeWidth="2"/><path d="M3 9h14" stroke="#0d8a3e" strokeWidth="2"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ouvrir un compte</p>
                <p className="text-xs text-gray-500">Courant, épargne ou professionnel</p>
              </div>
            </Link>
            <Link href="/admin/cartes" className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="2" y="4" width="16" height="12" rx="2" stroke="#7c3aed" strokeWidth="2"/><path d="M2 8h16" stroke="#7c3aed" strokeWidth="2"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Émettre une carte</p>
                <p className="text-xs text-gray-500">Visa Débit, Classic, Gold ou Platinum</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
  teal: "bg-teal-50 text-teal-700",
  purple: "bg-purple-50 text-purple-700",
  orange: "bg-orange-50 text-orange-700",
  rose: "bg-rose-50 text-rose-700",
};

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${COLORS[color] || COLORS.blue}`}>
          <IconFor name={icon} />
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function IconFor({ name }: { name: string }) {
  switch (name) {
    case "users": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "wallet": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M11 9.5a.5.5 0 100-1 .5.5 0 000 1z" fill="currentColor"/></svg>;
    case "chart": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 14V8l4-3 4 4 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "clock": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "plus": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "arrows": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case "card": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "mail": return <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
    default: return null;
  }
}
