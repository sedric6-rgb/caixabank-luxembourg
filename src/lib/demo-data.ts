export interface DemoClient {
  id: number;
  client_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  id_type: string;
  id_number: string;
  status: string;
  created_at: string;
  accounts: DemoAccount[];
  cards: DemoCard[];
  transactions: DemoTx[];
}

export interface DemoAccount {
  label: string;
  number: string;
  balance: number;
  type: string;
}

export interface DemoCard {
  last4: string;
  type: string;
  status: string;
  expiry: string;
}

export interface DemoTx {
  date: string;
  desc: string;
  amount: number;
}

export const DEMO_CLIENTS: DemoClient[] = [
  {
    id: 1, client_number: "CBP-284751", first_name: "Jan", last_name: "Kowalski",
    email: "jan.kowalski@email.lu", phone: "+352 621 345 678", date_of_birth: "15/03/1985",
    address: "12 Av. de la Gare", city: "Luxembourg", postal_code: "1611", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "AXR 482916", status: "actif", created_at: "15/03/2022",
    accounts: [
      { label: "Compte Courant", number: "LU61 0019 1014 0000 0712 1981 2874", balance: 12847.53, type: "courant" },
      { label: "Livret Epargne", number: "LU27 0019 2004 0000 3002 0135 5387", balance: 45230.00, type: "epargne" },
      { label: "Compte Pro", number: "LU10 0019 0099 7603 1234 5678 9012", balance: 89415.22, type: "professionnel" },
    ],
    cards: [
      { last4: "4827", type: "Visa Gold", status: "Active", expiry: "09/2027" },
      { last4: "9153", type: "Visa Debit", status: "Active", expiry: "03/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Cactus", amount: -125.5 },
      { date: "15/09/2024", desc: "Entreprise ABC — Salaire", amount: 4500 },
      { date: "14/09/2024", desc: "Delhaize", amount: -42.3 },
      { date: "14/09/2024", desc: "Credit Immobilier CBL", amount: -1567.23 },
      { date: "13/09/2024", desc: "Fournisseur XYZ S.a r.l.", amount: -8500 },
      { date: "13/09/2024", desc: "Interets Livret Epargne", amount: 122.34 },
    ],
  },
  {
    id: 2, client_number: "CBP-384921", first_name: "Anna", last_name: "Nowak",
    email: "anna.nowak@email.lu", phone: "+352 691 234 567", date_of_birth: "08/11/1990",
    address: "45 Rue de Hollerich", city: "Luxembourg", postal_code: "1741", country: "Luxembourg",
    id_type: "Passeport", id_number: "EP 7823941", status: "actif", created_at: "22/07/2023",
    accounts: [
      { label: "Compte Courant", number: "LU83 0019 1026 0000 0422 0000 1234", balance: 5621.80, type: "courant" },
      { label: "Livret Epargne", number: "LU44 0019 2202 0000 0002 4447 5678", balance: 18750.00, type: "epargne" },
    ],
    cards: [
      { last4: "3341", type: "Visa Classic", status: "Active", expiry: "11/2026" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Auchan Kirchberg", amount: -87.40 },
      { date: "14/09/2024", desc: "Salaire — Societe ABC", amount: 3800 },
      { date: "13/09/2024", desc: "Loyer appartement", amount: -1450 },
      { date: "12/09/2024", desc: "Transfert epargne", amount: -500 },
    ],
  },
  {
    id: 3, client_number: "CBP-192847", first_name: "Piotr", last_name: "Wisniewski",
    email: "p.wisniewski@email.lu", phone: "+352 661 876 543", date_of_birth: "22/06/1978",
    address: "8 Bd Royal", city: "Luxembourg", postal_code: "2449", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "BKL 193847", status: "actif", created_at: "10/01/2023",
    accounts: [
      { label: "Compte Courant", number: "LU44 0019 2202 0000 0002 4447 1234", balance: 23105.44, type: "courant" },
      { label: "Compte Pro", number: "LU92 0019 6247 0000 0010 4319 8745", balance: 67890.00, type: "professionnel" },
    ],
    cards: [
      { last4: "7712", type: "Visa Gold", status: "Active", expiry: "06/2027" },
      { last4: "2289", type: "Visa Debit", status: "Active", expiry: "01/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement client Dupont", amount: 12500 },
      { date: "14/09/2024", desc: "Fournitures bureau", amount: -345.60 },
      { date: "13/09/2024", desc: "Assurance pro", amount: -890 },
      { date: "12/09/2024", desc: "Facture IT Services", amount: -2100 },
      { date: "11/09/2024", desc: "Reglement facture #4521", amount: 8400 },
    ],
  },
  {
    id: 4, client_number: "CBP-573921", first_name: "Katarzyna", last_name: "Wojcik",
    email: "k.wojcik@email.lu", phone: "+352 621 543 876", date_of_birth: "30/01/1995",
    address: "17 Rue de Bonnevoie", city: "Luxembourg", postal_code: "1260", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "CMP 582710", status: "en_attente", created_at: "01/09/2024",
    accounts: [
      { label: "Compte Courant", number: "LU15 0019 0076 0000 3310 0018 8523", balance: 0, type: "courant" },
    ],
    cards: [],
    transactions: [],
  },
  {
    id: 5, client_number: "CBP-847291", first_name: "Tomasz", last_name: "Kaminski",
    email: "t.kaminski@email.lu", phone: "+352 691 987 654", date_of_birth: "14/09/1982",
    address: "3 Rue du Fort Thungen", city: "Kirchberg", postal_code: "1499", country: "Luxembourg",
    id_type: "Passeport", id_number: "FH 4829103", status: "actif", created_at: "18/05/2023",
    accounts: [
      { label: "Compte Pro", number: "LU28 0019 4100 0000 5500 1234 5678", balance: 156420.10, type: "professionnel" },
      { label: "Compte Courant", number: "LU71 0019 1014 0000 8800 9876 5432", balance: 8340.25, type: "courant" },
    ],
    cards: [
      { last4: "6601", type: "Visa Platinum", status: "Active", expiry: "12/2027" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Paiement fournisseur Allemagne", amount: -24500 },
      { date: "14/09/2024", desc: "Encaissement facture #7832", amount: 18900 },
      { date: "13/09/2024", desc: "Charges sociales Q3", amount: -4200 },
      { date: "12/09/2024", desc: "TVA recuperee", amount: 3150 },
    ],
  },
  {
    id: 6, client_number: "CBP-629184", first_name: "Magdalena", last_name: "Lewandowska",
    email: "m.lewandowska@email.lu", phone: "+352 661 012 345", date_of_birth: "05/04/1988",
    address: "22 Av. Monterey", city: "Luxembourg", postal_code: "2163", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "DRX 749102", status: "bloque", created_at: "03/11/2022",
    accounts: [
      { label: "Compte Courant", number: "LU33 0019 1014 0000 6600 3333 4444", balance: 1245.67, type: "courant" },
      { label: "Livret Epargne", number: "LU55 0019 2004 0000 7700 5555 6666", balance: 32100.00, type: "epargne" },
    ],
    cards: [
      { last4: "8834", type: "Visa Classic", status: "Bloquee", expiry: "04/2026" },
    ],
    transactions: [
      { date: "03/11/2022", desc: "Blocage du compte — fraude suspectee", amount: 0 },
    ],
  },
  {
    id: 7, client_number: "CBP-418293", first_name: "Michal", last_name: "Zielinski",
    email: "m.zielinski@email.lu", phone: "+352 691 543 210", date_of_birth: "19/12/1993",
    address: "9 Rue de Strasbourg", city: "Luxembourg", postal_code: "2561", country: "Luxembourg",
    id_type: "Passeport", id_number: "GH 1029384", status: "actif", created_at: "27/04/2024",
    accounts: [
      { label: "Compte Courant", number: "LU77 0019 1014 0000 9900 7777 8888", balance: 4520.90, type: "courant" },
    ],
    cards: [
      { last4: "1199", type: "Visa Debit", status: "Active", expiry: "04/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — Banque XYZ", amount: 5200 },
      { date: "14/09/2024", desc: "Loyer", amount: -1600 },
      { date: "13/09/2024", desc: "Restaurant", amount: -65.40 },
    ],
  },
  {
    id: 8, client_number: "CBP-739182", first_name: "Agnieszka", last_name: "Szymanska",
    email: "a.szymanska@email.lu", phone: "+352 621 678 901", date_of_birth: "28/07/1986",
    address: "14 Rue de Merl", city: "Luxembourg", postal_code: "2146", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "EPQ 382019", status: "actif", created_at: "14/02/2023",
    accounts: [
      { label: "Compte Courant", number: "LU88 0019 1014 0000 1100 8888 9999", balance: 9876.45, type: "courant" },
      { label: "Livret Epargne", number: "LU99 0019 2004 0000 2200 9999 0000", balance: 54200.00, type: "epargne" },
    ],
    cards: [
      { last4: "5567", type: "Visa Gold", status: "Active", expiry: "02/2028" },
      { last4: "3398", type: "Visa Debit", status: "Active", expiry: "08/2027" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — Cabinet Avocat", amount: 6800 },
      { date: "14/09/2024", desc: "Assurance habitation", amount: -245 },
      { date: "13/09/2024", desc: "Courses Cactus", amount: -178.90 },
      { date: "12/09/2024", desc: "Transfert vers epargne", amount: -2000 },
      { date: "11/09/2024", desc: "Abonnement fitness", amount: -49.90 },
    ],
  },
];
