import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Edge Function: redeploy — publica el sitio en Vercel (botón manual "Actualizar página")
//
// Configuración requerida (Supabase Dashboard → Edge Functions → Secrets):
//   VERCEL_DEPLOY_HOOK_URL — URL del Deploy Hook de Vercel
//
// Auth: solo JWT de usuario autenticado (el admin del panel /admin).
// No hay secret compartido: los triggers de BD fueron eliminados (0011).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ---- Auth: exige JWT válido de un usuario autenticado ----
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnon) throw new Error("auth config missing");
    const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseAnon, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error(`invalid token (${r.status})`);
  } catch (err) {
    console.warn("[redeploy] auth failed:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ---- Config: solo env vars, sin fallbacks en código ----
  const hookUrl = Deno.env.get("VERCEL_DEPLOY_HOOK_URL");
  if (!hookUrl) {
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          "Falta configurar el secreto. Dashboard Supabase → Edge Functions → Secrets → añade VERCEL_DEPLOY_HOOK_URL con la URL del Deploy Hook de Vercel.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ---- Disparo con retry 3x + backoff ----
  let lastError = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(hookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const text = await res.text();
      if (!res.ok) {
        lastError = `Vercel hook ${res.status}: ${text.slice(0, 300)}`;
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
        else throw new Error(lastError);
        continue;
      }
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      console.log(`[redeploy] hook disparado OK (intento ${attempt})`);
      return new Response(JSON.stringify({ ok: true, attempt, vercel: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  console.error("[redeploy] fallo tras 3 intentos:", lastError);
  return new Response(
    JSON.stringify({
      ok: false,
      error: lastError || "No se pudo disparar el Deploy Hook tras 3 intentos",
    }),
    { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
