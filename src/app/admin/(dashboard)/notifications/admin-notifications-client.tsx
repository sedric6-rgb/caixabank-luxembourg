"use client";

import { useState, useTransition } from "react";
import type { AdminNotification } from "@/lib/notifications-store";
import {
  sendNotificationToAllAction,
  sendNotificationToClientAction,
  sendMessageToAllAction,
} from "@/lib/actions/admin-notifications";

const NOTIF_TYPES = [
  { value: "info", label: "Information", color: "bg-blue-100 text-blue-700" },
  { value: "alerte", label: "Alerte", color: "bg-red-100 text-red-700" },
  { value: "promotion", label: "Promotion", color: "bg-amber-100 text-amber-700" },
];

const MSG_CATEGORIES = [
  { value: "information", label: "Information" },
  { value: "general", label: "Question generale" },
  { value: "compte", label: "Mon compte" },
  { value: "carte", label: "Cartes bancaires" },
  { value: "virement", label: "Virements" },
  { value: "autre", label: "Autre" },
];

interface Props {
  sentNotifications: AdminNotification[];
  clients: { id: number; name: string; clientNumber: string }[];
}

export default function AdminNotificationsClient({ sentNotifications, clients }: Props) {
  const [tab, setTab] = useState<"notification" | "message">("notification");
  const [notifications, setNotifications] = useState(sentNotifications);
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<"all" | "single">("all");
  const [selectedClientId, setSelectedClientId] = useState<number>(clients[0]?.id || 0);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSendNotification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      let res;
      if (target === "all") {
        res = await sendNotificationToAllAction(fd);
      } else {
        fd.set("clientId", String(selectedClientId));
        res = await sendNotificationToClientAction(fd);
      }

      if (res.success) {
        const now = new Date().toISOString().split("T")[0];
        setNotifications((prev) => [
          {
            id: Date.now(),
            title: String(fd.get("title")),
            message: String(fd.get("message")),
            type: String(fd.get("type")) as "info" | "alerte" | "promotion",
            targetClientIds: target === "all" ? "all" : [selectedClientId],
            createdAt: now,
          },
          ...prev,
        ]);
        form.reset();
        const count = target === "all" ? `${clients.length} clients` : "1 client";
        notify(`Notification envoyee a ${count}`);
      } else {
        notify(res.error || "Erreur");
      }
    });
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const res = await sendMessageToAllAction(fd);
      if (res.success) {
        form.reset();
        notify(`Message envoye a ${res.count} clients actifs`);
      } else {
        notify(res.error || "Erreur");
      }
    });
  };

  const typeBadge = (type: string) => {
    const t = NOTIF_TYPES.find((nt) => nt.value === type);
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t?.color || "bg-gray-100 text-gray-600"}`}>
        {t?.label || type}
      </span>
    );
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications & Communication</h1>
        <p className="text-sm text-gray-500 mt-1">Envoyez des notifications et messages a vos clients</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("notification")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "notification" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <span className="inline-flex items-center gap-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6.5A5 5 0 005 6.5C5 11 3 13 3 13h14s-2-2-2-6.5zM8.5 16a2.5 2.5 0 005 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Notification (cloche)
          </span>
        </button>
        <button
          onClick={() => setTab("message")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "message" ? "bg-[#003d82] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          <span className="inline-flex items-center gap-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="14" height="12" rx="2" />
              <path d="M2 5l7 5 7-5" strokeLinejoin="round" />
            </svg>
            Message (messagerie)
          </span>
        </button>
      </div>

      {tab === "notification" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Envoyer une notification</h2>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "all"}
                    onChange={() => setTarget("all")}
                    className="text-[#003d82]"
                  />
                  <span className="text-sm font-medium text-gray-700">Tous les clients</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "single"}
                    onChange={() => setTarget("single")}
                    className="text-[#003d82]"
                  />
                  <span className="text-sm font-medium text-gray-700">Un client</span>
                </label>
              </div>

              {target === "single" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.clientNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {NOTIF_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Maintenance prevue ce week-end"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="Contenu de la notification..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50 transition-colors"
              >
                {isPending ? "Envoi en cours..." : `Envoyer la notification${target === "all" ? " a tous" : ""}`}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Historique des notifications</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucune notification envoyee</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      {typeBadge(n.type)}
                      <span className="text-[10px] text-gray-400">
                        {n.targetClientIds === "all"
                          ? `Tous les clients`
                          : `${n.targetClientIds.length} client(s)`}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-auto">{n.createdAt}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Envoyer un message a tous les clients</h2>
            <p className="text-sm text-gray-500 mb-4">
              Ce message apparaitra dans la messagerie de chaque client actif
            </p>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                <select
                  name="category"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {MSG_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                <input
                  name="subject"
                  required
                  placeholder="Ex: Mise a jour de nos services"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Redigez votre message pour tous les clients..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50 transition-colors"
              >
                {isPending ? "Envoi en cours..." : "Envoyer a tous les clients actifs"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
