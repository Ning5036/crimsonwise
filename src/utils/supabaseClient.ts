const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export class SbPermanentError extends Error {}

export async function sbInsert<T extends object>(
  table: string,
  row: T,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase env vars not set (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)",
    );
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (res.status === 409) return;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = `Supabase insert failed (${res.status}): ${text}`;
    // Permanent only when Postgres itself rejected the row's data (SQLSTATE class 22 = data
    // exception, 23 = integrity/CHECK violation): retrying can never succeed, so don't queue it.
    // Everything else (network, 401/403 config, 5xx, PostgREST PGRST* such as a stale schema
    // cache) stays retryable — a config error must not drop data.
    let code = "";
    try { code = String((JSON.parse(text) as { code?: unknown }).code ?? ""); } catch { /* not JSON */ }
    const permanent = res.status === 413 || (res.status === 400 && /^2[23]\d{3}$/.test(code));
    throw permanent ? new SbPermanentError(msg) : new Error(msg);
  }
}
