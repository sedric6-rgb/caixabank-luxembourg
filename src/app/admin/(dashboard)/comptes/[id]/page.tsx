import Link from "next/link";
import { loadAdminClients } from "@/lib/admin-view";
import AccountView from "./CompteDetailClient";

export const dynamic = "force-dynamic";

export default async function CompteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [clientId, acctIdx] = id.split("-").map(Number);
  const client = (await loadAdminClients()).find((c) => c.id === clientId);
  const account = client?.accounts[acctIdx];

  if (!client || !account) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Compte introuvable</h1>
        <p className="text-gray-500 mb-4">Ce compte n&apos;existe pas.</p>
        <Link href="/admin/comptes" className="text-blue-600 hover:underline text-sm">Retour aux comptes</Link>
      </div>
    );
  }

  return <AccountView client={client} initialAccount={account} />;
}
