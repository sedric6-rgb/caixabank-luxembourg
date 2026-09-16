import { getClientSession } from "@/lib/auth-client";
import { getClientById } from "@/lib/queries/banking";
import ProfilClient from "./profil-client";

export default async function ProfilPage() {
  const session = await getClientSession();
  const client = session ? await getClientById(session.clientId) : null;

  if (!client) return <p className="text-gray-500">Profil introuvable</p>;

  return <ProfilClient client={client} />;
}
