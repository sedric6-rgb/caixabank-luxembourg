"use client";

import { useState } from "react";

const INITIAL_CARDS = [
  { id: 1, last4: "4827", type: "Visa Gold", expiry: "09/2027", status: "active" as string, limit: 5000, contactless: true, online: true, account: "Compte Courant" },
  { id: 2, last4: "9153", type: "Visa Debit", expiry: "03/2028", status: "active" as string, limit: 2000, contactless: true, online: true, account: "Compte Courant" },
];

type Card = typeof INITIAL_CARDS[number];

const CARD_COLORS: Record<string, string> = {
  "Visa Gold": "from-yellow-600 to-yellow-800",
  "Visa Debit": "from-blue-600 to-blue-900",
  "Visa Classic": "from-gray-600 to-gray-800",
  "Visa Platinum": "from-gray-800 to-black",
};

export default function CartesPage() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState<{ card: Card; action: "block" | "oppose" } | null>(null);
  const [limitEdit, setLimitEdit] = useState<{ cardId: number; value: string } | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const toggleOption = (id: number, option: "contactless" | "online") => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, [option]: !c[option] } : c));
    const card = cards.find((c) => c.id === id)!;
    const label = option === "contactless" ? "Sans contact" : "Paiement en ligne";
    notify(`${label} ${card[option] ? "desactive" : "active"} pour la carte **** ${card.last4}`);
  };

  const blockCard = (card: Card) => {
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: c.status === "active" ? "blocked" : "active" } : c));
    setConfirm(null);
    notify(card.status === "active" ? `Carte **** ${card.last4} bloquee` : `Carte **** ${card.last4} debloquee`);
  };

  const opposeCard = (card: Card) => {
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, status: "opposed" } : c));
    setConfirm(null);
    notify(`Opposition enregistree pour la carte **** ${card.last4}. Un conseiller vous contactera.`);
  };

  const updateLimit = (id: number) => {
    if (!limitEdit) return;
    const newLimit = Number(limitEdit.value);
    if (newLimit < 100 || newLimit > 50000) { notify("Le plafond doit etre entre 100 et 50 000 EUR"); return; }
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, limit: newLimit } : c));
    setLimitEdit(null);
    notify(`Plafond mis a jour : ${newLimit.toLocaleString("fr-FR")} EUR`);
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mes cartes bancaires</h1>
      <p className="text-sm text-gray-500 mb-6">Gerez vos cartes et parametres de securite</p>

      <div className="space-y-8">
        {cards.map((card) => (
          <div key={card.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <div className={`bg-gradient-to-br ${CARD_COLORS[card.type] || "from-blue-600 to-blue-900"} rounded-2xl p-6 text-white aspect-[1.586/1] max-w-[400px] flex flex-col justify-between shadow-lg ${card.status !== "active" ? "opacity-60" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-white/70">CaixaBank Luxembourg</p>
                    <p className="text-sm font-medium mt-1">{card.type}</p>
                  </div>
                  <svg width="40" height="26" viewBox="0 0 40 26"><rect width="40" height="26" rx="3" fill="white" fillOpacity="0.2"/><text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">VISA</text></svg>
                </div>
                <div>
                  <p className="text-lg font-mono tracking-widest mb-3">**** **** **** {card.last4}</p>
                  <div className="flex justify-between text-xs">
                    <div><span className="text-white/60">Expiration</span><p className="font-medium">{card.expiry}</p></div>
                    <div><span className="text-white/60">Compte</span><p className="font-medium">{card.account}</p></div>
                  </div>
                </div>
              </div>
              {card.status !== "active" && (
                <div className="absolute inset-0 max-w-[400px] rounded-2xl flex items-center justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${card.status === "blocked" ? "bg-red-600 text-white" : "bg-gray-900 text-white"}`}>
                    {card.status === "blocked" ? "CARTE BLOQUEE" : "OPPOSITION"}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Parametres</h3>
              <div className="space-y-4">
                <Toggle label="Paiement sans contact" enabled={card.contactless} disabled={card.status !== "active"} onToggle={() => toggleOption(card.id, "contactless")} />
                <Toggle label="Paiement en ligne" enabled={card.online} disabled={card.status !== "active"} onToggle={() => toggleOption(card.id, "online")} />
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Plafond mensuel</label>
                  {limitEdit?.cardId === card.id ? (
                    <div className="flex gap-2">
                      <input type="number" value={limitEdit.value} onChange={(e) => setLimitEdit({ ...limitEdit, value: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={() => updateLimit(card.id)} className="text-xs px-3 py-1.5 rounded-lg bg-[#003d82] text-white font-medium hover:bg-[#002a5c]">OK</button>
                      <button onClick={() => setLimitEdit(null)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">Annuler</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-gray-900">{card.limit.toLocaleString("fr-FR")} EUR</p>
                      {card.status === "active" && (
                        <button onClick={() => setLimitEdit({ cardId: card.id, value: String(card.limit) })} className="text-xs text-blue-600 hover:underline">Modifier</button>
                      )}
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-gray-200 flex gap-2">
                  {card.status === "active" ? (
                    <>
                      <button onClick={() => setConfirm({ card, action: "block" })} className="text-xs px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100">Bloquer la carte</button>
                      <button onClick={() => setConfirm({ card, action: "oppose" })} className="text-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">Opposer la carte</button>
                    </>
                  ) : card.status === "blocked" ? (
                    <button onClick={() => blockCard(card)} className="text-xs px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200">Debloquer la carte</button>
                  ) : (
                    <p className="text-xs text-gray-500">Carte en opposition — contactez votre agence</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {confirm.action === "block" ? "Bloquer la carte" : "Mettre en opposition"}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {confirm.action === "block"
                ? `Etes-vous sur de vouloir bloquer temporairement la carte **** ${confirm.card.last4} ? Vous pourrez la debloquer a tout moment.`
                : `Etes-vous sur de vouloir mettre en opposition la carte **** ${confirm.card.last4} ? Cette action est irreversible. Une nouvelle carte vous sera envoyee.`
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => confirm.action === "block" ? blockCard(confirm.card) : opposeCard(confirm.card)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${confirm.action === "oppose" ? "bg-red-600 text-white hover:bg-red-700" : "bg-orange-500 text-white hover:bg-orange-600"}`}>
                {confirm.action === "block" ? "Bloquer" : "Confirmer l'opposition"}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">Annuler</button>
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
