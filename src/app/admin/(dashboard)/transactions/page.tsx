import { loadAdminClients } from "@/lib/admin-view";
import TransactionsClient from "./TransactionsClient";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  return <TransactionsClient clients={await loadAdminClients()} />;
}
