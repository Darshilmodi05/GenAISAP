// @ts-nocheck
// Supabase Edge Function: generate-report-async
// Background job that generates AI-powered reports without blocking the client.
// Triggered by the /api/reports/generate route and runs as a long-running edge task.
// Updates the report status in Supabase from 'processing' → 'ready' | 'failed'.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const ML_SERVICE_URL = Deno.env.get("ML_SERVICE_URL") || "http://host.docker.internal:8000";

// Supabase REST helper
async function supabaseRpc(
  table: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: Record<string, any>,
  filter?: string
) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${filter ? `?${filter}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${method} ${table} failed: ${res.status}`);
  return res.json();
}

/** Update report status in the database */
async function updateReport(
  reportId: string,
  fields: Record<string, any>
) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(fields),
    }
  );
}

/** Fetch ML forecast data for the report context */
async function fetchForecastContext(sapModule: string): Promise<string> {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/forecast/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        historical: [120000, 135000, 128000, 142000, 155000, 148000],
        periods: 3,
        module: sapModule,
      }),
    });
    if (!res.ok) return "Forecast data unavailable.";
    const data = await res.json();
    return `30-day forecast: ${data.forecast?.join(", ") || "N/A"}. Confidence: ${data.confidence || "N/A"}`;
  } catch {
    return "Forecast data unavailable.";
  }
}

/** Call Anthropic Claude to generate the report content */
async function generateWithClaude(
  reportTitle: string,
  sapModule: string,
  metrics: Record<string, any>,
  forecastContext: string,
  dateRange: { from: string; to: string }
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    // Fallback: generate a structured mock report
    return generateMockReport(reportTitle, sapModule, metrics, dateRange);
  }

  const systemPrompt = `You are an enterprise SAP financial analyst generating executive-grade reports for the GenAISAP platform. 
Your reports must be:
- Structured in markdown with clear sections
- Quantitative and data-driven, referencing the provided metrics
- Professional, concise, and audit-ready
- Written for CFO-level stakeholders`;

  const userPrompt = `Generate a detailed ${sapModule} module report titled "${reportTitle}" for the period ${dateRange.from} to ${dateRange.to}.

Available Metrics:
${JSON.stringify(metrics, null, 2)}

ML Forecast Intelligence:
${forecastContext}

Include:
1. Executive Summary (2-3 sentences)
2. Key Performance Indicators table
3. Variance Analysis (vs prior period if data available)
4. ML-Powered Forecast (next 30 days)
5. Risk Flags & Anomalies
6. Recommended Actions (3-5 items)
7. Compliance Notes`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "Report generation failed.";
}

/** Fallback mock report when Anthropic API key is not configured */
function generateMockReport(
  title: string,
  module: string,
  metrics: Record<string, any>,
  dateRange: { from: string; to: string }
): string {
  return `# ${title}
**Module:** ${module} | **Period:** ${dateRange.from} → ${dateRange.to}
**Generated:** ${new Date().toISOString()} | **Status:** Demo Mode

---

## Executive Summary
This report provides an automated analysis of ${module} module performance for the specified period. Key indicators remain within expected variance thresholds with one high-priority anomaly flagged for review.

## Key Performance Indicators
| Metric | Value | vs Prior Period |
|--------|-------|-----------------|
| Total Transactions | ${metrics.total_transactions || "4,821"} | +12.4% |
| Processing Volume | ${metrics.volume || "€2.3M"} | -3.2% |
| Error Rate | ${metrics.error_rate || "0.08%"} | -18.5% |
| Cycle Time (avg) | ${metrics.cycle_time || "2.1 days"} | -0.4 days |

## Variance Analysis
No significant budget variance detected. Processing efficiency improved by 18.5% compared to the prior period baseline.

## ML-Powered Forecast (Next 30 Days)
Projected transaction volume: **+8-14% growth** based on Prophet model analysis. Confidence interval: 89%.

## Risk Flags
- ⚠️ **MEDIUM**: Vendor 4450 shows unusual clearing pattern — recommend review
- ℹ️ **LOW**: 3 open items aging beyond 60 days

## Recommended Actions
1. Initiate clearing workflow for aged open items
2. Schedule vendor 4450 compliance review
3. Update FX rate tables for period-end close
4. Enable automated dunning for overdue receivables
5. Archive Q1 postings to cold storage

## Compliance Notes
All postings comply with SOX Section 404 requirements. Audit trail maintained with 100% integrity.

---
*Report generated by GenAISAP Intelligence Engine • Confidential*`;
}

Deno.serve(async (req) => {
  const { method } = req;

  // CORS preflight
  if (method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
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
    const body = await req.json();
    const { report_id, title, sap_module, metrics, date_range, organization_id } = body;

    if (!report_id || !sap_module) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: report_id, sap_module" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`[REPORT GEN] Starting async generation for report: ${report_id}`);

    // Mark report as processing
    await updateReport(report_id, {
      status: "processing",
      updated_at: new Date().toISOString(),
    });

    // Fetch ML forecast context in parallel with report generation
    const forecastContext = await fetchForecastContext(sap_module);

    // Generate the report content via Claude (or fallback)
    const reportContent = await generateWithClaude(
      title || `${sap_module} Performance Report`,
      sap_module,
      metrics || {},
      forecastContext,
      date_range || {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      }
    );

    // Store completed report in Supabase
    await updateReport(report_id, {
      status: "ready",
      content: {
        markdown: reportContent,
        generated_at: new Date().toISOString(),
        model: ANTHROPIC_API_KEY ? "claude-3-5-sonnet-20241022" : "mock",
        sap_module,
        forecast_context: forecastContext,
      },
      updated_at: new Date().toISOString(),
    });

    // Write audit log
    if (organization_id) {
      try {
        await supabaseRpc("audit_logs", "POST", {
          organization_id,
          action: "report.generated",
          resource_type: "report",
          resource_id: report_id,
          metadata: {
            sap_module,
            model: ANTHROPIC_API_KEY ? "claude-3-5-sonnet-20241022" : "mock",
          },
        });
      } catch {
        // Non-fatal — audit log failure should not fail the report
      }
    }

    console.log(`[REPORT GEN] Report ${report_id} generated successfully.`);

    return new Response(
      JSON.stringify({
        success: true,
        report_id,
        status: "ready",
        message: "Report generated and stored successfully.",
        timestamp: new Date().toISOString(),
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
    console.error(`[REPORT GEN ERROR]`, error.message);

    // Attempt to mark report as failed if we have a report_id
    try {
      const body = await req.json().catch(() => ({}));
      if (body.report_id) {
        await updateReport(body.report_id, {
          status: "failed",
          content: { error: error.message },
          updated_at: new Date().toISOString(),
        });
      }
    } catch {
      // ignore
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
