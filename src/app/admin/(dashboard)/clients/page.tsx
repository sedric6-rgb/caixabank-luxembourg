"use client";

import Link from "next/link";
import { useState } from "react";
import { DEMO_CLIENTS } from "@/lib/demo-data";

const STATUS_STYLES: Record<string, string> = {
  actif: "bg-green-100 text-green-700",
  en_attente: "bg-yellow-100 text-yellow-700",
  bloque: "bg-red-100 text-red-700",
  inactif: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  actif: "Actif",
  en_attente: "En attente",
  bloque: "Bloque",
  inactif: "Inactif",
};

const FILTERS = ["Tous", "Actif", "En attente", "Bloque"];

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");

  const clients = DEMO_CLIENTS.filter((c) => {
    if (filter === "Actif" && c.status !== "actif") return false;
    if (filter === "En attente" && c.status !== "en_attente") return false;
    if (filter === "Bloque" && c.status !== "bloque") return false;
    if (search) {
      const q = search.toLowerCase();
      const name = `${c.first_name} ${c.last_name}`.toLowerCase();
      return name.includes(q) || c.client_number.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} client{clients.length > 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/clients/new" className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Nouveau client
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{f}</button>
          ))}
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, numero ou email..." className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">N Client</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nom complet</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Telephone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Cree le</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{client.client_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{client.first_name} {client.last_name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{client.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{client.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[client.status] || "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABELS[client.status] || client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{client.created_at}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/clients/${client.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Voir le compte
                    </Link>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun client trouve</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
