import { shared, nextId } from "@/lib/shared-store";

export type GuaranteeStatus = "brouillon" | "en_attente" | "active" | "expiree" | "annulee";

export interface BankGuarantee {
  id: number;
  clientId: number;
  client: string;
  reference: string;
  type: string;
  swiftType: string;
  beneficiaire: string;
  montant: number;
  devise: string;
  objet: string;
  dateEmission: string;
  dateExpiration: string;
  status: GuaranteeStatus;
  banqueCorrespondante: string;
  conditions: string;
}

export const GUARANTEE_TYPES: { label: string; swift: string; description: string }[] = [
  { label: "SBLC — Standby Letter of Credit", swift: "MT 760", description: "Garantie bancaire standby irrevocable" },
  { label: "Lettre de Credit Documentaire", swift: "MT 700", description: "Credit documentaire irrevocable pour importation/exportation" },
  { label: "Garantie de Soumission (Bid Bond)", swift: "MT 760", description: "Garantie de participation a un appel d'offres" },
  { label: "Garantie de Bonne Execution (Performance Bond)", swift: "MT 760", description: "Garantie de bonne fin d'execution d'un contrat" },
  { label: "Garantie de Restitution d'Acompte (Advance Payment)", swift: "MT 760", description: "Garantie de remboursement d'acompte verse" },
  { label: "Garantie de Paiement", swift: "MT 760", description: "Garantie de paiement irrevocable a premiere demande" },
  { label: "Garantie de Retenue de Garantie (Retention Bond)", swift: "MT 760", description: "Garantie liberant la retenue de garantie" },
  { label: "Garantie Douaniere", swift: "MT 760", description: "Caution douaniere pour operations d'importation" },
  { label: "Garantie Locative", swift: "MT 760", description: "Garantie bancaire pour bail commercial ou residentiel" },
  { label: "Lettre de Confort (Letter of Comfort)", swift: "MT 799", description: "Lettre d'intention de soutien financier" },
  { label: "Lettre de Blocage de Fonds (Proof of Funds)", swift: "MT 799", description: "Attestation de disponibilite de fonds bloques" },
  { label: "Confirmation de Compte (Bank Confirmation Letter)", swift: "MT 799", description: "Confirmation officielle de relation bancaire et solde" },
  { label: "Lettre de Credit Standby (ISP98)", swift: "MT 760", description: "SBLC conforme aux regles ISP98 de la CCI" },
  { label: "Credit Documentaire Transferable", swift: "MT 700", description: "LC transferable a un second beneficiaire" },
  { label: "Credit Documentaire Back-to-Back", swift: "MT 700", description: "Credit adosse a un credit documentaire maitre" },
  { label: "Garantie Bancaire a Premiere Demande (URDG 758)", swift: "MT 760", description: "Garantie conforme aux URDG 758 de la CCI" },
  { label: "Lettre d'Intention Bancaire (Bank Endorsement Letter)", swift: "MT 799", description: "Lettre de soutien bancaire pour projet" },
  { label: "Aval Bancaire", swift: "MT 760", description: "Garantie de paiement sur effets de commerce" },
  { label: "Caution de Marche Public", swift: "MT 760", description: "Garantie pour marche public ou contrat gouvernemental" },
  { label: "Garantie Financiere (Financial Guarantee)", swift: "MT 760", description: "Garantie financiere pour obligations contractuelles" },
];

export const DEVISES = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD"];

