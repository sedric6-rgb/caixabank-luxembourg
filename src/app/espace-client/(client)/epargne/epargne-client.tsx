"use client";

import { useState } from "react";

type EpargneAccount = { id: number; label: string; balance: number; iban: string };
type CourantAccount = { id: number; label: string; balance: number };

type SavingsProduct = {
  id: string;
  type: SavingsType;
  label: string;
  balance: number;
  currency: string;
  rate: number;
  rateLabel: string;
  availability: string;
  maturity?: string;
  icon: string;
  color: string;
};

type SavingsType =
  | "epargne_remuneree"
  | "compte_terme"
  | "depot_devises"
  | "fonds_monetaire"
  | "assurance_vie"
  | "tresorerie_perso";

type CatalogProduct = {
  type: SavingsType;
  name: string;
  description: string;
  rateRange: string;
  minAmount: string;
  availability: string;
  icon: string;
  color: string;
  features: string[];
};

const CATALOG: CatalogProduct[] = [
  {
    type: "epargne_remuneree",
    name: "Compte d’epargne remunere",
    description: "Epargne disponible a tout moment avec un taux attractif. Capital garanti.",
    rateRange: "2,25 % — 2,75 %",
    minAmount: "500 EUR",
    availability: "Disponible a tout moment",
    icon: "\u{1F3E6}",
    color: "bg-emerald-50 border-emerald-200",
    features: ["Capital garanti (FGDL)", "Retraits libres", "Interets capitalises mensuellement", "Pas de frais de gestion"],
  },
  {
    type: "compte_terme",
    name: "Compte a terme / Depot a terme",
    description: "Bloquez votre epargne pour une duree definie et beneficiez d’un taux fixe garanti.",
    rateRange: "3,25 % — 4,10 %",
    minAmount: "10 000 EUR",
    availability: "Bloque jusqu’a echeance",
    icon: "\u{1F512}",
    color: "bg-blue-50 border-blue-200",
    features: ["Taux fixe garanti", "Durees : 3, 6, 12, 24 ou 36 mois", "Capital garanti a echeance", "Penalite en cas de retrait anticipe"],
  },
  {
    type: "depot_devises",
    name: "Depot multi-devises",
    description: "Placez vos avoirs en EUR, USD ou CHF pour diversifier votre exposition de change.",
    rateRange: "1,50 % — 4,50 %",
    minAmount: "5 000 (devise)",
    availability: "Selon conditions du depot",
    icon: "\u{1F30D}",
    color: "bg-violet-50 border-violet-200",
    features: ["EUR, USD, CHF disponibles", "Taux varies selon la devise", "Diversification du risque de change", "Conversion au cours du jour"],
  },
  {
    type: "fonds_monetaire",
    name: "Fonds monetaire",
    description: "Placement court terme a risque faible. Rendement superieur au livret, sans garantie bancaire.",
    rateRange: "3,20 % — 3,80 %",
    minAmount: "25 000 EUR",
    availability: "Liquidite J+1 a J+3",
    icon: "\u{1F4CA}",
    color: "bg-amber-50 border-amber-200",
    features: ["Risque faible (SRI 1/7)", "Liquidite rapide (J+1 a J+3)", "Pas de garantie bancaire (FGDL)", "Rendement superieur au livret"],
  },
  {
    type: "assurance_vie",
    name: "Assurance-vie / Contrat de capitalisation",
    description: "Enveloppe fiscale pour faire fructifier votre capital sur le long terme avec avantages successoraux.",
    rateRange: "2,80 % — 3,50 %",
    minAmount: "50 000 EUR",
    availability: "Rachat partiel ou total possible",
    icon: "\u{1F6E1}️",
    color: "bg-teal-50 border-teal-200",
    features: ["Avantages fiscaux", "Transmission optimisee", "Fonds en euros ou unites de compte", "Rachat partiel possible"],
  },
  {
    type: "tresorerie_perso",
    name: "Solution de tresorerie personnalisee",
    description: "Pour les gros montants : taux negocies selon le montant et la duree, accompagnement dedie.",
    rateRange: "Taux negocie",
    minAmount: "250 000 EUR",
    availability: "Sur mesure",
    icon: "\u{1F48E}",
    color: "bg-rose-50 border-rose-200",
    features: ["Taux negocies selon montant et duree", "Gestionnaire dedie", "Conditions sur mesure", "Rapports trimestriels personnalises"],
  },
];

