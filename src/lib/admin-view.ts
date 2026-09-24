import { DEMO_CLIENTS, type DemoClient } from "@/lib/demo-data";
import { readState } from "@/lib/state";

export type AdminClient = Omit<DemoClient, "password">;

export async function loadAdminClients(): Promise<AdminClient[]> {
  await readState();
  return DEMO_CLIENTS.map((c) => {
    const copy: DemoClient = structuredClone(c);
    delete copy.password;
    return copy;
  });
}
