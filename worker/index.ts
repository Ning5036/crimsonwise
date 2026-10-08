/**
 * Cloudflare Worker entry point.
 *
 * Routes:
 *   POST /api/admin/export  → password-gated CSV export (service_role)
 *   *                       → static SPA assets (dist/)
 *
 * Runtime env vars (set in Cloudflare → Settings → Variables and Secrets):
 *   SUPABASE_URL                 — https://...supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    — service_role JWT (secret)
 *   ADMIN_PASSWORD               — admin gate (secret)
 *
 * Build-time env vars (set in Cloudflare → Settings → Build):
 *   VITE_SUPABASE_URL            — baked into client bundle
 *   VITE_SUPABASE_ANON_KEY       — baked into client bundle
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  ADMIN_PASSWORD?: string;
}

const ALLOWED_TABLES = new Set(["public_feedback", "sessions"]);

// Compare SHA-256 digests so neither the comparison time nor the early
// length check leaks anything about the stored password.
export async function passwordMatches(given: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all(
    [given, expected].map((s) => crypto.subtle.digest("SHA-256", enc.encode(s))),
  );
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = typeof v === "object" ? JSON.stringify(v) : String(v);
  // Formula injection: a cell starting with = + - @ \t \r runs as a formula
  // when the CSV is opened in Excel/Sheets. Prefix it so it reads as text.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

type Row = Record<string, unknown>;

function rowsToCsv(rows: Row[]): string {
  if (!rows.length) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const head = headers.map(csvEscape).join(",");
  const body = rows
    .map((r) => headers.map((h) => csvEscape(r[h])).join(","))
    .join("\r\n");
  return head + "\r\n" + body;
}

async function handleAdminExport(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_SERVICE_ROLE_KEY ||
    !env.ADMIN_PASSWORD
  ) {
    console.error("admin export: missing env vars");
    return new Response("Server error", { status: 500 });
  }

  let body: { password?: string; table?: string };
  try {
    body = (await request.json()) as { password?: string; table?: string };
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password || !(await passwordMatches(password, env.ADMIN_PASSWORD))) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const table =
    body.table && ALLOWED_TABLES.has(body.table)
      ? body.table
      : "public_feedback";

  try {
    const supabaseUrl = env.SUPABASE_URL.replace(/\/+$/, "");
    const res = await fetch(
      `${supabaseUrl}/rest/v1/${table}?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("admin export: upstream", res.status, text.slice(0, 500));
      return new Response("Upstream error", { status: 502 });
    }

    const rows = (await res.json()) as Row[];
    const csv = rowsToCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `CrimsonWise_${table}_${date}.csv`;

    return new Response("﻿" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("admin export:", e);
    return new Response("Server error", { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/admin/export") {
      return handleAdminExport(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
