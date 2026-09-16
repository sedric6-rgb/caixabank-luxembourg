const BRANCHES = [
  { city: "Luxembourg-Gare", address: "6 Av. de la Liberté, 1930 Luxembourg", phone: "+352 26 00 00 00", hours: "Lun-Ven 8h-18h, Sam 9h-13h", hq: true },
  { city: "Kirchberg", address: "2 Rue Edward Steichen, 2540 Luxembourg", phone: "+352 26 00 00 10", hours: "Lun-Ven 8h30-17h30", hq: false },
  { city: "Esch-sur-Alzette", address: "28 Rue de l'Alzette, 4010 Esch-sur-Alzette", phone: "+352 26 00 00 20", hours: "Lun-Ven 9h-17h", hq: false },
  { city: "Ettelbruck", address: "15 Grand-Rue, 9050 Ettelbruck", phone: "+352 26 00 00 30", hours: "Lun-Ven 8h30-17h30", hq: false },
];

export default function AgencesPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-[#001f42] to-[#003d82] text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Nos agences</h1>
          <p className="text-blue-200 text-lg">Retrouvez-nous dans les principales villes du Luxembourg</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRANCHES.map((branch) => (
            <div key={branch.city} className={`bg-white rounded-xl border p-6 ${branch.hq ? "border-blue-300 ring-1 ring-blue-100" : "border-gray-200"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{branch.city}</h2>
                    {branch.hq && <span className="text-xs text-blue-600 font-medium">Siège social</span>}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="mt-0.5 shrink-0"><path d="M8 14s-5-4.27-5-7.2a5 5 0 0110 0C13 9.73 8 14 8 14z" stroke="#6b7280" strokeWidth="1.2"/><circle cx="8" cy="6.8" r="1.5" stroke="#6b7280" strokeWidth="1.2"/></svg>
                  <span className="text-gray-600">{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="shrink-0"><path d="M2.5 4a1.5 1.5 0 011.5-1.5h1.7a.8.8 0 01.76.55l.9 2.7a.8.8 0 01-.37.9l-1.1.66a8 8 0 003.68 3.68l.66-1.1a.8.8 0 01.9-.37l2.7.9a.8.8 0 01.55.76V13a1.5 1.5 0 01-1.5 1.5A11.5 11.5 0 012.5 4z" stroke="#6b7280" strokeWidth="1.2"/></svg>
                  <span className="text-gray-600">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="shrink-0"><circle cx="8" cy="8" r="6" stroke="#6b7280" strokeWidth="1.2"/><path d="M8 4v4l3 1.5" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <span className="text-gray-600">{branch.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8">
          <h3 className="font-bold text-gray-900 mb-2">Besoin d&apos;un rendez-vous ?</h3>
          <p className="text-sm text-gray-500 mb-4">Prenez rendez-vous en ligne avec un conseiller dans l&apos;agence de votre choix</p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-[#003d82] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">
            Prendre rendez-vous
          </a>
        </div>
      </div>
    </div>
  );
}
