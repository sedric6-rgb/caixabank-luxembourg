import { shared, nextId } from "@/lib/shared-store";

export interface Insurance {
  id: number;
  clientId: number;
  client: string;
  type: string;
  formule: string;
  prime: number;
  couverture: number;
  status: string;
  debut: string;
  echeance: string;
}

export const INSURANCES: Insurance[] = shared<Insurance>("insurances", () => [
  { id: 1, clientId: 19, client: "Cedric Carpentier", type: "Vie", formule: "Mixte", prime: 450, couverture: 500000, status: "active", debut: "01/03/2023", echeance: "01/03/2053" },
  { id: 2, clientId: 19, client: "Cedric Carpentier", type: "Habitation", formule: "Premium", prime: 145, couverture: 800000, status: "active", debut: "15/06/2025", echeance: "15/06/2027" },
  { id: 3, clientId: 20, client: "François Martelly", type: "Auto", formule: "Tous risques", prime: 180, couverture: 120000, status: "active", debut: "01/01/2026", echeance: "01/01/2027" },
  { id: 4, clientId: 20, client: "François Martelly", type: "Vie", formule: "Capital deces", prime: 320, couverture: 1000000, status: "active", debut: "10/04/2022", echeance: "10/04/2052" },
  { id: 5, clientId: 21, client: "Fritz Mambouka", type: "Vie", formule: "Epargne capitalisation", prime: 850, couverture: 2000000, status: "active", debut: "01/06/2022", echeance: "01/06/2052" },
  { id: 6, clientId: 21, client: "Fritz Mambouka", type: "Habitation", formule: "Premium", prime: 280, couverture: 1500000, status: "active", debut: "15/09/2025", echeance: "15/09/2027" },
  { id: 7, clientId: 21, client: "Fritz Mambouka", type: "Responsabilite civile", formule: "Etendue", prime: 95, couverture: 5000000, status: "active", debut: "01/01/2026", echeance: "01/01/2027" },
  { id: 8, clientId: 0, client: "Sophie Laurent", type: "Sante", formule: "Complementaire", prime: 210, couverture: 0, status: "active", debut: "01/02/2026", echeance: "01/02/2027" },
  { id: 9, clientId: 0, client: "Michel Weber", type: "Habitation", formule: "Confort", prime: 110, couverture: 450000, status: "en_attente", debut: "01/10/2026", echeance: "01/10/2027" },
  { id: 10, clientId: 0, client: "Elena Popov", type: "Voyage", formule: "Monde", prime: 55, couverture: 50000, status: "active", debut: "01/07/2026", echeance: "01/07/2027" },
]);

export function newInsuranceId(): number {
  return nextId(INSURANCES, 1);
}
