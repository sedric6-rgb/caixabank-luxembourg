"use client";

import Link from "next/link";
import { useState } from "react";

const INIT_CLIENT = {
  id: 1, client_number: "CBP-284751", first_name: "Jan", last_name: "Kowalski",
  email: "jan.kowalski@email.lu", phone: "+352 621 345 678", date_of_birth: "15/03/1985",
  address: "12 Av. de la Gare", city: "Luxembourg", postal_code: "1611", country: "Luxembourg",
  id_type: "Carte d'identité", id_number: "AXR 482916", status: "actif", created_at: "15/03/2022",
};

const ACCOUNTS = [
  { label: "Compte Courant", number: "LU61 0019 1014 0000 0712 1981 2874", balance: 12847.53, type: "courant" },
  { label: "Livret Épargne", number: "LU27 0019 2004 0000 3002 0135 5387", balance: 45230.00, type: "epargne" },
  { label: "Compte Pro", number: "LU10 0019 0099 7603 1234 5678 9012", balance: 89415.22, type: "professionnel" },
];

const CARDS = [
  { last4: "4827", type: "Visa Gold", status: "Active", expiry: "09/2027" },
  { last4: "9153", type: "Visa Débit", status: "Active", expiry: "03/2028" },
];

const TXS = [
  { date: "15/09/2024", desc: "Cactus", amount: -125.5 },
  { date: "15/09/2024", desc: "Entreprise ABC — Salaire", amount: 4500 },
  { date: "14/09/2024", desc: "Delhaize", amount: -42.3 },
  { date: "14/09/2024", desc: "Crédit Immobilier CBL", amount: -1567.23 },
  { date: "13/09/2024", desc: "Fournisseur XYZ S.à r.l.", amount: -8500 },
  { date: "13/09/2024", desc: "Intérêts Livret Épargne", amount: 122.34 },
];

export default function ClientDetailPage() {
  const [client, setClient] = useState(INIT_CLIENT);
  const [editing, setEditing] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const saveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setClient((prev) => ({
      ...prev,
      first_name: String(fd.get("first_name")),
      last_name: String(fd.get("last_name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      address: String(fd.get("address")),
      city: String(fd.get("city")),
      postal_code: String(fd.get("postal_code")),
    }));
    setEditing(false);
    notify("Profil mis à jour");
  };

  const toggleBlock = () => {
    setClient((prev) => ({ ...prev, status: prev.status === "actif" ? "bloqué" : "actif" }));
    notify(client.status === "actif" ? "Client bloqué" : "Client réactivé");
    setConfirmBlock(false);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsgOpen(false);
    notify("Message envoyé au client");
  };

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTxOpen(false);
    notify("Transaction enregistrée");
  };

  const statusColor = client.status === "actif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="text-sm text-blue-600 hover:underline mb-2 inline-block">← Retour aux clients</Link>
          <h1 className="text-2xl font-bold text-gray-900">{client.first_name} {client.last_name}</h1>
          <p className="text-sm text-gray-500 font-mono">{client.client_number}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{client.status === "actif" ? "Actif" : "Bloqué"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {editing ? (
            <form onSubmit={saveEdit}>
              <h2 className="font-semibold text-gray-900 mb-4">Modifier le profil</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><label className="block text-gray-500 mb-1">Prénom</label><input name="first_name" defaultValue={client.first_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Nom</label><input name="last_name" defaultValue={client.last_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Email</label><input name="email" type="email" defaultValue={client.email} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Téléphone</label><input name="phone" defaultValue={client.phone} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Adresse</label><input name="address" defaultValue={client.address} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Ville</label><input name="city" defaultValue={client.city} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Code postal</label><input name="postal_code" defaultValue={client.postal_code} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
                <button type="button" onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                <Info label="Prénom" value={client.first_name} /><Info label="Nom" value={client.last_name} />
                <Info label="Email" value={client.email} /><Info label="Téléphone" value={client.phone} />
                <Info label="Date de naissance" value={client.date_of_birth} /><Info label="Nationalité" value={client.country} />
                <Info label="Adresse" value={`${client.address}, ${client.postal_code} ${client.city}`} />
                <Info label="Pièce d'identité" value={`${client.id_type} — ${client.id_number}`} />
                <Info label="Client depuis" value={client.created_at} />
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-2">
            <button onClick={() => setEditing(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Modifier le profil</button>
            <button onClick={() => setMsgOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Envoyer un message</button>
            <button onClick={() => setTxOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-[#003d82] hover:bg-blue-50">Nouvelle transaction</button>
            <button onClick={() => setConfirmBlock(true)} className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm ${client.status === "actif" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
              {client.status === "actif" ? "Bloquer le client" : "Réactiver le client"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Comptes bancaires</h2>
          <div className="space-y-3">
            {ACCOUNTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.label}</p>
                  <p className="text-xs font-mono text-gray-400">{a.number}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{a.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</span>
              </div>
            ))}
            <p className="text-right text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              Total : {ACCOUNTS.reduce((s, a) => s + a.balance, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cartes bancaires</h2>
          <div className="space-y-3">
            {CARDS.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.type}</p>
                  <p className="text-xs text-gray-400">**** **** **** {c.last4} — Exp. {c.expiry}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Dernières opérations</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">
            <th className="text-left py-2 font-medium text-gray-500">Date</th>
            <th className="text-left py-2 font-medium text-gray-500">Description</th>
            <th className="text-right py-2 font-medium text-gray-500">Montant</th>
          </tr></thead>
          <tbody>
            {TXS.map((tx, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 text-gray-600">{tx.date}</td>
                <td className="py-2 text-gray-700">{tx.desc}</td>
                <td className={`py-2 text-right font-medium ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msgOpen && (
        <Modal onClose={() => setMsgOpen(false)}>
          <form onSubmit={sendMessage} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Envoyer un message</h2>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea rows={4} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Envoyer</button>
              <button type="button" onClick={() => setMsgOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}

      {txOpen && (
        <Modal onClose={() => setTxOpen(false)}>
          <form onSubmit={addTransaction} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Nouvelle transaction</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Crédit</option><option>Débit</option><option>Virement</option><option>Prélèvement</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label><input type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {ACCOUNTS.map((a, i) => <option key={i}>{a.label} — {a.number}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
              <button type="button" onClick={() => setTxOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmBlock && (
        <Modal onClose={() => setConfirmBlock(false)}>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{client.status === "actif" ? "Bloquer ce client ?" : "Réactiver ce client ?"}</h2>
          <p className="text-sm text-gray-500 mb-6">{client.status === "actif" ? "Le client ne pourra plus accéder à son espace en ligne ni utiliser ses cartes." : "Le client retrouvera l'accès à tous ses services."}</p>
          <div className="flex gap-3">
            <button onClick={toggleBlock} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${client.status === "actif" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>Confirmer</button>
            <button onClick={() => setConfirmBlock(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-gray-500 text-sm">{label}</dt><dd className="font-medium text-gray-900 text-sm">{value}</dd></div>;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
