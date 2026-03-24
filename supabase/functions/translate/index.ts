import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, target } = await req.json();

    if (!text || !target) {
      return new Response(JSON.stringify({ error: "Missing text or target" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const endpoints = [
      "https://translate.argosopentech.com/translate",
      "https://libretranslate.de/translate",
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, source: "auto", target, format: "text" }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) continue;

        const data = await response.json();
        if (data.translatedText) {
          return new Response(JSON.stringify({ translatedText: data.translatedText }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        console.log(`Endpoint ${url} failed, trying next...`);
      }
    }

    return new Response(JSON.stringify({ error: "All translation endpoints failed" }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
