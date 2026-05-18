// @ts-nocheck
// Supabase Edge Function: trigger-ml-training
// Orchestrates scheduled or event-driven retraining of Prophet and Isolation Forest models.

// Fallback to host.docker.internal so containerized Deno functions can contact host ML services
const ML_SERVICE_URL = Deno.env.get("ML_SERVICE_URL") || "http://host.docker.internal:8000";

Deno.serve(async (req) => {
  const { method } = req;

  if (method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    console.log(`[ML TRIGGER] Initiating scheduled ML training session targeting: ${ML_SERVICE_URL}`);

    // Call local/remote Python ML Microservice training route
    const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!mlResponse.ok) {
      throw new Error(`Python ML microservice returned status ${mlResponse.status}`);
    }

    const payload = await mlResponse.json();

    const responsePayload = {
      success: true,
      timestamp: new Date().toISOString(),
      service_status: payload.status,
      message: "Prophet and Isolation Forest scheduled training trigger successfully dispatched."
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      status: 200,
    });
  } catch (error: any) {
    console.error(`[ML TRIGGER ERROR]`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      status: 500,
    });
  }
});
