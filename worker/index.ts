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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
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
    return new Response("Server misconfigured: missing env vars", {
      status: 500,
    });
  }

  let body: { password?: string; table?: string };
  try {
    body = (await request.json()) as { password?: string; table?: string };
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password || !timingSafeEqual(password, env.ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const table =
    body.table && ALLOWED_TABLES.has(body.table)
      ? body.table
      : "public_feedback";

  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(`Supabase error (${res.status}): ${text}`, {
      status: 502,
    });
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
