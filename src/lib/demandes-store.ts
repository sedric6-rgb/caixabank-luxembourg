export type DemandeType =
  | "carte"
  | "chequier"
  | "plafond"
  | "compte_epargne"
  | "opposition"
  | "autre";

export type DemandeStatus = "en_attente" | "en_cours" | "validee" | "refusee";

export interface Demande {
  id: number;
  clientId: number;
  clientName: string;
  clientNumber: string;
  type: DemandeType;
  label: string;
  details: string;
  status: DemandeStatus;
  createdAt: string;
  updatedAt: string;
}

const TYPE_LABELS: Record<DemandeType, string> = {
  carte: "Commande de carte",
  chequier: "Commande de chequier",
  plafond: "Augmentation de plafond",
  compte_epargne: "Ouverture compte epargne",
  opposition: "Opposition carte",
  autre: "Autre demande",
};

export function getTypeLabel(type: DemandeType): string {
  return TYPE_LABELS[type] || type;
}

export const DEMANDES: Demande[] = [
  {
    id: 1, clientId: 1, clientName: "Jan Kowalski", clientNumber: "CBP-284751",
    type: "plafond", label: "Augmentation plafond Visa Gold",
    details: "Demande d'augmentation du plafond mensuel de 10 000 EUR a 15 000 EUR pour la carte Visa Gold **** 4827",
    status: "en_attente", createdAt: "15/09/2024", updatedAt: "15/09/2024",
  },
  {
    id: 2, clientId: 21, clientName: "Fritz Mambouka", clientNumber: "CBP-918274",
    type: "carte", label: "Commande Visa Business",
    details: "Demande de carte Visa Business pour le compte professionnel",
    status: "validee", createdAt: "10/09/2024", updatedAt: "12/09/2024",
  },
];

let nextId = 3;

export function addDemande(d: Omit<Demande, "id" | "createdAt" | "updatedAt" | "status">): Demande {
  const now = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const demande: Demande = {
    ...d,
    id: nextId++,
    status: "en_attente",
    createdAt: now,
    updatedAt: now,
  };
  DEMANDES.unshift(demande);
  return demande;
}

export function updateDemandeStatus(id: number, status: DemandeStatus): void {
  const d = DEMANDES.find((x) => x.id === id);
  if (d) {
    d.status = status;
    d.updatedAt = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
}

export function getDemandesByClient(clientId: number): Demande[] {
  return DEMANDES.filter((d) => d.clientId === clientId);
}

export function getAllDemandes(): Demande[] {
  return DEMANDES;
}
