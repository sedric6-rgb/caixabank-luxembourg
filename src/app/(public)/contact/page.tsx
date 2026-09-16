export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#001f42] to-[#003d82] text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-blue-200 text-lg">Notre équipe est à votre disposition</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" placeholder="+352 ..." className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Information générale</option>
                  <option>Ouverture de compte</option>
                  <option>Demande de crédit</option>
                  <option>Problème technique</option>
                  <option>Réclamation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={5} required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="bg-[#003d82] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">Envoyer</button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
              <div className="space-y-4">
                <ContactInfo icon="phone" label="Téléphone" value="+352 26 00 00 00" sub="Lun-Ven 8h-20h, Sam 9h-14h" />
                <ContactInfo icon="mail" label="Email" value="contact@caixabank.lu" />
                <ContactInfo icon="location" label="Siège social" value="6 Av. de la Liberté" sub="1930 Luxembourg-Gare, Luxembourg" />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Service d&apos;urgence carte</h3>
              <p className="text-sm text-gray-600 mb-3">Carte perdue ou volée ? Appelez immédiatement :</p>
              <p className="text-lg font-bold text-[#003d82]">+352 26 00 00 01</p>
              <p className="text-xs text-gray-500 mt-1">Disponible 24h/24, 7j/7</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Horaires d&apos;ouverture</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Lundi - Vendredi</span><span className="font-medium text-gray-900">8h00 - 20h00</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Samedi</span><span className="font-medium text-gray-900">9h00 - 14h00</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Dimanche</span><span className="font-medium text-gray-500">Fermé</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
        {icon === "phone" && <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.2 3.6a1 1 0 01-.46 1.133l-1.4.84a10 10 0 004.6 4.6l.84-1.4a1 1 0 011.133-.46l3.6 1.2A1 1 0 0117 14.72V17a2 2 0 01-2 2A14 14 0 013 5z" stroke="#003d82" strokeWidth="1.5"/></svg>}
        {icon === "mail" && <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2" stroke="#003d82" strokeWidth="1.5"/><path d="M3 6l7 5 7-5" stroke="#003d82" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
        {icon === "location" && <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 18s-6-5.34-6-9a6 6 0 1112 0c0 3.66-6 9-6 9z" stroke="#003d82" strokeWidth="1.5"/><circle cx="10" cy="9" r="2" stroke="#003d82" strokeWidth="1.5"/></svg>}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}