function getFritzDavinProducts(): SavingsProduct[] {
  return [
    {
      id: "ep-01",
      type: "epargne_remuneree",
      label: "Compte Epargne Remunere",
      balance: 80000,
      currency: "EUR",
      rate: 2.50,
      rateLabel: "Taux brut annuel",
      availability: "Disponible a tout moment",
      icon: "\u{1F3E6}",
      color: "emerald",
    },
    {
      id: "ct-01",
      type: "compte_terme",
      label: "Depot a terme 12 mois",
      balance: 120000,
      currency: "EUR",
      rate: 3.75,
      rateLabel: "Taux fixe garanti",
      availability: "Bloque jusqu’au 22/08/2027",
      maturity: "22/08/2027",
      icon: "\u{1F512}",
      color: "blue",
    },
    {
      id: "dd-01",
      type: "depot_devises",
      label: "Depot USD",
      balance: 48000,
      currency: "USD",
      rate: 4.10,
      rateLabel: "Taux USD annuel",
      availability: "Disponible a echeance (6 mois)",
      maturity: "22/02/2027",
      icon: "\u{1F30D}",
      color: "violet",
    },
    {
      id: "fm-01",
      type: "fonds_monetaire",
      label: "Fonds Monetaire Rendement+",
      balance: 77000,
      currency: "EUR",
      rate: 3.42,
      rateLabel: "Rendement net annualise",
      availability: "Liquidite J+1",
      icon: "\u{1F4CA}",
      color: "amber",
    },
    {
      id: "av-01",
      type: "assurance_vie",
      label: "Contrat de Capitalisation",
      balance: 65000,
      currency: "EUR",
      rate: 3.20,
      rateLabel: "Taux fonds en euros 2026",
      availability: "Rachat partiel possible",
      icon: "\u{1F6E1}️",
      color: "teal",
    },
    {
      id: "tp-01",
      type: "tresorerie_perso",
      label: "Tresorerie Sur Mesure",
      balance: 60000,
      currency: "EUR",
      rate: 3.85,
      rateLabel: "Taux negocie",
      availability: "Echeance renouvelable 3 mois",
      maturity: "04/01/2027",
      icon: "\u{1F48E}",
      color: "rose",
    },
  ];
}

function getDefaultProducts(totalBalance: number): SavingsProduct[] {
  if (totalBalance <= 0) return [];
  const pct = (p: number) => Math.round(totalBalance * p);
  return [
    {
      id: "ep-01",
      type: "epargne_remuneree",
      label: "Livret Epargne",
      balance: pct(0.45),
      currency: "EUR",
      rate: 2.50,
      rateLabel: "Taux brut annuel",
      availability: "Disponible a tout moment",
      icon: "\u{1F3E6}",
      color: "emerald",
    },
    {
      id: "ct-01",
      type: "compte_terme",
      label: "Depot a terme 6 mois",
      balance: pct(0.30),
      currency: "EUR",
      rate: 3.50,
      rateLabel: "Taux fixe garanti",
      availability: "Bloque jusqu’au 04/04/2027",
      maturity: "04/04/2027",
      icon: "\u{1F512}",
      color: "blue",
    },
    {
      id: "fm-01",
      type: "fonds_monetaire",
      label: "Fonds Monetaire",
      balance: pct(0.25),
      currency: "EUR",
      rate: 3.35,
      rateLabel: "Rendement net annualise",
      availability: "Liquidite J+2",
      icon: "\u{1F4CA}",
      color: "amber",
    },
  ];
}

function isFritzOrDavin(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("fritz") || n.includes("davin");
}

function getInterestHistory(products: SavingsProduct[]) {
  const totalWeighted = products.reduce((s, p) => s + p.balance * p.rate / 100, 0);
  const monthly = totalWeighted / 12;
  const months = [
    "Septembre 2026", "Aout 2026", "Juillet 2026",
    "Juin 2026", "Mai 2026", "Avril 2026",
  ];
  return months.map((month, i) => ({
    month,
    amount: Math.round((monthly - i * monthly * 0.008) * 100) / 100,
  }));
}

