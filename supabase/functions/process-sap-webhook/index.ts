// @ts-nocheck
// Supabase Edge Function: process-sap-webhook
// Validates and routes incoming SAP S/4HANA event webhooks into the GenAISAP pipeline.
// Events trigger anomaly scans, cache invalidation, and alert creation in Supabase.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SAP_WEBHOOK_SECRET = Deno.env.get("SAP_WEBHOOK_SECRET") || "";
const ML_SERVICE_URL = Deno.env.get("ML_SERVICE_URL") || "http://host.docker.internal:8000";

// SAP event type → SAP module mapping
const EVENT_MODULE_MAP: Record<string, string> = {
  "FI_POSTING_CREATED": "FICO",
  "FI_PAYMENT_CLEARED": "FICO",
  "FI_VARIANCE_DETECTED": "FICO",
  "SD_ORDER_CREATED": "SD",
  "SD_DELIVERY_CONFIRMED": "SD",
  "SD_INVOICE_POSTED": "SD",
  "MM_GR_POSTED": "MM",
  "MM_PO_CREATED": "MM",
  "MM_STOCK_CHANGED": "MM",
};

// Events that should immediately trigger an anomaly scan
const HIGH_RISK_EVENTS = new Set([
  "FI_VARIANCE_DETECTED",
  "FI_POSTING_CREATED",
  "MM_STOCK_CHANGED",
]);

/** Verify the HMAC-SHA256 signature sent by SAP webhook */
async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!secret || !signature) return true; // Skip in dev if not configured

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const sigBytes = Uint8Array.from(
    signature.replace("sha256=", "").match(/.{1,2}/g)!.map((byte) =>
      parseInt(byte, 16)
    )
  );

  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
}

/** Write alert into Supabase alerts table via REST API */
async function createAlert(
  organizationId: string,
  event: Record<string, any>,
  sapModule: string,
  anomalyResult: Record<string, any> | null
) {
  const severity = anomalyResult?.is_anomaly ? "high" : "medium";
  const alertBody = {
    organization_id: organizationId,
    alert_type: "sap_webhook_event",
    severity,
    title: `SAP ${sapModule} Event: ${event.event_type}`,
    description:
      anomalyResult?.narrative ||
      `Incoming SAP event ${event.event_type} processed from ${event.company_code || "unknown entity"}.`,
    sap_module: sapModule,
    affected_entities: event.entities || {},
    status: "open",
    detected_at: new Date().toISOString(),
  };

  await fetch(`${SUPABASE_URL}/rest/v1/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(alertBody),
  });
}

/** Invalidate analytics cache for the affected SAP module */
async function invalidateModuleCache(organizationId: string, sapModule: string) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/analytics_cache?organization_id=eq.${organizationId}&sap_module=eq.${sapModule}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
}

Deno.serve(async (req) => {
  const { method } = req;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type, x-sap-signature",
      },
    });
  }

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-sap-signature") || "";

    // Verify webhook authenticity
    const isValid = await verifyWebhookSignature(rawBody, signature, SAP_WEBHOOK_SECRET);
    if (!isValid) {
      console.error("[SAP WEBHOOK] Invalid signature — rejecting request.");
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(rawBody);
    const { event_type, organization_id, payload, timestamp } = event;

    console.log(`[SAP WEBHOOK] Received event: ${event_type} for org: ${organization_id}`);

    if (!event_type || !organization_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: event_type, organization_id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sapModule = EVENT_MODULE_MAP[event_type] || "UNKNOWN";
    let anomalyResult = null;

    // For high-risk events, immediately call ML service for anomaly scoring
    if (HIGH_RISK_EVENTS.has(event_type) && payload?.value !== undefined) {
      try {
        const mlResponse = await fetch(`${ML_SERVICE_URL}/anomaly/detect-spikes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [payload.value],
            related_modules: { [sapModule]: true },
          }),
        });

        if (mlResponse.ok) {
          anomalyResult = await mlResponse.json();
          console.log(
            `[SAP WEBHOOK] Anomaly score for ${event_type}: ${JSON.stringify(anomalyResult)}`
          );
        }
      } catch (mlError) {
        // ML service unavailable — continue processing without anomaly check
        console.warn(`[SAP WEBHOOK] ML service unreachable: ${mlError.message}`);
      }
    }

    // Persist alert in Supabase
    await createAlert(organization_id, { event_type, ...payload }, sapModule, anomalyResult);

    // Invalidate stale analytics cache for this module
    await invalidateModuleCache(organization_id, sapModule);

    return new Response(
      JSON.stringify({
        success: true,
        event_type,
        sap_module: sapModule,
        anomaly_detected: anomalyResult?.is_anomaly || false,
        timestamp: timestamp || new Date().toISOString(),
        message: "SAP webhook processed and routed successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    console.error(`[SAP WEBHOOK ERROR]`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
