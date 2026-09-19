"use client";

import { useState, useTransition } from "react";
import type { Conversation, ConversationMessage } from "@/lib/messages-store";
import { createConversationAction, replyConversationAction } from "@/lib/actions/messages";

const CATEGORIES: Record<string, string> = {
  general: "Question generale",
  compte: "Mon compte",
  carte: "Cartes bancaires",
  virement: "Virements",
  credit: "Credits & Prets",
  reclamation: "Reclamation",
  autre: "Autre",
};

type View = "list" | "thread" | "new";

export default function MessagerieClient({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  const selected = conversations.find((c) => c.id === selectedId);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openThread = (id: number) => {
    setSelectedId(id);
    setView("thread");
  };

  const handleNewConversation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createConversationAction(fd);
      if (res.success && res.conversationId) {
        const now = new Date().toLocaleDateString("fr-FR");
        const newConv: Conversation = {
          id: res.conversationId,
          clientId: 0,
          clientName: "",
          clientNumber: "",
          subject: String(fd.get("subject")),
          category: String(fd.get("category") || "general"),
          status: "ouvert",
          messages: [{
            id: Date.now(),
            sender: "client",
            text: String(fd.get("message")),
            date: now,
          }],
          createdAt: now,
          updatedAt: now,
        };
        setConversations((prev) => [newConv, ...prev]);
        setSelectedId(res.conversationId);
        setView("thread");
        notify("Conversation creee");
      }
    });
  };

  const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await replyConversationAction(fd);
      if (res.success) {
        const now = new Date().toLocaleDateString("fr-FR");
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? {
                  ...c,
                  updatedAt: now,
                  status: "ouvert" as const,
                  messages: [...c.messages, { id: Date.now(), sender: "client" as const, text: String(fd.get("message")), date: now }],
                }
              : c
          )
        );
        form.reset();
        notify("Message envoye");
      }
    });
  };

  const statusBadge = (status: string) => (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === "ouvert" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
      {status === "ouvert" ? "Ouvert" : "Ferme"}
    </span>
  );

  const categoryLabel = (cat: string) => CATEGORIES[cat] || cat;

  // Toast
  const toastEl = toast ? (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>
  ) : null;

  // NEW CONVERSATION VIEW
  if (view === "new") {
    return (
      <div>
        {toastEl}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView("list")} className="text-sm text-blue-600 hover:underline">&larr; Retour</button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Nouveau message</h1>
        </div>
        <form onSubmit={handleNewConversation} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
            <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
            <input name="subject" required placeholder="Ex: Question sur mon compte courant"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Votre message</label>
            <textarea name="message" rows={6} required placeholder="Decrivez votre demande en detail..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending}
              className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
              {isPending ? "Envoi..." : "Envoyer"}
            </button>
            <button type="button" onClick={() => setView("list")} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  // THREAD VIEW
  if (view === "thread" && selected) {
    return (
      <div>
        {toastEl}
        <button onClick={() => { setView("list"); setSelectedId(null); }} className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Retour a la messagerie</button>
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
              {statusBadge(selected.status)}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-medium">{categoryLabel(selected.category)}</span>
              <span className="ml-2">Cree le {selected.createdAt}</span>
            </p>

            <div className="space-y-4">
              {selected.messages.map((msg: ConversationMessage) => (
                <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 ${msg.sender === "client" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-800"}`}>
                    <p className={`text-[11px] font-medium mb-1 ${msg.sender === "client" ? "text-blue-200" : "text-gray-500"}`}>
                      {msg.sender === "client" ? "Vous" : "CaixaBank Luxembourg"} — {msg.date}
                    </p>
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selected.status === "ouvert" && (
            <form onSubmit={handleReply} className="bg-white rounded-xl border border-gray-200 p-4">
              <input type="hidden" name="conversationId" value={selected.id} />
              <textarea name="message" rows={3} required placeholder="Votre reponse..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
              <button type="submit" disabled={isPending}
                className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">
                {isPending ? "Envoi..." : "Repondre"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div>
      {toastEl}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messagerie</h1>
          <p className="text-sm text-gray-500 mt-1">Contactez votre service client</p>
        </div>
        <button onClick={() => setView("new")}
          className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M12 2l2 2-8 8H4v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Nouveau message
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {conversations.map((conv) => {
          const lastMsg = conv.messages[conv.messages.length - 1];
          const hasUnread = lastMsg?.sender === "banque";
          return (
            <button key={conv.id} onClick={() => openThread(conv.id)}
              className={`w-full text-left flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors ${hasUnread ? "bg-blue-50/50" : ""}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${hasUnread ? "bg-blue-600" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm truncate ${hasUnread ? "font-semibold text-gray-900" : "text-gray-700"}`}>{conv.subject}</p>
                  {statusBadge(conv.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{categoryLabel(conv.category)}</span>
                  <p className="text-xs text-gray-400 truncate">{lastMsg?.text.slice(0, 60)}...</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400 whitespace-nowrap">{conv.updatedAt}</span>
                <p className="text-[10px] text-gray-300 mt-0.5">{conv.messages.length} msg</p>
              </div>
            </button>
          );
        })}
        {conversations.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm mb-2">Aucune conversation</p>
            <button onClick={() => setView("new")} className="text-sm text-blue-600 hover:underline">Envoyer votre premier message</button>
          </div>
        )}
      </div>
    </div>
  );
}
