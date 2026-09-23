"use client";

import { useState, useTransition } from "react";
import type { Conversation, ConversationMessage } from "@/lib/messages-store";
import { adminReplyAction } from "@/lib/actions/messages";
import { sendMessageToAllAction } from "@/lib/actions/admin-notifications";

const CATEGORIES: Record<string, string> = {
  general: "Question generale",
  compte: "Mon compte",
  carte: "Cartes bancaires",
  virement: "Virements",
  credit: "Credits & Prets",
  reclamation: "Reclamation",
  information: "Information",
  autre: "Autre",
};

export default function AdminMessagerieClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "ouvert" | "ferme">("all");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations.filter((c) => filter === "all" || c.status === filter);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await adminReplyAction(fd);
      if (res.success) {
        const now = new Date().toLocaleDateString("fr-FR");
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? {
                  ...c,
                  updatedAt: now,
                  messages: [...c.messages, { id: Date.now(), sender: "banque" as const, text: String(fd.get("message")), date: now }],
                }
              : c
          )
        );
        form.reset();
        notify("Reponse envoyee");
      }
    });
  };

  const handleBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await sendMessageToAllAction(fd);
      if (res.success) {
        form.reset();
        setShowBroadcast(false);
        notify(`Message envoye a ${res.count} clients`);
      } else {
        notify(res.error || "Erreur");
      }
    });
  };

  const statusBadge = (status: string) => (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === "ouvert" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {status === "ouvert" ? "Ouvert" : "Ferme"}
    </span>
  );

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messagerie clients</h1>
          <p className="text-sm text-gray-500 mt-1">{conversations.filter((c) => c.status === "ouvert").length} conversation(s) ouverte(s)</p>
        </div>
        <button onClick={() => setShowBroadcast(!showBroadcast)}
          className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z" />
          </svg>
          Envoyer a tous
        </button>
      </div>

      {showBroadcast && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Nouveau message pour tous les clients</h2>
          <p className="text-sm text-gray-500 mb-4">Ce message sera cree dans la messagerie de chaque client actif</p>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="information">Information</option>
                  <option value="general">Question generale</option>
                  <option value="compte">Mon compte</option>
                  <option value="carte">Cartes bancaires</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                <input name="subject" required placeholder="Ex: Mise a jour de nos services"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" rows={4} required placeholder="Votre message pour tous les clients..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isPending}
                className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
                {isPending ? "Envoi..." : "Envoyer a tous les clients"}
              </button>
              <button type="button" onClick={() => setShowBroadcast(false)} className="text-sm text-gray-500 hover:text-gray-700">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(["all", "ouvert", "ferme"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f === "all" ? "Toutes" : f === "ouvert" ? "Ouvertes" : "Fermees"}
          </button>
        ))}
      </div>

      <div className="flex gap-4 min-h-[500px]">
        {/* List */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {filtered.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === selectedId;
              return (
                <button key={conv.id} onClick={() => setSelectedId(conv.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${isActive ? "bg-blue-50 border-l-2 border-l-blue-600" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{conv.clientName}</p>
                    {statusBadge(conv.status)}
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-1">{conv.clientNumber}</p>
                  <p className="text-sm text-gray-700 truncate">{conv.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{CATEGORIES[conv.category] || conv.category}</span>
                    <span className="text-[10px] text-gray-400">{conv.messages.length} msg</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{conv.updatedAt}</span>
                  </div>
                  {lastMsg && (
                    <p className="text-xs text-gray-400 truncate mt-1">{lastMsg.sender === "client" ? "Client" : "Banque"}: {lastMsg.text.slice(0, 50)}...</p>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucune conversation</div>
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="hidden lg:block flex-1">
          {selected ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selected.clientName} ({selected.clientNumber}) — {CATEGORIES[selected.category] || selected.category}
                  </p>
                </div>
                {statusBadge(selected.status)}
              </div>

              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                {selected.messages.map((msg: ConversationMessage) => (
                  <div key={msg.id} className={`flex ${msg.sender === "banque" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.sender === "banque" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-800"}`}>
                      <p className={`text-[11px] font-medium mb-1 ${msg.sender === "banque" ? "text-blue-200" : "text-gray-500"}`}>
                        {msg.sender === "banque" ? "Service Client" : selected.clientName} — {msg.date}
                      </p>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReply} className="border-t border-gray-200 pt-4">
                <input type="hidden" name="conversationId" value={selected.id} />
                <textarea name="message" rows={3} required placeholder="Repondre au client..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
                <button type="submit" disabled={isPending}
                  className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
                  {isPending ? "Envoi..." : "Repondre"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mx-auto mb-4 text-gray-300" stroke="currentColor" strokeWidth="1.5">
                <rect x="6" y="10" width="36" height="28" rx="4"/>
                <path d="M6 16l18 12 18-12" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm">Selectionnez une conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
