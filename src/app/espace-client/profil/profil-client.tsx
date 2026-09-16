"use client";

import { useState } from "react";

interface ClientData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  client_number: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
}

export default function ProfilClient({ client }: { client: ClientData }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: client.email, phone: client.phone, address: client.address, postal_code: client.postal_code, city: client.city });
  const [toast, setToast] = useState("");
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [notifs, setNotifs] = useState([true, true, false]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const saveProfile = () => {
    setEditing(false);
    notify("Profil mis a jour avec succes");
  };

  const changePwd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPwd = String(fd.get("newPwd"));
    const confirmPwd = String(fd.get("confirmPwd"));
    if (newPwd !== confirmPwd) { notify("Les mots de passe ne correspondent pas"); return; }
    if (newPwd.length < 8) { notify("Le mot de passe doit contenir au moins 8 caracteres"); return; }
    setShowPwdForm(false);
    notify("Mot de passe modifie avec succes");
  };

  const toggleNotif = (i: number) => {
    setNotifs((prev) => prev.map((v, idx) => idx === i ? !v : v));
    notify("Preferences mises a jour");
  };

  return (
    <div className="max-w-3xl">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mon profil</h1>
      <p className="text-sm text-gray-500 mb-6">Vos informations personnelles et parametres</p>

      <div className="space-y-6">
        <Section title="Informations personnelles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Prenom" value={client.first_name} />
            <Info label="Nom" value={client.last_name} />
            <Info label="Date de naissance" value={client.date_of_birth} />
            <Info label="Nationalite" value={client.country} />
            <Info label="Numero client" value={client.client_number} mono />
          </div>
        </Section>

        <Section title="Coordonnees" action={!editing ? <button onClick={() => setEditing(true)} className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100">Modifier</button> : undefined}>
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><label className="block text-gray-500 mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Telephone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Adresse</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-gray-500 mb-1">Code postal</label><input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-gray-500 mb-1">Ville</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={saveProfile} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Enregistrer</button>
                <button onClick={() => { setEditing(false); setForm({ email: client.email, phone: client.phone, address: client.address, postal_code: client.postal_code, city: client.city }); }} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Email" value={form.email} />
              <Info label="Telephone" value={form.phone} />
              <Info label="Adresse" value={form.address} />
              <Info label="Ville" value={`${form.postal_code} ${form.city}`} />
            </div>
          )}
        </Section>

        <Section title="Securite">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mot de passe</p>
                <p className="text-xs text-gray-500">Derniere modification il y a 3 mois</p>
              </div>
              <button onClick={() => setShowPwdForm(!showPwdForm)} className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100">Modifier</button>
            </div>
            {showPwdForm && (
              <form onSubmit={changePwd} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div><label className="block text-xs text-gray-500 mb-1">Mot de passe actuel</label><input name="currentPwd" type="password" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Nouveau mot de passe</label><input name="newPwd" type="password" required minLength={8} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs text-gray-500 mb-1">Confirmer</label><input name="confirmPwd" type="password" required minLength={8} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Changer le mot de passe</button>
                  <button type="button" onClick={() => setShowPwdForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
                </div>
              </form>
            )}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Authentification a deux facteurs</p>
                <p className="text-xs text-gray-500">{twoFA ? "Activee" : "Non activee"}</p>
              </div>
              <button onClick={() => { setTwoFA(!twoFA); notify(twoFA ? "2FA desactivee" : "2FA activee avec succes"); }} className={`text-xs px-4 py-2 rounded-lg font-medium ${twoFA ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                {twoFA ? "Desactiver" : "Activer"}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Derniere connexion</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} — Luxembourg</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Preferences de notification">
          <div className="space-y-3 text-sm">
            {["Alertes de transaction par email", "Notifications de securite par SMS", "Newsletter et offres"].map((label, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{label}</span>
                <button onClick={() => toggleNotif(i)} className={`relative w-11 h-6 rounded-full transition-colors ${notifs[i] ? "bg-blue-600" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[i] ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className={`font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
