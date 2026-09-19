"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { clientLogoutAction } from "@/lib/actions/client-auth";

type NavItem = { href: string; label: string; icon: string };

export default function ClientMobileNav({ nav, clientName, clientNumber }: { nav: NavItem[]; clientName: string; clientNumber: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-[#001f42] text-gray-300 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <img src="/logo-caixa.png" alt="" width={24} height={24} className="h-6 w-6" />
                  <span className="text-sm font-bold text-white">CaixaBank Luxembourg</span>
                </div>
                <p className="text-[9px] font-semibold tracking-[0.15em] text-blue-400 uppercase mt-0.5 ml-8">Banque Privée</p>
                <p className="text-xs text-white mt-1">{clientName}</p>
                <p className="text-xs text-blue-400 font-mono">{clientNumber}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {nav.map((item) => {
                const active = pathname === item.href || (item.href !== "/espace-client" && pathname.startsWith(item.href + "/"));
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors ${active ? "bg-white/15 text-white font-medium" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10">
              <form action={clientLogoutAction}>
                <button type="submit" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors w-full">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M6 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
