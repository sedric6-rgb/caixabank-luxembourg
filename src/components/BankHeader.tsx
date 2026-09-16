"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Particuliers" },
  { href: "/services", label: "Professionnels" },
  { href: "/services", label: "Services" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/agences", label: "Agences" },
  { href: "/contact", label: "Contact" },
];

export function BankHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="wrap flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <img src="/logo/caixabank-logo.jpg" alt="CaixaBank" className="h-8 w-auto" />
          <span className="text-lg font-bold text-primary sm:text-xl">CaixaBank Luxembourg</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-[0.92rem] font-medium text-ink-soft lg:flex">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/espace-client/connexion" className="btn btn-outline text-sm">
            Espace Client
          </Link>
          <Link href="/contact" className="btn btn-accent text-sm">
            Ouvrir un compte
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-[2px] w-6 rounded bg-primary-dark transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-[2px] w-6 rounded bg-primary-dark transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[2px] w-6 rounded bg-primary-dark transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="wrap flex flex-col gap-1 py-6">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line-soft py-3 text-lg font-medium text-primary-dark"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/espace-client/connexion"
                onClick={() => setOpen(false)}
                className="btn btn-outline w-full"
              >
                Espace Client
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn btn-accent w-full"
              >
                Ouvrir un compte
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
