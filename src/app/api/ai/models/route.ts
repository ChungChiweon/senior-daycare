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
