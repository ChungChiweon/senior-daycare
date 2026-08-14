/**
 * AI Provider Status — Safe Diagnostic Endpoint (Staging Use Only)
 * Returns boolean flags + minimal connectivity probe result.
 * Never exposes key values, prompts, or personal data.
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  const provider = process.env.AI_PROVIDER ?? "not_set";
  const model = process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5-mini";

  const keyConfigured = Boolean(apiKey && apiKey.trim().length > 10);
  const keyPrefix = keyConfigured ? apiKey!.slice(0, 7) + "..." : "NOT_SET";

  // Minimal connectivity probe — 1 token, no personal data
  let probeResult: "not_attempted" | "success" | "model_error" | "auth_error" | "network_error" | "unknown_error" = "not_attempted";
  let probeModel: string | null = null;
  let probeLatencyMs: number | null = null;
  let probeErrorMsg: string | null = null;

  if (keyConfigured && provider !== "mock") {
    const probeStart = Date.now();
    try {
      const client = new OpenAI({ apiKey: apiKey!.trim() });
      const resp = await client.responses.create({
        model,
        store: false,
        input: "ping",
        max_output_tokens: 5
      });
      probeResult = "success";
      probeModel = resp.model;
      probeLatencyMs = Date.now() - probeStart;
    } catch (err: unknown) {
      probeLatencyMs = Date.now() - probeStart;
      if (err instanceof OpenAI.APIError) {
        probeErrorMsg = `status=${err.status} type=${err.type} name=${err.name}`;
        if (err.status === 401) probeResult = "auth_error";
        else if (err.status === 404 || err.status === 400) probeResult = "model_error";
        else probeResult = "network_error";
      } else {
        probeResult = "unknown_error";
        probeErrorMsg = err instanceof Error ? err.message.slice(0, 120) : "unknown";
      }
    }
  }

  return NextResponse.json({
    provider,
    model_configured: model,
    key_configured: keyConfigured,
    key_prefix: keyPrefix,
    will_use_llm: keyConfigured && provider !== "mock",
    node_env: process.env.NODE_ENV,
    // Probe results
    probe_result: probeResult,
    probe_actual_model: probeModel,
    probe_latency_ms: probeLatencyMs,
    probe_error: probeErrorMsg,
    timestamp: new Date().toISOString()
  });
}

