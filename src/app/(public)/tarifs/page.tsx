export default function TarifsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#001f42] to-[#003d82] text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Tarifs et conditions</h1>
          <p className="text-blue-200 text-lg">Transparence totale sur nos frais bancaires</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        <Table title="Tarifs des comptes" headers={["Type de compte", "Frais mensuels", "Carte incluse", "Virements SEPA"]} rows={[
          ["Compte Courant", "0 EUR", "Visa Débit", "Illimités gratuits"],
          ["Livret Épargne", "0 EUR", "—", "—"],
          ["Compte Professionnel", "29 EUR", "Visa Classic", "50 gratuits/mois"],
          ["Compte Jeune (16-25 ans)", "0 EUR", "Visa Débit", "Illimités gratuits"],
        ]} />

        <Table title="Tarifs des cartes" headers={["Type de carte", "Cotisation annuelle", "Plafond retrait/mois", "Plafond paiement/mois"]} rows={[
          ["Visa Débit", "0 EUR", "2 000 EUR", "5 000 EUR"],
          ["Visa Classic", "60 EUR", "3 000 EUR", "10 000 EUR"],
          ["Visa Gold", "180 EUR", "5 000 EUR", "20 000 EUR"],
          ["Visa Platinum", "480 EUR", "10 000 EUR", "50 000 EUR"],
        ]} />

        <Table title="Tarifs des opérations" headers={["Opération", "Tarif"]} rows={[
          ["Virement SEPA (en ligne)", "Gratuit"],
          ["Virement SEPA (en agence)", "5 EUR"],
          ["Virement instantané", "Gratuit"],
          ["Virement international", "25 EUR"],
          ["Prélèvement automatique", "Gratuit"],
          ["Retrait DAB CaixaBank", "Gratuit"],
          ["Retrait DAB autre réseau", "5 EUR"],
          ["Retrait à l'étranger", "2% (min. 10 EUR)"],
        ]} />

        <Table title="Taux d'intérêt" headers={["Produit", "Taux"]} rows={[
          ["Livret Épargne", "3,25% brut annuel"],
          ["Prêt immobilier", "À partir de 3,45% TAEG"],
          ["Crédit consommation", "À partir de 5,80% TAEG"],
          ["Crédit auto", "À partir de 4,30% TAEG"],
          ["Crédit étudiant", "À partir de 2,00% TAEG"],
          ["Découvert autorisé", "7,50% TAEG"],
        ]} />

        <p className="text-xs text-gray-400 text-center max-w-2xl mx-auto">
          Les taux et tarifs indiqués sont valables au 1er septembre 2024 et susceptibles de modification. Consultez nos conditions générales pour plus de détails. CaixaBank Luxembourg S.A. est un établissement de crédit agréé par la CSSF.
        </p>
      </div>
    </div>
  );
}

function Table({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {headers.map((h) => <th key={h} className="text-left px-6 py-3 font-medium text-gray-500">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className={`px-6 py-3 ${j === 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
