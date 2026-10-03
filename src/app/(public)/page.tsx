import Link from "next/link";

/* ---------- inline SVG icons ---------- */

function IconWealth() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#e8f0fa" />
      <path d="M16 32V22l8-6 8 6v10" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 32v-6h8v6" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 22l10-8 10 8" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInvestment() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#e8f5ed" />
      <path d="M16 30l5-5 4 3 7-8" stroke="#0d8a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 20h4v4" stroke="#0d8a3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEstate() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#fef3e2" />
      <path d="M17 18h14M17 22h14M17 26h8M17 30h5" stroke="#d4760a" strokeWidth="2" strokeLinecap="round" />
      <rect x="14" y="15" width="20" height="18" rx="2" stroke="#d4760a" strokeWidth="2" />
    </svg>
  );
}

function IconFamily() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#f3e8fa" />
      <circle cx="20" cy="20" r="3" stroke="#7c3aed" strokeWidth="2" />
      <circle cx="28" cy="20" r="3" stroke="#7c3aed" strokeWidth="2" />
      <path d="M14 32c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconDiscretion() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4l12 5v9c0 7.5-5 13-12 16C13 31 8 25.5 8 18V9l12-5z" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M15 20l3 3 7-7" stroke="#003d82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDedicated() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="16" r="6" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M10 34c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" strokeLinecap="round" />
      <circle cx="30" cy="12" r="4" fill="#0d8a3e" stroke="white" strokeWidth="2" />
      <path d="M28.5 12l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobal() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="13" stroke="#003d82" strokeWidth="2" fill="#e8f0fa" />
      <path d="M7 20h26M20 7c-4 4-4 22 0 26M20 7c4 4 4 22 0 26" stroke="#003d82" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- data ---------- */

const SERVICES = [
  {
    icon: <IconWealth />,
    title: "Gestion de patrimoine",
    desc: "Strategies patrimoniales sur mesure, allocation d'actifs et optimisation fiscale par nos gestionnaires dedies.",
    href: "/services",
  },
  {
    icon: <IconInvestment />,
    title: "Conseil en investissements",
    desc: "Acces aux marches internationaux, fonds exclusifs, private equity et produits structures.",
    href: "/services",
  },
  {
    icon: <IconEstate />,
    title: "Planification successorale",
    desc: "Structuration patrimoniale, transmission intergenerationnelle et ingenierie juridique adaptee.",
    href: "/services",
  },
  {
    icon: <IconFamily />,
    title: "Family Office",
    desc: "Accompagnement global pour familles fortunees : coordination fiscale, gouvernance et philanthropie.",
    href: "/services",
  },
];

const ADVANTAGES = [
  {
    icon: <IconDedicated />,
    title: "Gestionnaire dedie",
    desc: "Un interlocuteur unique, expert en gestion de fortune, disponible pour construire et piloter votre strategie patrimoniale.",
  },
  {
    icon: <IconDiscretion />,
    title: "Discretion absolue",
    desc: "Secret bancaire luxembourgeois, infrastructure securisee et confidentialite garantie pour chaque client.",
  },
  {
    icon: <IconGlobal />,
    title: "Expertise internationale",
    desc: "Equipe multilangue couvrant les juridictions europeennes, africaines et internationales pour une gestion transfrontaliere.",
  },
];

const KEY_FIGURES = [
  { value: "2,4 Mrd EUR", label: "d'actifs sous gestion" },
  { value: "98 %", label: "de clients satisfaits" },
  { value: "35+", label: "annees d'expertise" },
  { value: "12", label: "gestionnaires seniors" },
];

/* ---------- page ---------- */

