import { BANK_CLIENTS, type ClientRecord } from "@/lib/client-data";
import { readState } from "@/lib/state";

export type AdminClient = Omit<ClientRecord, "password">;

export async function loadAdminClients(): Promise<AdminClient[]> {
  await readState();
  return BANK_CLIENTS.map((c) => {
    const copy: ClientRecord = structuredClone(c);
    delete copy.password;
    return copy;
  });
}
