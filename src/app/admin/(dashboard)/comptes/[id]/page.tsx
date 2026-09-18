"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { DEMO_CLIENTS, type DemoAccount, type DemoTx, type DemoCard } from "@/lib/demo-data";

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function today() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function findAccountData(paramId: string) {
  const parts = paramId.split("-");
  if (parts.length < 2) return null;
  const clientId = Number(parts[0]);
  const acctIdx = Number(parts[1]);
  const client = DEMO_CLIENTS.find((c) => c.id === clientId);
  if (!client || acctIdx < 0 || acctIdx >= client.accounts.length) return null;
  return { client, account: client.accounts[acctIdx], acctIdx };
}

export default function CompteDetailPage() {
  const params = useParams();
  const data = findAccountData(String(params.id));

  if (!data) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Compte introuvable</h1>
        <p className="text-gray-500 mb-4">Ce compte n&apos;existe pas.</p>
        <Link href="/admin/comptes" className="text-blue-600 hover:underline text-sm">Retour aux comptes</Link>
      </div>
    );
  }

  return <AccountView client={data.client} initialAccount={data.account} />;
}

function AccountView({ client, initialAccount }: { client: typeof DEMO_CLIENTS[number]; initialAccount: DemoAccount }) {
  const [account, setAccount] = useState<DemoAccount>(initialAccount);
  const [transactions, setTransactions] = useState<DemoTx[]>(
    client.transactions.map((tx) => ({ ...tx }))
  );
  const [cards] = useState<DemoCard[]>(client.cards);
  const [showAddTx, setShowAddTx] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"mouvements" | "cartes" | "infos">("mouvements");

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const TYPE_LABELS: Record<string, string> = { courant: "Compte Courant", epargne: "Livret Epargne", professionnel: "Compte Professionnel" };
  const statusColor = client.status === "actif" ? "bg-green-100 text-green-700" : client.status === "en_attente" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const statusLabel = client.status === "actif" ? "Actif" : client.status === "en_attente" ? "En attente" : "Bloque";

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = String(fd.get("type"));
    const rawAmount = Number(fd.get("amount"));
    const isCredit = type === "Credit" || type === "Virement entrant" || type === "Interet";
    const amount = isCredit ? rawAmount : -rawAmount;
    const desc = String(fd.get("description"));
    setTransactions((prev) => [{ date: today(), desc, amount }, ...prev]);
    setAccount((prev) => ({ ...prev, balance: prev.balance + amount }));
    setShowAddTx(false);
    notify(`${type} de ${fmt(Math.abs(amount))} EUR enregistre`);
  };

  const updateTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editIdx === null) return;
    const fd = new FormData(e.currentTarget);
    const oldTx = transactions[editIdx];
    const newAmount = Number(fd.get("amount"));
    const newDesc = String(fd.get("description"));
    const newDate = String(fd.get("date"));
    const isCredit = newAmount >= 0;
    const signedAmount = isCredit ? Math.abs(newAmount) : -Math.abs(newAmount);
    const diff = signedAmount - oldTx.amount;

    setTransactions((prev) => prev.map((tx, i) =>
      i === editIdx ? { date: newDate, desc: newDesc, amount: signedAmount } : tx
    ));
    setAccount((prev) => ({ ...prev, balance: prev.balance + diff }));
    setEditIdx(null);
    notify("Transaction modifiee");
  };

  const deleteTransaction = (idx: number) => {
    const tx = transactions[idx];
    setTransactions((prev) => prev.filter((_, i) => i !== idx));
    setAccount((prev) => ({ ...prev, balance: prev.balance - tx.amount }));
    notify("Transaction supprimee");
  };

  const TABS = [
    { key: "mouvements" as const, label: "Mouvements", count: transactions.length },
    { key: "cartes" as const, label: "Cartes", count: cards.length },
    { key: "infos" as const, label: "Informations" },
  ];

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/comptes" className="text-sm text-blue-600 hover:underline mb-2 inline-block">&larr; Retour aux comptes</Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{TYPE_LABELS[account.type] || account.type}</h1>
            <p className="text-sm font-mono text-gray-500 mt-1">{account.number}</p>
            <p className="text-sm text-gray-500 mt-0.5">Titulaire : <Link href={`/admin/clients/${client.id}`} className="text-blue-600 hover:underline">{client.first_name} {client.last_name}</Link></p>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>

      {/* Solde */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Solde disponible</p>
            <p className={`text-3xl font-bold ${account.balance >= 0 ? "text-gray-900" : "text-red-600"}`}>{fmt(account.balance)} EUR</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Ouvert le {client.created_at}</p>
            <p>N client : {client.client_number}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}{t.count !== undefined ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {/* Mouvements */}
      {tab === "mouvements" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Mouvements du compte</h2>
            <button onClick={() => setShowAddTx(true)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
              <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Ajouter
            </button>
          </div>

          {showAddTx && (
            <form onSubmit={addTransaction} className="p-4 border-b border-gray-200 bg-blue-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Credit</option><option>Debit</option><option>Virement entrant</option><option>Virement sortant</option><option>Prelevement</option><option>Carte</option><option>Interet</option><option>Retrait</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Montant (EUR)</label>
                  <input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input name="description" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
                <button type="button" onClick={() => setShowAddTx(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3">Annuler</button>
              </div>
            </form>
          )}

          {transactions.length === 0 ? (
            <p className="p-6 text-center text-gray-400 text-sm">Aucun mouvement sur ce compte</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 group">
                  {editIdx === i ? (
                    <form onSubmit={updateTransaction} className="flex flex-wrap items-end gap-3 w-full">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Date</label>
                        <input name="date" defaultValue={tx.date} required className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <input name="description" defaultValue={tx.desc} required className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Montant</label>
                        <input name="amount" type="number" step="0.01" defaultValue={tx.amount} required className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex gap-1">
                        <button type="submit" className="bg-[#003d82] text-white px-3 py-1.5 rounded-lg text-xs font-medium">OK</button>
                        <button type="button" onClick={() => setEditIdx(null)} className="text-xs text-gray-500 px-2">Annuler</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${tx.amount >= 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {tx.amount >= 0 ? "+" : "-"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tx.desc}</p>
                          <p className="text-xs text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {tx.amount >= 0 ? "+" : ""}{fmt(tx.amount)} EUR
                        </span>
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button onClick={() => setEditIdx(i)} className="p-1.5 rounded-md hover:bg-gray-200" title="Modifier">
                            <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                          <button onClick={() => deleteTransaction(i)} className="p-1.5 rounded-md hover:bg-red-100 text-red-500" title="Supprimer">
                            <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M3 4h10M5.5 4V3a1 1 0 011-1h3a1 1 0 011 1v1M6.5 7v4M9.5 7v4M4.5 4l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cartes */}
      {tab === "cartes" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cartes bancaires</h2>
          {cards.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune carte associee a ce compte</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((c, i) => (
                <div key={i} className={`rounded-xl p-5 text-white ${c.status === "Active" ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-red-800 to-red-900"}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium opacity-80">{c.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "Active" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>{c.status}</span>
                  </div>
                  <p className="text-lg font-mono tracking-widest mb-4">**** **** **** {c.last4}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-60">Titulaire</p>
                      <p className="text-sm font-medium">{client.first_name} {client.last_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-60">Expire</p>
                      <p className="text-sm font-medium">{c.expiry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Infos */}
      {tab === "infos" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Informations du compte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <Info label="IBAN" value={account.number} />
            <Info label="Type" value={TYPE_LABELS[account.type] || account.type} />
            <Info label="Titulaire" value={`${client.first_name} ${client.last_name}`} />
            <Info label="N client" value={client.client_number} />
            <Info label="Email" value={client.email} />
            <Info label="Telephone" value={client.phone} />
            <Info label="Adresse" value={`${client.address}, ${client.postal_code} ${client.city}`} />
            <Info label="Ouvert le" value={client.created_at} />
            <Info label="Piece d'identite" value={`${client.id_type} — ${client.id_number}`} />
            <Info label="Statut" value={statusLabel} />
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-gray-500">{label}</dt><dd className="font-medium text-gray-900 mt-0.5">{value}</dd></div>;
}
