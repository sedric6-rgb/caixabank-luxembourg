"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { DEMO_CLIENTS, type DemoClient, type DemoAccount, type DemoTx } from "@/lib/demo-data";
import { toggleBlockTransactionsAction } from "@/lib/actions/virements";
import { formatAmount } from "@/lib/format";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = Number(params.id);
  const found = DEMO_CLIENTS.find((c) => c.id === clientId);

  if (!found) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Client introuvable</h1>
        <p className="text-gray-500 mb-4">Aucun client avec l&apos;identifiant {params.id}</p>
        <Link href="/admin/clients" className="text-blue-600 hover:underline text-sm">Retour a la liste</Link>
      </div>
    );
  }

  return <ClientDetail initial={found} />;
}

function ClientDetail({ initial }: { initial: DemoClient }) {
  const [client, setClient] = useState(initial);
  const [accounts, setAccounts] = useState<DemoAccount[]>(initial.accounts);
  const [transactions, setTransactions] = useState<DemoTx[]>(initial.transactions);
  const [editing, setEditing] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [addAcctOpen, setAddAcctOpen] = useState(false);
  const [confirmBlockTx, setConfirmBlockTx] = useState(false);
  const [txBlocked, setTxBlocked] = useState(initial._transactions_blocked || false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const saveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      first_name: String(fd.get("first_name")),
      last_name: String(fd.get("last_name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      address: String(fd.get("address")),
      city: String(fd.get("city")),
      postal_code: String(fd.get("postal_code")),
    };
    setClient((prev) => ({ ...prev, ...updates }));
    const src = DEMO_CLIENTS.find((c) => c.id === initial.id);
    if (src) {
      Object.assign(src, updates);
    }
    setEditing(false);
    notify("Profil mis a jour");
  };

  const toggleBlock = () => {
    const newStatus = client.status === "actif" ? "bloque" : "actif";
    setClient((prev) => ({ ...prev, status: newStatus }));
    const src = DEMO_CLIENTS.find((c) => c.id === initial.id);
    if (src) src.status = newStatus;
    notify(newStatus === "bloque" ? "Client bloque" : "Client reactive");
    setConfirmBlock(false);
  };

  const toggleBlockTx = async () => {
    const newVal = !txBlocked;
    await toggleBlockTransactionsAction(initial.id, newVal);
    setTxBlocked(newVal);
    notify(newVal ? "Transactions bloquees" : "Transactions debloquees");
    setConfirmBlockTx(false);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsgOpen(false);
    notify("Message envoye au client");
  };

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = String(fd.get("type"));
    const rawAmount = Number(fd.get("amount"));
    const amount = (type === "Credit" || type === "Virement entrant") ? rawAmount : -rawAmount;
    const desc = String(fd.get("description"));
    const accountNum = String(fd.get("account"));
    const d = new Date();
    const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

    const newTx = { date, desc: `${type} — ${desc}`, amount };
    setTransactions((prev) => [newTx, ...prev]);
    setAccounts((prev) => prev.map((a) =>
      a.number === accountNum ? { ...a, balance: a.balance + amount } : a
    ));
    const src = DEMO_CLIENTS.find((c) => c.id === initial.id);
    if (src) {
      src.transactions.unshift(newTx);
      const acct = src.accounts.find((a) => a.number === accountNum);
      if (acct) acct.balance += amount;
    }
    setTxOpen(false);
    notify(`Transaction de ${formatAmount(Math.abs(amount))} EUR enregistree`);
  };

  const addAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = () => String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const types: Record<string, string> = { courant: "Compte Courant", epargne: "Livret Epargne", professionnel: "Compte Pro" };
    const type = String(fd.get("type"));
    const newAcct: DemoAccount = {
      label: types[type] || type,
      number: `LU${r().slice(0,2)} 0019 ${r()} ${r()} ${r()} ${r()} ${r().slice(0,4)}`,
      balance: Number(fd.get("balance") || 0),
      type,
    };
    setAccounts((prev) => [...prev, newAcct]);
    const src = DEMO_CLIENTS.find((c) => c.id === initial.id);
    if (src) src.accounts.push(newAcct);
    setAddAcctOpen(false);
    notify("Compte bancaire cree");
  };

  const statusColor = client.status === "actif" ? "bg-green-100 text-green-700"
    : client.status === "en_attente" ? "bg-yellow-100 text-yellow-700"
    : "bg-red-100 text-red-700";
  const statusLabel = client.status === "actif" ? "Actif" : client.status === "en_attente" ? "En attente" : "Bloque";

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="text-sm text-blue-600 hover:underline mb-2 inline-block">&larr; Retour aux clients</Link>
          <h1 className="text-2xl font-bold text-gray-900">{client.first_name} {client.last_name}</h1>
          <p className="text-sm text-gray-500 font-mono">{client.client_number}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusLabel}</span>
      </div>

      {/* Info + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {editing ? (
            <form onSubmit={saveEdit}>
              <h2 className="font-semibold text-gray-900 mb-4">Modifier le profil</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><label className="block text-gray-500 mb-1">Prenom</label><input name="first_name" defaultValue={client.first_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Nom</label><input name="last_name" defaultValue={client.last_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Email</label><input name="email" type="email" defaultValue={client.email} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Telephone</label><input name="phone" defaultValue={client.phone} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
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
                <Info label="Prenom" value={client.first_name} />
                <Info label="Nom" value={client.last_name} />
                <Info label="Email" value={client.email} />
                <Info label="Telephone" value={client.phone} />
                <Info label="Date de naissance" value={client.date_of_birth} />
                <Info label="Nationalite" value={client.country} />
                <Info label="Adresse" value={`${client.address}, ${client.postal_code} ${client.city}`} />
                <Info label="Piece d'identite" value={`${client.id_type} — ${client.id_number}`} />
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
            <button onClick={() => setAddAcctOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-[#003d82] hover:bg-blue-50">Ouvrir un compte</button>
            <button onClick={() => setTxOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-[#003d82] hover:bg-blue-50">Nouvelle transaction</button>
            <button onClick={() => setConfirmBlockTx(true)} className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm ${!txBlocked ? "border-orange-200 text-orange-600 hover:bg-orange-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
              {!txBlocked ? "Bloquer les transactions" : "Debloquer les transactions"}
            </button>
            {txBlocked && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-orange-600 bg-orange-50 rounded-lg border border-orange-200">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1a4 4 0 00-4 4v2H2a1 1 0 00-1 1v5a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2H5V5z" fill="currentColor"/></svg>
                Transactions bloquees
              </div>
            )}
            <button onClick={() => setConfirmBlock(true)} className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm ${client.status === "actif" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
              {client.status === "actif" ? "Bloquer le client" : "Reactiver le client"}
            </button>
          </div>
        </div>
      </div>

      {/* Comptes + Cartes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Comptes bancaires</h2>
          {accounts.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun compte ouvert</p>
          ) : (
            <div className="space-y-3">
              {accounts.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.label}</p>
                    <p className="text-xs font-mono text-gray-400">{a.number}</p>
                  </div>
                  <span className={`text-sm font-bold ${a.balance >= 0 ? "text-gray-900" : "text-red-600"}`}>{formatAmount(a.balance)} EUR</span>
                </div>
              ))}
              <p className="text-right text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                Total : {formatAmount(totalBalance)} EUR
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cartes bancaires</h2>
          {initial.cards.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune carte emise</p>
          ) : (
            <div className="space-y-3">
              {initial.cards.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.type}</p>
                    <p className="text-xs text-gray-400">**** **** **** {c.last4} — Exp. {c.expiry}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Dernieres operations</h2>
          <span className="text-xs text-gray-400">{transactions.length} operation{transactions.length > 1 ? "s" : ""}</span>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune transaction</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-500">Date</th>
              <th className="text-left py-2 font-medium text-gray-500">Description</th>
              <th className="text-right py-2 font-medium text-gray-500">Montant</th>
            </tr></thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-600">{tx.date}</td>
                  <td className="py-2 text-gray-700">{tx.desc}</td>
                  <td className={`py-2 text-right font-medium ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.amount >= 0 ? "+" : ""}{formatAmount(tx.amount)} EUR
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {msgOpen && (
        <Modal onClose={() => setMsgOpen(false)}>
          <form onSubmit={sendMessage} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Envoyer un message a {client.first_name}</h2>
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
                <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Credit</option><option>Debit</option><option>Virement entrant</option><option>Virement sortant</option><option>Prelevement</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label><input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
              <select name="account" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {accounts.map((a, i) => <option key={i} value={a.number}>{a.label} — {a.number}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input name="description" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
              <button type="button" onClick={() => setTxOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}

      {addAcctOpen && (
        <Modal onClose={() => setAddAcctOpen(false)}>
          <form onSubmit={addAccount} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Ouvrir un compte</h2>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type de compte</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="courant">Compte Courant</option>
                <option value="epargne">Livret Epargne</option>
                <option value="professionnel">Compte Professionnel</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Solde initial (EUR)</label>
              <input name="balance" type="number" min="0" step="0.01" defaultValue="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Creer le compte</button>
              <button type="button" onClick={() => setAddAcctOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmBlockTx && (
        <Modal onClose={() => setConfirmBlockTx(false)}>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{!txBlocked ? "Bloquer les transactions ?" : "Debloquer les transactions ?"}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {!txBlocked
              ? "Le client ne pourra plus effectuer de virements ni de transactions. Un message lui demandera de contacter son conseiller."
              : "Le client pourra de nouveau effectuer des virements et transactions."}
          </p>
          {!txBlocked && (
            <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-xs text-orange-700">Le client verra : &quot;Vos transactions sont temporairement suspendues. Veuillez contacter votre conseiller pour plus d&apos;informations.&quot;</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={toggleBlockTx} className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${!txBlocked ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}>Confirmer</button>
            <button onClick={() => setConfirmBlockTx(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
          </div>
        </Modal>
      )}

      {confirmBlock && (
        <Modal onClose={() => setConfirmBlock(false)}>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{client.status === "actif" ? "Bloquer ce client ?" : "Reactiver ce client ?"}</h2>
          <p className="text-sm text-gray-500 mb-6">{client.status === "actif" ? "Le client ne pourra plus acceder a son espace en ligne ni utiliser ses cartes." : "Le client retrouvera l'acces a tous ses services."}</p>
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
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
