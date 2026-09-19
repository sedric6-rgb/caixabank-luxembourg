"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions/client-auth";

export default function ForgotPasswordPage() {
  const [result, setResult] = useState<{ newPassword: string } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await resetPasswordAction(fd);
      if (res.success && res.newPassword) {
        setResult({ newPassword: res.newPassword });
      } else {
        setError(res.error || "Erreur");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f42] to-[#003d82] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <img src="/logo-caixa.png" alt="CaixaBank" width={52} height={52} className="h-13 w-13" />
            <span className="text-2xl font-bold text-white">CaixaBank Luxembourg</span>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-blue-300 uppercase -mt-1">Banque Privée</p>
          </Link>
          <p className="text-blue-200 text-sm mt-2">Reinitialisation du mot de passe</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {result ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M10 16l4 4 8-8" stroke="#0d8a3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Mot de passe reinitialise</h1>
              <p className="text-sm text-gray-500 mb-4">Votre nouveau mot de passe temporaire :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-lg font-mono font-bold text-gray-900">{result.newPassword}</p>
              </div>
              <p className="text-xs text-gray-400 mb-6">Notez ce mot de passe et changez-le depuis votre profil apres connexion.</p>
              <Link href="/espace-client/connexion"
                className="inline-block bg-[#003d82] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">
                Se connecter
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Mot de passe oublie</h1>
              <p className="text-sm text-gray-500 mb-6">Saisissez votre numero client et l&apos;email associe pour reinitialiser votre mot de passe.</p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="client_number" className="block text-sm font-medium text-gray-700 mb-1">Numero client</label>
                  <input id="client_number" name="client_number" type="text" required placeholder="CBP-XXXXXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                  <input id="email" name="email" type="email" required placeholder="votre@email.lu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button type="submit" disabled={isPending}
                  className="w-full bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors disabled:opacity-50">
                  {isPending ? "Verification..." : "Reinitialiser le mot de passe"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/espace-client/connexion" className="text-sm text-blue-600 hover:underline">
                  Retour a la connexion
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1a4 4 0 00-4 4v2H2a1 1 0 00-1 1v5a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2H5V5z" fill="currentColor"/></svg>
            Connexion securisee — Chiffrement SSL/TLS
          </div>
        </div>
      </div>
    </div>
  );
}
