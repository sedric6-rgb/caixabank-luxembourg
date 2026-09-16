import { clientLoginAction } from "@/lib/actions/client-auth";
import Link from "next/link";

export default async function ClientLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f42] to-[#003d82] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/logo/caixabank-logo.jpg" alt="CaixaBank" className="h-12 w-auto mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">CaixaBank Luxembourg</span>
          </Link>
          <p className="text-blue-200 text-sm mt-2">Espace Client Sécurisé</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Connexion</h1>
          <p className="text-sm text-gray-500 mb-6">Accédez à vos comptes en ligne</p>

          {error === "invalid" && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">Numéro client ou mot de passe incorrect.</p>
            </div>
          )}
          {error === "missing" && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-700">Veuillez remplir tous les champs.</p>
            </div>
          )}

          <form action={clientLoginAction} className="space-y-4">
            <div>
              <label htmlFor="client_number" className="block text-sm font-medium text-gray-700 mb-1">Numéro client</label>
              <input id="client_number" name="client_number" type="text" required placeholder="CBP-XXXXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input id="password" name="password" type="password" required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button type="submit" className="w-full bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">
              Se connecter
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <a href="#" className="text-blue-600 hover:underline">Mot de passe oublié ?</a>
            <a href="#" className="text-blue-600 hover:underline">Première connexion</a>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">Connexion démo : CBP-284751 / demo2024</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
            <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1a4 4 0 00-4 4v2H2a1 1 0 00-1 1v5a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-2 4a2 2 0 114 0v2H5V5z" fill="currentColor"/></svg>
            Connexion sécurisée — Chiffrement SSL/TLS
          </div>
        </div>
      </div>
    </div>
  );
}
