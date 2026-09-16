export function formatPrice(value: number, listingType?: "vente" | "location"): string {
  const formatted = new Intl.NumberFormat("fr-FR").format(Math.round(value));
  const suffix = listingType === "location" ? " FCFA / mois" : " FCFA";
  return `${formatted}${suffix}`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    date
  );
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, "");
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/** Compare une date (string ou Date, telle que renvoyee par MySQL) au jour present. */
export function isOverdue(value: string | Date): boolean {
  const date = typeof value === "string" ? new Date(value) : value;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return date.getTime() < startOfToday.getTime();
}
