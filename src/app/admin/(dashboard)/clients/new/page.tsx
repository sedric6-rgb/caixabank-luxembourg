"use client";

import { useState, useTransition } from "react";
import { createClientAction } from "@/lib/actions/clients";

export default function NewClientPage() {
  const [result, setResult] = useState<{ clientNumber: string } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createClientAction(fd);
      if (res.success && res.clientNumber) {
        setResult({ clientNumber: res.clientNumber });
      } else {
        setError(res.error || "Erreur lors de la creation du client");
      }
    });
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Compte client cree</h2>
        <p className="text-gray-500 mb-4">Le client a ete enregistre avec succes.</p>
        <p className="text-sm text-gray-600">Numero client : <span className="font-mono font-bold">{result.clientNumber}</span></p>
        <p className="text-xs text-gray-400 mt-2">Mot de passe : celui defini lors de la creation</p>
        <button onClick={() => setResult(null)} className="mt-6 text-sm text-blue-600 hover:underline">
          Creer un autre client
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nouveau client</h1>
      <p className="text-sm text-gray-500 mb-8">Ouverture de compte et enregistrement</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Identite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prenom" name="first_name" required />
            <Field label="Nom" name="last_name" required />
            <Field label="Date de naissance" name="dob" type="date" required />
            <Field label="Nationalite" name="nationality" defaultValue="Luxembourgeoise" />
          </div>
        </Section>

        <Section title="Piece d'identite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de piece</label>
              <select name="id_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="carte_identite">Carte d&apos;identite</option>
                <option value="passeport">Passeport</option>
                <option value="permis_conduire">Permis de conduire</option>
              </select>
            </div>
            <Field label="Numero de piece" name="id_number" required />
          </div>
        </Section>

        <Section title="Coordonnees">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Telephone" name="phone" type="tel" placeholder="+352 ..." required />
            <div className="sm:col-span-2"><Field label="Adresse" name="address" required /></div>
            <Field label="Ville" name="city" required />
            <Field label="Code postal" name="postal_code" required />
            <Field label="Pays" name="country" defaultValue="Luxembourg" />
          </div>
        </Section>

        <Section title="Compte bancaire">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de compte</label>
              <select name="account_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="courant">Compte Courant</option>
                <option value="epargne">Livret Epargne</option>
                <option value="professionnel">Compte Professionnel</option>
                <option value="jeune">Compte Jeune</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carte bancaire</label>
              <select name="card_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="visa_debit">Visa Debit</option>
                <option value="visa_classic">Visa Classic</option>
                <option value="visa_gold">Visa Gold</option>
                <option value="visa_platinum">Visa Platinum</option>
              </select>
            </div>
          </div>
        </Section>

        <Section title="Acces en ligne">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero client</label>
              <p className="text-xs text-gray-400 mb-1">Genere automatiquement a la creation</p>
              <input type="text" value="CBP-XXXXXX" readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono text-gray-400" />
            </div>
            <Field label="Mot de passe initial" name="password" type="password" required placeholder="Min. 8 caracteres" />
          </div>
        </Section>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button type="submit" disabled={isPending}
            className="bg-[#003d82] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors disabled:opacity-50">
            {isPending ? "Creation en cours..." : "Creer le compte client"}
          </button>
          <a href="/admin/clients" className="text-sm text-gray-500 hover:text-gray-700">Annuler</a>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, name, type = "text", required, defaultValue, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input id={name} name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}
