export type StoreKey =
  | "clients"
  | "loans"
  | "demandes"
  | "conversations"
  | "notifications"
  | "insurances"
  | "mandates";

export type Identified = { id: number };

// Kept on globalThis so every bundle that imports a store (instrumentation, pages, actions) shares the same arrays.
export const registry = globalThis as unknown as {
  __cblStores?: Partial<Record<StoreKey, Identified[]>>;
  __cblSnapshot?: Partial<Record<StoreKey, Identified[]>>;
  __cblLoad?: Promise<void>;
};

export function storesMap(): Partial<Record<StoreKey, Identified[]>> {
  return (registry.__cblStores ??= {});
}

// Items defined in code but absent from the saved snapshot (e.g. a client added in a later release) are kept.
export function hydrate(arr: Identified[], saved: Identified[]) {
  const added = arr.filter((item) => !saved.some((s) => s.id === item.id));
  arr.splice(0, arr.length, ...structuredClone(saved), ...added);
}

export function shared<T extends Identified>(key: StoreKey, init: () => T[]): T[] {
  const stores = storesMap();
  if (!stores[key]) {
    const arr = init();
    const snapshot = registry.__cblSnapshot?.[key];
    if (snapshot) hydrate(arr, snapshot);
    stores[key] = arr;
  }
  return stores[key] as T[];
}

export function nextId(items: Identified[], min: number): number {
  return items.reduce((max, item) => Math.max(max, item.id), min - 1) + 1;
}
