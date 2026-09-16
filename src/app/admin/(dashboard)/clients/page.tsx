import Link from "next/link";

const DEMO_CLIENTS = [
  { id: 1, client_number: "CBP-284751", name: "Jan Kowalski", email: "jan.kowalski@email.pl", phone: "+48 612 345 678", status: "actif", created: "15/03/2022" },
  { id: 2, client_number: "CBP-384921", name: "Anna Nowak", email: "anna.nowak@email.pl", phone: "+48 501 234 567", status: "actif", created: "22/07/2023" },
  { id: 3, client_number: "CBP-192847", name: "Piotr Wiśniewski", email: "p.wisniewski@email.pl", phone: "+48 698 765 432", status: "actif", created: "10/01/2023" },
  { id: 4, client_number: "CBP-573921", name: "Katarzyna Wójcik", email: "k.wojcik@email.pl", phone: "+48 512 876 543", status: "en_attente", created: "01/09/2024" },
  { id: 5, client_number: "CBP-847291", name: "Tomasz Kamiński", email: "t.kaminski@email.pl", phone: "+48 601 987 654", status: "actif", created: "18/05/2023" },
  { id: 6, client_number: "CBP-629184", name: "Magdalena Lewandowska", email: "m.lewandowska@email.pl", phone: "+48 789 012 345", status: "bloque", created: "03/11/2022" },
  { id: 7, client_number: "CBP-418293", name: "Michał Zieliński", email: "m.zielinski@email.pl", phone: "+48 660 543 210", status: "actif", created: "27/04/2024" },
  { id: 8, client_number: "CBP-739182", name: "Agnieszka Szymańska", email: "a.szymanska@email.pl", phone: "+48 510 678 901", status: "actif", created: "14/02/2023" },
];

const STATUS_STYLES: Record<string, string> = {
  actif: "bg-green-100 text-green-700",
  en_attente: "bg-yellow-100 text-yellow-700",
  bloque: "bg-red-100 text-red-700",
  inactif: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  actif: "Actif",
  en_attente: "En attente",
  bloque: "Bloqué",
  inactif: "Inactif",
};

export default function AdminClientsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">{DEMO_CLIENTS.length} clients enregistrés</p>
        </div>
        <Link href="/admin/clients/new" className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Nouveau client
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">N° Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nom complet</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Téléphone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Créé le</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CLIENTS.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{client.client_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{client.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{client.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{client.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[client.status]}`}>
                      {STATUS_LABELS[client.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{client.created}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
