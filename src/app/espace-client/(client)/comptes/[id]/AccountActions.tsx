"use client";

import jsPDF from "jspdf";

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

function fmtCurrency(n: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n);
}

export default function AccountActions({ accountLabel, accountNumber, clientName, balance, currency, transactions }: AccountActionsProps) {

  function downloadRIB() {
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();

    doc.setFillColor(0, 31, 66);
    doc.rect(0, 0, w, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CaixaBank Luxembourg S.A.", w / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Banque Privee", w / 2, 28, { align: "center" });

    doc.setFontSize(14);
    doc.text("Releve d'Identite Bancaire (RIB)", w / 2, 38, { align: "center" });

    let y = 60;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    const addField = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(label, 25, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value, 80, y);
      y += 10;
    };

    doc.setDrawColor(0, 61, 130);
    doc.setLineWidth(0.5);
    doc.line(20, 52, w - 20, 52);

    addField("Titulaire", clientName);
    addField("Compte", accountLabel);
    y += 5;
    addField("IBAN", accountNumber);
    addField("BIC / SWIFT", "CABORLULLUX");
    y += 5;

    doc.line(20, y, w - 20, y);
    y += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("Etablissement bancaire", 25, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.text("CaixaBank Luxembourg S.A. — Banque Privee", 25, y); y += 6;
    doc.text("6 Av. de la Liberte, 1930 Luxembourg-Gare", 25, y); y += 6;
    doc.text("Grand-Duche de Luxembourg", 25, y); y += 12;

    doc.text("Etablissement de credit agree par la CSSF", 25, y); y += 5;
    doc.text("(Commission de Surveillance du Secteur Financier)", 25, y); y += 5;
    doc.text("Membre du Fonds de Garantie des Depots Luxembourg (FGDL)", 25, y); y += 12;

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      `Document genere le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
      w / 2, y, { align: "center" }
    );

    doc.save(`RIB_${accountNumber.replace(/\s/g, "").slice(-8)}_CaixaBank.pdf`);
  }

  function downloadReleve() {
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();
    const dateEdition = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    doc.setFillColor(0, 31, 66);
    doc.rect(0, 0, w, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CaixaBank Luxembourg S.A.", w / 2, 18, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Banque Privee", w / 2, 26, { align: "center" });
    doc.setFontSize(12);
    doc.text("Releve de compte", w / 2, 35, { align: "center" });

    let y = 52;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const addInfo = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(value, 70, y);
      y += 7;
    };

    addInfo("Titulaire", clientName);
    addInfo("Compte", accountLabel);
    addInfo("IBAN", accountNumber);
    addInfo("Solde actuel", fmtCurrency(balance, currency));
    addInfo("Date", dateEdition);
    y += 5;

    // Table header
    const cols = { date: 20, desc: 52, debit: 130, credit: 158, solde: 178 };
    doc.setFillColor(240, 240, 245);
    doc.rect(15, y - 5, w - 30, 8, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Date", cols.date, y);
    doc.text("Description", cols.desc, y);
    doc.text("Debit", cols.debit, y);
    doc.text("Credit", cols.credit, y);
    doc.text("Solde", cols.solde, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    let totalDebits = 0;
    let totalCredits = 0;

    for (const tx of transactions) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const date = new Date(tx.executed_at).toLocaleDateString("fr-FR");
      const desc = tx.description.length > 40 ? tx.description.slice(0, 38) + "..." : tx.description;

      doc.setDrawColor(230, 230, 230);
      doc.line(15, y + 2, w - 15, y + 2);

      doc.setTextColor(60, 60, 60);
      doc.text(date, cols.date, y);
      doc.text(desc, cols.desc, y);

      if (tx.type === "debit") {
        doc.setTextColor(200, 30, 30);
        doc.text(`-${fmtCurrency(tx.amount)}`, cols.debit, y);
        totalDebits += tx.amount;
      } else {
        doc.setTextColor(13, 138, 62);
        doc.text(`+${fmtCurrency(tx.amount)}`, cols.credit, y);
        totalCredits += tx.amount;
      }

      doc.setTextColor(60, 60, 60);
      doc.text(fmtCurrency(tx.balance_after), cols.solde, y);
      y += 7;
    }

    if (transactions.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.text("Aucune operation sur cette periode", w / 2, y + 10, { align: "center" });
      y += 20;
    }

    y += 5;
    if (y > 260) { doc.addPage(); y = 20; }

    doc.setDrawColor(0, 61, 130);
    doc.setLineWidth(0.5);
    doc.line(15, y, w - 15, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Total debits :", 20, y);
    doc.setTextColor(200, 30, 30);
    doc.text(`-${fmtCurrency(totalDebits)}`, 70, y);

    doc.setTextColor(80, 80, 80);
    doc.text("Total credits :", 110, y);
    doc.setTextColor(13, 138, 62);
    doc.text(`+${fmtCurrency(totalCredits)}`, 155, y);

    y += 15;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("CaixaBank Luxembourg S.A. — Etablissement de credit agree par la CSSF. Membre du FGDL.", w / 2, y, { align: "center" });
    doc.text(`Document genere le ${dateEdition}`, w / 2, y + 5, { align: "center" });

    doc.save(`Releve_${accountNumber.replace(/\s/g, "").slice(-8)}_${new Date().toISOString().slice(0, 10)}.pdf`);
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
