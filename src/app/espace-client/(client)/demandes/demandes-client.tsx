"use client";

import { useState, useTransition } from "react";
import { createDemandeAction } from "@/lib/actions/demandes";

type CardInfo = { id: number; last4: string; type: string; limit: number };
type AccountInfo = { id: number; label: string; type: string };
type DemandeInfo = { id: number; type: string; label: string; details: string; status: string; createdAt: string };

const STATUS_COLORS: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-800",
  en_cours: "bg-blue-100 text-blue-800",
  validee: "bg-green-100 text-green-700",
  refusee: "bg-red-100 text-red-700",
};
const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  validee: "Validee",
  refusee: "Refusee",
};

const CARD_TYPES = ["Visa Debit", "Visa Classic", "Visa Gold", "Visa Platinum", "Visa Infinite", "Visa Business"];

export default function DemandesClient({
  cards,
  accounts,
  hasEpargne,
  initialDemandes,
}: {
  cards: CardInfo[];
  accounts: AccountInfo[];
  hasEpargne: boolean;
  initialDemandes: DemandeInfo[];
}) {
  const [demandes, setDemandes] = useState(initialDemandes);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 4000); };

  const submitDemande = (type: string, label: string, details: string) => {
    const fd = new FormData();
    fd.set("type", type);
    fd.set("label", label);
    fd.set("details", details);

    startTransition(async () => {
      const result = await createDemandeAction(fd);
      if (result.success) {
        setDemandes((prev) => [
          { id: Date.now(), type, label, details, status: "en_attente", createdAt: new Date().toLocaleDateString("fr-FR") },
          ...prev,
        ]);
        setShowForm(null);
        notify("Demande envoyee avec succes");
      } else {
        notify(result.error || "Erreur");
      }
    });
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Mes demandes</h1>
      <p className="text-sm text-gray-500 mb-6">Commander une carte, un chequier, modifier vos plafonds ou ouvrir un compte</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ActionCard icon="card" title="Commander une carte" desc="Visa Debit, Classic, Gold..." onClick={() => setShowForm("carte")} />
        <ActionCard icon="book" title="Commander un chequier" desc="Chequier de 25 ou 50 cheques" onClick={() => setShowForm("chequier")} />
        <ActionCard icon="up" title="Augmenter un plafond" desc="Modifier le plafond de carte" onClick={() => setShowForm("plafond")} />
        {!hasEpargne && (
          <ActionCard icon="plus" title="Ouvrir un compte epargne" desc="Livret epargne a taux preferentiel" onClick={() => setShowForm("compte_epargne")} />
        )}
      </div>

      {showForm === "carte" && (
        <FormCard title="Commander une carte" onClose={() => setShowForm(null)}>
          <CardOrderForm onSubmit={(label, details) => submitDemande("carte", label, details)} pending={isPending} />
        </FormCard>
      )}

      {showForm === "chequier" && (
        <FormCard title="Commander un chequier" onClose={() => setShowForm(null)}>
          <ChequierForm accounts={accounts} onSubmit={(label, details) => submitDemande("chequier", label, details)} pending={isPending} />
        </FormCard>
      )}

      {showForm === "plafond" && (
        <FormCard title="Augmenter un plafond de carte" onClose={() => setShowForm(null)}>
          <PlafondForm cards={cards} onSubmit={(label, details) => submitDemande("plafond", label, details)} pending={isPending} />
        </FormCard>
      )}

      {showForm === "compte_epargne" && (
        <FormCard title="Ouvrir un compte epargne" onClose={() => setShowForm(null)}>
          <EpargneForm onSubmit={(label, details) => submitDemande("compte_epargne", label, details)} pending={isPending} />
        </FormCard>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Historique des demandes</h2>
        </div>
        {demandes.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400 text-sm">Aucune demande pour le moment</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {demandes.map((d) => (
              <div key={d.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{d.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{d.createdAt}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[d.status] || "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[d.status] || d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  const icons: Record<string, React.ReactNode> = {
    card: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#003d82" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>,
    book: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#003d82" strokeWidth="1.5"><path d="M4 4h4v16H4zM8 4h12v16H8M12 8h4M12 12h4M12 16h2"/></svg>,
    up: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round"><path d="M12 19V5M7 10l5-5 5 5"/></svg>,
    plus: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#003d82" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>,
  };
  return (
    <button onClick={onClick} className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-blue-300 transition-all">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">{icons[icon]}</div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </button>
  );
}

function FormCard({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      {children}
    </div>
  );
}

function CardOrderForm({ onSubmit, pending }: { onSubmit: (label: string, details: string) => void; pending: boolean }) {
  const [cardType, setCardType] = useState(CARD_TYPES[0]);
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type de carte</label>
        <select value={cardType} onChange={(e) => setCardType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {CARD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button onClick={() => onSubmit(`Commande ${cardType}`, `Demande de nouvelle carte ${cardType}`)} disabled={pending}
        className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
        {pending ? "Envoi..." : "Envoyer la demande"}
      </button>
    </div>
  );
}

function ChequierForm({ accounts, onSubmit, pending }: { accounts: AccountInfo[]; onSubmit: (label: string, details: string) => void; pending: boolean }) {
  const [acctId, setAcctId] = useState(String(accounts[0]?.id || ""));
  const [qty, setQty] = useState("25");
  const acct = accounts.find((a) => String(a.id) === acctId);
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
        <select value={acctId} onChange={(e) => setAcctId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de cheques</label>
        <select value={qty} onChange={(e) => setQty(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="25">Carnet de 25 cheques</option>
          <option value="50">Carnet de 50 cheques</option>
        </select>
      </div>
      <button onClick={() => onSubmit(`Chequier ${qty} cheques`, `Demande de chequier de ${qty} cheques pour le compte ${acct?.label || ""}`)} disabled={pending}
        className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
        {pending ? "Envoi..." : "Commander le chequier"}
      </button>
    </div>
  );
}

function PlafondForm({ cards, onSubmit, pending }: { cards: CardInfo[]; onSubmit: (label: string, details: string) => void; pending: boolean }) {
  const [cardId, setCardId] = useState(String(cards[0]?.id || ""));
  const [newLimit, setNewLimit] = useState("");
  const card = cards.find((c) => String(c.id) === cardId);
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Carte</label>
        <select value={cardId} onChange={(e) => setCardId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {cards.map((c) => <option key={c.id} value={c.id}>{c.type} **** {c.last4} (plafond actuel : {c.limit.toLocaleString("fr-FR").replace(/ /g, " ")} EUR)</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau plafond souhaite (EUR)</label>
        <input type="number" min="100" step="100" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} placeholder={String((card?.limit || 5000) * 2)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button onClick={() => {
        if (!newLimit || !card) return;
        onSubmit(
          `Augmentation plafond ${card.type} **** ${card.last4}`,
          `Demande d'augmentation du plafond mensuel de ${card.limit.toLocaleString("fr-FR").replace(/ /g, " ")} EUR a ${Number(newLimit).toLocaleString("fr-FR").replace(/ /g, " ")} EUR pour la carte ${card.type} **** ${card.last4}`
        );
      }} disabled={pending || !newLimit}
        className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
        {pending ? "Envoi..." : "Envoyer la demande"}
      </button>
    </div>
  );
}

function EpargneForm({ onSubmit, pending }: { onSubmit: (label: string, details: string) => void; pending: boolean }) {
  return (
    <div className="space-y-4 max-w-md">
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-gray-700 font-medium">Livret Epargne CaixaBank</p>
        <p className="text-xs text-gray-500 mt-1">Taux promotionnel : 4,5% annuel brut</p>
        <p className="text-xs text-gray-500">Plafond : 250 000 EUR</p>
        <p className="text-xs text-gray-500">Disponibilite : immediate</p>
      </div>
      <button onClick={() => onSubmit("Ouverture Livret Epargne", "Demande d'ouverture d'un Livret Epargne au taux promotionnel de 4,5%")} disabled={pending}
        className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
        {pending ? "Envoi..." : "Ouvrir le compte epargne"}
      </button>
    </div>
  );
}
