"use client";

import { useState } from "react";

type Card = {
  id: number; last4: string; type: string; expiry: string;
  status: string; limit: number; contactless: boolean; online: boolean; account: string;
};

const CARD_COLORS: Record<string, string> = {
  "Visa Gold": "from-yellow-600 to-yellow-800",
  "Visa Debit": "from-blue-600 to-blue-900",
  "Visa Classic": "from-gray-600 to-gray-800",
  "Visa Platinum": "from-[#8c9eab] via-[#c5d0d8] to-[#6b7d8a]",
  "Visa Infinite": "from-slate-900 to-black",
  "Visa Business": "from-blue-800 to-indigo-900",
  "Mastercard Gold": "from-amber-600 to-amber-800",
  "Mastercard Classic": "from-red-600 to-red-900",
  "Visa Virtuelle": "from-cyan-500 to-blue-700",
};

export default function CartesClient({ initialCards, clientName }: { initialCards: Card[]; clientName: string }) {
  const [cards, setCards] = useState(initialCards);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState<{ card: Card; action: "block" | "oppose" } | null>(null);
  const [limitEdit, setLimitEdit] = useState<{ cardId: number; value: string } | null>(null);
  const [pinReveal, setPinReveal] = useState<number | null>(null);
  const [wallets, setWallets] = useState<Record<number, { apple: boolean; google: boolean }>>({});
  const [showCreateVirtual, setShowCreateVirtual] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleCardReveal = (id: number) => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getFullCardNumber = (last4: string) => {
    const seed = parseInt(last4, 10);
    const g1 = String(4000 + (seed * 3 % 999)).padStart(4, "0");
    const g2 = String((seed * 7 % 9000) + 1000);
    const g3 = String((seed * 13 % 9000) + 1000);
    return `${g1} ${g2} ${g3} ${last4}`;
  };

  const toggleOption = (id: number, option: "contactless" | "online") => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, [option]: !c[option] } : c));
    const card = cards.find((c) => c.id === id)!;
    const label = option === "contactless" ? "Sans contact" : "Paiement en ligne";
    notify(`${label} ${card[option] ? "désactivé" : "activé"} pour la carte **** ${card.last4}`);
  };

  const blockCard = (card: Card) => {
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: c.status === "active" ? "blocked" : "active" } : c));
    setConfirm(null);
    notify(card.status === "active" ? `Carte **** ${card.last4} bloquée` : `Carte **** ${card.last4} débloquée`);
  };

  const opposeCard = (card: Card) => {
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: "opposed" } : c));
    setConfirm(null);
    notify(`Carte **** ${card.last4} mise en opposition`);
  };

  const updateLimit = (id: number) => {
    if (!limitEdit) return;
    const newLimit = Number(limitEdit.value);
    if (newLimit < 100 || newLimit > 50000) { notify("Le plafond doit être entre 100 et 50 000 EUR"); return; }
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, limit: newLimit } : c));
    setLimitEdit(null);
    notify(`Plafond mis à jour : ${newLimit.toLocaleString("fr-FR").replace(/ /g, " ")} EUR`);
  };

  const createVirtualCard = () => {
    const newCard: Card = {
      id: Date.now(),
      last4: String(Math.floor(1000 + Math.random() * 9000)),
      type: "Visa Virtuelle",
      expiry: `${String(new Date().getMonth() + 1).padStart(2, "0")}/${new Date().getFullYear() + 3 - 2000}`,
      status: "active",
      limit: 1000,
      contactless: false,
      online: true,
      account: cards[0]?.account || "Compte courant",
    };
    setCards((prev) => [newCard, ...prev]);
    setShowCreateVirtual(false);
    notify("Carte virtuelle créée avec succès");
  };

  const toggleWallet = (cardId: number, wallet: "apple" | "google") => {
    setWallets((prev) => {
      const current = prev[cardId] || { apple: false, google: false };
      return { ...prev, [cardId]: { ...current, [wallet]: !current[wallet] } };
    });
    const w = wallets[cardId] || { apple: false, google: false };
    const name = wallet === "apple" ? "Apple Pay" : "Google Pay";
    notify(`${name} ${w[wallet] ? "désactivé" : "activé"} pour cette carte`);
  };

  const getSimulatedPin = (cardId: number) => {
    const seed = cardId * 7919;
    return String(((seed % 9000) + 1000));
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Mes cartes bancaires</h1>
          <p className="text-sm text-gray-500">Gérez vos cartes et paramètres de sécurité</p>
        </div>
        <button onClick={() => setShowCreateVirtual(true)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Créer une carte virtuelle
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucune carte bancaire</p>
        </div>
      ) : (
        <div className="space-y-8">
          {cards.map((card) => {
            const w = wallets[card.id] || { apple: false, google: false };
            return (
              <div key={card.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative">
                  <div className={`bg-gradient-to-br ${CARD_COLORS[card.type] || "from-blue-600 to-blue-900"} rounded-2xl p-5 sm:p-6 ${card.type === "Visa Platinum" ? "text-gray-900" : "text-white"} aspect-[1.586/1] max-w-[400px] flex flex-col justify-between shadow-lg ${card.status !== "active" ? "opacity-60" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-xs ${card.type === "Visa Platinum" ? "text-gray-900/60" : "text-white/70"}`}>CaixaBank Luxembourg — Banque Privée</p>
                        <p className="text-sm font-medium mt-1">{card.type}</p>
                      </div>
                      {card.type === "Visa Virtuelle" ? (
                        <svg width="40" height="26" viewBox="0 0 40 26"><rect width="40" height="26" rx="3" fill="white" fillOpacity="0.2"/><text x="4" y="14" fill="white" fontSize="7" fontWeight="bold">VIRTUAL</text></svg>
                      ) : (
                        <svg width="40" height="26" viewBox="0 0 40 26"><rect width="40" height="26" rx="3" fill={card.type === "Visa Platinum" ? "#1a2a3a" : "white"} fillOpacity="0.2"/><text x="6" y="17" fill={card.type === "Visa Platinum" ? "#1a2a3a" : "white"} fontSize="10" fontWeight="bold">VISA</text></svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base sm:text-lg font-mono tracking-widest select-none">
                          {revealedCards.has(card.id) ? getFullCardNumber(card.last4) : `**** **** **** ${card.last4}`}
                        </p>
                        <button onClick={() => toggleCardReveal(card.id)} className={`${card.type === "Visa Platinum" ? "text-gray-900/50 hover:text-gray-900" : "text-white/70 hover:text-white"} transition-colors`} aria-label={revealedCards.has(card.id) ? "Masquer le numéro" : "Afficher le numéro"}>
                          {revealedCards.has(card.id) ? (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : (
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                          )}
                        </button>
                      </div>
                      <p className="text-sm font-medium tracking-wide mb-2 uppercase">{clientName}</p>
                      <div className="flex justify-between text-xs">
                        <div><span className={card.type === "Visa Platinum" ? "text-gray-900/50" : "text-white/60"}>Expiration</span><p className="font-medium">{card.expiry}</p></div>
                        <div><span className={card.type === "Visa Platinum" ? "text-gray-900/50" : "text-white/60"}>Compte</span><p className="font-medium">{card.account}</p></div>
                      </div>
                    </div>
                  </div>
                  {card.status !== "active" && (
                    <div className="absolute inset-0 max-w-[400px] rounded-2xl flex items-center justify-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${card.status === "blocked" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}>
                        {card.status === "blocked" ? "CARTE BLOQUÉE" : "OPPOSITION"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Paramètres</h3>
                  <div className="space-y-4">
                    {card.type !== "Visa Virtuelle" && (
                      <Toggle label="Paiement sans contact" enabled={card.contactless} disabled={card.status !== "active"} onToggle={() => toggleOption(card.id, "contactless")} />
                    )}
                    <Toggle label="Paiement en ligne" enabled={card.online} disabled={card.status !== "active"} onToggle={() => toggleOption(card.id, "online")} />

                    {/* PIN */}
                    {card.type !== "Visa Virtuelle" && card.status === "active" && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Code PIN</label>
                        <div className="flex items-center gap-2">
                          {pinReveal === card.id ? (
                            <>
                              <p className="text-lg font-bold text-gray-900 font-mono tracking-widest">{getSimulatedPin(card.id)}</p>
                              <button onClick={() => setPinReveal(null)} className="text-xs text-gray-500 hover:underline">Masquer</button>
                            </>
                          ) : (
                            <>
                              <p className="text-lg font-bold text-gray-400 font-mono tracking-widest">* * * *</p>
                              <button onClick={() => setPinReveal(card.id)} className="text-xs text-blue-600 hover:underline">Consulter</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Limit */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Plafond mensuel</label>
                      {limitEdit?.cardId === card.id ? (
                        <div className="flex gap-2">
                          <input type="number" value={limitEdit.value} onChange={(e) => setLimitEdit({ ...limitEdit, value: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          <button onClick={() => updateLimit(card.id)} className="text-xs px-3 py-1.5 rounded-lg bg-[#003d82] text-white font-medium hover:bg-[#002a5c]">OK</button>
                          <button onClick={() => setLimitEdit(null)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium">Annuler</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-gray-900">{card.limit.toLocaleString("fr-FR").replace(/ /g, " ")} EUR</p>
                          {card.status === "active" && (
                            <button onClick={() => setLimitEdit({ cardId: card.id, value: String(card.limit) })} className="text-xs text-blue-600 hover:underline">Modifier</button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mobile Wallet */}
                    {card.status === "active" && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Portefeuille mobile</label>
                        <div className="flex gap-2">
                          <button onClick={() => toggleWallet(card.id, "apple")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${w.apple ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M11.3 4.7c-.1.1-1.7 1-1.7 3 0 2.3 2 3.1 2.1 3.1 0 0-.3 1-1 2.1-.7 1-1.3 1.9-2.4 1.9s-1.3-.6-2.5-.6-1.5.6-2.5.7c-1 0-1.8-1.1-2.5-2.1C.1 11.4-.6 8.8.6 7c.6-1 1.7-1.6 2.8-1.6 1 0 1.7.7 2.5.7s1.4-.8 2.7-.7c.5 0 1.7.2 2.6 1.3zm-3-2.5c.5-.6.8-1.5.7-2.3-.7 0-1.6.5-2.1 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.6-.4 2.1-1z"/></svg>
                            Apple Pay
                          </button>
                          <button onClick={() => toggleWallet(card.id, "google")}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${w.google ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M7 1.2c1.6 0 2.7.7 3.3 1.3l2.4-2.3C11.4.1 9.5-.5 7-.5 4.2-.5 1.8 1 .5 3.2l2.8 2.2C4 3.4 5.3 1.2 7 1.2z"/></svg>
                            Google Pay
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                      {card.status === "active" ? (
                        <>
                          <button onClick={() => setConfirm({ card, action: "block" })} className="text-xs px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100">Bloquer temporairement</button>
                          <button onClick={() => setConfirm({ card, action: "oppose" })} className="text-xs px-4 py-2 rounded-lg bg-orange-50 text-orange-700 font-medium hover:bg-orange-100">Opposer (vol/perte)</button>
                        </>
                      ) : card.status === "blocked" ? (
                        <button onClick={() => blockCard(card)} className="text-xs px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200">Débloquer</button>
                      ) : (
                        <p className="text-xs text-gray-500">Carte en opposition — contactez votre agence</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {confirm.action === "block" ? "Bloquer la carte" : "Mettre en opposition"}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {confirm.action === "block"
                ? `Bloquer temporairement la carte **** ${confirm.card.last4} ? Vous pourrez la débloquer à tout moment.`
                : `Déclarer la carte **** ${confirm.card.last4} en opposition (vol ou perte) ? Cette action est irréversible depuis votre espace. Contactez votre agence pour toute modification.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => confirm.action === "block" ? blockCard(confirm.card) : opposeCard(confirm.card)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white ${confirm.action === "block" ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"}`}>
                {confirm.action === "block" ? "Bloquer" : "Confirmer l'opposition"}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Create virtual card modal */}
      {showCreateVirtual && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateVirtual(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Créer une carte virtuelle</h2>
            <p className="text-sm text-gray-600 mb-4">
              La carte virtuelle est idéale pour vos achats en ligne. Elle est liée à votre compte courant principal et dispose d&apos;un plafond de 1 000 EUR modifiable.
            </p>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-700 rounded-xl p-4 text-white mb-6">
              <p className="text-xs text-white/70">CaixaBank Luxembourg</p>
              <p className="text-sm font-medium mt-1">Visa Virtuelle</p>
              <p className="text-base font-mono tracking-widest mt-3">**** **** **** ****</p>
              <p className="text-xs text-white/60 mt-2">Utilisable immédiatement en ligne</p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" stroke="#0d8a3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Numéro de carte unique et sécurisé
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" stroke="#0d8a3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Activation et blocage instantanés
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 8l3 3 7-7" stroke="#0d8a3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Plafond personnalisable
              </li>
            </ul>
            <div className="flex gap-3">
              <button onClick={createVirtualCard} className="flex-1 bg-[#003d82] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
                Créer la carte
              </button>
              <button onClick={() => setShowCreateVirtual(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ label, enabled, disabled, onToggle }: { label: string; enabled: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>{label}</span>
      <button onClick={onToggle} disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${enabled ? "bg-blue-600" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
