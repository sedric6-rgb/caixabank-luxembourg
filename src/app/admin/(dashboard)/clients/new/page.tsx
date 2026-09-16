"use client";

import { useState } from "react";

export default function NewClientPage() {
  const [submitted, setSubmitted] = useState(false);
  const generatedNumber = `CBP-${Math.floor(100000 + Math.random() * 900000)}`;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Compte client créé</h2>
        <p className="text-gray-500 mb-4">Le client a été enregistré avec succès.</p>
        <p className="text-sm text-gray-600">Numéro client : <span className="font-mono font-bold">{generatedNumber}</span></p>
        <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-blue-600 hover:underline">
          Créer un autre client
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Nouveau client</h1>
      <p className="text-sm text-gray-500 mb-8">Ouverture de compte et enregistrement</p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
        <Section title="Identité">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom" name="first_name" required />
            <Field label="Nom" name="last_name" required />
            <Field label="Date de naissance" name="dob" type="date" required />
            <Field label="Nationalité" name="nationality" defaultValue="Luxembourgeoise" />
          </div>
        </Section>

        <Section title="Pièce d'identité">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de pièce</label>
              <select name="id_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="carte_identite">Carte d&apos;identité</option>
                <option value="passeport">Passeport</option>
                <option value="permis_conduire">Permis de conduire</option>
              </select>
            </div>
            <Field label="Numéro de pièce" name="id_number" required />
          </div>
        </Section>

        <Section title="Coordonnées">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Téléphone" name="phone" type="tel" placeholder="+352 ..." required />
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
                <option value="epargne">Livret Épargne</option>
                <option value="professionnel">Compte Professionnel</option>
                <option value="jeune">Compte Jeune</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carte bancaire</label>
              <select name="card_type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="visa_debit">Visa Débit</option>
                <option value="visa_classic">Visa Classic</option>
                <option value="visa_gold">Visa Gold</option>
                <option value="visa_platinum">Visa Platinum</option>
              </select>
            </div>
          </div>
        </Section>

        <Section title="Accès en ligne">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro client (auto)</label>
              <input type="text" value={generatedNumber} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono" />
            </div>
            <Field label="Mot de passe initial" name="password" type="password" required placeholder="Min. 8 caractères" />
          </div>
        </Section>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button type="submit" className="bg-[#003d82] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c] transition-colors">
            Créer le compte client
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
