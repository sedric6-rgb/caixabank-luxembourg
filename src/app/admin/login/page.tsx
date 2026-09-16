import { loginAction } from "@/lib/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f42] to-[#003060] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo/caixabank-logo.jpg" alt="CaixaBank" className="h-10 w-auto mx-auto mb-2" />
          <span className="text-xl font-bold text-white">CaixaBank Luxembourg</span>
          <p className="text-blue-400 text-xs mt-1">Administration</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Connexion Admin</h1>
          <p className="text-sm text-gray-500 mb-6">Accès réservé au personnel autorisé</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">Mot de passe incorrect.</p>
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={next || "/admin"} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full bg-[#003d82] text-white py-3 rounded-lg font-medium hover:bg-[#002a5c] transition-colors">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
