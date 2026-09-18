"use server";

import { DEMO_CLIENTS } from "@/lib/demo-data";

export async function createClientAction(formData: FormData): Promise<{ success: boolean; clientNumber?: string; error?: string }> {
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const dob = String(formData.get("dob") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const postalCode = String(formData.get("postal_code") || "").trim();
  const country = String(formData.get("country") || "Luxembourg").trim();
  const idType = String(formData.get("id_type") || "carte_identite");
  const idNumber = String(formData.get("id_number") || "").trim();
  const accountType = String(formData.get("account_type") || "courant");
  const cardType = String(formData.get("card_type") || "visa_debit");
  const password = String(formData.get("password") || "").trim();

  if (!firstName || !lastName || !email || !phone || !dob || !address || !city || !postalCode || !idNumber || !password) {
    return { success: false, error: "Tous les champs obligatoires doivent etre remplis" };
  }

  if (password.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caracteres" };
  }

  const maxId = DEMO_CLIENTS.reduce((max, c) => Math.max(max, c.id), 0);
  const newId = maxId + 1;

  const clientNumber = `CBP-${String(100000 + Math.floor(Math.random() * 900000))}`;

  if (DEMO_CLIENTS.some((c) => c.client_number === clientNumber)) {
    return { success: false, error: "Erreur de generation du numero client, veuillez reessayer" };
  }

  const idTypeLabels: Record<string, string> = {
    carte_identite: "Carte d'identite",
    passeport: "Passeport",
    permis_conduire: "Permis de conduire",
  };

  const accountLabels: Record<string, string> = {
    courant: "Compte Courant",
    epargne: "Livret Epargne",
    professionnel: "Compte Professionnel",
    jeune: "Compte Jeune",
  };

  const cardTypeLabels: Record<string, string> = {
    visa_debit: "Visa Debit",
    visa_classic: "Visa Classic",
    visa_gold: "Visa Gold",
    visa_platinum: "Visa Platinum",
  };

  const dobFormatted = dob.split("-").reverse().join("/");

  const iban = `LU${String(10 + newId).padStart(2, "0")} 0019 ${String(1000 + newId).slice(-4)} 0000 ${String(newId).padStart(4, "0")} ${String(Date.now()).slice(-4)} ${String(Date.now()).slice(-8, -4)}`;

  const last4 = String(1000 + Math.floor(Math.random() * 9000));
  const expiryYear = new Date().getFullYear() + 4;
  const expiryMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  DEMO_CLIENTS.push({
    id: newId,
    client_number: clientNumber,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    date_of_birth: dobFormatted,
    address,
    city,
    postal_code: postalCode,
    country,
    id_type: idTypeLabels[idType] || idType,
    id_number: idNumber,
    status: "actif",
    created_at: new Date().toLocaleDateString("fr-FR"),
    accounts: [
      {
        label: accountLabels[accountType] || "Compte Courant",
        number: iban,
        balance: 0,
        type: accountType,
      },
    ],
    cards: [
      {
        last4,
        type: cardTypeLabels[cardType] || "Visa Debit",
        status: "Active",
        expiry: `${expiryMonth}/${expiryYear}`,
      },
    ],
    transactions: [],
  });

  return { success: true, clientNumber };
}
