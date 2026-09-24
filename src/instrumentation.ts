export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Every store must be registered before the saved state is loaded into it.
  await Promise.all([
    import("@/lib/demo-data"),
    import("@/lib/loans-store"),
    import("@/lib/demandes-store"),
    import("@/lib/messages-store"),
    import("@/lib/notifications-store"),
    import("@/lib/insurances-store"),
    import("@/lib/mandates-store"),
  ]);
  const { readState } = await import("@/lib/state");
  await readState();
}