export default function EpargneClient({
  epargneAccounts,
  courantAccounts,
  clientName,
}: {
  epargneAccounts: EpargneAccount[];
  courantAccounts: CourantAccount[];
  clientName: string;
}) {
  const totalEpargne = epargneAccounts.reduce((s, a) => s + a.balance, 0);
  const products = isFritzOrDavin(clientName)
    ? getFritzDavinProducts()
    : getDefaultProducts(totalEpargne);

  const [tab, setTab] = useState<"portfolio" | "catalog">("portfolio");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showSubscribe, setShowSubscribe] = useState<SavingsType | null>(null);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const totalProducts = products.reduce((s, p) => s + p.balance, 0);
  const weightedRate = products.length > 0
    ? products.reduce((s, p) => s + p.balance * p.rate, 0) / totalProducts
    : 0;
  const monthlyInterest = totalProducts * weightedRate / 100 / 12;
  const annualInterest = totalProducts * weightedRate / 100;

  const interestHistory = getInterestHistory(products);

  const typeDistribution = CATALOG.map((cat) => {
    const matching = products.filter((p) => p.type === cat.type);
    const total = matching.reduce((s, p) => s + p.balance, 0);
    return { ...cat, total, count: matching.length };
  }).filter((d) => d.total > 0);

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Mon epargne</h1>
      <p className="text-sm text-gray-500 mb-6">Gerez vos placements, comptes a terme et solutions d&apos;epargne</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setTab("portfolio")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "portfolio" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Mon portefeuille
        </button>
        <button
          onClick={() => setTab("catalog")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "catalog" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Produits disponibles
        </button>
      </div>

      {tab === "portfolio" && (
        <>
          {/* Hero cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#003d82] to-[#001d40] rounded-xl p-5 text-white">
              <p className="text-sm text-white/70">Epargne totale</p>
              <p className="text-2xl font-bold mt-1">{fmtCurrency(totalProducts)}</p>
              <p className="text-xs text-white/60 mt-2">{products.length} produit{products.length > 1 ? "s" : ""} actif{products.length > 1 ? "s" : ""}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Taux moyen pondere</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{weightedRate.toFixed(2)} %</p>
              <p className="text-xs text-gray-400 mt-2">Rendement annuel brut</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Interets estimes / an</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">+{fmtCurrency(annualInterest)}</p>
              <p className="text-xs text-gray-400 mt-2">soit ~{fmtCurrency(monthlyInterest)} / mois</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8 text-center">
              <p className="text-4xl mb-3">{"\u{1F4B0}"}</p>
              <p className="text-sm text-blue-800 font-medium">Vous n&apos;avez pas encore de produit d&apos;epargne</p>
              <p className="text-xs text-blue-600 mt-1 mb-4">Decouvrez nos solutions pour faire fructifier votre capital</p>
              <button onClick={() => setTab("catalog")} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
                Voir les produits
              </button>
            </div>
          ) : (
            <>
              {/* Allocation bar */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Repartition de votre epargne</h2>
                <div className="flex h-4 rounded-full overflow-hidden mb-4">
                  {typeDistribution.map((d) => {
                    const pct = (d.total / totalProducts) * 100;
                    const colors: Record<string, string> = {
                      epargne_remuneree: "bg-emerald-500",
                      compte_terme: "bg-blue-500",
                      depot_devises: "bg-violet-500",
                      fonds_monetaire: "bg-amber-500",
                      assurance_vie: "bg-teal-500",
                      tresorerie_perso: "bg-rose-500",
                    };
                    return (
                      <div
                        key={d.type}
                        className={`${colors[d.type] ?? "bg-gray-400"} transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${d.name} — ${fmtCurrency(d.total)} (${pct.toFixed(1)}%)`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  {typeDistribution.map((d) => {
                    const dotColors: Record<string, string> = {
                      epargne_remuneree: "bg-emerald-500",
                      compte_terme: "bg-blue-500",
                      depot_devises: "bg-violet-500",
                      fonds_monetaire: "bg-amber-500",
                      assurance_vie: "bg-teal-500",
                      tresorerie_perso: "bg-rose-500",
                    };
                    return (
                      <span key={d.type} className="flex items-center gap-1.5 text-gray-600">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColors[d.type] ?? "bg-gray-400"}`} />
                        {d.name} — {((d.total / totalProducts) * 100).toFixed(1)} %
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Products grid */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mes placements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {products.map((product) => {
                  const borderColors: Record<string, string> = {
                    emerald: "border-emerald-200 hover:border-emerald-300",
                    blue: "border-blue-200 hover:border-blue-300",
                    violet: "border-violet-200 hover:border-violet-300",
                    amber: "border-amber-200 hover:border-amber-300",
                    teal: "border-teal-200 hover:border-teal-300",
                    rose: "border-rose-200 hover:border-rose-300",
                  };
                  const badgeColors: Record<string, string> = {
                    emerald: "bg-emerald-100 text-emerald-700",
                    blue: "bg-blue-100 text-blue-700",
                    violet: "bg-violet-100 text-violet-700",
                    amber: "bg-amber-100 text-amber-700",
                    teal: "bg-teal-100 text-teal-700",
                    rose: "bg-rose-100 text-rose-700",
                  };
                  const expanded = expandedProduct === product.id;
                  const monthlyEst = product.balance * product.rate / 100 / 12;
                  const catLabel = CATALOG.find((c) => c.type === product.type)?.name ?? "";
                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl border ${borderColors[product.color] ?? "border-gray-200"} p-5 transition-all cursor-pointer`}
                      onClick={() => setExpandedProduct(expanded ? null : product.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{product.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{product.label}</h3>
                            <p className="text-xs text-gray-400">{catLabel}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[product.color] ?? "bg-gray-100 text-gray-700"}`}>
                          {product.rate.toFixed(2)} %
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{fmtCurrency(product.balance, product.currency)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{product.availability}</span>
                        <span className="text-xs text-green-600 font-medium">+{fmtCurrency(monthlyEst)} / mois</span>
                      </div>
                      {expanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Type de taux</span>
                            <span className="font-medium text-gray-900">{product.rateLabel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Devise</span>
                            <span className="font-medium text-gray-900">{product.currency}</span>
                          </div>
                          {product.maturity && (
                            <div className="flex justify-between">
                              <span>Echeance</span>
                              <span className="font-medium text-gray-900">{product.maturity}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Interets estimes / an</span>
                            <span className="font-medium text-green-600">+{fmtCurrency(product.balance * product.rate / 100)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Interest history */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des interets</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-3 font-medium text-gray-500">Periode</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-500">Interets verses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interestHistory.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-3 text-gray-700">{item.month}</td>
                        <td className="px-6 py-3 text-right font-semibold text-green-600">+{fmtCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Linked accounts */}
              {epargneAccounts.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Comptes epargne associes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {epargneAccounts.map((acct) => (
                      <div key={acct.id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{acct.label}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Actif</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{fmtCurrency(acct.balance)}</p>
                        <p className="text-xs text-gray-400 font-mono mt-2">{acct.iban}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {tab === "catalog" && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nos solutions d&apos;epargne</h2>
          <p className="text-sm text-gray-500 mb-6">Choisissez le placement adapte a vos objectifs et votre horizon</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CATALOG.map((product) => {
              const hasProduct = products.some((p) => p.type === product.type);
              return (
                <div key={product.type} className={`rounded-xl border p-5 ${product.color} transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{product.icon}</span>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    </div>
                    {hasProduct && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Souscrit</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div>
                      <p className="text-gray-500">Rendement</p>
                      <p className="font-semibold text-gray-900">{product.rateRange}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Montant minimum</p>
                      <p className="font-semibold text-gray-900">{product.minAmount}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Disponibilite</p>
                      <p className="font-semibold text-gray-900">{product.availability}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {product.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#22c55e" opacity=".15"/><path d="M4 7l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowSubscribe(showSubscribe === product.type ? null : product.type);
                    }}
                    className="w-full bg-[#003d82] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors"
                  >
                    {hasProduct ? "Souscrire a nouveau" : "Souscrire"}
                  </button>

                  {showSubscribe === product.type && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                      <p className="text-sm font-medium text-gray-900">Demande de souscription</p>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Montant souhaite (EUR)</label>
                        <input
                          type="number"
                          min={100}
                          placeholder={product.minAmount.replace(/[^0-9]/g, "")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {courantAccounts.length > 0 && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Compte source</label>
                          <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {courantAccounts.map((a) => (
                              <option key={a.id} value={a.id}>{a.label} — {fmtCurrency(a.balance)}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowSubscribe(null);
                            notify("Demande de souscription envoyee a votre gestionnaire");
                          }}
                          className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]"
                        >
                          Envoyer la demande
                        </button>
                        <button
                          onClick={() => setShowSubscribe(null)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function fmtCurrency(n: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, minimumFractionDigits: 2 }).format(n).replace(/ /g, " ");
}
