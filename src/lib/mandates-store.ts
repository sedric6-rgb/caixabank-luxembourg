import { shared, nextId } from "@/lib/shared-store";

export type MandateStatus = "Actif" | "En attente" | "Suspendu" | "Termine";

export interface Mandate {
  id: number;
  creditor: string;
  debtor: string;
  rum: string;
  amount: number;
  frequency: string;
  nextDate: string;
  status: MandateStatus;
}

export const MANDATES: Mandate[] = shared<Mandate>("mandates", () => [
  { id: 1, creditor: "Enovos Luxembourg S.A.", debtor: "LU61...2874", rum: "MNDT-2026-001", amount: 189.50, frequency: "Mensuel", nextDate: "01/10/2026", status: "Actif" },
  { id: 2, creditor: "POST Luxembourg", debtor: "LU61...2874", rum: "MNDT-2026-002", amount: 54.90, frequency: "Mensuel", nextDate: "05/10/2026", status: "Actif" },
  { id: 3, creditor: "CCSS", debtor: "LU61...2874", rum: "MNDT-2026-003", amount: 1567.23, frequency: "Mensuel", nextDate: "01/10/2026", status: "Actif" },
  { id: 4, creditor: "Assurances Foyer", debtor: "LU61...2874", rum: "MNDT-2026-004", amount: 245.00, frequency: "Trimestriel", nextDate: "01/01/2027", status: "Actif" },
  { id: 5, creditor: "SES Water", debtor: "LU10...9012", rum: "MNDT-2026-005", amount: 78.30, frequency: "Bimestriel", nextDate: "01/11/2026", status: "Actif" },
  { id: 6, creditor: "Fitness First", debtor: "LU61...2874", rum: "MNDT-2026-006", amount: 49.90, frequency: "Mensuel", nextDate: "—", status: "Suspendu" },
  { id: 7, creditor: "Ancien bailleur", debtor: "LU61...2874", rum: "MNDT-2025-012", amount: 1200.00, frequency: "Mensuel", nextDate: "—", status: "Termine" },
  { id: 8, creditor: "Crèche Les Petits", debtor: "LU61...2874", rum: "MNDT-2026-007", amount: 890.00, frequency: "Mensuel", nextDate: "01/10/2026", status: "En attente" },
]);

export function newMandateId(): number {
  return nextId(MANDATES, 1);
}
