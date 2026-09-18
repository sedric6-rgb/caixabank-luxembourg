import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import MobileNav from "./MobileNav";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: "dashboard" },
  { href: "/admin/clients", label: "Clients", icon: "users" },
  { href: "/admin/comptes", label: "Comptes", icon: "wallet" },
  { href: "/admin/transactions", label: "Transactions", icon: "arrows" },
  { href: "/admin/cartes", label: "Cartes", icon: "card" },
  { href: "/admin/prets", label: "Credits & Prets", icon: "loan" },
  { href: "/admin/demandes", label: "Demandes clients", icon: "inbox" },
  { href: "/admin/assurances", label: "Assurances", icon: "shield" },
  { href: "/admin/prelevements", label: "Prelevements", icon: "debit" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] bg-[#001f42] text-gray-300 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="text-sm font-bold text-white">CaixaBank Luxembourg</span>
          </Link>
          <p className="text-xs text-blue-400 mt-1">Administration</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full px-3 py-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M6 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Deconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] min-w-0">
        {/* Header mobile + desktop */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MobileNav nav={NAV} />
            <div>
              <h2 className="text-sm font-bold text-gray-900 lg:text-gray-500 lg:font-medium">CaixaBank Luxembourg</h2>
              <p className="text-xs text-gray-400 lg:hidden">Administration</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        </header>
        <main className="p-4 sm:p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="10" y="2" width="6" height="6" rx="1"/><rect x="2" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>;
    case "users": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16a6 6 0 0112 0"/></svg>;
    case "wallet": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="14" height="11" rx="2"/><circle cx="13" cy="10" r="1" fill="currentColor" stroke="none"/></svg>;
    case "arrows": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7l4-4 4 4M5 11l4 4 4-4"/></svg>;
    case "card": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="14" height="11" rx="2"/><path d="M2 8h14"/></svg>;
    case "loan": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 5v8M7 7c0-.6.9-1 2-1s2 .4 2 1-.9 1-2 1-2 .4-2 1 .9 1 2 1 2-.4 2-1"/></svg>;
    case "inbox": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10h4l1.5 2h3L12 10h4"/><rect x="2" y="3" width="14" height="12" rx="2"/></svg>;
    case "shield": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2l6 3v4c0 3.5-2.5 6.5-6 8-3.5-1.5-6-4.5-6-8V5l6-3z"/><path d="M6.5 9l2 2 3.5-3.5"/></svg>;
    case "debit": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9h12M12 5l4 4-4 4"/><path d="M15 14H5a2 2 0 01-2-2V6"/></svg>;
    default: return null;
  }
}
