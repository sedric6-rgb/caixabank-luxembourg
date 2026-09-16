import Link from "next/link";

/* ---------- inline SVG icons ---------- */

function IconAccount() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#e8f0fa" />
      <path d="M14 32V18a2 2 0 012-2h16a2 2 0 012 2v14M14 22h20M20 26h2M20 30h8" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSavings() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#e8f5ed" />
      <circle cx="24" cy="24" r="10" stroke="#0d8a3e" strokeWidth="2" />
      <path d="M24 19v10M21 22l3-3 3 3" stroke="#0d8a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCredit() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#fef3e2" />
      <path d="M16 20h16M16 28h16M16 24h8" stroke="#d4760a" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="17" width="20" height="14" rx="2" stroke="#d4760a" strokeWidth="2" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#fde8eb" />
      <rect x="13" y="17" width="22" height="14" rx="2" stroke="#c8102e" strokeWidth="2" />
      <path d="M13 22h22" stroke="#c8102e" strokeWidth="2" />
      <rect x="17" y="26" width="6" height="2" rx="1" fill="#c8102e" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4l12 5v9c0 7.5-5 13-12 16C13 31 8 25.5 8 18V9l12-5z" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M15 20l3 3 7-7" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M20 12v8l5 4" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTransparent() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="28" height="20" rx="3" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M14 20h12M14 24h8" stroke="#003d82" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="10" r="6" fill="#0d8a3e" stroke="white" strokeWidth="2" />
      <path d="M28 10l1.5 1.5L32 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- data ---------- */

const SERVICES = [
  {
    icon: <IconAccount />,
    title: "Comptes bancaires",
    desc: "Compte courant, compte epargne et comptes professionnels adaptes a vos besoins.",
    href: "/services",
  },
  {
    icon: <IconSavings />,
    title: "Epargne & Placements",
    desc: "Livrets, comptes a terme et solutions de placement pour faire fructifier votre capital.",
    href: "/services",
  },
  {
    icon: <IconCredit />,
    title: "Credits & Prets",
    desc: "Prets immobiliers, credits a la consommation et financements professionnels.",
    href: "/services",
  },
  {
    icon: <IconCard />,
    title: "Cartes bancaires",
    desc: "Visa Debit, Classic, Gold et Platinum avec paiement sans contact et Apple Pay.",
    href: "/services",
  },
];

const ADVANTAGES = [
  {
    icon: <IconShield />,
    title: "Securite maximale",
    desc: "Infrastructure certifiee PCI DSS, authentification forte 3D Secure et surveillance continue des transactions.",
  },
  {
    icon: <IconClock />,
    title: "Accessible 24/7",
    desc: "Application mobile et espace web disponibles a tout moment pour gerer vos comptes ou que vous soyez.",
  },
  {
    icon: <IconTransparent />,
    title: "Frais transparents",
    desc: "Aucun frais cache. Nos tarifs sont clairs, publics et parmi les plus competitifs du marche luxembourgeois.",
  },
];

const RATES = [
  { label: "Livret Epargne", value: "3,25 %", note: "taux annuel brut" },
  { label: "Pret immobilier", value: "a partir de 3,45 %", note: "TAEG fixe" },
  { label: "Compte courant", value: "0 EUR/mois", note: "sans conditions" },
];

/* ---------- page ---------- */

export default function HomePage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="wrap relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h1 className="text-white">Votre banque, simplement.</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              Decouvrez une experience bancaire moderne au Luxembourg. Comptes, epargne, credits et cartes
              - tout ce dont vous avez besoin, accessible en quelques clics.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn btn-white">
                Ouvrir un compte
              </Link>
              <Link href="/services" className="btn border border-white/40 text-white hover:border-white hover:bg-white/10">
                Decouvrir nos services
              </Link>
            </div>
          </div>

          {/* Account balance mockup card */}
          <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-white/70">Compte courant</span>
                <span className="badge bg-green-500/20 text-green-300">Actif</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">12 450,00 EUR</p>
              <p className="mt-1 text-sm text-white/50">LU61 0019 1014 0000 0712 1981 2874</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/50">Entrees ce mois</p>
                  <p className="mt-1 text-sm font-semibold text-green-300">+ 8 200 EUR</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-white/50">Sorties ce mois</p>
                  <p className="mt-1 text-sm font-semibold text-red-300">- 3 750 EUR</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg bg-white/15 py-2 text-sm font-medium text-white hover:bg-white/20">Virer</button>
                <button className="flex-1 rounded-lg bg-white/15 py-2 text-sm font-medium text-white hover:bg-white/20">Historique</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES HIGHLIGHTS ========== */}
      <section className="py-20">
        <div className="wrap">
          <div className="text-center">
            <h2>Nos services bancaires</h2>
            <p className="mx-auto mt-4 text-ink-soft">
              Des solutions completes pour particuliers et professionnels.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="card group transition-shadow hover:shadow-lg">
                <div className="mb-4">{s.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-ink-soft">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  En savoir plus
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="bg-bg-alt py-20">
        <div className="wrap">
          <h2 className="text-center">Pourquoi choisir CaixaBank Luxembourg ?</h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">{a.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{a.title}</h3>
                <p className="mx-auto text-sm text-ink-soft">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RATES TEASER ========== */}
      <section className="py-20">
        <div className="wrap">
          <h2 className="text-center">Nos taux actuels</h2>
          <p className="mx-auto mt-4 text-center text-ink-soft">
            Des taux competitifs pour votre epargne et vos projets.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {RATES.map((r) => (
              <div key={r.label} className="stat-card text-center">
                <p className="stat-label">{r.label}</p>
                <p className="stat-value mt-2">{r.value}</p>
                <p className="mt-1 text-xs text-ink-faint">{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-primary py-16 text-center text-white">
        <div className="wrap">
          <h2 className="text-white">Ouvrez votre compte en 10 minutes</h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            Inscription 100 % en ligne, sans paperasse. Recevez votre carte bancaire sous 3 jours ouvrables.
          </p>
          <Link href="/contact" className="btn btn-white mt-8">
            Ouvrir un compte gratuitement
          </Link>
        </div>
      </section>
    </>
  );
}