export default function HomePage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark to-primary text-white">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="wrap relative grid items-center gap-10 py-24 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] uppercase text-white/60">Banque Privee &mdash; Luxembourg</p>
            <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
              Votre patrimoine merite<br className="hidden lg:block" /> une attention d&apos;exception.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
              Nos gestionnaires de fortune vous accompagnent avec discretion et expertise pour structurer,
              faire croitre et transmettre votre patrimoine a travers les generations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn btn-white">
                Prendre rendez-vous
              </Link>
              <Link href="/services" className="btn border border-white/40 text-white hover:border-white hover:bg-white/10">
                Notre expertise
              </Link>
            </div>
          </div>

          {/* Wealth overview card */}
          <div className="mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
            <div className="rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-white/70">Vue patrimoniale</span>
                <span className="badge bg-green-500/20 text-green-300">Actualise</span>
              </div>
              <p className="text-sm text-white/50 mb-1">Actifs totaux</p>
              <p className="text-3xl font-bold tracking-tight">1 598 000,00 EUR</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Compte courant</span>
                  <span className="font-semibold">1 148 000 EUR</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Livret epargne</span>
                  <span className="font-semibold">450 000 EUR</span>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <p className="text-xs text-white/60">Performance YTD</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-green-300">+4,8 % depuis janvier 2026</p>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="flex-1 rounded-lg bg-white/15 py-2 text-sm font-medium text-white hover:bg-white/20">Mon portefeuille</button>
                <button className="flex-1 rounded-lg bg-white/15 py-2 text-sm font-medium text-white hover:bg-white/20">Mon conseiller</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== KEY FIGURES ========== */}
      <section className="border-b border-line bg-paper">
        <div className="wrap grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
          {KEY_FIGURES.map((f) => (
            <div key={f.label} className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">{f.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== SERVICES HIGHLIGHTS ========== */}
      <section className="py-20">
        <div className="wrap">
          <div className="text-center">
            <h2>Une expertise dediee a votre patrimoine</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
              Chaque client beneficie d&apos;une strategie patrimoniale personnalisee, elaboree par un gestionnaire de fortune senior.
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
          <h2 className="text-center">Pourquoi choisir CaixaBank Luxembourg &mdash; Banque Privee ?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-ink-soft">
            Depuis plus de 35 ans, nous accompagnons entrepreneurs, familles et investisseurs
            dans la gestion et la transmission de leur patrimoine.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {ADVANTAGES.map((a) => (
              <div key={a.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">{a.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{a.title}</h3>
                <p className="mx-auto max-w-xs text-sm text-ink-soft">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== APPROACH ========== */}
      <section className="py-20">
        <div className="wrap">
          <h2 className="text-center">Notre approche</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-ink-soft">
            Un accompagnement en quatre etapes pour une gestion patrimoniale d&apos;excellence.
          </p>

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 rounded-xl overflow-hidden border border-line">
            {[
              { step: "01", title: "Diagnostic patrimonial", desc: "Analyse complete de votre situation financiere, fiscale et successorale." },
              { step: "02", title: "Strategie sur mesure", desc: "Definition d'objectifs et elaboration d'une allocation personnalisee." },
              { step: "03", title: "Mise en oeuvre", desc: "Execution des investissements et structuration juridique adaptee." },
              { step: "04", title: "Suivi continu", desc: "Reporting regulier, ajustements et revues strategiques avec votre gestionnaire." },
            ].map((item) => (
              <div key={item.step} className="bg-paper p-6 sm:p-8">
                <span className="text-3xl font-bold text-primary/20">{item.step}</span>
                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="bg-primary py-16 text-center text-white">
        <div className="wrap">
          <h2 className="text-white">Rencontrez votre gestionnaire de fortune</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">
            Echangez en toute confidentialite avec l&apos;un de nos experts pour definir
            la strategie patrimoniale adaptee a vos objectifs.
          </p>
          <Link href="/contact" className="btn btn-white mt-8">
            Prendre rendez-vous
          </Link>
          <p className="mt-4 text-sm text-white/40">Entretien sans engagement &mdash; sur place ou en visioconference</p>
        </div>
      </section>
    </>
  );
}
