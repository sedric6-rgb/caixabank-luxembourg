"use client";

import { useState } from "react";

const INITIAL_MESSAGES = [
  { id: 1, subject: "Bienvenue chez CaixaBank Luxembourg", body: "Cher M. Kowalski,\n\nNous avons le plaisir de vous accueillir parmi nos clients. Votre compte est maintenant actif et vous pouvez profiter de l'ensemble de nos services bancaires en ligne.\n\nN'hesitez pas a nous contacter pour toute question.\n\nCordialement,\nVotre conseiller CaixaBank Luxembourg", sender: "banque" as string, read: true, date: "15 janv. 2024" },
  { id: 2, subject: "Votre nouvelle carte Visa Gold est prete", body: "Votre carte Visa Gold **** 4827 a ete emise et sera disponible dans votre agence sous 5 jours ouvres.\n\nPlafond mensuel : 5 000 EUR\nPaiement sans contact : Active\n\nCordialement,\nService Cartes", sender: "banque" as string, read: false, date: "10 sept. 2024" },
  { id: 3, subject: "Confirmation de virement", body: "Votre virement de 2 800,00 EUR vers Immobiliare S.a r.l. a ete execute avec succes le 12 septembre 2024.\n\nReference : VIR-2024091208000008", sender: "banque" as string, read: false, date: "12 sept. 2024" },
];

type Message = typeof INITIAL_MESSAGES[number];

export default function MessageriePage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [toast, setToast] = useState("");

  const selected = messages.find((m) => m.id === selectedId);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openMessage = (id: number) => {
    setSelectedId(id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const toggleRead = (id: number) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: !m.read } : m));
    notify("Statut de lecture mis a jour");
  };

  const deleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelectedId(null);
    notify("Message supprime");
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newMsg: Message = {
      id: Date.now(),
      subject: String(fd.get("subject")),
      body: String(fd.get("body")),
      sender: "client",
      read: true,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    };
    setMessages((prev) => [newMsg, ...prev]);
    setShowCompose(false);
    setReplyTo(null);
    notify("Message envoye avec succes");
  };

  if (showCompose || replyTo) {
    return (
      <div>
        {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setShowCompose(false); setReplyTo(null); }} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
          <h1 className="text-xl font-bold text-gray-900">{replyTo ? `Re: ${replyTo.subject}` : "Nouveau message"}</h1>
        </div>
        <form onSubmit={sendMessage} className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
            <input name="subject" defaultValue={replyTo ? `Re: ${replyTo.subject}` : ""} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {replyTo && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 border-l-4 border-gray-300">
              <p className="font-medium text-gray-600 mb-1">Message original :</p>
              <p className="whitespace-pre-line">{replyTo.body}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea name="body" rows={6} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Envoyer</button>
            <button type="button" onClick={() => { setShowCompose(false); setReplyTo(null); }} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
        <button onClick={() => setSelectedId(null)} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Retour a la messagerie</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{selected.subject}</h2>
          <p className="text-xs text-gray-500 mb-4">{selected.sender === "banque" ? "CaixaBank Luxembourg" : "Vous"} — {selected.date}</p>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selected.body}</div>
          <div className="mt-6 flex gap-2">
            {selected.sender === "banque" && (
              <button onClick={() => setReplyTo(selected)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M5 3L1 7l4 4M1 7h9a3 3 0 013 3v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Repondre
              </button>
            )}
            <button onClick={() => toggleRead(selected.id)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
              Marquer comme {selected.read ? "non lu" : "lu"}
            </button>
            <button onClick={() => deleteMessage(selected.id)} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
          <p className="text-sm text-gray-500 mt-1">{messages.filter((m) => !m.read).length} message(s) non lu(s)</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M12 2l2 2-8 8H4v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Nouveau message
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {messages.map((msg) => (
          <button key={msg.id} onClick={() => openMessage(msg.id)}
            className={`w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${!msg.read ? "bg-blue-50/50" : ""}`}>
            <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? "bg-blue-600" : "bg-transparent"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm truncate ${!msg.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>{msg.subject}</p>
                {msg.sender === "client" && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Envoye</span>}
              </div>
              <p className="text-xs text-gray-400 truncate">{msg.body.slice(0, 80)}...</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{msg.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
