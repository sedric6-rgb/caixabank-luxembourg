"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type AccountInfo = { id: number; label: string; iban: string };

const DOCUMENT_CATEGORIES = [
  { key: "releves", label: "Relevés de compte", icon: "doc", count: 12 },
  { key: "fiscaux", label: "Documents fiscaux", icon: "tax", count: 3 },
  { key: "certificats", label: "Certificats", icon: "cert", count: 2 },
  { key: "contrats", label: "Contrats", icon: "contract", count: 5 },
  { key: "correspondance", label: "Correspondance", icon: "mail", count: 4 },
];

const DEMO_DOCUMENTS: Record<string, { id: number; name: string; date: string; type: string; size: string }[]> = {
  releves: [
    { id: 1, name: "Relevé mensuel — Septembre 2026", date: "30/09/2026", type: "PDF", size: "245 Ko" },
    { id: 2, name: "Relevé mensuel — Août 2026", date: "31/08/2026", type: "PDF", size: "238 Ko" },
    { id: 3, name: "Relevé mensuel — Juillet 2026", date: "31/07/2026", type: "PDF", size: "242 Ko" },
    { id: 4, name: "Relevé mensuel — Juin 2026", date: "30/06/2026", type: "PDF", size: "235 Ko" },
    { id: 5, name: "Relevé mensuel — Mai 2026", date: "31/05/2026", type: "PDF", size: "240 Ko" },
    { id: 6, name: "Relevé mensuel — Avril 2026", date: "30/04/2026", type: "PDF", size: "231 Ko" },
  ],
  fiscaux: [
    { id: 10, name: "Attestation fiscale 2025", date: "15/02/2026", type: "PDF", size: "189 Ko" },
    { id: 11, name: "Relevé d'intérêts 2025", date: "31/01/2026", type: "PDF", size: "142 Ko" },
    { id: 12, name: "Attestation de résidence fiscale", date: "10/01/2026", type: "PDF", size: "95 Ko" },
  ],
  certificats: [
    { id: 20, name: "Attestation de solde", date: "15/09/2026", type: "PDF", size: "128 Ko" },
    { id: 21, name: "Certificat de non-gage", date: "01/09/2026", type: "PDF", size: "110 Ko" },
  ],
  contrats: [
    { id: 30, name: "Conditions générales — Compte courant", date: "15/03/2022", type: "PDF", size: "1.2 Mo" },
    { id: 31, name: "Convention de compte épargne", date: "15/03/2022", type: "PDF", size: "890 Ko" },
    { id: 32, name: "Contrat carte Visa", date: "15/03/2022", type: "PDF", size: "756 Ko" },
    { id: 33, name: "Mandat de prélèvement SEPA", date: "20/04/2022", type: "PDF", size: "234 Ko" },
    { id: 34, name: "Convention de services en ligne", date: "15/03/2022", type: "PDF", size: "445 Ko" },
  ],
  correspondance: [
    { id: 40, name: "Confirmation virement international", date: "13/09/2026", type: "PDF", size: "156 Ko" },
    { id: 41, name: "Avis d'opéré — Investissement", date: "01/09/2026", type: "PDF", size: "178 Ko" },
    { id: 42, name: "Notification de changement tarifaire", date: "10/08/2026", type: "PDF", size: "112 Ko" },
    { id: 43, name: "Confirmation ouverture compte pro", date: "15/03/2022", type: "PDF", size: "198 Ko" },
  ],
};

export default function DocumentsClient({
  clientName,
  accounts,
}: {
  clientName: string;
  accounts: AccountInfo[];
}) {
  const [activeCategory, setActiveCategory] = useState("releves");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ id: number; name: string; date: string; type: string; size: string }[]>([]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const docs = [...(DEMO_DOCUMENTS[activeCategory] || []), ...(activeCategory === "correspondance" ? uploadedFiles : [])];
  const filteredDocs = searchQuery
    ? docs.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : docs;

  const downloadDocument = (doc: { name: string }) => {
    const pdf = new jsPDF();
    const w = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(0, 31, 66);
    pdf.rect(0, 0, w, 40, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("CaixaBank Luxembourg S.A.", w / 2, 18, { align: "center" });
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Banque Privee — Coffre-fort numerique", w / 2, 28, { align: "center" });

    let y = 55;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(doc.name, 20, y);
    y += 12;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Titulaire : ${clientName}`, 20, y); y += 7;
    pdf.text(`Date : ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, 20, y); y += 12;

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(10);
    pdf.text("Ce document a ete genere depuis votre espace client CaixaBank Luxembourg.", 20, y); y += 7;
    pdf.text("Pour toute question, contactez votre conseiller.", 20, y); y += 20;

    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(7);
    pdf.text("CaixaBank Luxembourg S.A. — Etablissement de credit agree par la CSSF. Membre du FGDL.", w / 2, 280, { align: "center" });

    pdf.save(`${doc.name.replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "").replace(/\s+/g, "_")}.pdf`);
    notify("Document téléchargé");
  };

  const handleUpload = () => {
    setUploadedFiles((prev) => [...prev, {
      id: Date.now(),
      name: `Document personnel — ${new Date().toLocaleDateString("fr-FR")}`,
      date: new Date().toLocaleDateString("fr-FR"),
      type: "PDF",
      size: "125 Ko",
    }]);
    notify("Document ajouté au coffre-fort");
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Documents & Coffre-fort</h1>
          <p className="text-sm text-gray-500 mt-1">Consultez et téléchargez tous vos documents bancaires</p>
        </div>
        <button onClick={handleUpload} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 12V4M5 7l3-3 3 3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Ajouter un document
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {DOCUMENT_CATEGORIES.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.key ? "bg-[#003d82] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {cat.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.key ? "bg-white/20" : "bg-gray-100"}`}>{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un document..."
          className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="#dc2626" strokeWidth="1.5"/><path d="M12 2v4h4" stroke="#dc2626" strokeWidth="1.5"/><text x="6" y="15" fill="#dc2626" fontSize="5" fontWeight="bold">PDF</text></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.date} — {doc.size}</p>
                </div>
              </div>
              <button onClick={() => downloadDocument(doc)} className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 shrink-0 ml-2">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2v8M4 7l3 3 3-3M2 12h10"/></svg>
                  Télécharger
                </span>
              </button>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">Aucun document trouvé</div>
          )}
        </div>
      </div>

      {/* Digital vault info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="shrink-0 mt-0.5"><path d="M12 2a7 7 0 00-7 7v3H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a7 7 0 00-7-7zM8 9a4 4 0 118 0v3H8V9z" fill="#003d82" opacity="0.2"/><path d="M12 2a7 7 0 00-7 7v3H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a7 7 0 00-7-7zM8 9a4 4 0 118 0v3H8V9z" stroke="#003d82" strokeWidth="1.5"/></svg>
          <div>
            <h3 className="font-semibold text-gray-900">Coffre-fort numérique sécurisé</h3>
            <p className="text-sm text-gray-600 mt-1">Tous vos documents sont stockés de manière chiffrée et accessibles 24h/24. Vous pouvez y ajouter vos propres documents personnels.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
