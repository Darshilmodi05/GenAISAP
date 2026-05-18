// @ts-nocheck
// Supabase Edge Function: scheduled-anomaly-scan
// Executes high-frequency outlier sweeps across S/4HANA post logs.

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
    console.log(`[ANOMALY SCAN] Triggering automated ledger posting scan targeting: ${ML_SERVICE_URL}`);

    // In production, we retrieve recent postings from Supabase/Postgres
    // and batch forward them to Python ML Microservice for isolation sweeps
    const mockPostings = [
      { id: "tx_101", description: "Standard Vendor clearing", value: 12000 },
      { id: "tx_102", description: "Frankfurt Warehouse High-Value Spill", value: 840000 }
    ];

    const mlResponse = await fetch(`${ML_SERVICE_URL}/anomaly/detect-spikes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: mockPostings.map(p => p.value), related_modules: { FICO: true, MM: true } })
    });

    if (!mlResponse.ok) {
      throw new Error(`Python ML microservice returned status ${mlResponse.status}`);
    }

    const payload = await mlResponse.json();

    const responsePayload = {
      success: true,
      timestamp: new Date().toISOString(),
      anomalies_detected: payload.anomalies?.length || 0,
      anomalies: payload.anomalies || [],
      message: "Scheduled anomaly scan processed successfully."
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      status: 200,
    });
  } catch (error: any) {
    console.error(`[ANOMALY SCAN ERROR]`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      status: 500,
    });
  }
});
