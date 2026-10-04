"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { MarketScenario } from "@/lib/market-simulation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Filler, ChartTooltip);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RiskLevel = 1 | 2 | 3 | 4 | 5;
type AssetCategory =
  | "obligations"
  | "actions"
  | "gestion_mandat"
  | "produits_structures"
  | "private_equity"
  | "immobilier"
  | "dette_privee"
  | "infrastructures"
  | "assurance_vie"
  | "fonds_alternatifs"
  | "matieres_premieres"
  | "liquidites";

interface Product {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  expectedYield: string;
  risk: RiskLevel;
  minInvestment: number;
  liquidity: string;
  currency: string;
  isin?: string;
}

interface Holding {
  productId: string;
  name: string;
  category: AssetCategory;
  invested: number;
  currentValue: number;
  perf: number;
  dateAchat: string;
  currency: string;
}

/* ------------------------------------------------------------------ */
/*  Categories metadata                                                */
/* ------------------------------------------------------------------ */

const CATEGORIES: {
  key: AssetCategory;
  label: string;
  icon: string;
  color: string;
  chartColor: string;
}[] = [
  { key: "obligations", label: "Obligations", icon: "\u{1F4CA}", color: "bg-blue-500", chartColor: "#3b82f6" },
  { key: "actions", label: "Actions & ETF", icon: "\u{1F4C8}", color: "bg-emerald-500", chartColor: "#10b981" },
  { key: "gestion_mandat", label: "Gestion sous mandat", icon: "\u{1F3DB}️", color: "bg-indigo-500", chartColor: "#6366f1" },
  { key: "produits_structures", label: "Produits structurés", icon: "\u{1F527}", color: "bg-pink-500", chartColor: "#ec4899" },
  { key: "private_equity", label: "Private Equity", icon: "\u{1F680}", color: "bg-purple-500", chartColor: "#8b5cf6" },
  { key: "immobilier", label: "Immobilier", icon: "\u{1F3E2}", color: "bg-amber-500", chartColor: "#f59e0b" },
  { key: "dette_privee", label: "Dette privée", icon: "\u{1F4B0}", color: "bg-red-500", chartColor: "#ef4444" },
  { key: "infrastructures", label: "Infrastructures", icon: "⚡", color: "bg-teal-500", chartColor: "#14b8a6" },
  { key: "assurance_vie", label: "Assurance-vie Lux.", icon: "\u{1F6E1}️", color: "bg-cyan-500", chartColor: "#06b6d4" },
  { key: "fonds_alternatifs", label: "Hedge Funds", icon: "\u{1F3AF}", color: "bg-rose-500", chartColor: "#f43f5e" },
  { key: "matieres_premieres", label: "Or & Matières", icon: "\u{1F947}", color: "bg-yellow-600", chartColor: "#ca8a04" },
  { key: "liquidites", label: "Liquidités", icon: "\u{1F4B6}", color: "bg-sky-500", chartColor: "#0ea5e9" },
];

const RISK_LABELS: Record<RiskLevel, string> = {
  1: "Très faible",
  2: "Faible",
  3: "Modéré",
  4: "Élevé",
  5: "Très élevé",
};

const RISK_COLORS: Record<RiskLevel, string> = {
  1: "text-green-700 bg-green-50",
  2: "text-green-600 bg-green-50",
  3: "text-yellow-700 bg-yellow-50",
  4: "text-orange-700 bg-orange-50",
  5: "text-red-700 bg-red-50",
};

const RISK_PROFILE_LEVELS = ["Prudent", "Équilibré", "Dynamique", "Offensif"] as const;

/* ------------------------------------------------------------------ */
/*  Product catalog                                                    */
/* ------------------------------------------------------------------ */

