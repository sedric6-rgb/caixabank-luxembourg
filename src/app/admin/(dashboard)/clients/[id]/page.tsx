import Link from "next/link";
import { DEMO_CLIENTS } from "@/lib/demo-data";
import { syncClientStatuses } from "@/lib/client-status";
import ClientDetail from "./ClientDetail";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await syncClientStatuses();
  const found = DEMO_CLIENTS.find((c) => c.id === Number(id));

  if (!found) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Client introuvable</h1>
        <p className="text-gray-500 mb-4">Aucun client avec l&apos;identifiant {id}</p>
        <Link href="/admin/clients" className="text-blue-600 hover:underline text-sm">Retour a la liste</Link>
      </div>
    );
  }

  return <ClientDetail initial={{ ...found, password: undefined }} />;
}
