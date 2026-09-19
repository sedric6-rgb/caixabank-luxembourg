"use client";

import { useState, useRef, useEffect } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read && !readIds.has(n.id)).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M15 6.5A5 5 0 005 6.5C5 11 3 13 3 13h14s-2-2-2-6.5zM8.5 16a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Aucune notification</div>
            ) : (
              notifications.map((n) => {
                const isRead = n.is_read || readIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!isRead ? "bg-blue-50/50" : ""}`}
                    onClick={() => setReadIds((prev) => new Set(prev).add(n.id))}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!isRead ? "bg-blue-500" : "bg-transparent"}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${!isRead ? "text-gray-900" : "text-gray-600"}`}>
                            {n.title}
                          </span>
                          {n.type === "promotion" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Offre</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
