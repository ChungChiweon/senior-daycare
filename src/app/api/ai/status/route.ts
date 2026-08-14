/**
 * AI Provider Status — Safe Diagnostic Endpoint (Staging Use Only)
 * Returns boolean flags only. Never exposes key values or prompts.
 */
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  const provider = process.env.AI_PROVIDER ?? "not_set";
  const model = process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5-mini (default)";

  const keyConfigured = Boolean(apiKey && apiKey.trim().length > 10);
  const keyPrefix = keyConfigured ? apiKey!.slice(0, 7) + "..." : "NOT_SET";

  return NextResponse.json({
    provider,
    model,
    key_configured: keyConfigured,
    key_prefix: keyPrefix,       // sk-proj... — safe, never full key
    ai_provider_is_openai: provider === "openai",
    will_use_llm: keyConfigured && provider !== "mock",
    node_env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
