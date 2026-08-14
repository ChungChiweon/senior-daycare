/**
 * List available OpenAI models — Staging diagnostic only.
 * Returns model IDs only. Never exposes key value.
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim().length < 10) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }
  try {
    const client = new OpenAI({ apiKey: apiKey.trim() });
    const list = await client.models.list();
    const gptModels = list.data
      .map((m) => m.id)
      .filter((id) => /gpt|o1|o3|o4/.test(id))
      .sort();
    return NextResponse.json({ models: gptModels, total: gptModels.length });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST: Test a specific model with Responses API (plain text, no json_object format)
 * Body: { model?: string }
 */
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim().length < 10) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const model = body.model ?? process.env.AI_MODEL ?? "gpt-5-mini";

  const client = new OpenAI({ apiKey: apiKey.trim() });
  const start = Date.now();

  // Test 1: plain text (no json_object)
  let plainResult: string | null = null;
  let plainError: string | null = null;
  try {
    const r = await client.responses.create({
      model,
      store: false,
      input: "Say hello in Korean in one sentence.",
      max_output_tokens: 30
    });
    plainResult = r.output_text ?? null;
  } catch (e: unknown) {
    if (e instanceof OpenAI.APIError) {
      plainError = `status=${e.status} type=${e.type} msg=${e.message.slice(0, 100)}`;
    } else {
      plainError = e instanceof Error ? e.message.slice(0, 100) : "unknown";
    }
  }

  // Test 2: json_object format
  let jsonResult: string | null = null;
  let jsonError: string | null = null;
  try {
    const r = await client.responses.create({
      model,
      store: false,
      input: 'Return JSON: {"ok":true}',
      text: { format: { type: "json_object" } },
      max_output_tokens: 20
    });
    jsonResult = r.output_text ?? null;
  } catch (e: unknown) {
    if (e instanceof OpenAI.APIError) {
      jsonError = `status=${e.status} type=${e.type} msg=${e.message.slice(0, 100)}`;
    } else {
      jsonError = e instanceof Error ? e.message.slice(0, 100) : "unknown";
    }
  }

  return NextResponse.json({
    model,
    latency_ms: Date.now() - start,
    plain_text: { result: plainResult, error: plainError },
    json_object: { result: jsonResult, error: jsonError }
  });
}

