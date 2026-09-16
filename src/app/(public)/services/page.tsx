import Link from "next/link";

const SERVICES = [
  {
    title: "Comptes bancaires",
    items: [
      { name: "Compte Courant", desc: "Votre compte du quotidien avec carte Visa incluse, virements SEPA illimités et appli mobile.", price: "0 EUR/mois" },
      { name: "Livret Épargne", desc: "Épargnez à votre rythme avec un taux attractif de 3,25% et des fonds disponibles à tout moment.", price: "Gratuit" },
      { name: "Compte Professionnel", desc: "Dédié aux entrepreneurs : encaissements, terminal de paiement, comptabilité intégrée.", price: "29 EUR/mois" },
      { name: "Compte Jeune", desc: "Pour les 16-25 ans : carte gratuite, cashback et appli dédiée.", price: "0 EUR/mois" },
    ],
  },
  {
    title: "Cartes bancaires",
    items: [
      { name: "Visa Débit", desc: "Paiements et retraits dans le monde entier, sans contact, Apple Pay et Google Pay.", price: "0 EUR/an" },
      { name: "Visa Classic", desc: "Assurances voyages incluses, plafonds relevés et service d'assistance 24/7.", price: "60 EUR/an" },
      { name: "Visa Gold", desc: "Carte premium avec conciergerie, assurances étendues et accès aux salons d'aéroport.", price: "180 EUR/an" },
      { name: "Visa Platinum", desc: "Notre carte la plus exclusive : plafonds élevés, services VIP et avantages partenaires.", price: "480 EUR/an" },
    ],
  },
  {
    title: "Crédits & Prêts",
    items: [
      { name: "Prêt Immobilier", desc: "Financez votre bien immobilier avec des taux compétitifs à partir de 3,45% TAEG.", price: "Dès 3,45%" },
      { name: "Crédit Consommation", desc: "Réalisez vos projets personnels avec un crédit flexible jusqu'à 100 000 EUR.", price: "Dès 5,80%" },
      { name: "Crédit Auto", desc: "Achetez votre véhicule neuf ou d'occasion avec un financement adapté.", price: "Dès 4,30%" },
      { name: "Crédit Étudiant", desc: "Financez vos études avec un taux préférentiel et un différé de remboursement.", price: "Dès 2,00%" },
    ],
  },
  {
    title: "Services digitaux",
    items: [
      { name: "Application mobile", desc: "Gérez vos comptes, effectuez des virements et suivez vos dépenses depuis votre smartphone.", price: "Gratuit" },
      { name: "Virements instantanés", desc: "Transférez de l'argent en temps réel, 24h/24 et 7j/7, en zone SEPA.", price: "0 EUR" },
      { name: "Apple Pay & Google Pay", desc: "Payez sans contact avec votre téléphone ou montre connectée.", price: "Inclus" },
      { name: "Notifications en temps réel", desc: "Recevez une alerte instantanée pour chaque opération sur votre compte.", price: "Inclus" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#001f42] to-[#003d82] text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Nos services bancaires</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Découvrez l&apos;ensemble de nos solutions pour particuliers et professionnels</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {SERVICES.map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.items.map((item) => (
                <div key={item.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-sm font-bold text-[#003d82] whitespace-nowrap ml-4">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center bg-blue-50 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Prêt à nous rejoindre ?</h2>
          <p className="text-gray-500 mb-6">Ouvrez votre compte en ligne en 10 minutes</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#003d82] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">
            Ouvrir un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
