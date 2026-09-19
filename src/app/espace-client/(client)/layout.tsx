import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth-client";
import { getClientById, getClientNotifications } from "@/lib/queries/banking";
import { clientLogoutAction } from "@/lib/actions/client-auth";
import ClientMobileNav from "./ClientMobileNav";
import NotificationBell from "./NotificationBell";

const NAV = [
  { href: "/espace-client", label: "Tableau de bord", icon: "dashboard" },
  { href: "/espace-client/comptes", label: "Mes comptes", icon: "wallet" },
  { href: "/espace-client/virements", label: "Virements", icon: "send" },
  { href: "/espace-client/cartes", label: "Cartes", icon: "card" },
  { href: "/espace-client/epargne", label: "Épargne", icon: "piggy" },
  { href: "/espace-client/investissements", label: "Investissements", icon: "chart" },
  { href: "/espace-client/prets", label: "Crédits & Prêts", icon: "loan" },
  { href: "/espace-client/prelevements", label: "Prélèvements", icon: "repeat" },
  { href: "/espace-client/beneficiaires", label: "Bénéficiaires", icon: "users" },
  { href: "/espace-client/documents", label: "Documents", icon: "folder" },
  { href: "/espace-client/demandes", label: "Mes demandes", icon: "clipboard" },
  { href: "/espace-client/releves", label: "Relevés", icon: "doc" },
  { href: "/espace-client/messagerie", label: "Messagerie", icon: "mail" },
  { href: "/espace-client/profil", label: "Mon profil", icon: "user" },
];

export default async function EspaceClientLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  void cookieStore;
  const session = await getClientSession();

  if (!session) {
    redirect("/espace-client/connexion");
  }

  const client = await getClientById(session.clientId);
  const clientName = client ? `${client.first_name} ${client.last_name}` : "Client";
  const clientNumber = client?.client_number || "";
  const notifications = await getClientNotifications(session.clientId);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex lg:flex-col w-[270px] bg-[#001f42] text-gray-300 fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-caixa.png" alt="CaixaBank" width={32} height={32} className="h-8 w-8" />
            <div className="leading-tight">
              <span className="text-sm font-bold text-white">CaixaBank Luxembourg</span>
              <p className="text-[9px] font-semibold tracking-[0.15em] text-blue-400 uppercase">Banque Privée</p>
            </div>
          </Link>
          <div className="mt-3">
            <p className="text-sm text-white font-medium">{clientName}</p>
            <p className="text-xs text-blue-400 font-mono">{clientNumber}</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
              <NavIcon name={item.icon} />
              {item.label}
              {item.icon === "mail" && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={clientLogoutAction}>
            <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full px-3 py-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M6 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[270px] min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClientMobileNav nav={NAV} clientName={clientName} clientNumber={clientNumber} />
            <span className="text-sm text-gray-500">Espace Client</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell notifications={notifications} />
            <span className="text-sm text-gray-400">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="10" y="2" width="6" height="6" rx="1"/><rect x="2" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/></svg>;
    case "wallet": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="14" height="11" rx="2"/><circle cx="13" cy="10" r="1" fill="currentColor" stroke="none"/></svg>;
    case "send": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 2L8 10M16 2l-5 14-3-6-6-3 14-5z"/></svg>;
    case "card": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="14" height="11" rx="2"/><path d="M2 8h14"/></svg>;
    case "loan": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M9 5v8M7 7c0-.6.9-1 2-1s2 .4 2 1-.9 1-2 1-2 .4-2 1 .9 1 2 1 2-.4 2-1"/></svg>;
    case "users": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="6" r="3"/><path d="M3 16a6 6 0 0112 0"/></svg>;
    case "doc": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 2h6l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M11 2v4h4M7 10h4M7 13h4"/></svg>;
    case "mail": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="14" height="12" rx="2"/><path d="M2 5l7 5 7-5" strokeLinejoin="round"/></svg>;
    case "piggy": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8a5 4 0 1010 0 5 4 0 00-10 0z"/><path d="M8 5V4M15 8h1M5 11l-2 3M13 11l2 3"/></svg>;
    case "chart": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15l4-5 3 2 5-7"/><path d="M11 5h3v3"/></svg>;
    case "repeat": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4l2 2-2 2M4 14l-2-2 2-2"/><path d="M16 6H6a3 3 0 000 6M2 12h10a3 3 0 000-6"/></svg>;
    case "folder": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/></svg>;
    case "clipboard": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2h6v2H6zM4 4h10v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/><path d="M7 9h4M7 12h4"/></svg>;
    case "user": return <svg width="18" height="18" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="7" r="3"/><path d="M4 16a5 5 0 0110 0"/></svg>;
    default: return null;
  }
}