const PRODUCTS: Product[] = [
  // Obligations & Taux
  { id: "obl-01", name: "Obligations d'État Zone Euro AAA", category: "obligations", description: "Panier d'obligations souveraines notées AAA (Allemagne, Luxembourg, Pays-Bas). Rendement régulier avec risque très limité.", expectedYield: "3,2 – 3,8 % / an", risk: 1, minInvestment: 10000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0290357846" },
  { id: "obl-02", name: "Corporate Bonds Investment Grade", category: "obligations", description: "Fonds obligataire investi en dettes d'entreprises notées BBB+ à AA. Secteurs diversifiés : industrie, énergie, bancaire.", expectedYield: "4,0 – 5,2 % / an", risk: 2, minInvestment: 25000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0517399756" },
  { id: "obl-03", name: "High Yield Bonds Euro", category: "obligations", description: "Obligations d'entreprises à haut rendement (BB à B). Potentiel de rendement supérieur avec volatilité accrue.", expectedYield: "5,5 – 7,5 % / an", risk: 3, minInvestment: 50000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0832436535" },
  { id: "obl-04", name: "Dépôt à terme 12 mois", category: "obligations", description: "Placement garanti à capital protégé. Taux fixé à la souscription pour une durée de 12 mois.", expectedYield: "3,50 % garanti", risk: 1, minInvestment: 100000, liquidity: "12 mois (pénalité si retrait anticipé)", currency: "EUR" },
  { id: "obl-05", name: "Emerging Market Bonds USD", category: "obligations", description: "Obligations de marchés émergents en USD. Diversification géographique et rendement attractif.", expectedYield: "6,0 – 8,0 % / an", risk: 3, minInvestment: 50000, liquidity: "Quotidienne", currency: "USD", isin: "LU0455734078" },

  // Actions & Fonds
  { id: "act-01", name: "Actions Européennes Large Cap", category: "actions", description: "OPCVM investi dans les 50 plus grandes capitalisations européennes. Gestion active avec biais qualité/croissance.", expectedYield: "7 – 10 % / an (historique)", risk: 3, minInvestment: 5000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0599612842" },
  { id: "act-02", name: "ETF S&P 500 (réplication physique)", category: "actions", description: "Tracker répliquant l'indice S&P 500 avec frais réduits. Exposition aux 500 plus grandes entreprises américaines.", expectedYield: "8 – 12 % / an (historique)", risk: 3, minInvestment: 1000, liquidity: "Quotidienne", currency: "USD", isin: "IE00B5BMR087" },
  { id: "act-03", name: "Fonds Technologie Mondiale", category: "actions", description: "Fonds thématique concentré sur les leaders technologiques : IA, cloud, semiconducteurs, cybersécurité.", expectedYield: "10 – 18 % / an (historique)", risk: 4, minInvestment: 10000, liquidity: "Quotidienne", currency: "USD", isin: "LU0348723411" },
  { id: "act-04", name: "Actions Asie-Pacifique", category: "actions", description: "Exposition diversifiée aux marchés asiatiques : Japon, Corée du Sud, Inde, Australie, Singapour.", expectedYield: "6 – 11 % / an (historique)", risk: 4, minInvestment: 10000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0516422945" },
  { id: "act-05", name: "ETF Santé & Biotech", category: "actions", description: "Fonds thématique santé, biotechnologies et medtech. Tendance de long terme portée par le vieillissement démographique.", expectedYield: "7 – 13 % / an (historique)", risk: 3, minInvestment: 5000, liquidity: "Quotidienne", currency: "EUR", isin: "IE00BYZK4776" },
  { id: "act-06", name: "Fonds Défense & Aérospatial", category: "actions", description: "Fonds concentré sur le secteur de la défense européenne et aérospatiale. Thématique portée par la hausse des budgets militaires.", expectedYield: "9 – 15 % / an (historique)", risk: 4, minInvestment: 25000, liquidity: "Quotidienne", currency: "EUR", isin: "LU0988613234" },
  { id: "act-07", name: "ETF Énergie Renouvelable", category: "actions", description: "Tracker dédié aux entreprises de l'énergie verte : solaire, éolien, hydrogène, stockage.", expectedYield: "5 – 12 % / an (historique)", risk: 4, minInvestment: 5000, liquidity: "Quotidienne", currency: "EUR", isin: "IE00BKLF1R75" },

  // Gestion sous mandat
  { id: "man-01", name: "Mandat Prudent", category: "gestion_mandat", description: "Gestion déléguée avec allocation prudente : 70 % obligations, 20 % actions, 10 % monétaire. Objectif de préservation du capital.", expectedYield: "3 – 5 % / an", risk: 2, minInvestment: 250000, liquidity: "Mensuelle (préavis 30j)", currency: "EUR" },
  { id: "man-02", name: "Mandat Équilibré", category: "gestion_mandat", description: "Allocation mixte : 45 % obligations, 45 % actions, 10 % alternatifs. Équilibre rendement/risque optimal.", expectedYield: "5 – 8 % / an", risk: 3, minInvestment: 500000, liquidity: "Mensuelle (préavis 30j)", currency: "EUR" },
  { id: "man-03", name: "Mandat Dynamique", category: "gestion_mandat", description: "Forte exposition actions (70 %+), thématiques de conviction. Pour investisseurs avec horizon long terme (5 ans+).", expectedYield: "7 – 12 % / an", risk: 4, minInvestment: 500000, liquidity: "Mensuelle (préavis 30j)", currency: "EUR" },
  { id: "man-04", name: "Mandat ESG Impact", category: "gestion_mandat", description: "Mandat 100 % ESG avec critères d'exclusion stricts. Labels ISR et Greenfin. Reporting d'impact trimestriel.", expectedYield: "5 – 9 % / an", risk: 3, minInvestment: 500000, liquidity: "Mensuelle (préavis 30j)", currency: "EUR" },

  // Produits structurés
  { id: "str-01", name: "Autocall Euro Stoxx 50 — Coupon 7 %", category: "produits_structures", description: "Produit à capital conditionellement protégé lié à l'Euro Stoxx 50. Coupon de 7 % / an si l'indice ne baisse pas de plus de 30 %. Barrière de protection à -40 %.", expectedYield: "7,0 % / an (conditionnel)", risk: 3, minInvestment: 50000, liquidity: "Rappel trimestriel possible", currency: "EUR" },
  { id: "str-02", name: "Phoenix Note CAC 40 — Coupon 10 %", category: "produits_structures", description: "Structure Phoenix versant un coupon trimestriel de 2,5 % si le CAC 40 reste au-dessus de -35 %. Effet mémoire sur les coupons non versés.", expectedYield: "10,0 % / an (conditionnel)", risk: 4, minInvestment: 100000, liquidity: "Rappel trimestriel possible", currency: "EUR" },
  { id: "str-03", name: "Capital Protégé 100 % — Participation S&P", category: "produits_structures", description: "Capital garanti à 100 % à l'échéance (5 ans). Participation à 60 % de la hausse du S&P 500. Idéal pour profil prudent.", expectedYield: "Participation 60 % de la hausse", risk: 2, minInvestment: 100000, liquidity: "5 ans (marché secondaire possible)", currency: "EUR" },

  // Private Equity
  { id: "pe-01", name: "Fonds PE Growth Europe III", category: "private_equity", description: "Investissement dans des PME européennes en forte croissance. Secteurs : tech, santé, services B2B. Durée : 7-10 ans.", expectedYield: "12 – 18 % / an (TRI cible)", risk: 5, minInvestment: 200000, liquidity: "Bloqué 7-10 ans", currency: "EUR" },
  { id: "pe-02", name: "Secondaire Private Equity Global", category: "private_equity", description: "Fonds de secondaire offrant une diversification sur 200+ participations PE matures. Décote d'entrée et J-curve atténuée.", expectedYield: "10 – 15 % / an (TRI cible)", risk: 4, minInvestment: 125000, liquidity: "Bloqué 5-7 ans", currency: "EUR" },
  { id: "pe-03", name: "Venture Capital Tech & IA", category: "private_equity", description: "Fonds de capital-risque ciblant les startups IA, deep tech et SaaS en Série A/B. Potentiel de rendement élevé, risque de perte totale.", expectedYield: "15 – 25 % / an (TRI cible)", risk: 5, minInvestment: 250000, liquidity: "Bloqué 8-12 ans", currency: "USD" },

  // Immobilier
  { id: "imm-01", name: "SCPI Bureaux Prime Europe", category: "immobilier", description: "SCPI investie dans des bureaux prime à Paris, Munich, Amsterdam et Luxembourg. Taux d'occupation > 95 %.", expectedYield: "4,2 – 5,0 % / an (distribution)", risk: 2, minInvestment: 50000, liquidity: "Trimestrielle (délai variable)", currency: "EUR" },
  { id: "imm-02", name: "OPCI Hôtellerie & Tourisme", category: "immobilier", description: "Fonds immobilier concentré sur l'hôtellerie haut de gamme en Europe. Portefeuille de 30 actifs premium.", expectedYield: "5,5 – 7,0 % / an", risk: 3, minInvestment: 100000, liquidity: "Semestrielle", currency: "EUR" },
  { id: "imm-03", name: "Fonds Logistique & Data Centers", category: "immobilier", description: "Investissement dans des entrepôts logistiques et centres de données en Europe. Tendance structurelle e-commerce et cloud.", expectedYield: "5,0 – 7,5 % / an", risk: 3, minInvestment: 100000, liquidity: "Trimestrielle", currency: "EUR" },
  { id: "imm-04", name: "Immobilier Résidentiel Luxembourg", category: "immobilier", description: "Fonds dédié au résidentiel haut de gamme au Luxembourg. Marché résilient avec demande structurelle forte.", expectedYield: "3,5 – 4,5 % / an (distribution)", risk: 2, minInvestment: 75000, liquidity: "Annuelle", currency: "EUR" },

  // Dette privée
  { id: "det-01", name: "Senior Secured Lending Europe", category: "dette_privee", description: "Financement de PME européennes par prêts seniors sécurisés. Rendement supérieur aux obligations classiques avec sûretés réelles.", expectedYield: "5,5 – 7,0 % / an", risk: 3, minInvestment: 150000, liquidity: "Bloqué 3-5 ans", currency: "EUR" },
  { id: "det-02", name: "Unitranche Mid-Market", category: "dette_privee", description: "Financement unitranche de sociétés mid-market (50-500 M€ de CA). Mix dette senior + mezzanine en un seul instrument.", expectedYield: "7,0 – 9,0 % / an", risk: 3, minInvestment: 200000, liquidity: "Bloqué 4-6 ans", currency: "EUR" },

  // Infrastructures
  { id: "inf-01", name: "Infrastructures Core Europe", category: "infrastructures", description: "Investissement dans des actifs d'infrastructure essentiels : autoroutes, aéroports, réseaux d'eau, télécommunications.", expectedYield: "5,0 – 7,0 % / an", risk: 2, minInvestment: 200000, liquidity: "Bloqué 8-12 ans", currency: "EUR" },
  { id: "inf-02", name: "Énergies Renouvelables & Transition", category: "infrastructures", description: "Portefeuille de parcs éoliens, solaires et installations de stockage en Europe. Revenus contractualisés long terme.", expectedYield: "6,0 – 8,5 % / an", risk: 3, minInvestment: 150000, liquidity: "Bloqué 7-10 ans", currency: "EUR" },
  { id: "inf-03", name: "Digital Infrastructure & 5G", category: "infrastructures", description: "Tours télécoms, fibre optique et data centers. Revenus récurrents indexés, forte visibilité.", expectedYield: "5,5 – 7,5 % / an", risk: 3, minInvestment: 200000, liquidity: "Bloqué 6-8 ans", currency: "EUR" },

  // Assurance-vie luxembourgeoise
  { id: "asv-01", name: "Contrat Patrimoine Sécurité", category: "assurance_vie", description: "Assurance-vie luxembourgeoise avec fonds en euros garanti et unités de compte. Triangle de sécurité luxembourgeois. Avantages successoraux.", expectedYield: "2,5 – 4,0 % / an (fonds euros)", risk: 1, minInvestment: 250000, liquidity: "Rachat partiel sous 30 jours", currency: "EUR" },
  { id: "asv-02", name: "Contrat FID Multi-Supports", category: "assurance_vie", description: "Fonds Interne Dédié permettant de loger actions, obligations, fonds alternatifs et PE dans une enveloppe fiscalement optimisée.", expectedYield: "Variable selon allocation", risk: 3, minInvestment: 500000, liquidity: "Rachat sous 30 jours (sauf actifs illiquides)", currency: "EUR" },
  { id: "asv-03", name: "Contrat Transmission Générationnelle", category: "assurance_vie", description: "Structure patrimoniale dédiée à la transmission. Démembrement possible. Multi-devises, multi-dépositaires.", expectedYield: "Variable selon allocation", risk: 2, minInvestment: 1000000, liquidity: "Rachat sous 30 jours", currency: "EUR" },

  // Fonds alternatifs / Hedge funds
  { id: "alt-01", name: "Multi-Strategy Hedge Fund", category: "fonds_alternatifs", description: "Fonds multi-stratégies : Long/Short, Event Driven, Relative Value. Objectif de performance absolue, décorrélé des marchés.", expectedYield: "6 – 10 % / an", risk: 4, minInvestment: 250000, liquidity: "Trimestrielle (préavis 90j)", currency: "USD" },
  { id: "alt-02", name: "Global Macro Opportunities", category: "fonds_alternatifs", description: "Stratégie macro globale exploitant les tendances des devises, taux et matières premières. Forte diversification.", expectedYield: "5 – 12 % / an", risk: 4, minInvestment: 200000, liquidity: "Mensuelle (préavis 60j)", currency: "USD" },
  { id: "alt-03", name: "Market Neutral Equity Europe", category: "fonds_alternatifs", description: "Stratégie long/short equity avec exposition nette proche de zéro. Rendement indépendant de la direction des marchés.", expectedYield: "4 – 8 % / an", risk: 3, minInvestment: 125000, liquidity: "Mensuelle (préavis 30j)", currency: "EUR" },

  // Or, matières premières, cryptoactifs
  { id: "mat-01", name: "Or Physique (lingots alloués)", category: "matieres_premieres", description: "Or physique stocké en coffre-fort à Luxembourg. Lingots alloués et identifiés. Valeur refuge par excellence.", expectedYield: "Variable (cours de l'or)", risk: 3, minInvestment: 50000, liquidity: "Vente sous 48h", currency: "EUR" },
  { id: "mat-02", name: "ETF Matières Premières Diversifiées", category: "matieres_premieres", description: "Tracker répliquant un panier diversifié : métaux précieux, énergie, métaux industriels, agriculture.", expectedYield: "Variable (indices matières)", risk: 3, minInvestment: 10000, liquidity: "Quotidienne", currency: "USD", isin: "IE00BDFL4P12" },
  { id: "mat-03", name: "Bitcoin & Ethereum ETP (réglementé)", category: "matieres_premieres", description: "ETP coté en bourse répliquant Bitcoin et Ethereum. Produit réglementé, conservé par dépositaire institutionnel. Forte volatilité.", expectedYield: "Variable (marché crypto)", risk: 5, minInvestment: 10000, liquidity: "Quotidienne", currency: "EUR", isin: "CH1199067674" },
];

/* ------------------------------------------------------------------ */
/*  Personalized portfolio holdings                                    */
/* ------------------------------------------------------------------ */

const HOLDING_TEMPLATE: { productId: string; name: string; category: AssetCategory; pct: number; perf: number; dateAchat: string; currency: string }[] = [
  { productId: "asv-01", name: "Contrat Patrimoine Sécurité", category: "assurance_vie", pct: 0.30, perf: 3.36, dateAchat: "15/11/2024", currency: "EUR" },
  { productId: "obl-04", name: "Dépôt à terme 12 mois", category: "obligations", pct: 0.18, perf: 1.75, dateAchat: "01/04/2026", currency: "EUR" },
  { productId: "act-01", name: "Actions Européennes Large Cap", category: "actions", pct: 0.14, perf: 9.4, dateAchat: "15/03/2025", currency: "EUR" },
  { productId: "obl-02", name: "Corporate Bonds Investment Grade", category: "obligations", pct: 0.11, perf: 4.2, dateAchat: "22/01/2025", currency: "EUR" },
  { productId: "imm-01", name: "SCPI Bureaux Prime Europe", category: "immobilier", pct: 0.10, perf: 7.1, dateAchat: "10/06/2024", currency: "EUR" },
  { productId: "act-02", name: "ETF S&P 500", category: "actions", pct: 0.08, perf: 6.0, dateAchat: "03/09/2024", currency: "USD" },
  { productId: "str-01", name: "Autocall Euro Stoxx 50 — Coupon 7 %", category: "produits_structures", pct: 0.05, perf: 3.5, dateAchat: "04/10/2026", currency: "EUR" },
  { productId: "pe-02", name: "Secondaire Private Equity Global", category: "private_equity", pct: 0.04, perf: 0, dateAchat: "04/10/2026", currency: "EUR" },
];

const CATEGORY_SENSITIVITY: Partial<Record<AssetCategory, number>> = {
  actions: 1.5,
  private_equity: 1.3,
  fonds_alternatifs: 1.2,
  matieres_premieres: 1.1,
  produits_structures: 0.8,
  immobilier: 0.6,
  obligations: 0.3,
  assurance_vie: 0.2,
  dette_privee: 0.4,
  infrastructures: 0.5,
  gestion_mandat: 0.7,
  liquidites: 0,
};

function getInitialHoldings(_clientName: string, totalBalance: number, multiplier = 1.0): Holding[] {
  if (totalBalance <= 0) return [];
  return HOLDING_TEMPLATE.map((t) => {
    const invested = Math.round(totalBalance * t.pct);
    const sensitivity = CATEGORY_SENSITIVITY[t.category] ?? 1.0;
    const effectiveMultiplier = 1 + (multiplier - 1) * sensitivity;
    const currentValue = Math.round(invested * (1 + t.perf / 100) * effectiveMultiplier);
    const perf = invested > 0 ? ((currentValue - invested) / invested) * 100 : 0;
    return { productId: t.productId, name: t.name, category: t.category, invested, currentValue, perf, dateAchat: t.dateAchat, currency: t.currency };
  });
}

function getRiskProfile(_clientName: string): number {
  return 1;
}

/* ------------------------------------------------------------------ */
/*  Simulated 12-month portfolio performance                           */
/* ------------------------------------------------------------------ */

const PERF_MONTHS = [
  "Nov 25", "Déc 25", "Jan 26", "Fév 26", "Mar 26",
  "Avr 26", "Mai 26", "Jun 26", "Jul 26", "Aoû 26", "Sep 26", "Oct 26",
];

function getPortfolioPerf(_clientName: string, totalBalance: number, multiplier = 1.0): number[] {
  const baseFactors = [0.96, 0.967, 0.978, 0.972, 0.984, 0.993, 0.988, 0.998, 1.002, 0.996, 1.000, 1.002];
  return baseFactors.map((f, i) => {
    const progress = i / (baseFactors.length - 1);
    const scenarioEffect = 1 + (multiplier - 1) * progress;
    return Math.round(totalBalance * f * scenarioEffect);
  });
}

interface CategoryEvolution {
  label: string;
  color: string;
  values: number[];
}

function getCategoryEvolution(_clientName: string, totalBalance: number, multiplier = 1.0): CategoryEvolution[] {
  const scale = (base: number[], pct: number, sensitivity: number) =>
    base.map((v, i) => {
      const progress = i / (base.length - 1);
      const scenarioEffect = 1 + (multiplier - 1) * sensitivity * progress;
      return Math.round(totalBalance * pct * v * scenarioEffect);
    });
  return [
    { label: "Assurance-vie", color: "#06b6d4", values: scale([0.97, 0.974, 0.98, 0.985, 0.987, 0.99, 0.992, 0.995, 0.997, 0.999, 1.0, 1.003], 0.30, 0.2) },
    { label: "Actions", color: "#10b981", values: scale([0.92, 0.94, 0.96, 0.95, 0.98, 1.0, 0.99, 1.02, 1.05, 1.03, 1.06, 1.08], 0.22, 1.5) },
    { label: "Obligations", color: "#3b82f6", values: scale([0.97, 0.975, 0.98, 0.983, 0.986, 0.99, 0.993, 0.996, 0.998, 1.0, 1.002, 1.005], 0.29, 0.3) },
    { label: "Immobilier", color: "#f59e0b", values: scale([0.96, 0.965, 0.97, 0.98, 0.985, 0.99, 0.995, 1.0, 1.003, 1.005, 1.007, 1.01], 0.10, 0.6) },
    { label: "Produits structurés", color: "#ec4899", values: scale([0.98, 0.985, 0.99, 0.975, 0.99, 0.995, 0.99, 1.0, 1.003, 0.998, 1.005, 1.01], 0.05, 0.8) },
    { label: "Private Equity", color: "#8b5cf6", values: scale([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], 0.04, 1.3) },
  ];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const SCENARIO_LABELS: Record<MarketScenario, { label: string; color: string; icon: string }> = {
  normal: { label: "Normal", color: "bg-gray-100 text-gray-600", icon: "⚖️" },
  bull: { label: "Marché haussier", color: "bg-green-100 text-green-700", icon: "📈" },
  correction: { label: "Correction", color: "bg-orange-100 text-orange-700", icon: "📉" },
  crash: { label: "Krach", color: "bg-red-100 text-red-700", icon: "💥" },
  stable: { label: "Marché stable", color: "bg-blue-100 text-blue-700", icon: "➡️" },
};

export default function InvestissementsClient({
  clientName,
  totalBalance,
  marketScenario = "normal",
  marketMultiplier = 1.0,
}: {
  clientName: string;
  totalBalance: number;
  marketScenario?: MarketScenario;
  marketMultiplier?: number;
}) {
  const [tab, setTab] = useState<"portefeuille" | "marche">("portefeuille");
  const [holdings, setHoldings] = useState<Holding[]>(() => getInitialHoldings(clientName, totalBalance, marketMultiplier));
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderAmount, setOrderAmount] = useState("");
  const [orderStep, setOrderStep] = useState<"form" | "confirm" | "done">("form");
  const [sellProduct, setSellProduct] = useState<Holding | null>(null);
  const [sellAmount, setSellAmount] = useState("");
  const [sellStep, setSellStep] = useState<"form" | "confirm" | "done">("form");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [showDataTable, setShowDataTable] = useState(false);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const riskLevel = getRiskProfile(clientName);
  const perfData = getPortfolioPerf(clientName, totalBalance, marketMultiplier);
  const catEvolution = getCategoryEvolution(clientName, totalBalance, marketMultiplier);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
  const totalPerfAbs = totalValue - totalInvested;
  const totalPerfPct = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

  const categoryAlloc = useMemo(() => {
    const map: Record<string, { value: number; color: string; chartColor: string }> = {};
    for (const h of holdings) {
      const cat = CATEGORIES.find((c) => c.key === h.category);
      const label = cat?.label ?? h.category;
      if (!map[label]) map[label] = { value: 0, color: cat?.color ?? "bg-gray-400", chartColor: cat?.chartColor ?? "#9ca3af" };
      map[label].value += h.currentValue;
    }
    return Object.entries(map)
      .map(([label, data]) => ({
        label,
        value: data.value,
        pct: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        color: data.color,
        chartColor: data.chartColor,
      }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, totalValue]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, search]);

  const handleSubscribe = () => {
    if (!selectedProduct) return;
    const amount = parseFloat(orderAmount.replace(/\s/g, "").replace(",", "."));
    if (isNaN(amount) || amount < selectedProduct.minInvestment) return;

    const existing = holdings.find((h) => h.productId === selectedProduct.id);
    if (existing) {
      setHoldings((prev) =>
        prev.map((h) =>
          h.productId === selectedProduct.id
            ? { ...h, invested: h.invested + amount, currentValue: h.currentValue + amount }
            : h
        )
      );
    } else {
      setHoldings((prev) => [
        ...prev,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          category: selectedProduct.category,
          invested: amount,
          currentValue: amount,
          perf: 0,
          dateAchat: new Date().toLocaleDateString("fr-FR"),
          currency: selectedProduct.currency,
        },
      ]);
    }
    setOrderStep("done");
    notify(`Souscription de ${fmtCurrency(amount)} confirmée — ${selectedProduct.name}`);
  };

  const handleSell = () => {
    if (!sellProduct) return;
    const amount = parseFloat(sellAmount.replace(/\s/g, "").replace(",", "."));
    if (isNaN(amount) || amount <= 0 || amount > sellProduct.currentValue) return;

    if (amount >= sellProduct.currentValue * 0.999) {
      setHoldings((prev) => prev.filter((h) => h.productId !== sellProduct.productId));
    } else {
      const ratio = amount / sellProduct.currentValue;
      setHoldings((prev) =>
        prev.map((h) =>
          h.productId === sellProduct.productId
            ? {
                ...h,
                invested: h.invested - h.invested * ratio,
                currentValue: h.currentValue - amount,
              }
            : h
        )
      );
    }
    setSellStep("done");
    notify(`Cession de ${fmtCurrency(amount)} confirmée — ${sellProduct.name}`);
  };

  const closeSubscribeModal = () => {
    setSelectedProduct(null);
    setOrderAmount("");
    setOrderStep("form");
  };

  const closeSellModal = () => {
    setSellProduct(null);
    setSellAmount("");
    setSellStep("form");
  };

  const perfChange = perfData.length >= 2
    ? ((perfData[perfData.length - 1] - perfData[0]) / perfData[0]) * 100
    : 0;

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Investissements</h1>
          <p className="text-sm text-gray-500">Portefeuille de {clientName}</p>
        </div>
        <span className="text-sm text-gray-400 tabular-nums">4 octobre 2026</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("portefeuille")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "portefeuille"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Mon portefeuille
        </button>
        <button
          onClick={() => setTab("marche")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            tab === "marche"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Catalogue d&apos;investissements
        </button>
      </div>

      {/* TAB 1: PORTEFEUILLE */}
      {tab === "portefeuille" && (
        <>
          {/* Simulation banner */}
          {marketScenario !== "normal" && (
            <div className={`rounded-xl px-4 py-3 mb-4 flex items-center gap-3 ${SCENARIO_LABELS[marketScenario].color}`}>
              <span className="text-xl">{SCENARIO_LABELS[marketScenario].icon}</span>
              <div className="text-sm">
                <span className="font-bold">Simulation active :</span>{" "}
                <span>{SCENARIO_LABELS[marketScenario].label}</span>
                <span className="ml-2 opacity-75">
                  (multiplicateur {marketMultiplier.toFixed(2)}x)
                </span>
              </div>
            </div>
          )}
          {/* Hero card */}
          <div className="bg-gradient-to-br from-[#001f42] to-[#003d82] rounded-2xl p-8 text-center mb-6">
            <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-2">Valeur totale du portefeuille</p>
            <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{fmtCurrency(totalValue)}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`text-sm font-semibold ${totalPerfAbs >= 0 ? "text-green-300" : "text-red-300"}`}>
                {totalPerfAbs >= 0 ? "+" : ""}{fmtCurrency(totalPerfAbs)}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${totalPerfAbs >= 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                {totalPerfPct >= 0 ? "+" : ""}{totalPerfPct.toFixed(2)} %
              </span>
            </div>

            {/* Risk profile indicator */}
            <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Profil de risque</span>
              <div className="flex items-start gap-0">
                {RISK_PROFILE_LEVELS.map((level, i) => {
                  const active = i <= riskLevel;
                  return (
                    <div key={level} className="flex items-start">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${active ? "bg-white" : "bg-white/20"}`} />
                        <span className={`text-[10px] whitespace-nowrap ${active ? "text-white font-bold" : "text-white/30"}`}>{level}</span>
                      </div>
                      {i < RISK_PROFILE_LEVELS.length - 1 && (
                        <div className={`w-6 sm:w-8 h-0.5 mt-[5px] ${i < riskLevel ? "bg-white" : "bg-white/20"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Allocation bar + breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-4">Répartition du portefeuille</p>

            {/* Stacked bar */}
            <div className="flex h-5 rounded overflow-hidden gap-0.5 mb-4">
              {categoryAlloc.map((a) => (
                <div
                  key={a.label}
                  className={`${a.color} transition-all group relative`}
                  style={{ width: `${a.pct}%` }}
                  title={`${a.label}: ${fmtCurrency(a.value)} (${a.pct.toFixed(1)} %)`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-5">
              {categoryAlloc.map((a) => (
                <div key={a.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className={`w-2.5 h-2.5 rounded-sm ${a.color}`} />
                  {a.label}
                </div>
              ))}
            </div>

            {/* Breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryAlloc.map((a) => (
                <div key={a.label} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-sm ${a.color}`} />
                    <span className="text-xs font-semibold text-gray-500">{a.label}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 tracking-tight">{fmtCurrency(a.value)}</p>
                  <p className="text-xs text-gray-400 tabular-nums">{a.pct.toFixed(1)} %</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
              <div>
                <p className="text-base font-bold text-gray-900">Évolution du portefeuille</p>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mt-0.5">Performance sur 12 mois</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">{fmtCurrency(perfData[perfData.length - 1])}</span>
                <span className={`text-sm font-semibold ${perfChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {perfChange >= 0 ? "+" : ""}{perfChange.toFixed(1)} %
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <PerformanceChart months={PERF_MONTHS} values={perfData} />
            </div>

            <button
              onClick={() => setShowDataTable(!showDataTable)}
              className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 mt-3"
            >
              {showDataTable ? "Masquer les données" : "Voir les données"}
            </button>
            {showDataTable && (
              <table className="w-full text-sm mt-3 border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 py-1.5 px-2 border-b border-gray-200">Mois</th>
                    <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-gray-400 py-1.5 px-2 border-b border-gray-200">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {PERF_MONTHS.map((m, i) => (
                    <tr key={m}>
                      <td className="text-gray-500 py-1 px-2 border-b border-gray-100">{m}</td>
                      <td className="text-right text-gray-500 py-1 px-2 border-b border-gray-100 tabular-nums">{fmtCurrency(perfData[i])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Category evolution chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="mb-4">
              <p className="text-base font-bold text-gray-900">{"É"}volution par classe d&apos;actifs</p>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 mt-0.5">Performance individuelle sur 12 mois</p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
              {catEvolution.map((cat) => (
                <div key={cat.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <CategoryEvolutionChart months={PERF_MONTHS} categories={catEvolution} />
            </div>
          </div>

          {/* Holdings detail table */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">D{"é"}tail du portefeuille</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Instrument</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Catégorie</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Investi</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Valeur</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Perf.</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400">
                        Aucun investissement en portefeuille.{" "}
                        <button onClick={() => setTab("marche")} className="text-blue-600 hover:underline">
                          Découvrir le catalogue
                        </button>
                      </td>
                    </tr>
                  )}
                  {holdings.map((h) => {
                    const catMeta = CATEGORIES.find((c) => c.key === h.category);
                    return (
                      <tr key={h.productId} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{h.name}</p>
                          <p className="text-xs text-gray-400 sm:hidden">{catMeta?.label}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1">
                            <span>{catMeta?.icon}</span> {catMeta?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 tabular-nums">{fmtCurrency(h.invested)}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">{fmtCurrency(h.currentValue)}</td>
                        <td className={`px-4 py-3 text-right font-semibold tabular-nums ${h.perf >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {h.perf >= 0 ? "+" : ""}{h.perf.toFixed(2)} %
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => { setSellProduct(h); setSellStep("form"); }}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-colors"
                          >
                            Céder
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#001f42] to-[#003d82] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">Conseil patrimonial personnalisé</h3>
                <p className="text-sm mt-1 text-blue-200">
                  Prenez rendez-vous avec votre conseiller dédié pour optimiser votre stratégie d&apos;investissement.
                </p>
              </div>
              <a
                href="/espace-client/messagerie"
                className="inline-flex items-center gap-2 bg-white text-[#003d82] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-100 shrink-0 transition-colors"
              >
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: CATALOGUE */}
      {tab === "marche" && (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#003d82] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Toutes les classes
              </button>
              {CATEGORIES.filter((c) => c.key !== "liquidites").map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.key
                      ? "bg-[#003d82] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredProducts.length === 0 && (
              <p className="text-gray-400 col-span-2 py-10 text-center">Aucun produit trouvé pour cette recherche.</p>
            )}
            {filteredProducts.map((product) => {
              const catMeta = CATEGORIES.find((c) => c.key === product.category);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{catMeta?.icon}</span>
                        <span className="text-xs font-medium text-gray-400">{catMeta?.label}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 leading-snug">{product.name}</h3>
                    </div>
                    <span className={`ml-3 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${RISK_COLORS[product.risk]}`}>
                      Risque {product.risk}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
                    <div>
                      <span className="text-gray-400">Rendement attendu</span>
                      <p className="font-semibold text-gray-800">{product.expectedYield}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Investissement min.</span>
                      <p className="font-semibold text-gray-800">{fmtCurrency(product.minInvestment)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Liquidité</span>
                      <p className="font-semibold text-gray-800">{product.liquidity}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Devise</span>
                      <p className="font-semibold text-gray-800">{product.currency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedProduct(product); setOrderStep("form"); setOrderAmount(""); }}
                    className="w-full bg-[#003d82] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#002a5c] transition-colors"
                  >
                    Souscrire
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-5 text-xs text-gray-400 leading-relaxed">
            <p className="font-semibold text-gray-500 mb-2">Avertissement &mdash; Information importante</p>
            <p>
              Les performances passées ne préjugent pas des performances futures. Tout investissement comporte des risques,
              y compris un risque de perte en capital. Les informations présentées ne constituent ni un conseil en investissement,
              ni une recommandation personnalisée. Avant toute souscription, consultez le Document d&apos;Informations Clés (DIC)
              et le prospectus du produit concerné.
            </p>
          </div>
        </>
      )}

      {/* SUBSCRIBE MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeSubscribeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {orderStep === "form" && (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Souscrire</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{selectedProduct.name}</p>
                    </div>
                    <button onClick={closeSubscribeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Rendement attendu</span><span className="font-medium text-gray-800">{selectedProduct.expectedYield}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Risque</span><span className={`font-medium px-2 py-0.5 rounded-full text-xs ${RISK_COLORS[selectedProduct.risk]}`}>{RISK_LABELS[selectedProduct.risk]} ({selectedProduct.risk}/5)</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Liquidité</span><span className="font-medium text-gray-800">{selectedProduct.liquidity}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Devise</span><span className="font-medium text-gray-800">{selectedProduct.currency}</span></div>
                      {selectedProduct.isin && <div className="flex justify-between"><span className="text-gray-500">ISIN</span><span className="font-mono text-gray-800">{selectedProduct.isin}</span></div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant à investir ({selectedProduct.currency})</label>
                      <input type="text" inputMode="decimal" value={orderAmount} onChange={(e) => setOrderAmount(e.target.value)} placeholder={`Min. ${fmtCurrency(selectedProduct.minInvestment)}`} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <p className="text-xs text-gray-400 mt-1">Montant minimum : {fmtCurrency(selectedProduct.minInvestment)} — Liquidités disponibles : {fmtCurrency(Math.max(0, totalBalance - totalInvested))}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { const amount = parseFloat(orderAmount.replace(/\s/g, "").replace(",", ".")); if (isNaN(amount) || amount < selectedProduct.minInvestment) { notify(`Le montant minimum est de ${fmtCurrency(selectedProduct.minInvestment)}`); return; } setOrderStep("confirm"); }} className="flex-1 bg-[#003d82] text-white py-3 rounded-lg font-semibold hover:bg-[#002a5c] transition-colors">Continuer</button>
                    <button onClick={closeSubscribeModal} className="px-5 py-3 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                  </div>
                </>
              )}
              {orderStep === "confirm" && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la souscription</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-blue-600">Produit</span><span className="font-medium text-blue-900">{selectedProduct.name}</span></div>
                    <div className="flex justify-between"><span className="text-blue-600">Montant</span><span className="font-bold text-blue-900 text-lg">{fmtCurrency(parseFloat(orderAmount.replace(/\s/g, "").replace(",", ".")))}</span></div>
                    <div className="flex justify-between"><span className="text-blue-600">Risque</span><span className="font-medium text-blue-900">{RISK_LABELS[selectedProduct.risk]}</span></div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">En confirmant, vous acceptez les conditions générales de souscription et reconnaissez avoir pris connaissance du DIC du produit.</p>
                  <div className="flex gap-3">
                    <button onClick={handleSubscribe} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Confirmer la souscription</button>
                    <button onClick={() => setOrderStep("form")} className="px-5 py-3 text-sm text-gray-500 hover:text-gray-700">Retour</button>
                  </div>
                </>
              )}
              {orderStep === "done" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Souscription enregistrée</h3>
                  <p className="text-sm text-gray-500 mb-2">Votre investissement dans <strong>{selectedProduct.name}</strong> a été pris en compte.</p>
                  <p className="text-xs text-gray-400 mb-6">Réf. {genRef()} — Un relevé de souscription sera disponible sous 48h.</p>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => { closeSubscribeModal(); setTab("portefeuille"); }} className="bg-[#003d82] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#002a5c] transition-colors">Voir mon portefeuille</button>
                    <button onClick={closeSubscribeModal} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5">Fermer</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {sellProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeSellModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {sellStep === "form" && (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Céder / Racheter</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{sellProduct.name}</p>
                    </div>
                    <button onClick={closeSellModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Valeur actuelle</span><span className="font-medium text-gray-800">{fmtCurrency(sellProduct.currentValue)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Plus/Moins-value</span><span className={`font-medium ${sellProduct.perf >= 0 ? "text-green-600" : "text-red-600"}`}>{sellProduct.perf >= 0 ? "+" : ""}{sellProduct.perf.toFixed(2)} %</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date d&apos;achat</span><span className="font-medium text-gray-800">{sellProduct.dateAchat}</span></div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant à céder ({sellProduct.currency})</label>
                    <input type="text" inputMode="decimal" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} placeholder={`Max. ${fmtCurrency(sellProduct.currentValue)}`} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => setSellAmount(String(Math.floor(sellProduct.currentValue)))} className="text-xs text-blue-600 hover:underline mt-1">Tout céder ({fmtCurrency(sellProduct.currentValue)})</button>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { const amount = parseFloat(sellAmount.replace(/\s/g, "").replace(",", ".")); if (isNaN(amount) || amount <= 0 || amount > sellProduct.currentValue) { notify("Montant invalide"); return; } setSellStep("confirm"); }} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">Continuer</button>
                    <button onClick={closeSellModal} className="px-5 py-3 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                  </div>
                </>
              )}
              {sellStep === "confirm" && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la cession</h3>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-red-600">Instrument</span><span className="font-medium text-red-900">{sellProduct.name}</span></div>
                    <div className="flex justify-between"><span className="text-red-600">Montant cédé</span><span className="font-bold text-red-900 text-lg">{fmtCurrency(parseFloat(sellAmount.replace(/\s/g, "").replace(",", ".")))}</span></div>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Le produit de la cession sera crédité sur votre compte courant sous 2 à 5 jours ouvrés selon la liquidité de l&apos;actif.</p>
                  <div className="flex gap-3">
                    <button onClick={handleSell} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">Confirmer la cession</button>
                    <button onClick={() => setSellStep("form")} className="px-5 py-3 text-sm text-gray-500 hover:text-gray-700">Retour</button>
                  </div>
                </>
              )}
              {sellStep === "done" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Cession enregistrée</h3>
                  <p className="text-sm text-gray-500 mb-2">Votre ordre de cession a été pris en compte.</p>
                  <p className="text-xs text-gray-400 mb-6">Réf. {genRef()} — Le montant sera crédité sous 2 à 5 jours ouvrés.</p>
                  <button onClick={closeSellModal} className="bg-[#003d82] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#002a5c] transition-colors">Fermer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Performance Chart component                                        */
/* ------------------------------------------------------------------ */

function PerformanceChart({ months, values }: { months: string[]; values: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS<"line"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgba(0, 61, 130, 0.15)");
    gradient.addColorStop(1, "rgba(0, 61, 130, 0)");

    chartInstance.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            data: values,
            borderColor: "#003d82",
            borderWidth: 2,
            pointRadius: values.map((_, i) => (i === values.length - 1 ? 5 : 0)),
            pointHoverRadius: 5,
            pointBackgroundColor: "#003d82",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#003d82",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            fill: true,
            backgroundColor: gradient,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#1a1e2c",
            bodyColor: "#5c6070",
            borderColor: "#e6e5e1",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { family: "Inter, system-ui, sans-serif", weight: "bold" as const, size: 12 },
            bodyFont: { family: "system-ui, sans-serif", size: 13 },
            callbacks: {
              label: (item) =>
                new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(item.parsed.y ?? 0),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#92959e",
              font: { family: "system-ui, sans-serif", size: 11 },
              maxRotation: 0,
            },
            border: { color: "#e6e5e1" },
          },
          y: {
            grid: { color: "#f3f4f6" },
            ticks: {
              color: "#92959e",
              font: { family: "system-ui, sans-serif", size: 11 },
              callback: (v: string | number) =>
                new Intl.NumberFormat("fr-FR", { notation: "compact", compactDisplay: "short", style: "currency", currency: "EUR" }).format(Number(v)),
            },
            border: { display: false },
          },
        },
        interaction: { intersect: false, mode: "index" as const },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [months, values]);

  return <canvas ref={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Category Evolution Chart                                           */
/* ------------------------------------------------------------------ */

function CategoryEvolutionChart({ months, categories }: { months: string[]; categories: CategoryEvolution[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS<"line"> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: categories.map((cat) => ({
          label: cat.label,
          data: cat.values,
          borderColor: cat.color,
          borderWidth: 2,
          pointRadius: cat.values.map((_, i) => (i === cat.values.length - 1 ? 4 : 0)),
          pointHoverRadius: 4,
          pointBackgroundColor: cat.color,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          fill: false,
          tension: 0.35,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#1a1e2c",
            bodyColor: "#5c6070",
            borderColor: "#e6e5e1",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: "Inter, system-ui, sans-serif", weight: "bold" as const, size: 12 },
            bodyFont: { family: "system-ui, sans-serif", size: 12 },
            callbacks: {
              label: (item) => {
                const val = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(item.parsed.y ?? 0);
                return `${item.dataset.label} : ${val}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#92959e",
              font: { family: "system-ui, sans-serif", size: 11 },
              maxRotation: 0,
            },
            border: { color: "#e6e5e1" },
          },
          y: {
            grid: { color: "#f3f4f6" },
            ticks: {
              color: "#92959e",
              font: { family: "system-ui, sans-serif", size: 11 },
              callback: (v: string | number) =>
                new Intl.NumberFormat("fr-FR", { notation: "compact", compactDisplay: "short", style: "currency", currency: "EUR" }).format(Number(v)),
            },
            border: { display: false },
          },
        },
        interaction: { intersect: false, mode: "index" as const },
      },
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [months, categories]);

  return <canvas ref={canvasRef} />;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace(/ /g, " ");
}

function genRef() {
  const now = new Date();
  const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${d}-${r}`;
}
