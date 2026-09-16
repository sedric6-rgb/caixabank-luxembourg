import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "La Banque",
    links: [
      { href: "/about", label: "A propos" },
      { href: "/careers", label: "Carrieres" },
      { href: "/presse", label: "Presse" },
      { href: "/rse", label: "RSE" },
    ],
  },
  {
    title: "Particuliers",
    links: [
      { href: "/services", label: "Comptes" },
      { href: "/services", label: "Epargne" },
      { href: "/services", label: "Credits" },
      { href: "/services", label: "Cartes" },
      { href: "/services", label: "Assurances" },
    ],
  },
  {
    title: "Professionnels",
    links: [
      { href: "/services", label: "Compte pro" },
      { href: "/services", label: "Credit pro" },
      { href: "/services", label: "Terminal de paiement" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/contact", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/contact", label: "Reclamations" },
      { href: "/tarifs", label: "Tarifs" },
    ],
  },
];

export function BankFooter() {
  return (
    <footer className="border-t border-line bg-primary-dark text-white">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/70">
              {col.title}
            </h4>
            <nav className="flex flex-col gap-2">
              {col.links.map((link, i) => (
                <Link
                  key={`${link.label}-${i}`}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-6">
          <div className="flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2024 CaixaBank Luxembourg S.A. Tous droits reserves.</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/mentions-legales" className="hover:text-white">Mentions legales</Link>
              <span className="text-white/20">|</span>
              <Link href="/confidentialite" className="hover:text-white">Politique de confidentialite</Link>
              <span className="text-white/20">|</span>
              <Link href="/cookies" className="hover:text-white">Cookies</Link>
            </div>
          </div>
          <p className="mt-4 text-[0.7rem] leading-relaxed text-white/35">
            CaixaBank Luxembourg S.A. — Etablissement de credit agree par la CSSF (Commission de Surveillance du Secteur Financier).
            Membre du Fonds de Garantie des Depots Luxembourg (FGDL).
            Siege social : 6 Av. de la Liberte, 1930 Luxembourg-Gare.
            Etablissement soumis a la reglementation bancaire de l&apos;Union europeenne.
          </p>
        </div>
      </div>
    </footer>
  );
}
