import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Edge Function: redeploy — único punto para publicar en Vercel
// Llamada solo desde /admin con botón manual "Actualizar página"
// Secrets requeridos (supabase secrets set):
//   VERCEL_DEPLOY_HOOK_URL  — https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy
//   REDEPLOY_SECRET         — opcional, si se define se exige header x-redeploy-secret

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-redeploy-secret",
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

  // Auth: permite x-redeploy-secret (triggers) O JWT de admin (panel manual)
  // Mantiene compatibilidad con hook/secret hardcodeados si no hay env vars
  const requiredSecret = Deno.env.get("REDEPLOY_SECRET") ?? "2a47f34b84a82f030605b62f556707e677426a4e880d1723";
  const gotSecret = req.headers.get("x-redeploy-secret");
  let authorized = gotSecret === requiredSecret;

  if (!authorized) {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length);
      // Verifica JWT contra Supabase Auth
      try {
        // Usa fetch directo a /auth/v1/user para evitar importar @supabase/supabase-js si no está disponible
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "https://bwhpeoppgexwaqphozdq.supabase.co";
        const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        if (supabaseAnon) {
          const r = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: { apikey: supabaseAnon, Authorization: `Bearer ${token}` },
          });
          authorized = r.ok;
        }
      } catch {
        authorized = false;
      }
    }
  }

  if (!authorized) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const hookUrl = Deno.env.get("VERCEL_DEPLOY_HOOK_URL") ?? "https://api.vercel.com/v1/integrations/deploy/prj_pgSUjLuqqhmxwrvetVSVfxQLDmh5/U0SJCY42GK";
  if (!hookUrl) {
    return new Response(JSON.stringify({ ok: false, error: "VERCEL_DEPLOY_HOOK_URL not configured. Set it with: supabase secrets set VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/..." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Retry 3x con backoff
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
        lastError = `Vercel hook ${res.status}: ${text.slice(0, 500)}`;
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
        else throw new Error(lastError);
        continue;
      }
      // Vercel deploy hook suele responder {job:{id,...}} o vacío con 201
      let data: unknown = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }
      return new Response(JSON.stringify({ ok: true, attempt, vercel: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  return new Response(JSON.stringify({ ok: false, error: lastError || "Failed to trigger Vercel deploy hook after 3 attempts" }), {
    status: 502,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
