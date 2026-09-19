"use client";

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: number;
  balance_after: number;
  description: string;
  counterparty: string;
  executed_at: string;
}

interface AccountActionsProps {
  accountLabel: string;
  accountNumber: string;
  clientName: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export default function AccountActions({ accountLabel, accountNumber, clientName, balance, currency, transactions }: AccountActionsProps) {
  function downloadRIB() {
    const iban = accountNumber.replace(/\s/g, "");
    const formattedIBAN = accountNumber;
    const content = [
      "═══════════════════════════════════════════════════════════",
      "          RELEVE D'IDENTITE BANCAIRE (RIB)",
      "═══════════════════════════════════════════════════════════",
      "",
      "  Banque :      CaixaBank Luxembourg S.A.",
      "                Banque Privee",
      "",
      "  Adresse :     6 Av. de la Liberte",
      "                1930 Luxembourg-Gare",
      "                Grand-Duche de Luxembourg",
      "",
      "───────────────────────────────────────────────────────────",
      "",
      `  Titulaire :   ${clientName}`,
      `  Compte :      ${accountLabel}`,
      "",
      `  IBAN :        ${formattedIBAN}`,
      `  BIC/SWIFT :   CABORLULLUX`,
      "",
      "───────────────────────────────────────────────────────────",
      "",
      "  Etablissement de credit agree par la CSSF",
      "  (Commission de Surveillance du Secteur Financier)",
      "  Membre du Fonds de Garantie des Depots Luxembourg (FGDL)",
      "",
      `  Document genere le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
      "",
      "═══════════════════════════════════════════════════════════",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RIB_${iban.slice(-8)}_CaixaBank.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadReleve() {
    const rows = [
      "Date;Description;Debit (EUR);Credit (EUR);Solde apres (EUR)",
    ];
    for (const tx of transactions) {
      const date = new Date(tx.executed_at).toLocaleDateString("fr-FR");
      const debit = tx.type === "debit" ? tx.amount.toFixed(2) : "";
      const credit = tx.type === "credit" ? tx.amount.toFixed(2) : "";
      rows.push(`${date};${tx.description};${debit};${credit};${tx.balance_after.toFixed(2)}`);
    }

    const header = [
      `Releve de compte - ${accountLabel}`,
      `IBAN: ${accountNumber}`,
      `Titulaire: ${clientName}`,
      `Solde actuel: ${new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(balance)}`,
      `Date d'edition: ${new Date().toLocaleDateString("fr-FR")}`,
      "",
      "",
    ].join("\n");

    const csv = header + rows.join("\n");
    const BOM = "﻿";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Releve_${accountNumber.replace(/\s/g, "").slice(-8)}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-3">
      <button onClick={downloadRIB} className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors">
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v8M4 7l3 3 3-3M2 12h10"/></svg>
          Telecharger RIB
        </span>
      </button>
      <button onClick={downloadReleve} className="text-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v8M4 7l3 3 3-3M2 12h10"/></svg>
          Releve de compte
        </span>
      </button>
    </div>
  );
}
