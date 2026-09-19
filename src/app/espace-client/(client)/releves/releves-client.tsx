"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type AccountInfo = { id: number; label: string; iban: string; clientName?: string };
type Transaction = { date: string; description: string; amount: number };

function fmtAbs(n: number) {
  return Math.abs(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RelevesClient({
  accounts,
  transactionsByAccount,
  clientName,
}: {
  accounts: AccountInfo[];
  transactionsByAccount: Record<number, Transaction[]>;
  clientName: string;
}) {
  const [selectedAcctId, setSelectedAcctId] = useState(accounts[0]?.id ?? 0);
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const txs = transactionsByAccount[selectedAcctId] || [];
  const totalCredits = txs.filter((t) => t.amount >= 0).reduce((s, t) => s + t.amount, 0);
  const totalDebits = txs.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const selectedAcct = accounts.find((a) => a.id === selectedAcctId);

  const downloadPDF = () => {
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
    addInfo("Compte", selectedAcct?.label || "");
    addInfo("IBAN", selectedAcct?.iban || "");
    addInfo("Date", dateEdition);
    y += 5;

    const cols = { date: 20, desc: 52, debit: 135, credit: 168 };
    doc.setFillColor(240, 240, 245);
    doc.rect(15, y - 5, w - 30, 8, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Date", cols.date, y);
    doc.text("Description", cols.desc, y);
    doc.text("Debit (EUR)", cols.debit, y);
    doc.text("Credit (EUR)", cols.credit, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (const tx of txs) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setDrawColor(230, 230, 230);
      doc.line(15, y + 2, w - 15, y + 2);
      doc.setTextColor(60, 60, 60);
      doc.text(tx.date, cols.date, y);
      const desc = tx.description.length > 42 ? tx.description.slice(0, 40) + "..." : tx.description;
      doc.text(desc, cols.desc, y);
      if (tx.amount < 0) {
        doc.setTextColor(200, 30, 30);
        doc.text(fmtAbs(tx.amount), cols.debit, y);
      } else {
        doc.setTextColor(13, 138, 62);
        doc.text(fmtAbs(tx.amount), cols.credit, y);
      }
      y += 7;
    }

    if (txs.length === 0) {
      doc.setTextColor(150, 150, 150);
      doc.text("Aucune operation", w / 2, y + 10, { align: "center" });
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
    doc.text(`-${fmtAbs(Math.abs(totalDebits))} EUR`, 65, y);
    doc.setTextColor(80, 80, 80);
    doc.text("Total credits :", 110, y);
    doc.setTextColor(13, 138, 62);
    doc.text(`+${fmtAbs(totalCredits)} EUR`, 155, y);

    y += 15;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("CaixaBank Luxembourg S.A. — Etablissement de credit agree par la CSSF. Membre du FGDL.", w / 2, y, { align: "center" });
    doc.text(`Document genere le ${dateEdition}`, w / 2, y + 5, { align: "center" });

    doc.save(`Releve_${(selectedAcct?.label || "compte").replace(/\s/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
    notify("Releve PDF telecharge");
  };

  if (showDetail) {
    return (
      <div>
        {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowDetail(false)} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Releve — {selectedAcct?.label}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500">Compte</p><p className="font-medium text-gray-900 font-mono text-xs break-all">{selectedAcct?.iban}</p></div>
            <div><p className="text-gray-500">Total credits</p><p className="font-medium text-green-600">+{fmtAbs(totalCredits)} EUR</p></div>
            <div><p className="text-gray-500">Total debits</p><p className="font-medium text-red-600">-{fmtAbs(Math.abs(totalDebits))} EUR</p></div>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <button onClick={downloadPDF} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2v9M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Telecharger PDF
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Description</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Debit (EUR)</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Credit (EUR)</th>
            </tr></thead>
            <tbody>
              {txs.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3 text-gray-700">{tx.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">{tx.amount < 0 ? fmtAbs(tx.amount) : ""}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{tx.amount >= 0 ? fmtAbs(tx.amount) : ""}</td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">Aucune operation</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Releves de compte</h1>
          <p className="text-sm text-gray-500 mt-1">Consultez et telechargez vos releves</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
        <select
          value={selectedAcctId}
          onChange={(e) => setSelectedAcctId(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">{selectedAcct?.label}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><p className="text-gray-500">Total credits</p><p className="font-medium text-green-600">+{fmtAbs(totalCredits)} EUR</p></div>
          <div><p className="text-gray-500">Total debits</p><p className="font-medium text-red-600">-{fmtAbs(Math.abs(totalDebits))} EUR</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDetail(true)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Consulter</button>
          <button onClick={downloadPDF} className="flex-1 bg-[#003d82] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Telecharger PDF</button>
        </div>
      </div>
    </div>
  );
}