export const GUARANTEES: BankGuarantee[] = shared<BankGuarantee>("guarantees", () => [
  {
    id: 1, clientId: 21, client: "Fritz Mambouka", reference: "GT-2026-001",
    type: "SBLC — Standby Letter of Credit", swiftType: "MT 760",
    beneficiaire: "Global Trade Partners Ltd", montant: 500000, devise: "EUR",
    objet: "Garantie de paiement pour contrat d'approvisionnement n°GT-2026-4521",
    dateEmission: "15/03/2026", dateExpiration: "15/03/2027", status: "active",
    banqueCorrespondante: "Deutsche Bank AG, Frankfurt",
    conditions: "Irrevocable, payable a premiere demande conforme aux ISP98",
  },
  {
    id: 2, clientId: 21, client: "Fritz Mambouka", reference: "GT-2026-002",
    type: "Garantie de Bonne Execution (Performance Bond)", swiftType: "MT 760",
    beneficiaire: "Ministere des Infrastructures — Luxembourg", montant: 250000, devise: "EUR",
    objet: "Garantie de bonne execution du marche public n°MI-2026-078",
    dateEmission: "01/04/2026", dateExpiration: "01/10/2027", status: "active",
    banqueCorrespondante: "Banque Internationale a Luxembourg",
    conditions: "Conforme URDG 758, irrevocable a premiere demande",
  },
  {
    id: 3, clientId: 19, client: "Cedric Carpentier", reference: "GT-2026-003",
    type: "Garantie Locative", swiftType: "MT 760",
    beneficiaire: "Immobiliere du Kirchberg S.A.", montant: 18000, devise: "EUR",
    objet: "Garantie locative pour bail commercial — 24 Rue de l'Avenir, Luxembourg",
    dateEmission: "01/06/2026", dateExpiration: "01/06/2029", status: "active",
    banqueCorrespondante: "N/A — emission directe",
    conditions: "3 mois de loyer, renouvelable tacitement",
  },
  {
    id: 4, clientId: 20, client: "François Martelly", reference: "GT-2026-004",
    type: "Lettre de Credit Documentaire", swiftType: "MT 700",
    beneficiaire: "Shanghai Import Export Corp.", montant: 750000, devise: "USD",
    objet: "LC documentaire pour importation de materiel industriel — Proforma SI-2026-312",
    dateEmission: "10/05/2026", dateExpiration: "10/08/2026", status: "expiree",
    banqueCorrespondante: "Bank of China, Shanghai",
    conditions: "Irrevocable, documents contre paiement, Incoterms CIF Antwerp",
  },
  {
    id: 5, clientId: 22, client: "Davin Mambouka", reference: "GT-2026-005",
    type: "Lettre de Blocage de Fonds (Proof of Funds)", swiftType: "MT 799",
    beneficiaire: "Notaire Jean-Pierre Muller", montant: 1200000, devise: "EUR",
    objet: "Attestation de fonds disponibles pour acquisition immobiliere",
    dateEmission: "20/06/2026", dateExpiration: "20/09/2026", status: "active",
    banqueCorrespondante: "N/A — emission directe",
    conditions: "Fonds bloques sur compte sequestre ref. CBL-SEQ-2026-045",
  },
  {
    id: 6, clientId: 22, client: "Davin Mambouka", reference: "GT-2026-006",
    type: "Garantie de Paiement", swiftType: "MT 760",
    beneficiaire: "EuroConstruct GmbH", montant: 350000, devise: "EUR",
    objet: "Garantie de paiement pour travaux de renovation — Devis EC-2026-891",
    dateEmission: "01/07/2026", dateExpiration: "01/01/2028", status: "active",
    banqueCorrespondante: "Commerzbank AG, Munich",
    conditions: "Irrevocable, paiement echelonne selon avancement des travaux",
  },
  {
    id: 7, clientId: 26, client: "Mohessou Francis — FINAF Conseils Investissement", reference: "GT-2026-007",
    type: "SBLC — Standby Letter of Credit", swiftType: "MT 760",
    beneficiaire: "FINAF Conseils Investissement — Gerant : Mohessou Francis", montant: 22000000, devise: "EUR",
    objet: "Garantie bancaire SBLC MT 760 irrevocable de EUR 22 000 000 emise par CaixaBank S.A. Luxembourg en faveur de FINAF Conseils Investissement pour couverture d'operations d'investissement et de conseil financier",
    dateEmission: "04/11/2026", dateExpiration: "04/11/2027", status: "active",
    banqueCorrespondante: "CaixaBank S.A., Luxembourg — SWIFT: CABORABB",
    conditions: "Irrevocable et inconditionnelle, payable a premiere demande conforme aux regles ISP98 (International Standby Practices) et UCP 600 de la CCI. Montant : EUR 22 000 000,00. Valable 12 mois avec renouvellement tacite.",
  },
]);

export function newGuaranteeId(): number {
  return nextId(GUARANTEES, 1);
}

export function newGuaranteeRef(): string {
  const year = new Date().getFullYear();
  const num = GUARANTEES.length + 1;
  return `GT-${year}-${String(num).padStart(3, "0")}`;
}
