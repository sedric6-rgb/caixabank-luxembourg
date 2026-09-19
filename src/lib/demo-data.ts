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
  password?: string;
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
  {
    id: 9, client_number: "CBP-512847", first_name: "Marie", last_name: "Dupont",
    email: "m.dupont@email.lu", phone: "+352 621 111 222", date_of_birth: "12/05/1991",
    address: "6 Rue de Clausen", city: "Luxembourg", postal_code: "1342", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "FRX 291048", status: "actif", created_at: "08/06/2023",
    accounts: [
      { label: "Compte Courant", number: "LU12 0019 1014 0000 5500 1111 2222", balance: 7823.15, type: "courant" },
      { label: "Livret Epargne", number: "LU34 0019 2004 0000 6600 3333 4444", balance: 28500.00, type: "epargne" },
    ],
    cards: [
      { last4: "4412", type: "Visa Classic", status: "Active", expiry: "06/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — Ministere des Finances", amount: 5400 },
      { date: "14/09/2024", desc: "Monoprix", amount: -96.30 },
      { date: "13/09/2024", desc: "Loyer appartement", amount: -1350 },
      { date: "12/09/2024", desc: "EDF Electricite", amount: -127.50 },
    ],
  },
  {
    id: 10, client_number: "CBP-683192", first_name: "Carlos", last_name: "Ferreira",
    email: "c.ferreira@email.lu", phone: "+352 691 333 444", date_of_birth: "03/10/1979",
    address: "28 Rue de Beggen", city: "Luxembourg", postal_code: "1221", country: "Luxembourg",
    id_type: "Passeport", id_number: "PT 8472910", status: "actif", created_at: "19/11/2022",
    accounts: [
      { label: "Compte Courant", number: "LU56 0019 1014 0000 7700 5555 6666", balance: 15340.88, type: "courant" },
      { label: "Compte Pro", number: "LU78 0019 0099 0000 8800 7777 8888", balance: 112750.00, type: "professionnel" },
      { label: "Livret Epargne", number: "LU90 0019 2004 0000 9900 9999 0000", balance: 67800.00, type: "epargne" },
    ],
    cards: [
      { last4: "7723", type: "Visa Platinum", status: "Active", expiry: "11/2027" },
      { last4: "1156", type: "Visa Debit", status: "Active", expiry: "05/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Paiement client — Projet Europa", amount: 28000 },
      { date: "14/09/2024", desc: "Fournitures informatiques", amount: -1890 },
      { date: "13/09/2024", desc: "Restaurant Le Bouquet", amount: -142.50 },
      { date: "12/09/2024", desc: "Assurance vehicule", amount: -380 },
      { date: "11/09/2024", desc: "Cotisations sociales", amount: -2450 },
    ],
  },
  {
    id: 11, client_number: "CBP-294718", first_name: "Sophie", last_name: "Martin",
    email: "s.martin@email.lu", phone: "+352 661 555 666", date_of_birth: "25/08/1994",
    address: "11 Av. de la Liberte", city: "Luxembourg", postal_code: "1931", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "GKL 582039", status: "actif", created_at: "02/03/2024",
    accounts: [
      { label: "Compte Courant", number: "LU23 0019 1014 0000 1100 2222 3333", balance: 3245.70, type: "courant" },
    ],
    cards: [
      { last4: "9934", type: "Visa Debit", status: "Active", expiry: "03/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — Deloitte Luxembourg", amount: 4200 },
      { date: "14/09/2024", desc: "Zara", amount: -189.90 },
      { date: "13/09/2024", desc: "Spotify Premium", amount: -9.99 },
      { date: "12/09/2024", desc: "Pharmacie", amount: -34.50 },
    ],
  },
  {
    id: 12, client_number: "CBP-847362", first_name: "Ahmed", last_name: "Benali",
    email: "a.benali@email.lu", phone: "+352 621 777 888", date_of_birth: "17/02/1983",
    address: "5 Rue de Gasperich", city: "Luxembourg", postal_code: "1617", country: "Luxembourg",
    id_type: "Passeport", id_number: "DZ 3928471", status: "actif", created_at: "25/09/2023",
    accounts: [
      { label: "Compte Courant", number: "LU45 0019 1014 0000 4400 5555 6666", balance: 11290.33, type: "courant" },
      { label: "Livret Epargne", number: "LU67 0019 2004 0000 5500 7777 8888", balance: 41000.00, type: "epargne" },
    ],
    cards: [
      { last4: "2278", type: "Visa Gold", status: "Active", expiry: "09/2027" },
      { last4: "6643", type: "Visa Debit", status: "Active", expiry: "01/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — ArcelorMittal", amount: 5800 },
      { date: "14/09/2024", desc: "Auchan Cloche d'Or", amount: -215.40 },
      { date: "13/09/2024", desc: "Assurance vie", amount: -320 },
      { date: "12/09/2024", desc: "Virement famille", amount: -800 },
      { date: "11/09/2024", desc: "Parking LuxExpo", amount: -12 },
    ],
  },
  {
    id: 13, client_number: "CBP-193628", first_name: "Elena", last_name: "Rodrigues",
    email: "e.rodrigues@email.lu", phone: "+352 691 999 000", date_of_birth: "09/12/1987",
    address: "33 Rue de Limpertsberg", city: "Luxembourg", postal_code: "1940", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "HMN 472910", status: "en_attente", created_at: "10/09/2024",
    accounts: [
      { label: "Compte Courant", number: "LU89 0019 1014 0000 6600 8888 9999", balance: 0, type: "courant" },
    ],
    cards: [],
    transactions: [],
  },
  {
    id: 14, client_number: "CBP-562941", first_name: "Jean-Pierre", last_name: "Schmit",
    email: "jp.schmit@email.lu", phone: "+352 661 222 333", date_of_birth: "01/06/1972",
    address: "19 Rue de Eich", city: "Luxembourg", postal_code: "1461", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "JRX 839201", status: "actif", created_at: "07/08/2022",
    accounts: [
      { label: "Compte Courant", number: "LU11 0019 1014 0000 7700 1111 2222", balance: 28940.67, type: "courant" },
      { label: "Livret Epargne", number: "LU22 0019 2004 0000 8800 3333 4444", balance: 95000.00, type: "epargne" },
      { label: "Compte Pro", number: "LU33 0019 0099 0000 9900 5555 6666", balance: 245100.50, type: "professionnel" },
    ],
    cards: [
      { last4: "8891", type: "Visa Platinum", status: "Active", expiry: "08/2027" },
      { last4: "4420", type: "Visa Gold", status: "Active", expiry: "12/2028" },
      { last4: "7756", type: "Visa Debit", status: "Active", expiry: "06/2027" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Encaissement loyers immobiliers", amount: 8500 },
      { date: "14/09/2024", desc: "Notaire — acte vente", amount: -12400 },
      { date: "13/09/2024", desc: "Taxe fonciere", amount: -1870 },
      { date: "12/09/2024", desc: "Dividendes SCI Schmit", amount: 15000 },
      { date: "11/09/2024", desc: "Entretien immeubles", amount: -3200 },
      { date: "10/09/2024", desc: "Credit immobilier mensualite", amount: -4567.89 },
    ],
  },
  {
    id: 15, client_number: "CBP-738291", first_name: "Fatima", last_name: "El Amrani",
    email: "f.elamrani@email.lu", phone: "+352 621 444 555", date_of_birth: "20/03/1990",
    address: "7 Rue de Hamm", city: "Luxembourg", postal_code: "1713", country: "Luxembourg",
    id_type: "Passeport", id_number: "MA 5829301", status: "actif", created_at: "16/01/2024",
    accounts: [
      { label: "Compte Courant", number: "LU44 0019 1014 0000 2200 4444 5555", balance: 6150.20, type: "courant" },
      { label: "Livret Epargne", number: "LU55 0019 2004 0000 3300 6666 7777", balance: 19800.00, type: "epargne" },
    ],
    cards: [
      { last4: "3367", type: "Visa Classic", status: "Active", expiry: "01/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — PWC Luxembourg", amount: 4800 },
      { date: "14/09/2024", desc: "Delhaize Kirchberg", amount: -134.70 },
      { date: "13/09/2024", desc: "Abonnement transport CFL", amount: -75 },
      { date: "12/09/2024", desc: "Western Union — virement", amount: -500 },
    ],
  },
  {
    id: 16, client_number: "CBP-461829", first_name: "Marco", last_name: "Rossi",
    email: "m.rossi@email.lu", phone: "+352 691 666 777", date_of_birth: "14/11/1981",
    address: "25 Bd de la Petrusse", city: "Luxembourg", postal_code: "2320", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "KPQ 192847", status: "bloque", created_at: "12/04/2023",
    accounts: [
      { label: "Compte Courant", number: "LU66 0019 1014 0000 8800 6666 7777", balance: 890.45, type: "courant" },
      { label: "Compte Pro", number: "LU77 0019 0099 0000 9900 8888 9999", balance: 4200.00, type: "professionnel" },
    ],
    cards: [
      { last4: "5501", type: "Visa Gold", status: "Bloquee", expiry: "04/2027" },
    ],
    transactions: [
      { date: "12/04/2023", desc: "Blocage du compte — verification en cours", amount: 0 },
    ],
  },
  {
    id: 17, client_number: "CBP-829461", first_name: "Nadia", last_name: "Petrova",
    email: "n.petrova@email.lu", phone: "+352 661 888 999", date_of_birth: "06/09/1996",
    address: "2 Rue de Neudorf", city: "Luxembourg", postal_code: "2221", country: "Luxembourg",
    id_type: "Passeport", id_number: "RU 7382910", status: "actif", created_at: "30/05/2024",
    accounts: [
      { label: "Compte Courant", number: "LU88 0019 1014 0000 3300 8888 9999", balance: 2780.90, type: "courant" },
    ],
    cards: [
      { last4: "1178", type: "Visa Debit", status: "Active", expiry: "05/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Salaire — Amazon Luxembourg", amount: 3900 },
      { date: "14/09/2024", desc: "IKEA Arlon", amount: -567.80 },
      { date: "13/09/2024", desc: "Netflix", amount: -15.49 },
      { date: "12/09/2024", desc: "Uber", amount: -23.40 },
    ],
  },
  {
    id: 18, client_number: "CBP-374829", first_name: "David", last_name: "Muller",
    email: "d.muller@email.lu", phone: "+352 621 010 020", date_of_birth: "28/01/1975",
    address: "40 Rue de Cents", city: "Luxembourg", postal_code: "1319", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "LMN 482910", status: "actif", created_at: "23/12/2022",
    accounts: [
      { label: "Compte Courant", number: "LU99 0019 1014 0000 4400 9999 0000", balance: 19540.12, type: "courant" },
      { label: "Livret Epargne", number: "LU10 0019 2004 0000 5500 1111 2222", balance: 82000.00, type: "epargne" },
      { label: "Compte Pro", number: "LU21 0019 0099 0000 6600 3333 4444", balance: 178300.75, type: "professionnel" },
    ],
    cards: [
      { last4: "9902", type: "Visa Platinum", status: "Active", expiry: "12/2027" },
      { last4: "3345", type: "Visa Gold", status: "Active", expiry: "07/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement client — Consulting Q3", amount: 22000 },
      { date: "14/09/2024", desc: "Leasing Mercedes", amount: -890 },
      { date: "13/09/2024", desc: "Restaurant Clairefontaine", amount: -285 },
      { date: "12/09/2024", desc: "Expert comptable", amount: -1500 },
      { date: "11/09/2024", desc: "Charges bureau Kirchberg", amount: -2100 },
      { date: "10/09/2024", desc: "Salaire employe", amount: -4200 },
    ],
  },
  {
    id: 19, client_number: "CBP-437211", first_name: "Cedric", last_name: "Carpentier",
    email: "c.carpentier@email.lu", phone: "+352 621 850 912", date_of_birth: "22/04/1988",
    address: "15 Av. John F. Kennedy", city: "Luxembourg", postal_code: "1855", country: "Luxembourg",
    id_type: "Carte d'identite", id_number: "NRX 583920", status: "actif", created_at: "05/01/2023",
    password: "France24",
    accounts: [
      { label: "Compte Courant", number: "LU42 0019 1014 0000 1900 4371 2110", balance: 670000.00, type: "courant" },
    ],
    cards: [
      { last4: "8210", type: "Visa Platinum", status: "Active", expiry: "01/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement entrant — Investissements", amount: 45000 },
      { date: "14/09/2024", desc: "Assurance premium", amount: -1200 },
      { date: "13/09/2024", desc: "Virement sortant", amount: -8500 },
    ],
  },
  {
    id: 20, client_number: "CBP-592184", first_name: "François", last_name: "Martelly",
    email: "f.martelly@email.lu", phone: "+352 691 740 318", date_of_birth: "11/07/1976",
    address: "38 Bd Royal", city: "Luxembourg", postal_code: "2449", country: "Luxembourg",
    id_type: "Passeport", id_number: "HT 9281034", status: "actif", created_at: "18/06/2022",
    password: "France24",
    accounts: [
      { label: "Compte Courant", number: "LU53 0019 1014 0000 2000 5921 8400", balance: 867000.00, type: "courant" },
    ],
    cards: [
      { last4: "6347", type: "Visa Platinum", status: "Active", expiry: "06/2028" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement entrant — Dividendes", amount: 72000 },
      { date: "14/09/2024", desc: "Gestion patrimoine", amount: -3500 },
      { date: "13/09/2024", desc: "Virement international", amount: -15000 },
    ],
  },
  {
    id: 21, client_number: "CBP-918274", first_name: "Fritz", last_name: "Mambouka",
    email: "f.mambouka@email.lu", phone: "+352 621 930 471", date_of_birth: "08/03/1980",
    address: "51 Av. de la Porte-Neuve", city: "Luxembourg", postal_code: "2227", country: "Luxembourg",
    id_type: "Passeport", id_number: "CG 4829103", status: "actif", created_at: "12/02/2022",
    password: "Azerty31@",
    accounts: [
      { label: "Compte Courant", number: "LU62 0019 1014 0000 2100 9182 7400", balance: 1233000.00, type: "courant" },
      { label: "Livret Epargne", number: "LU73 0019 2004 0000 2100 8273 6500", balance: 450000.00, type: "epargne" },
      { label: "Compte Pro", number: "LU84 0019 0099 0000 2100 7364 5600", balance: 875000.00, type: "professionnel" },
    ],
    cards: [
      { last4: "9012", type: "Visa Platinum", status: "Active", expiry: "02/2029" },
      { last4: "4567", type: "Visa Gold", status: "Active", expiry: "08/2028" },
      { last4: "7834", type: "Visa Infinite", status: "Active", expiry: "11/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement entrant — Holdings International", amount: 185000 },
      { date: "14/09/2024", desc: "Acquisition immobiliere — Kirchberg", amount: -320000 },
      { date: "13/09/2024", desc: "Dividendes portefeuille", amount: 42000 },
      { date: "12/09/2024", desc: "Gestion patrimoine premium", amount: -5800 },
      { date: "11/09/2024", desc: "Assurance vie capitalisation", amount: -12000 },
      { date: "10/09/2024", desc: "Virement entrant — Societe FM Consulting", amount: 95000 },
    ],
  },
  {
    id: 22, client_number: "CBP-641823", first_name: "Andre Claude Davin", last_name: "Obame",
    email: "acd.obame@email.lu", phone: "+352 621 472 839", date_of_birth: "16/08/1984",
    address: "21 Av. Monterey", city: "Luxembourg", postal_code: "2163", country: "Luxembourg",
    id_type: "Passeport", id_number: "GA 7391028", status: "actif", created_at: "03/04/2023",
    password: "France24",
    accounts: [
      { label: "Compte Courant", number: "LU95 0019 1014 0000 2200 6418 2300", balance: 225000.00, type: "courant" },
    ],
    cards: [
      { last4: "5219", type: "Visa Platinum", status: "Active", expiry: "04/2029" },
    ],
    transactions: [
      { date: "15/09/2024", desc: "Virement entrant — Investissements ACD", amount: 35000 },
      { date: "14/09/2024", desc: "Gestion de patrimoine", amount: -2800 },
      { date: "13/09/2024", desc: "Virement sortant — Immobilier", amount: -18000 },
      { date: "12/09/2024", desc: "Dividendes portefeuille", amount: 12500 },
      { date: "11/09/2024", desc: "Assurance vie", amount: -950 },
    ],
  },
];
